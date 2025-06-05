FROM grafana/loki:latest
COPY config/loki/local-config.yaml /etc/loki/local-config.yaml
