const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/emissions', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cors({
    origin: 'http://ec2-184-72-8-239.us-west-1.compute.amazonaws.com:8080'
}));

const Car = mongoose.model("Car", {
  make: String,
  model: String,
  plate: String,
  appt: Number
})
//var cars = [];

app.get('/api/cars', async (req, res) => {
  console.log("Entered get cars api");
  //console.log(cars);
  try {
    let cars = await Car.find();
    res.send({
      cars: cars
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/api/car/:plate', async (req, res) => {
  console.log("Entered delete car api");
  try {
    await Car.deleteOne({
      plate: req.params.plate
    })
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post('/api/car/:plate/:make/:model', async (req, res) => {
  console.log("Entered post car api");
  let cars = await Car.find();
  let oldcar = cars.find(element => element.plate === req.params.plate);
  if (oldcar !== undefined) {
    console.log("Duplicate Car");
    res.sendStatus(422);
  }
  else {
      const carObj = new Car({
        make: req.params.make,
        model: req.params.model,
        plate: req.params.plate,
        appt: 0
      });
      console.log(carObj);
      try {
        await carObj.save();
        res.send({
          car: carObj
        });
      } catch (error) {
        console.log(error);
        res.sendStatus(500);
      }
  }
});

app.put('/api/appointment/:plate/:appt', async (req, res) => {
  console.log("Entered put car appt api");
  let car = await Car.findOne({
    plate: req.params.plate
  });
  if (car !== undefined) {
    car.appt = Number(req.params.appt);
    await car.save();
  } 
  else {
    res.sendStatus(404);
  }
  try {
    res.send({
      car: car
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(3000, () => console.log('Server listening on port 3000!'));