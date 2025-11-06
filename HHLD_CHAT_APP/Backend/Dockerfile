# base image that the container will be built on top of
#FROM node:latest
#For Apple Silicon M1/M2 chips, use the following line instead
FROM --platform=linux/amd64 node:lts-alpine3.19


# working directory for any command that follows it in the Dockerfile
WORKDIR /app


# copy local files from the host machine to the current working directory
COPY . /app


# execute commands that will run during the image build process
RUN npm install


# tell Docker which ports the container will listen on at runtime
EXPOSE 3000

#itgnore node_modules folder
COPY .dockerignore /app/.dockerignore

# run the command to start the application
CMD ["npm", "run", "start"]
#start interactive bash shell inside the container