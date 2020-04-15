FROM node:13

RUN mkdir -p /home/container/earth-chan
WORKDIR /home/container/earth-chan

# Copy and Install our bot
COPY package.json /home/container/earth-chan
RUN npm install

# Our precious bot
COPY . /home/container/earth-chan

ENV MODE 1

# Start me!
CMD ["node", "index.js"]
