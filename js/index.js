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
  const d1 = Number(document.getElementById('d1').value);
  const d2 = Number(document.getElementById('d2').value);
  const d3 = Number(document.getElementById('d3').value);

  const values = [d1, d2, d3];

  const max = Math.max(...values);
  const min = Math.min(...values);
  const delta = max - min;

  const nominal = (d1 + d2 + d3) / 3;
  const limit = nominal * 0.01;

  return { max, min, delta, nominal, limit };
}