# arctic-fox
Application created with the intention to be secured on vulnerabilities.

&nbsp;&nbsp;&nbsp;
[![ci](https://github.com/Haki-Malai/arctic-fox/actions/workflows/codeql.yml/badge.svg?branch=main)](https://github.com/Haki-Malai/arctic-fox/actions/workflows/codeql.yml)&nbsp;&nbsp;&nbsp;
[![ci](https://github.com/Haki-Malai/arctic-fox/actions/workflows/docker-heroku-deploy.yml/badge.svg?branch=main)](https://github.com/Haki-Malai/arctic-fox/actions/workflows/docker-heroku-deploy.yml)



## [Heroku](https://arcticfox.herokuapp.com/)
  #### For both user and /admin
  - Username: *useruser*
  - Password: *12345678*

### Run the application on a docker container
```console
foo@bar:~$ git clone https://github.com/Haki-Malai/arctic-fox
foo@bar:~$ cd arctic-fox
foo@bar:~$ docker build . -t arcticfox
foo@bar:~$ docker run -p 5000:5000 --env JWT_SECRET_KEY=$(openssl rand -base64 21) arcticfox
```
