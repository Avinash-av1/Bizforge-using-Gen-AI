const API_BASE = "https://bizforge-using-gen-ai.onrender.com";

// ---------------- COMMON OUTPUT HANDLER ----------------

function showOutput(text) {
  document.getElementById("output").innerHTML =
    text.replace(/\n/g, "<br>");
}

// ---------------- BRAND NAMES ----------------

async function generateBrand() {
  const industry = document.getElementById("inputText").value;

  if (!industry) {
    alert("Please enter an industry!");
    return;
  }

  const response = await fetch(`${API_BASE}/api/generate-brand`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      industry: industry,
      keywords: "",
      tone: "professional",
      language: "english"
    })
  });

  const data = await response.json();
  showOutput(data.data);
}

// ---------------- MARKETING CONTENT ----------------

async function generateContent() {
  const brand = document.getElementById("brandName").value;
  const industry = document.getElementById("industry").value;

  if (!brand || !industry) {
    alert("Please enter Brand Name and Industry!");
    return;
  }

  const response = await fetch(`${API_BASE}/api/generate-content`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      brand_description: `${brand} is a ${industry} startup`,
      tone: "professional",
      content_type: "marketing content",
      language: "english"
    })
  });

  const data = await response.json();
  showOutput(data.data);
}

// ---------------- SENTIMENT ANALYSIS ----------------

async function analyzeSentiment() {
  const text = document.getElementById("inputText").value;

  if (!text) {
    alert("Please enter text to analyze!");
    return;
  }

  const response = await fetch(`${API_BASE}/api/analyze-sentiment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: text,
      brand_tone: "neutral"
    })
  });

  const data = await response.json();
  showOutput(data.data);
}

// ---------------- LOGO IMAGE GENERATION ----------------

async function generateLogo() {
  const brand = document.getElementById("brandName").value;
  const industry = document.getElementById("industry").value;

  if (!brand || !industry) {
    alert("Please enter Brand Name and Industry!");
    return;
  }

  document.getElementById("output").innerText = "Generating logo...";

  const response = await fetch(`${API_BASE}/api/generate-logo-image`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      brand_name: brand,
      industry: industry
    })
  });

  const imageBlob = await response.blob();
  const imageURL = URL.createObjectURL(imageBlob);

  document.getElementById("logoImage").src = imageURL;
  document.getElementById("output").innerText = "Logo generated successfully!";
  document.getElementById("logosection").style.display = "block";
}

// ---------------- CHATBOT ----------------

function toggleChat() {
  document.getElementById("chatPanel").classList.toggle("open");
}

function formatAIResponse(text) {
  if (!text) return "";
  return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
             .replace(/\n+/g, "<br>");
}

async function sendChat() {
  const input = document.getElementById("chatInput");
  const chatBox = document.getElementById("chatBox");
  const msg = input.value.trim();

  if (!msg) return;

  const userMsg = document.createElement("div");
  userMsg.className = "ai-message ai-user";
  userMsg.textContent = msg;
  chatBox.appendChild(userMsg);

  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  const loading = document.createElement("div");
  loading.className = "ai-message ai-bot";
  loading.textContent = "Thinking…";
  chatBox.appendChild(loading);

  try {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg })
    });

    const data = await res.json();
    chatBox.removeChild(loading);

    const botMsg = document.createElement("div");
    botMsg.className = "ai-message ai-bot";
    botMsg.innerHTML = formatAIResponse(data.data);
    chatBox.appendChild(botMsg);

    chatBox.scrollTop = chatBox.scrollHeight;

  } catch {
    chatBox.removeChild(loading);
    loading.textContent = "Unable to connect to server.";
    chatBox.appendChild(loading);
  }
}

// ---------------- MAIN BRANDING CHAT ----------------

async function chatAI() {
  const message = document.getElementById("inputText").value.trim();

  if (!message) {
    alert("Please enter a branding-related question!");
    return;
  }

  document.getElementById("output").innerText =
    "Consulting branding expert...";

  try {
    const response = await fetch(`${API_BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    showOutput(data.data);

  } catch {
    document.getElementById("output").innerText =
      "Error connecting to branding service.";
  }
}