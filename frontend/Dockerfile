# pull official base image
FROM node:13.12.0-alpine as build
 
# set working directory
WORKDIR /app
 
EXPOSE 3000
 
# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH
 
# install app dependencies
COPY package.json ./
COPY package-lock.json ./
# RUN npm install --silent
RUN npm ci --silent
RUN npm install react-scripts@5.0.1 -g 
 
# add app
COPY . ./
 
# start app
# CMD ["npm", "start"]
RUN npm run build
 
# production environment
FROM nginx:stable-alpine
 
WORKDIR /usr/share/nginx/html
 
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
# new
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
ENTRYPOINT  ["nginx", "-g", "daemon off;"]