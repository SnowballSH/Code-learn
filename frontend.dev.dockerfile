FROM node

LABEL Name=codelearn_frontend_dev Version=0.0.1
WORKDIR /frontend

EXPOSE 5173

ADD frontend/start.sh /
RUN chmod +x /start.sh

CMD ["/start.sh"]
