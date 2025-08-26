#!/usr/bin/env python3
import http.server
import socketserver
import urllib.parse
import os
import threading
import signal
import sys

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Parse the path
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        
        # Remove trailing slash for consistency
        if path != '/' and path.endswith('/'):
            path = path[:-1]
        
        # Handle static assets
        if (path.startswith('/dist/') or 
            path.startswith('/img/') or 
            path.startswith('/videos/') or
            path in ['/robots.txt', '/sitemap.xml', '/favicon.ico', '/sorry.html']):
            return super().do_GET()
        
        # Handle SPA routes - serve index.html for all page routes
        spa_routes = ['/', '/about', '/webdesign', '/projects', '/graphic', '/faq']
        spa_prefixes = ['/about/', '/webdesign/', '/projects/', '/graphic/', '/faq/']
        
        if path in spa_routes or any(path.startswith(prefix) for prefix in spa_prefixes):
            self.path = '/index.html'
        
        return super().do_GET()
    
    def log_message(self, format, *args):
        # Log all requests
        super().log_message(format, *args)

def signal_handler(sig, frame):
    print('\nShutting down server...')
    sys.exit(0)

if __name__ == '__main__':
    PORT = 5000
    signal.signal(signal.SIGINT, signal_handler)
    
    try:
        with socketserver.TCPServer(('0.0.0.0', PORT), SPAHandler) as httpd:
            print(f'Serving at http://0.0.0.0:{PORT}')
            httpd.serve_forever()
    except Exception as e:
        print(f'Server error: {e}')
        sys.exit(1)