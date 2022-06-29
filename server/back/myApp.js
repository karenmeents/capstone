const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const CustomerModel = require('../mongodb/myApp')
require('dotenv').config()
const cors = require('cors');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose')
const ObjectID = require('mongodb').ObjectID;
const mongo = require('mongodb').MongoClient;

app.use(cors())
app.use(express.json())








app.post('/newUser/:fname/:lname/:uname/:pass/:cpass', (req, res) => {
  const hash = bcrypt.hashSync(req.params.pass, 12)
  CustomerModel.findOne({ firstname: req.params.fname, lastname: req.params.lname }, (err, data) => {
    if (data !== null) {
      if (data.length === 1) {
        data = data[0]
      }
    }

    if (err) {
      console.log(err)
    }

    else if (data !== null && data.firstname === req.params.fname && data.lastname === req.params.lname) {

      CustomerModel.findByIdAndUpdate({ _id: data._id }, { username: req.params.uname, password: hash }, (err, newData) => {
        if (err) {
          console.log(err)
        }
        else {
          console.log('updated user', newData)

        }

      })
    }
    else {

      let userToSave = new CustomerModel({
        firstname: req.params.fname,
        lastname: req.params.lname,
        username: req.params.uname,
        password: hash
      });

      userToSave.save((err, data) => {
        if (err) {
          console.log(err);
        }
        else {

          res.json({ message: 'Your password is confirmed. Please sign in.' })
        }
      })

    }
  })
})





app.post('/login/:uname/:pass', (req, res) => {

  CustomerModel.find({ username: req.params.uname }, (err, data) => {

    if (err) {
      console.log(err)
    }
    else {

      data.map(obj => {
        if (bcrypt.compareSync(req.params.pass, obj.password) && obj.username === req.params.uname) {

          res.json({ logged: true })
        }
        else {

          res.json({ logged: false })
        }

      })

    }
  })
})









app.post('/signup/:fname/:lname/:email/:newsletter', (req, res) => {

  CustomerModel.findOne({ firstname: req.params.fname, lastname: req.params.lname }, (err, data) => {
    if (data !== null) {
      if (data.length === 1) {
        data = data[0]
      }
    }
    if (err) {
      console.log(err)
    }
    else if (data !== null && data.firstname === req.params.fname && data.lastname === req.params.lname) {

      CustomerModel.findByIdAndUpdate({ _id: data._id }, { newsletter: true, email: req.params.email }, (err, newData) => {

        if (err) {
          console.log(err)
        }
        else {
          console.log('b', newData)
        }
      })

    }
    else {
      let userToSave = new CustomerModel({
        firstname: req.params.fname,
        lastname: req.params.lname,
        email: req.params.email,
        newsletter: true

      });

      userToSave.save((err, Userdata) => {
        if (err) {
          console.log(err);
        }
        else {
          console.log('b', newData)

        }
      })
    }
    res.json({ message: 'You are on our mailing list' })



  })

})








app.post('/delete', (req, res) => {

  CustomerModel.findOne({ firstname: req.body.fname, lastname: req.body.lname }, (err, data) => {

    if (data !== null) {
      if (data.length === 1) {
        data = data[0]
      }
    }
    if (err) {
      console.log(err)
    }
    else if (data !== null && data.firstname === req.body.fname && data.lastname === req.body.lname) {

      CustomerModel.findByIdAndUpdate({ _id: data._id }, { newsletter: false, email: "" }, (err, newData) => {

        if (err) {
          console.log(err)
        }
        else {
          console.log('c', newData)
        }
      })
    }
    res.json({ message: 'You have been removed from our mailing list.' })
  })
})







app.post('/CheckOut', (req, res) => {
  CustomerModel.findOne({ firstname: req.body.fname, lastname: req.body.lname }, (err, data) => {
    if (err) {
      console.log(err);
    }
    else {
      const cchash = bcrypt.hashSync(req.body.cc, 12)
      let date = new Date()
      let dateArr = []
      let month = date.getMonth() + 1
      let day = date.getDate()

      if (month < 10) {
        month = `0${month}`
      }
      if (day < 10) {
        day = `0${day}`
      }

      dateArr.push(date.getFullYear(), month, day);



      let dataToSave = new CustomerModel({
        date: dateArr.join('-'),
        firstname: req.body.fname,
        lastname: req.body.lname,
        address: req.body.address,
        city: req.body.city,
        state: req.body.st,
        zip: req.body.zip,
        phone: req.body.phone,
        cc: cchash,
        cctype: req.body.cctype,
        exp: req.body.exp,
        recFirstname: req.body.recfname,
        recLastname: req.body.reclname,
        recAddress: req.body.recaddress,
        recCity: req.body.reccity,
        recState: req.body.recstate,
        recZip: req.body.reczip,
        recPhone: req.body.recphone,
        card: req.body.card,
        amt: req.body.amt,
        order: req.body.neworder,
        comments: req.body.comment,
        deldate: req.body.deldate
      });

      dataToSave.save((err, Userdata) => {
        if (err) {
          console.log(err);
        }
        else {

          res.json({ message: 'Your order has been confirmed' })

        }
      })

    }
  })

})




mongo.connect(process.env.MONGO_URI, (err, db) => {
  db = db.db('Customers')

  app.post('/admin/:adminpass', (req, res) => {
    db.collection('admin').findOne({ pass: req.params.adminpass }, (err, data) => {
      if (err) {
        console.log(err)
        res.json({ login: false })
      }
      else {

        if (data != null && data.pass === req.params.adminpass) {
          res.json({ login: true })
        }
        else {
          res.json({ login: false })
        }
      }
    })
  })
})

app.get('/orders/:date', (req, res) => {
  CustomerModel.find({ deldate: req.params.date }, (err, data) => {
    if (err) {
      console.log(err)
    }
    else {
      if (data[0] === undefined) {
        res.json({ message: 'There are no orders for this date' })
      }
      else {

        res.json(data)

      }

    }
  })
})



const listener = app.listen(process.env.PORT || 8000, () => {
  console.log("Listening on port " + listener.address().port);
});

