#!/bin/bash
# Generate private key
openssl genrsa -out private-key.pem 2048

# Generate certificate
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout private-key.pem -out certificate.pem -days 365

echo "✅ SSL certificates generated successfully!"
echo "📁 Files created: private-key.pem, certificate.pem"