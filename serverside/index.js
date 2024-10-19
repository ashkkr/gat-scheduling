const express = require('express'); // imports express framework into the application
const cors = require('cors'); // imports CORS middleware into the application
const mongoose = require('mongoose');

const app = express(); // creates an instance of an express application
// app.use is used to add a middleware to the application
// express.json middleware is added. This middleware parses json requests
// and makes them available as req.body
app.use(express.json());
// adds cors middleware. cors() function enables cors for all routes.
// cors() function also adds necessary headers to responses allowing cross-origin
// requests from any origin by default
app.use(cors());

mongoose.connect('mongodb+srv://ashutoshsangra:4xj7hdS43aAv70PZ@cluster0.4ucnbnd.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'gst_scheduling' });

const userLogin = require('./routes/userlogin');
const { clientRoutes } = require('./routes/client');

app.use('/', clientRoutes);
app.use('/users', userLogin);

app.listen(3000, () => {
    console.log("The server is listening on 3000");
});

module.exports = app;