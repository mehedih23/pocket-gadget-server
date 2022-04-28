const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()

app.get('/', (req, res) => {
    res.send('Welcome To Server with mongodb')
})


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@pocket-gadget.un9wa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const pocketGadgetCollection = client.db('pocket-gadget-store').collection('products');

        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = pocketGadgetCollection.find(query);
            const result = await cursor.limit(6).toArray();
            res.send(result);
        })
    }
    finally {

    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log('Your Server is running and the port is http://localhost:', port)
})