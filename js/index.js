function parseLength(input) {
  if (!input) return NaN;

  let value = input.toString().trim().toLowerCase();

  const inchIndicators = ['"', 'in', 'inch', 'inches'];

  // Explicit inch units
  if (inchIndicators.some(ind => value.includes(ind))) {
    value = parseFloat(value);
    return value * 25.4; // inches → mm
  }

  // Explicit mm
  if (value.includes('mm')) {
    return parseFloat(value);
  }

  // No units → infer
  const num = parseFloat(value);
  if (isNaN(num)) return NaN;

  // <100 = inches, >=100 = mm
  return num < 100 ? num * 25.4 : num;
}

function clearOnFocus(e) {
  e.target.value = "";
}

const d1 = document.getElementById('d1');
const d2 = document.getElementById('d2');
const d3 = document.getElementById('d3');

d1.addEventListener("focus", clearOnFocus);
d2.addEventListener("focus", clearOnFocus);
d3.addEventListener("focus", clearOnFocus);

document.getElementById('calcForm').addEventListener('submit', e => {
  e.preventDefault();
  handleCalc();
});



function handleCalc(){
  const {delta,limit} = calcRound()
document.getElementById('deltaValue').textContent = delta.toFixed(3);
document.getElementById('limitValue').textContent = limit.toFixed(3);
  
   const status = document.getElementById('statusMessage');

  if (limit > delta) {
    status.textContent = "Shell is within tolerance";
    status.classList.remove("fail");
    status.classList.add("ok");
  } else {
    status.textContent = "Shell is out of round";
    status.classList.remove("ok");
    status.classList.add("fail");
  }
  //document.getElementById('d1').value = "";
//  document.getElementById('d2').value = "";
  //document.getElementById('d3').value = "";
}

function calcRound() {
  const d1 = parseLength(document.getElementById('d1').value);
  const d2 = parseLength(document.getElementById('d2').value);
  const d3 = parseLength(document.getElementById('d3').value);

  const values = [d1, d2, d3];

  const max = Math.max(...values);
  const min = Math.min(...values);
  const delta = max - min;

  const nominal = (d1 + d2 + d3) / 3;
  const limit = nominal * 0.01;

  return { max, min, delta, nominal, limit };
}
