FROM rust as builder
LABEL Name=codelearn_backend Version=0.0.1
WORKDIR /backend
COPY . .

EXPOSE $PORT

RUN cargo install --path ./backend/

CMD ["code_learn"]
