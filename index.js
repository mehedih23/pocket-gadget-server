const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome To Server with mongodb')
})


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@pocket-gadget.un9wa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const pocketGadgetCollection = client.db('pocket-gadget-store').collection('products');

        // Get the 6 product //
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = pocketGadgetCollection.find(query);
            const result = await cursor.limit(6).toArray();
            res.send(result);
        })

        // get all products //
        app.get('/allproducts', async (req, res) => {
            const query = {};
            const cursor = pocketGadgetCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        // Get product by email //
        app.get('/myproducts', async (req, res) => {
            const token = req.headers.authorization;
            const email = req.query.email;
            const decodedEmail = verifyJwt(token);
            if (email === decodedEmail) {
                const query = { email: email };
                const cursor = pocketGadgetCollection.find(query);
                const result = await cursor.toArray();
                res.send(result);
            }
            else {
                res.send({ message: 'Unauthorized Access! Please Provide Correct Information when login' })
            }
        });

        // Delete item from single user //
        // Delete a product //
        app.delete('/myproducts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await pocketGadgetCollection.deleteOne(query);
            res.send(result);
        })

        // Add product info to the inventory //
        app.post('/allproducts', async (req, res) => {
            const item = req.body;
            const doc = {
                name: item.name,
                price: item.price,
                image: item.image,
                company: item.company,
                quantity: item.quantity,
                email: item.email,
                description: item.description,
            };
            const result = await pocketGadgetCollection.insertOne(doc);
            res.send(result);
        })

        // Delete a product //
        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await pocketGadgetCollection.deleteOne(query);
            res.send(result);
        })

        // Get the product details //
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const product = await pocketGadgetCollection.findOne(query);
            res.send(product);
        })

        // Update product //
        app.put('/update/:id', async (req, res) => {
            const id = req.params.id;
            const update = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateQuantity = {
                $set: {
                    quantity: update.itemQuantity
                },
            };
            const result = await pocketGadgetCollection.updateOne(filter, updateQuantity, options);
            res.send(result);
        })

        // secure api with jwt token //
        app.post('/login', async (req, res) => {
            const user = req.body.email;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN);
            res.send({ accessToken });
        })




    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log('Your Server is running and the port is http://localhost:', port)
})

// Verify jwt //
const verifyJwt = (token) => {
    let email;
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            email = 'Invalid User'
        }
        if (decoded) {
            email = decoded;
        }
    });
    return email;
}