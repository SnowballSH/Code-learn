FROM rust as builder
LABEL Name=codelearn_backend_dev Version=0.0.1
WORKDIR /backend

EXPOSE $PORT

ADD backend/start.sh /
RUN chmod +x /start.sh

RUN cargo install cargo-watch

CMD ["/start.sh"]
