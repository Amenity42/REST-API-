//Create Rest API for the application
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const {Sequelize, DataTypes, ValidationError} = require('sequelize');


//Setup database
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'messages.db'
})

//Test you have connected to the database


//Create a model for the database
const Message = sequelize.define('Message', {
    // Model attributes are defined here
    message: {
        type: DataTypes.STRING,
        allowNull: false
    },
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }
});



//Setup the express server
let app = express();
let port = process.env.PORT || 3000;

//Check the server status and listen to the port
app.use(express.json()); //!Tells express we are expecting JSON data
app.listen(port, async function() {
    await sequelize.sync();
    console.log('Server is running on port: ' + port);

});

//Get all request
app.get('/messages', async function(req, res) {
    try {
        let message = await  Message.findAll();
        res.status(201).send(message);
    } catch (error) {
        if(error instanceof ValidationError){
            res.status(400).send();
        }
        else{
            res.status(500).send();
        }
        next(error);
    }
});

//Get specific request
app.get('/messages/:id', async function(req, res) {
    try {
        let message = await  Message.findOne({
            where: { id: req.params.id }
        });

        //Check if message exists else send 404 err
        if(message){
            res.status(200).send(message);
        }
        else{
            res.status(404).send();
        }
    } catch (error) {
        res.status(500).send();
        next(error);
    }
});

//Post requests
app.post(/messages/, async function(req, res, next) {
    try {
        let message = await  Message.create({ message : req.body.message });
        res.status(201).send(message);
    } catch (error) {
        if(error instanceof ValidationError){
            res.status(400).send();
        }
        else{
            res.status(500).send();
        }
        next(error);
    }
});

//Put requests

app.put('/messages/:id', async function(req, res, next) {
try{
    let message = await  Message.findOne({
        where: { id: req.params.id }
    });

    //Check if message exists else send 404 err
    if(message){
        res.status(200).send('Updated message');
        message = await  Message.update({ message : req.body.message },{
        where: { id: req.params.id }
        });
    }
    else{
        let message = await  Message.create({ message : req.body.message });
        res.status(201).send('Message was not found - creating message');
    }
} catch (error) {
    if(error instanceof ValidationError){
        res.status(400).send();
    }
    else{
        res.status(500).send();
    }
    next(error);
}
});

//Delete requests

app.delete(/messages/, function(req, res) {
    res.send('Hello World');
});


