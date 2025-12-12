const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.post('/calculate-bmi', (req, res) => {
  const { weight, height } = req.body;

  
  if (!weight || !height || weight <= 0 || height <= 0 || isNaN(weight) || isNaN(height)) {
    return res.json({
      error: true,
      message: 'Please enter valid positive numbers for weight and height.'
    });
  }

  
  const heightInMeters = parseFloat(height);
  const weightInKg = parseFloat(weight);
  const bmi = weightInKg / (heightInMeters * heightInMeters);

  
  let category = '';
  if (bmi < 18.5) {
    category = 'Underweight';
  } else if (bmi >= 18.5 && bmi < 24.9) {
    category = 'Normal weight';
  } else if (bmi >= 25 && bmi < 29.9) {
    category = 'Overweight';
  } else {
    category = 'Obese';
  }

  
  res.json({
    error: false,
    bmi: bmi.toFixed(2),
    category: category,
    message: `Your BMI is ${bmi.toFixed(2)} - ${category}`
  });
});


app.listen(PORT, () => {
  console.log(`BMI Calculator server is running at http://localhost:${PORT}`);
});
