FROM grafana/loki:3.2.1
COPY config/loki/local-config.yaml /etc/loki/local-config.yaml
