const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000 ;


// middleware
app.use(cors());
app.use(express.json());






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n2defbf.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();

    const jewelryCollection = client.db('jewelrydb').collection('jewelry')

    app.post('/jewelry', async(req, res)=>{
        const newJewelry = req.body;
        console.log(newJewelry)
        const result = await jewelryCollection.insertOne(newJewelry);
        res.send(result)
    })


    app.get('/jewelry', async(req, res)=>{
        const cursor = jewelryCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    //get my data by email
    app.get('/myjewelry', async(req, res)=>{
        let query = {};
        if(req.query?.email){
          query = {email: req.query.email}
        }
        const result = await jewelryCollection.find(query).toArray();
        res.send(result)
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



app.get('/', (req, res)=>{
    res.send("jewelry shop is running on port")
} )
app.listen(port, ()=>{
    console.log(`coffee server is running on port: ${port}`)
})