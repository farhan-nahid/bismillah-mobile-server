const express = require('express')
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const { ObjectID, ObjectId } = require('bson');
const app = express()
require('dotenv').config();

const port = process.env.PORT ||  5000;

app.use(cors())
app.use(bodyParser.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2xoju.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const mobileCollection = client.db("bismillahMobileZone").collection("mobile");
  const checkoutMobileCollection = client.db("bismillahMobileZone").collection("checkoutMobile");
  
    app.post('/adminAddMobile', (req,res)=>{
      const newMobile = req.body;
      mobileCollection.insertOne(newMobile)
      .then(result =>{
        res.send(result.insertedCount > 0)
      })
    })

    app.post('/orderCheckout', (req, res)=>{
      const newOrder = req.body;
      checkoutMobileCollection.insertOne(newOrder)
      .then(result=>{
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
        mobileCollection.find({_id:ObjectID(req.params.id)})
          .toArray((err, mobileItems)=>{
         res.send( mobileItems[0]);
          })
         })
       
         app.get('/orders', (req, res)=>{
           checkoutMobileCollection.find({email: req.query.email})
           .toArray((err, totalOrder)=>{
             res.send( totalOrder)
           })
         })

         app.delete('/delete/:id', (req, res)=>{
          console.log(req.params.id);
          mobileCollection.deleteOne({_id: ObjectId(req.params.id)})
          .then( result =>{
            res.send(result.deletedCount > 0)
          })
        })

         app.delete('/cancelOrder/:id', (req, res)=>{
          console.log(req.params.id);
          checkoutMobileCollection.deleteOne({_id: ObjectId(req.params.id)})
          .then( result =>{
            res.send(result.deletedCount > 0)
          })
        })
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})