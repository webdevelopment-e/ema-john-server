
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.isoaq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = 5001;

// console.log(process.env.DB_USER);



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");

  // console.log('database connected');


  app.post('/addProduct', (req, res) => {
    const products = req.body;
    // console.log(product);
    productsCollection.insertOne(products)
    .then(result => {
      // console.log(result);
      // console.log(result.insertedCount);
      res.send(result.insertedCount);
    })

  })

  app.get('/products', (req, res) => {
    productsCollection.find({})
    .toArray((err, documents) =>{
      res.send(documents);
    })
  })

  app.get('/product/:key', (req, res) => {
    productsCollection.find({key: req.params.key})
    .toArray((err, documents) =>{
      res.send(documents[0]);
    })
  })

});


app.get('/', (req, res) => {
  res.send('Hello ema John');
})

app.post('/productsByKeys', (req, res) => {
  const productKeys = req.body;
  productsCollection.find({key: {$in: productKeys}})
  .toArray((err, documents) => {
      res.send(documents);
  })
})

app.post('/addOrder', (req, res) => {
  const order = req.body;
  // console.log(product);
  ordersCollection.insertOne(order)
  .then(result => {
    // console.log(result);
    // console.log(result.insertedCount);
    res.send(result.insertedCount > 0);
  })

})



app.listen(process.env.PORT || port);