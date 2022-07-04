# arctic-fox
Application created with the intention to be exploitable and security testing

# Local run for testing
`cd arctic-fox`
`cd backend; pip3 install -r requirements.txt; flask run; # Open new terminal`
`cd frontend; npm install; expo start --web # Open new terminal`
`lcp --proxyUrl http://localhost:5000`

# TO-DO
## Frontend
  - Profile picture functionality
  - Payment request (with btc address)
  - Payment history
  - Task upload proof
## Backend
  - Admin page aproove payment (with btc address etc)
  - Save payment details (new table on db)
  - Approve tasks