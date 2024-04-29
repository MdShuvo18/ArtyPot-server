const express = require('express')
const cors = require('cors');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middle ware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ameizfp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// console.log(uri)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        const newCraftItemCollection = client.db("CraftItemCollection").collection("CraftItemCollection");


        const allArtandCraftCollection = client.db("CraftItemCollection").collection("AllArtandCraftCollection");
        // console.log(allArtandCraftCollection)

        const clayMadePotteryCollection = client.db("CraftItemCollection").collection("CLAY_MADE_POTTERY");

        // allArtandCraftCollection data
        app.get('/allArtandCraft', async (req, res) => {
            const cursor = allArtandCraftCollection.find()
            const result = await cursor.toArray();
            res.send(result);

        })

        // subcategory section data get 
        app.get('/subcategorysection/:subcategory_Name', async (req, res) => {
            const subcategory_Name = req.params.subcategory_Name
            console.log(subcategory_Name)
            const query = { subcategory_Name: subcategory_Name }
            const result = await newCraftItemCollection.find(query).toArray();
            res.send(result);
        })

        // clayMadePotteryCollection data
        app.get('/claymadepoterry', async (req, res) => {
            const cursor = clayMadePotteryCollection.find()
            const result = await cursor.toArray();
            res.send(result);
        })




        app.get('/addCraftItem', async (req, res) => {
            const cursor = newCraftItemCollection.find()
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/addCraftItem/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await newCraftItemCollection.findOne(query);
            res.send(result);
        })

        app.get('/myList/:email', async (req, res) => {
            // console.log(req.params.email)
            const result = await newCraftItemCollection.find({ email: req.params.email }).toArray();
            res.send(result);
        })

        app.post('/addCraftItem', async (req, res) => {
            const newCraftItem = req.body;
            console.log(newCraftItem);
            const result = await newCraftItemCollection.insertOne(newCraftItem);
            res.send(result);
        })

        // update item value
        app.put('/addCraftItem/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedItem = req.body;
            const Item = {
                $set: {
                    image: updatedItem.image,
                    item_name: updatedItem.item_name,
                    subcategory_Name: updatedItem.subcategory_Name,
                    short_description: updatedItem.short_description,
                    price: updatedItem.price,
                    rating: updatedItem.rating,
                    customization: updatedItem.customization,
                    processing_time: updatedItem.processing_time,
                    stockStatus: updatedItem.stockStatus
                }
            }
            const result = await newCraftItemCollection.updateOne(filter, Item, options);
            res.send(result);
        })

        // delete item
        app.delete('/addCraftItem/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await newCraftItemCollection.deleteOne(query);
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('art and craft server starting')
})

app.listen(port, () => {
    console.log(`art and craft server listing on post: ${port}`)
})