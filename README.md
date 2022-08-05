# arctic-fox
Application created with the intention to be secured on vulnerabilities.

## [Heroku](https://arcticfox.herokuapp.com/)
  - Username: *useruser*
  - Password: *12345678*

### Run the application on a docker container
```console
foo@bar:~$ docker build . -f Dockerfile.local -t arcticfox
foo@bar:~$ docker run --name arcticfox -p 5000:5000 --env JWT_SECRET_KEY=$(openssl rand -base64 21) arcticfox
```

#### To get the JWT_SECRET_KEY
  ```console
  foo@bar:~$ docker exec -it arcticfox bash -c 'echo $JWT_SECRET_KEY'
  ```
