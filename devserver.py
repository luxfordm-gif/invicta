#!/usr/bin/env python3
"""Static dev server for _site with caching turned off.

python -m http.server sends Last-Modified and no Cache-Control, so browsers
heuristically cache the CSS and keep serving an old copy after a rebuild. That
cost us real time, so this sends no-store on everything.
"""
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from functools import partial


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, max-age=0")
        self.send_header("Pragma", "no-cache")
        super().end_headers()

    def log_message(self, fmt, *args):
        pass  # quiet; eleventy already logs the build


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 4321
    root = sys.argv[2] if len(sys.argv) > 2 else "_site"
    ThreadingHTTPServer(("127.0.0.1", port), partial(NoCacheHandler, directory=root)).serve_forever()
