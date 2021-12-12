const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();


const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// mongoDb uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lcafd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        // console.log("connected database");
        const database = client.db('carMechanic');
        const servicesCollection = database.collection('services');

        // GET API
        app.get('/services', async (req, res) => {
            const service = servicesCollection.find({});
            // console.log(service);
            const services = await service.toArray();
            // console.log(services);
            res.send(services);
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            // console.log('getting the service', service);
            res.json(service);
        })


        // POST API
        app.post('/services', async (req,res) => {
            const service = req.body;
            console.log('hit the post api', service);
            const result = await servicesCollection.insertOne(service);
            // console.log('Got the services',result);
            res.send(result);
        })

        // DELETE API
        app.delete('/services/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id) };
            console.log(query);
            const result = await servicesCollection.deleteOne(query);
            console.log('deleting the user with id: ', result);
            res.json(result);
          })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => res.send('Running Genius Car Server!!'))
app.listen(port, () => console.log(` Genius Car Server app listening on port ${port}!`))


// app.delete('/services/:id', async (req,res) => {
//     const id = req.params.id;
//     const query = { _id: ObjectId(id) };
//     const result = await servicesCollection.deleteOne(query);
//     console.log('deleting the user with id: ', result);
//     res.json(result);
// })