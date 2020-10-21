FROM node:10.22.1

# define working directory in the Container
WORKDIR /usr/src/tizko-api

# copy everything from Local to Container
COPY ./ ./

# execute command
RUN npm install

CMD ["/bin/bash"]