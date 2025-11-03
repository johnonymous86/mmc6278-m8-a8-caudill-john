const mongoose = require('mongoose')
const MONGODB_URI = process.env.MONGODB_URI ||
  `mongodb://localhost:27017/${process.env.npm_package_config_DB_NAME}`;

mongoose.connect(MONGODB_URI)

module.exports = {connection: mongoose.connection, MONGODB_URI}


//


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://jcaudill86_db_user:CF7peLHGyfaQE90K@cluster0.n9whiwy.mongodb.net/?appName=Cluster0";

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
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
