import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const baseURL = "http://ec2-184-72-8-239.us-west-1.compute.amazonaws.com:3000"

function App() {
  const [cars, setCars] = useState([]);
  const [error, setError] = useState("");
  
  const fetchCars = async() => {
    try {      
      const response = await axios.get(baseURL+"/api/cars");
      setCars(response.data.cars);
    } catch(error) {
      setError("error retrieving products: " + error);
    }
  }
  const removeCar = async(car) => {
    try {
      await axios.delete(baseURL+"/api/car/" + car.plate);
      fetchCars();
    } catch(error) {
      setError("error removing car: " + error);
    }
  }
  const addCar = async() => {
    let make = document.getElementById("makeInput").value;
    let model = document.getElementById("modelInput").value;
    let plate = document.getElementById("plateInput").value;
    let errField = document.getElementById("addButtonErr");
    if (make === "" || model === "" || plate === "") {
     errField.style.visibility = "visible";
     return;
    }
    errField.style.visibility = "hidden";
    let duplicateErr = document.getElementById("duplicateMessage");
    
    try {
      await axios.post(baseURL+"/api/car/" + plate + "/" + make + "/" + model);
      fetchCars();
    } catch(error) {
      setError("error adding car: " + error);
    }
  }
  const updateAppt = async(car) => {
    try {
      await axios.put(baseURL+"/api/appointment/" + car.plate + "/" + car.appt);
      fetchCars();
    } catch(error) {
      setError("error updating appointment: " + error);
    }
  }
  
  function trackAppt(val, car) {
    car.appt = val;
  }
  
  useEffect(() => {
    fetchCars();
  },[]);
  
  return (
    <div className="App">
      <div className="pageTitleContainer">
        <h1 className="h1Class">Schedule Your At Home Emissions Check</h1>
      </div>
      <div className="carInformationContainer">
        <div className="carListContainer">
          <h2 className="h2Class">My Cars</h2>
          {cars.map( car => (
            <div key={car.id} className="carRow">
              <div className="car-details">
                <p className="car-description"><strong>Make:</strong> {car.make}, <strong>Model:</strong> {car.model}, <strong>Plate:</strong> {car.plate}, <strong>Days till Appt:</strong> {car.appt}</p>
                <div className="appointmentDetails">
                  <p className="car-description">Update Days till Appointment: &nbsp;</p>
                  <input className="intInput" type="number" id={car.plate} min="1" max ="60" onChange={(evt) => car.appt = evt.target.value}/>
                  <button className="buttonClass" onClick={e => updateAppt(car)}>Update Appointment</button>
                </div>
              </div>
              <button className="removeButton" onClick={e => removeCar(car)}>Remove Car</button>
            </div>
          ))}
          <div className="addCarContainer">
            <h2 className="h2Class">Register Car</h2>
            <div className="makeInputContainer">
              <label className="inputLabel" for="makeInput"><strong>Make:</strong></label>
              <input className="inputClass" type="text" id="makeInput" name="makeInput" size="15" maxlength="20"/>
            </div>
            <div className="modelInputContainer">
              <label className="inputLabel" for="modelInput"><strong>Model:</strong></label>
              <input className="inputClass" type="text" id="modelInput" name="modelInput" size="15" maxlength="20"/>
            </div>
            <div className="plateInputContainer">
              <label className="inputLabel" for="plateInput"><strong>Plate:</strong></label>
              <input className="inputClass" type="text" id="plateInput" name="plateInput" size="15" maxlength="20"/>
            </div>
            <button className="buttonClass" onClick={e => addCar()}>Add Car</button>
            <p><strong>Duplicate License Plates Will Not Be Added</strong></p>
            <p id="addButtonErr">Must Fill Out Make, Model, and Plate fields before adding a new car</p>

          </div>
        </div>
        
      </div>
      <div className='footer'>
        <div className='footer-item'>
          <a target='_blank' href='https://github.com/KevinHillyard/emissions-checks'>Link to Github</a>
        </div>
      </div>
    </div>
  );
}

export default App;
