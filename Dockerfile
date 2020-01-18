FROM node:11

RUN mkdir -p /home/container/earth-chan
WORKDIR /home/container/earth-chan

# Copy and Install our bot
COPY package.json /home/container/earth-chan
RUN npm install

# Our precious bot
COPY . /home/container/earth-chan
COPY /home/jay/.ssh/id_rsa /home/container/.ssh

ENV MODE 0
ENV PREFIX plana
ENV VERSION v1.2.0

# Start me!
CMD ["node", "index.js"]
