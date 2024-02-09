FROM node:20
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
# RUN npm i -g @digitak/esrun
RUN GENERATE_SOURCEMAP=false
RUN NODE_OPTIONS=--max_old_space_size=2048

COPY . .
EXPOSE 3000

CMD ["yarn", "dev"]
