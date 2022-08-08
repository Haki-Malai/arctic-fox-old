# ![favicon](https://github.com/Haki-Malai/arctic-fox/blob/main/frontend/assets/favicon-16x16.png?raw=true) Arctic-fox
Application created with the intention to be secured on vulnerabilities.

[![codeql](https://github.com/Haki-Malai/arctic-fox/actions/workflows/codeql.yml/badge.svg?branch=main)](https://github.com/Haki-Malai/arctic-fox/actions/workflows/codeql.yml)
&nbsp;
[![heroku-deploy](https://github.com/Haki-Malai/arctic-fox/actions/workflows/docker-heroku-deploy.yml/badge.svg?branch=main)](https://github.com/Haki-Malai/arctic-fox/actions/workflows/docker-heroku-deploy.yml)




## [![heroku](https://github.com/heroku/favicon/blob/master/favicon.iconset/icon_16x16.png?raw=true)](https://arcticfox.herokuapp.com/) [Heroku](https://arcticfox.herokuapp.com/)
  #### Login credentials for both user and /admin
  - Username: *useruser*
  - Password: *12345678*

### Run the application on a docker container
```console
foo@bar:~$ git clone https://github.com/Haki-Malai/arctic-fox
foo@bar:~$ cd arctic-fox
foo@bar:~$ docker build . -t arcticfox
foo@bar:~$ docker run -p 5000:5000 --env JWT_SECRET_KEY=$(openssl rand -base64 21) arcticfox
```
