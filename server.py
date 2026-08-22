import http.server
import socketserver
import os
import sys
import webbrowser

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

DIR = os.path.dirname(os.path.abspath(__file__))

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIR, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

socketserver.TCPServer.allow_reuse_address = True

ports_to_try = [8000, 8080, 8888, 5500, 3000]
httpd = None
active_port = None

for port in ports_to_try:
    try:
        httpd = socketserver.TCPServer(("", port), NoCacheHandler)
        active_port = port
        break
    except OSError:
        print(f"Port {port} កំពុងជាប់រវល់ ជាមួយកម្មវិធីចាស់ កំពុងសាកល្បង Port បន្ទាប់...")

if httpd and active_port:
    url = f"http://localhost:{active_port}"
    print(f"\n========================================================")
    print(f"  🌟 ល្បែងសិក្សា៣ (Ou Ta Pruk Educational Games v3)")
    print(f"  🚀 Server កំពុងដំណើរការយ៉ាងត្រឹមត្រូវនៅ: {url}")
    print(f"========================================================\n")
    sys.stdout.flush()
    try:
        webbrowser.open(url)
    except Exception:
        pass
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
else:
    print("Error: មិនអាចបើក Server បានទេ សូមបិទ Python ចាស់ៗចោលសិន។")
