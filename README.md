------------------------------------------ **Welcome to SplitWise** -----------------------------------------

Design Documentation and API Specs: [LINK](https://docs.google.com/document/d/1-RubMI5LL0JCDgjODCEHJ5Won50SIKdLPziadIqOkco/edit)

## Steps to Setup and start server:

0. Node.js Version Requirement
    * Our project requires Node.js version 14.2. Please follow the steps below to set up the       correct Node.js version.

Using nvm (Node Version Manager)

    Install nvm if you dont have :
    # installs nvm (Node Version Manager)
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

    # download and install Node.js (you may need to restart the terminal or source your /bashrc / .zshrc)
    nvm install 14

    # verifies the right Node.js version is in the environment
    node -v # should print `v14.21.3`

    # verifies the right npm version is in the environment
    npm -v # should print `6.14.18`
    
1. Install Mysql using `brew` or `apt` and make sure the service is running 
    * For Mac OS -> `brew services start mysql` 
    * For Linux -> `systemctl start mysql.service` 
    * open mysql and login with root user using `mysql -u root` . Note the app doesn't expects a password to login to root user 
    * Create Database `splitwise_db` using `create database splitwise_db` 
    * We don't need to worry about schema and tables, the `Sequelize` ORM will handle it through the app.

2. Clone the Repository using `git clone` 
3. Checkout to the Splitwise directory using `cd Splitwise`
4. Run `npm install` 
5. Start the Server using `npm run server` 
6. The Server should be running on `Port 8080` 
7. Use the Postman collection attached and hit the curls 


## Flow wise Example as per the code -> 

#### 1 : Create User with POST /user   

Eg. Adding 4 Users -> Bot1, Bot2, Bot3, Bot4

Sample Request Payload   
    
    curl --location 'localhost:8080/user' \
    --header 'Content-Type: application/json' \
    --data '{
    "name": "Bot1"
    }'

Sample Response 

    {
    "id": 1,
    "name": "Bot1",
    "updatedAt": "2024-08-13T14:30:00.275Z",
    "createdAt": "2024-08-13T14:30:00.275Z"
    }
    
\
#### 2 : Creating Group with users using POST /groups and passing User id in the members list

Eg. Creating a group called Friends with User Bot1, Bot2 and Bot3 

Sample Request Payload

    curl --location 'localhost:8080/groups' \
    --header 'Content-Type: application/json' \
    --data '{
    "name": "Friends",
    "members" : [1,2,4]
    }'

Sample Response 

    {
    "id": 1,
    "name": "Friends",
    "updatedAt": "2024-08-13T15:21:53.491Z",
    "createdAt": "2024-08-13T15:21:53.491Z"
    }
#### 3 : Adding Other remaining Users to group if required using PUT/{groupId}/user

Req Payload

    {
    "userId" : 3
    }

#### 4 : Creating Expense using POST/expense

Sample Request Payload

    curl --location 'http://localhost:8080/expense' \
    --header 'Content-Type: application/json' \
    --data '{
        "groupId": 2,
        "description": "Lunch",
        "amount": 190.0,
        "paidBy": 1,
        "splitBetween": [1, 2, 4],
        "splitType": "equal"
    }'

#### 5 : Viewing Balance Sheet For Each User by UserId using GET/balance/{user_id}

Sample Request Payload

    curl --location 'http://localhost:8080/balance/1'

Response Body 

    {
        "owes": [],
        "getBack": [
            {
                "id": 3,
                "userId": 2,
                "owesUserId": 1,
                "groupId": 2,
                "amount": 63.3333,
                "createdAt": "2024-08-13T15:23:10.000Z",
                "updatedAt": "2024-08-13T15:23:10.000Z",
                "user": {
                    "id": 2,
                    "name": "Bot2"
                }
            },
            {
                "id": 4,
                "userId": 4,
                "owesUserId": 1,
                "groupId": 2,
                "amount": 63.3333,
                "createdAt": "2024-08-13T15:23:10.000Z",
                "updatedAt": "2024-08-13T15:23:10.000Z",
                "user": {
                    "id": 4,
                    "name": "Bot4"
                }
            }
        ]
    }

#### 6 : Settle Up Between 2 users in a group POST/settleUp

Req Payload

    curl --location 'http://localhost:8080/settleUp' \
    --header 'Content-Type: application/json' \
    --data '{
        "groupId" : 1,
        "userId" : 2,
        "owesUserId" : 1
    }'

Response Body 

    {
    "msg": "Settled up successfully between the specified users in the group"
    }

Footer Notes: We can again fetch the balance sheet for Bot2 , it should be settled with Bot1




