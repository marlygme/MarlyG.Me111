#!/usr/bin/env python3
import http.server
import socketserver
import urllib.parse
import os
import sys
import socket

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        
        # Remove trailing slash for consistency
        if path != '/' and path.endswith('/'):
            path = path[:-1]
        
        # Handle static assets directly
        if (path.startswith('/dist/') or 
            path.startswith('/img/') or 
            path.startswith('/videos/') or
            path in ['/robots.txt', '/sitemap.xml', '/favicon.ico', '/sorry.html']):
            return super().do_GET()
        
        # For SPA routes, serve index.html
        spa_routes = ['/', '/about', '/webdesign', '/projects', '/graphic', '/faq']
        spa_prefixes = ['/about/', '/webdesign/', '/projects/', '/graphic/', '/faq/']
        
        if path in spa_routes or any(path.startswith(prefix) for prefix in spa_prefixes):
            self.path = '/index.html'
        
        return super().do_GET()

if __name__ == '__main__':
    PORT = 5000
    
    # Force port reuse
    class ReusableTCPServer(socketserver.TCPServer):
        allow_reuse_address = True
        
    try:
        httpd = ReusableTCPServer(('0.0.0.0', PORT), SPAHandler)
        print(f'Server running at http://0.0.0.0:{PORT}')
        httpd.serve_forever()
    except OSError as e:
        if 'Address already in use' in str(e):
            print(f"Port {PORT} is in use. Trying to force close...")
            # Try to close any socket on this port
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            sock.bind(('0.0.0.0', PORT))
            sock.close()
            # Try again
            httpd = ReusableTCPServer(('0.0.0.0', PORT), SPAHandler)
            print(f'Server running at http://0.0.0.0:{PORT}')
            httpd.serve_forever()
        else:
            raise