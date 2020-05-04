FROM node:14
RUN mkdir -p /home/container
WORKDIR /home/container
COPY . /home/container
RUN npm i
CMD ["node", "src"]