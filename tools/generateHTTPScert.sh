#!/bin/bash
# A script to generate a self-signed cert for the project
# Feel free to enter any info you want, it's not like the CAs are gonna sue you or sth

# Get the root working directory
ROOT_DIR=$(git rev-parse --show-toplevel)

# Run the command to generate the cert and key in the root directory
echo "Generating cert at $ROOT_DIR..."
echo -e "\x1b[1;31mOpenSSL will ask you to enter info, feel to enter any info you want!\x1b[0m"
echo ""
openssl req -nodes -new -x509 -keyout $ROOT_DIR/server.key -out $ROOT_DIR/server.cert
echo ""
echo "Done!"