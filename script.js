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
const borderColor = document.getElementById("borderColor");
const borderSize = document.getElementById("borderSize");
const borderValue = document.getElementById("borderValue");
const borderStyle = document.getElementById("borderStyle");
const resetDesign = document.getElementById("resetDesign");

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

// Generate QR code
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

  QRCode.toCanvas(qrCanvas, url, options, (error) => {
    if (error) console.error(error);
    else {
      if (logoImage) {
        logoImage.onload = () => drawLogo();
        drawLogo();
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
    resetDesign.classList.remove("hidden");
    drawBorder();
    const dataURL = qrCanvas.toDataURL("image/png");
    downloadLink.href = dataURL;
  }
});

// Draw border function
function drawBorder() {
  const ctx = qrCanvas.getContext("2d");
  const border = parseInt(borderSize.value);
  const style = borderStyle.value;
  const color = borderColor.value;
  const half = border / 2;

  ctx.save();
  ctx.lineWidth = border;
  ctx.strokeStyle = color;
  ctx.beginPath();

  if (style === "round") {
    const radius = 10;
    ctx.moveTo(half + radius, half);
    ctx.lineTo(qrCanvas.width - half - radius, half);
    ctx.quadraticCurveTo(qrCanvas.width - half, half, qrCanvas.width - half, half + radius);
    ctx.lineTo(qrCanvas.width - half, qrCanvas.height - half - radius);
    ctx.quadraticCurveTo(qrCanvas.width - half, qrCanvas.height - half, qrCanvas.width - half - radius, qrCanvas.height - half);
    ctx.lineTo(half + radius, qrCanvas.height - half);
    ctx.quadraticCurveTo(half, qrCanvas.height - half, half, qrCanvas.height - half - radius);
    ctx.lineTo(half, half + radius);
    ctx.quadraticCurveTo(half, half, half + radius, half);
  } else {
    ctx.rect(half, half, qrCanvas.width - border, qrCanvas.height - border);
  }

  ctx.stroke();
  ctx.restore();
}

// Live updates (QR + border)
function updateQRLive() {
  if (!qrContainer.classList.contains("hidden")) {
    const url = linkInput.value.trim();
    if (!url) return;

    const ctx = qrCanvas.getContext("2d");
    ctx.clearRect(0, 0, qrCanvas.width, qrCanvas.height);

    const options = {
      width: 250,
      color: {
        dark: qrColor.value,
        light: bgColor.value
      }
    };

    QRCode.toCanvas(qrCanvas, url, options, (error) => {
      if (!error) {
        if (logoImage) {
          const size = qrCanvas.width * 0.25;
          const x = (qrCanvas.width - size) / 2;
          const y = (qrCanvas.height - size) / 2;
          ctx.drawImage(logoImage, x, y, size, size);
        }
        drawBorder();
      }
    });
  }
}

// Live listeners
borderSize.addEventListener("input", () => {
  borderValue.textContent = `${borderSize.value}px`;
  updateQRLive();
});
borderColor.addEventListener("input", updateQRLive);
borderStyle.addEventListener("change", updateQRLive);
qrColor.addEventListener("input", updateQRLive);
bgColor.addEventListener("input", updateQRLive);

// Reset design
resetDesign.addEventListener("click", () => {
  qrColor.value = "#000000";
  bgColor.value = "#ffffff";
  borderColor.value = "#000000";
  borderSize.value = 2;
  borderStyle.value = "sharp";
  borderValue.textContent = "2px";
  updateQRLive();
});

// Save QR codes
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
