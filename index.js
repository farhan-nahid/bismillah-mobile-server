const express = require('express')
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const { ObjectID } = require('bson');
const app = express()
require('dotenv').config();

const port = process.env.PORT ||  5000;

app.use(cors())
app.use(bodyParser.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2xoju.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const mobileCollection = client.db("bismillahMobileZone").collection("mobile");
  
    app.post('/adminAddMobile', (req,res)=>{
      const newMobile = req.body;
     // console.log('Adding mobile', newMobile);
      mobileCollection.insertOne(newMobile)
      .then(result =>{
        console.log('insertedCount',result.insertedCount);
        res.send(result.insertedCount > 0)
      })
    })
    
    app.get('/mobileItems', (req, res)=>{
      mobileCollection.find()
      .toArray((err, mobileItems)=>{
        res.send( mobileItems);
      })

    })
       app.get('/mobile/:id', (req, res)=>{
         const mobile = req.params.id
        console.log('mobile', mobile);
        mobileCollection.find({_id:ObjectID(req.params.id)})
          .toArray((err, mobileItems)=>{
         res.send( mobileItems[0]);
          })
         })
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})