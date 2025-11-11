const generateBtn = document.getElementById("generateBtn");
const linkInput = document.getElementById("linkInput");
const qrContainer = document.getElementById("qrContainer");
const qrCanvas = document.getElementById("qrCode");
const downloadLink = document.getElementById("downloadLink");
const qrColor = document.getElementById("qrColor");
const bgColor = document.getElementById("bgColor");
const logoInput = document.getElementById("logoInput");
const saveBtn = document.getElementById("saveQR");
const savedQRCodes = document.getElementById("savedQRCodes");
const savedList = document.getElementById("savedList");

let logoImage = null;

// Handle logo upload
logoInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      logoImage = new Image();
      logoImage.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
});

generateBtn.addEventListener("click", () => {
  const url = linkInput.value.trim();
  if (!url) return alert("Please enter a valid URL.");

  const options = {
    width: 250,
    color: {
      dark: qrColor.value,
      light: bgColor.value
    }
  };

  // Generate QR Code
  QRCode.toCanvas(qrCanvas, url, options, (error) => {
    if (error) console.error(error);
    else {
      if (logoImage) {
        logoImage.onload = () => drawLogo();
      } else {
        showQR();
      }
    }
  });

  function drawLogo() {
    const ctx = qrCanvas.getContext("2d");
    const size = qrCanvas.width * 0.25;
    const x = (qrCanvas.width - size) / 2;
    const y = (qrCanvas.height - size) / 2;
    ctx.drawImage(logoImage, x, y, size, size);
    showQR();
  }

  function showQR() {
    qrContainer.classList.remove("hidden");
    const dataURL = qrCanvas.toDataURL("image/png");
    downloadLink.href = dataURL;
  }
});

// Save QR to local storage
saveBtn.addEventListener("click", () => {
  const dataURL = qrCanvas.toDataURL("image/png");
  const qrList = JSON.parse(localStorage.getItem("savedQRCodes")) || [];
  qrList.push(dataURL);
  localStorage.setItem("savedQRCodes", JSON.stringify(qrList));
  loadSavedQRCodes();
});

// Load saved QRs
function loadSavedQRCodes() {
  const qrList = JSON.parse(localStorage.getItem("savedQRCodes")) || [];
  savedList.innerHTML = "";
  if (qrList.length > 0) {
    savedQRCodes.classList.remove("hidden");
    qrList.forEach(src => {
      const img = document.createElement("img");
      img.src = src;
      savedList.appendChild(img);
    });
  }
}

loadSavedQRCodes();
