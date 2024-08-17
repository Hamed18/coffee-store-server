const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// console.log(process.env.DB_USER)   // https://www.npmjs.com/package/dotenv
// console.log(process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3nkfm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// console.log(uri);
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

	const coffeeCollection = client.db("coffeeDB").collection("coffee"); // connects your Node.js application to the coffeeDB database and specifically to the coffee collection within that database.
    
  app.get('/coffee', async(req,res) => {  // Setting Up the GET Route: When someone makes a GET request to /coffee, this function will be executed. app.get is a method used to define a route that handles GET requests., async (req, res) => { ... } is an asynchronous function 
    const cursor = coffeeCollection.find();  // coffeeCollection.find() is used to query all the documents in the coffee collection. It returns a cursor, which is like a pointer that allows you to iterate through the results of the query.
    const result = await cursor.toArray();  // await cursor.toArray() converts all the documents that the cursor points to into an array. await ensures that the code waits for this operation to complete before moving on.
    res.send(result);  // res.send(result) sends the array of documents (result) back to the client (e.g., a web browser or another server) as the response to the GET request.
  })   // now go to http://localhost:5000/coffee you will find all data in an array

	app.post('/coffee', async(req,res) => {
		const newCoffee = req.body;
		console.log(newCoffee);
		const result = await coffeeCollection.insertOne(newCoffee);
		res.send(result);
	})

  app.delete('/coffee/:id', async(req,res) => {  // Defining the DELETE Route:
    const id = req.params.id;  // Extracting the id from the Request:
    const query = {_id : new ObjectId(id)} //creates a query object that specifies which document to delete. new ObjectId(id) converts the id string into an ObjectId, which is the format MongoDB uses for _id fields.
    const result = await coffeeCollection.deleteOne(query);
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


app.get('/', (req,res) => {
	res.send('coffee making server is running')
})

app.listen(port, () => {
	console.log(`coffee server is running on port ${port}`)
})