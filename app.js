const express = require('express');

const morgan = require('morgan');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const app = express();

const productRoutes = require('./api/routes/products');

const orderRoutes = require('./api/routes/orders');

mongoose.connect('mongodb+srv://node-rest-user:' + process.env.MONGO_ATLAS_PW +'@node-rest-api-cluster-cigm0.mongodb.net/test?retryWrites=true',{useNewUrlParser: true});

mongoose.Promise = global.Promise;

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

app.use( ( req , res , next) =>{

    res.header('Access-Control-Allow-Origin' , '*');

    res.header(
    "Access-Control-Allow-Headers" , 
    "Origin , Content-Type , X-Requested-With , Accept , Authorization" 
    );

    if ( req.method === 'OPTIONS') {

        res.header('Access-Control-Allow-Methods' , 'PUT , POST , PATCH , DELETE , GET'); 
        return res.status(200).json({});
    }

    next();
    
})
 
//Routes that handle requests

app.use('/products' , productRoutes);

app.use('/orders' , orderRoutes );



app.use((req ,res , next) => {

    const err = new Error('Request invalid');

    err.status = 400;

    next(err);
});

app.use((error , req , res , next) => {

    res.status(error.status || 500);
    res.json({
        error:{
            message : error.message
        }

    });


});

module.exports = app;