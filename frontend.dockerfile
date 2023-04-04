FROM node

LABEL Name=codelearn_frontend Version=0.0.1
WORKDIR /frontend
COPY . .

RUN cd frontend/

RUN yarn install

RUN yarn build

FROM nginx

EXPOSE $PORT

WORKDIR /frontend
COPY . .

COPY frontend/nginx.conf /etc/nginx/nginx.conf

COPY frontend/dist/ /usr/share/nginx/html
