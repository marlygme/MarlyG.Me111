#!/usr/bin/env python3
import http.server
import socketserver
import urllib.parse
import sys
import time

PORT = 5000

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add performance headers
        if self.path.endswith('.js'):
            self.send_header('Cache-Control', 'public, max-age=31536000')
        elif self.path.endswith(('.png', '.jpg', '.gif', '.webp')):
            self.send_header('Cache-Control', 'public, max-age=31536000')
        elif self.path.endswith('.css'):
            self.send_header('Cache-Control', 'public, max-age=31536000')
        else:
            self.send_header('Cache-Control', 'public, max-age=3600')
        
        # Enable compression hint
        self.send_header('Vary', 'Accept-Encoding')
        super().end_headers()
    def do_GET(self):
        path = urllib.parse.urlparse(self.path).path
        
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