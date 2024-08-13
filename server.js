const express = require('express');
const app = express()
const morgan = require('morgan');
const db = require('./config/db');
const dotenv = require('dotenv');

dotenv.config(); // configuring port

app.use(morgan('dev')); // middleware for login
app.use(express.json());

db.authenticate()
    .then(() => console.log("Database Connected"))
    .catch(err => console.log("Encountered error while connecting to db" + err));

const PORT = process.env.PORT || 8080;

// System endpoints
app.get('/', (req,res)=>{
    res.status(200).send("<h2>----------------- Welcome to Splitwise, Please refer to the correct endpoints -----------------</h2>");
});

app.get('/health', (req,res)=>{
    res.status(200).send("<h1>UP</h1>");
});

// Application Endpoints, called via routers
app.use(require ('./routes/user'));
app.use(require ('./routes/group'));
app.use(require ('./routes/expense'));
app.use(require ('./routes/balance'));

app.listen(PORT, ()=>{
console.log("Server is UP and ruuning on Port " + PORT);
})