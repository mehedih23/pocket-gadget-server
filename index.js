const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()

app.get('/', (req, res) => {
    res.send('Welcome To Server')
})


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://pocket-gadget-admin-panel:<password>@pocket-gadget.un9wa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    const collection = client.db("test").collection("devices");
    console.log("Database connected")
    // perform actions on the collection object
    client.close();
});


app.listen(port, () => {
    console.log('Your Server is running and the port is http://localhost:', port)
})