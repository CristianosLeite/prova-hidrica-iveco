<h2>Generate the certfile</h2>

<p>This is a self-signed certificate, to avoid trust issues, the certificate must be installed on each device.</p>

To generate the certfile with openssl, you can use the following command:

```bash
openssl req -new -x509 -key cert/client.key -out cert/client.crt -days 3650 -config cert/ca.cnf
```

This command will generate a client.key and client.crt file in the current directory. The client.key file is the private key and the client.crt file is the certificate file.
