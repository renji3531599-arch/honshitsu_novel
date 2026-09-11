#!/usr/bin/env python3
"""開発用サーバー（静的配信） ―― no-store ヘッダ付きなので、脚本を編集したら
リロード一発で反映されます。

    python3 tools/serve.py            # http://127.0.0.1:8000/
    python3 tools/serve.py 8080       # ポート変更
"""
import http.server
import os
import socketserver
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000


class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        '.js': 'text/javascript',
        '.mjs': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json; charset=utf-8',
        '.txt': 'text/plain; charset=utf-8',
        '.svg': 'image/svg+xml',
        '.woff2': 'font/woff2',
    }

    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        super().end_headers()

    def log_message(self, fmt, *args):
        sys.stderr.write('  %s → %s\n' % (self.address_string(), fmt % args))


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


if __name__ == '__main__':
    with Server(('0.0.0.0', PORT), Handler) as httpd:
        print('serving %s at 0.0.0.0:%d' % (ROOT, PORT), flush=True)
        httpd.serve_forever()
