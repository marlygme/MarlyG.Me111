#!/usr/bin/env python3
import http.server
import socketserver
import urllib.parse
import sys
import time
import os
import json

PORT = 5000

def get_firebase_config():
    """Get Firebase configuration from environment variables"""
    return {
        'apiKey': os.environ.get('FIREBASE_API_KEY', ''),
        'authDomain': os.environ.get('FIREBASE_AUTH_DOMAIN', ''),
        'projectId': os.environ.get('FIREBASE_PROJECT_ID', ''),
        'storageBucket': os.environ.get('FIREBASE_STORAGE_BUCKET', ''),
        'messagingSenderId': os.environ.get('FIREBASE_MESSAGING_SENDER_ID', ''),
        'appId': os.environ.get('FIREBASE_APP_ID', ''),
        'databaseURL': f"https://{os.environ.get('FIREBASE_PROJECT_ID', '')}-default-rtdb.firebaseio.com" if os.environ.get('FIREBASE_PROJECT_ID') else ''
    }

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add performance headers (without compression)
        if self.path.endswith('.js'):
            self.send_header('Cache-Control', 'public, max-age=31536000, immutable')
        elif self.path.endswith(('.png', '.jpg', '.gif', '.webp')):
            self.send_header('Cache-Control', 'public, max-age=31536000, immutable')
        elif self.path.endswith('.css'):
            self.send_header('Cache-Control', 'public, max-age=31536000, immutable')
        elif self.path.endswith(('.mp4', '.m3u8', '.ts')):
            self.send_header('Cache-Control', 'public, max-age=86400')
        else:
            self.send_header('Cache-Control', 'public, max-age=3600')
        
        super().end_headers()
    def do_GET(self):
        path = urllib.parse.urlparse(self.path).path
        
        # Serve dynamic Firebase config
        if path == '/dist/env-config.js':
            config = get_firebase_config()
            content = f"window.firebaseConfig = {json.dumps(config)};"
            self.send_response(200)
            self.send_header('Content-Type', 'application/javascript')
            self.send_header('Content-Length', str(len(content)))
            self.end_headers()
            self.wfile.write(content.encode('utf-8'))
            return
        
        # Remove trailing slash
        if path != '/' and path.endswith('/'):
            path = path[:-1]
        
        # Static assets - serve as-is
        static_prefixes = ('/dist/', '/img/', '/videos/')
        static_files = ('/robots.txt', '/sitemap.xml', '/favicon.ico', '/sorry.html')
        
        if any(path.startswith(prefix) for prefix in static_prefixes) or path in static_files:
            return super().do_GET()
        
        # SPA routes - serve index.html
        spa_routes = ('/', '/about', '/webdesign', '/projects', '/graphic', '/faq')
        spa_prefixes = ('/about/', '/webdesign/', '/projects/', '/graphic/', '/faq/')
        
        # Handle all other routes that aren't static files
        if path.startswith('/') and path not in static_files and not any(path.startswith(prefix) for prefix in static_prefixes):
            self.path = '/index.html'
        
        if path in spa_routes or any(path.startswith(prefix) for prefix in spa_prefixes):
            self.path = '/index.html'
        
        return super().do_GET()

# Allow port reuse
class TCPServer(socketserver.TCPServer):
    allow_reuse_address = True

# Try to start server with retries
for attempt in range(5):
    try:
        httpd = TCPServer(('0.0.0.0', PORT), SPAHandler)
        print(f'Server running at http://0.0.0.0:{PORT}')
        httpd.serve_forever()
        break
    except OSError as e:
        if 'Address already in use' in str(e) and attempt < 4:
            print(f"Port {PORT} busy, retrying in 2 seconds...")
            time.sleep(2)
        else:
            print(f"Failed to start server: {e}")
            sys.exit(1)