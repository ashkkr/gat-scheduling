const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://ashutoshsangra:4xj7hdS43aAv70PZ@cluster0.4ucnbnd.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'gst_scheduling' });

const userLogin = require('./routes/userlogin');
const { clientRoutes } = require('./routes/client');

app.use('/', clientRoutes);
app.use('/users', userLogin);

app.listen(3000, () => {
    console.log("The server is listening on 3000");
});