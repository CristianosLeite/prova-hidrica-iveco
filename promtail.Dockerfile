FROM grafana/promtail:latest
COPY config/promtail/config.yml /etc/promtail/config.yml
