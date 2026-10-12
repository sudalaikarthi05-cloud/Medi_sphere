"""
Medisphere AI Microservice Layer
Provides lightweight HTTP inference for Spring Boot integration.
"""

import json
from http.server import HTTPServer, BaseHTTPRequestHandler
from federated_risk_model import FederatedCoordinator

coordinator = FederatedCoordinator()
coordinator.run_federated_round()


class AIRequestHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(204)

    def do_GET(self):
        if self.path == '/health' or self.path == '/':
            self._set_headers(200)
            self.wfile.write(json.dumps({
                "status": "UP",
                "service": "Medisphere TensorFlow Federated Inference Service",
                "architecture": "FedAvg",
                "nodes": 3
            }).encode('utf-8'))
        else:
            self._set_headers(404)
            self.wfile.write(b'{"error": "Not Found"}')

    def do_POST(self):
        if self.path == '/predict/risk':
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8')
            try:
                data = json.loads(body) if body else {}
                result = coordinator.predict_risk(data)
                self._set_headers(200)
                self.wfile.write(json.dumps(result).encode('utf-8'))
            except Exception as e:
                self._set_headers(400)
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
        else:
            self._set_headers(404)
            self.wfile.write(b'{"error": "Endpoint not found"}')


def run(server_class=HTTPServer, handler_class=AIRequestHandler, port=5000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f"Medisphere TFF Inference Service active on port {port}")
    httpd.serve_forever()


if __name__ == '__main__':
    run()
