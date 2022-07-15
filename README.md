# arctic-fox
Application created with the intention to be exploitable and security testing

# Local run for testing

```
# Runs the API (backend)
cd arctic-fox/backend
pip3 install -r requirements.txt 
flask run
```

```
# Runs the front-end react server
cd frontend
npm install
expo start --web
```
```
# proxy for communications between apps
lcp --proxyUrl http://localhost:5000`
```

# TO-DO
## Frontend
  - [x] Load available tasks from db
  - [x] Get assigned on task
  - [x] Profile picture functionality 
  - [x] Payment request (with btc address)
  - [x] Payment history
  - [x] Task upload proof
## Backend
  - [x] Admin task creation
  - [x] Approve tasks
  - [x] Admin page approve payment (with btc address etc)
  - [x] Save payment details (new table on db)
