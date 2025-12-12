document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('bmiForm');
  const errorMessage = document.getElementById('errorMessage');
  const resultContainer = document.getElementById('resultContainer');
  const bmiValue = document.getElementById('bmiValue');
  const bmiCategory = document.getElementById('bmiCategory');
  const bmiMessage = document.getElementById('bmiMessage');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    errorMessage.style.display = 'none';
    resultContainer.style.display = 'none';

    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);

    if (!weight || !height || weight <= 0 || height <= 0 || isNaN(weight) || isNaN(height)) {
      errorMessage.textContent = 'Please enter valid positive numbers for weight and height.';
      errorMessage.style.display = 'block';
      return;
    }

    fetch('/calculate-bmi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weight, height })
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        errorMessage.textContent = data.message || 'Error calculating BMI.';
        errorMessage.style.display = 'block';
        return;
      }

      bmiValue.textContent = data.bmi;
      bmiCategory.textContent = data.category;
      // Apply category-specific classes for styling (normal, overweight, obese, underweight)
      const cat = (data.category || '').toLowerCase();
      // category label classes
      bmiCategory.classList.remove('normal', 'overweight', 'obese', 'underweight');
      if (cat.includes('normal')) bmiCategory.classList.add('normal');
      else if (cat.includes('overweight')) bmiCategory.classList.add('overweight');
      else if (cat.includes('obese')) bmiCategory.classList.add('obese');
      else if (cat.includes('under')) bmiCategory.classList.add('underweight');
      // result card background classes
      const resultCard = document.querySelector('.result-card');
      if (resultCard) {
        resultCard.classList.remove('normal', 'overweight', 'obese', 'underweight');
        if (cat.includes('normal')) resultCard.classList.add('normal');
        else if (cat.includes('overweight')) resultCard.classList.add('overweight');
        else if (cat.includes('obese')) resultCard.classList.add('obese');
        else if (cat.includes('under')) resultCard.classList.add('underweight');
      }
      bmiMessage.textContent = data.message || '';
      resultContainer.style.display = 'block';
    })
    .catch(error => {
      console.error('Error:', error);
      errorMessage.textContent = 'An error occurred. Please try again.';
      errorMessage.style.display = 'block';
    });
  });
});
