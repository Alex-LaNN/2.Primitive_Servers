FROM node

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3005

CMD [ "npm", "run", "s" ]

# CMD [ "tail", "-f", "/dev/null" ]