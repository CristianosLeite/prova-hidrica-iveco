FROM grafana/promtail:3.2.1
COPY config/promtail/config.yml /etc/promtail/config.yml
