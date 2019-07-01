const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb+srv://formlife1:<formlife1>@cluster0-mx58k.mongodb.net/test?retryWrites=true';

// Use connect method to connect to the Server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  client.close();
});

const db = client.db("test");

db.collection('inventory').insertOne({
    name:'akshay',
    email:'akshay@gmail.com',
    text:'abcde'
  })
  