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

  // No units → treat as mm
  const num = parseFloat(value);
  if (isNaN(num)) return NaN;

  return num; // assume mm
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("message", event => {
    if (event.data && event.data.type === "NEW_VERSION_READY") {
      showUpdateBanner();
    }
  });
}

function showUpdateBanner() {
  const banner = document.createElement("div");
  banner.textContent = "Update available — tap to refresh";
  banner.style.position = "fixed";
  banner.style.bottom = "0";
  banner.style.left = "0";
  banner.style.right = "0";
  banner.style.padding = "12px";
  banner.style.background = "#1a1a1a";
  banner.style.color = "white";
  banner.style.textAlign = "center";
  banner.style.fontSize = "16px";
  banner.style.cursor = "pointer";
  banner.style.zIndex = "9999";

  banner.onclick = () => {
    window.location.reload();
  };

  document.body.appendChild(banner);
}

function clearOnFocus(e) {
  if (e.isTrusted) {
    e.target.value = "";
  }
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
  console.log('handleCalc Fired')
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

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const loader = document.getElementById("loader");
    if (loader) {
      loader.style.opacity = "0";
      loader.style.transition = "opacity 200ms ease";
      setTimeout(() => loader.style.display = "none", 200);
    }
  }, 350);
})
