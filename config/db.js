
 require('dotenv').config()
 
 const user = process.env.USER_MOGODB
 const pass = process.env.PASSWORD_MOGODB

 const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${user}:${pass}@apicluster.geygt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("blog");
  // perform actions on the collection object
  client.close();
});

