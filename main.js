const chatBody = document.getElementById("chatbody");
const userInput = document.getElementById("chatinput");
const sendButton = document.getElementById("sendbtn");
const split = document.getElementById("split-icon");
const aside = document.getElementById("aside");
const chatContainer = document.querySelector(".chat-container");
const body = document.querySelector(".body");

split.addEventListener('click', ()=> {
  aside.style.display = 'block';
  aside.style.position = 'fixed';
  aside.style.width = '60%';
  aside.style.height = '100vh';
  aside.style.backgroundColor = 'white'; 
  aside.style.top = '0px'; 
  aside.style.backgroundColor = 'white'; 
  aside.style.overflowY = 'auto'; 
  aside.style.zIndex = '1'; 
  chatContainer.style.backgroundColor = 'black';
})

function closeAside(click) {
  aside.style.display = 'none';

  if(body > '500px') {
    console.log('active width');
  }
}

// ⏱️ Minimum delay to avoid spamming
let lastRequestTime = 0;
const MIN_DELAY = 1000; // 1 second between messages

async function getAIResponse(userMessage) {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.reply;
  } catch (error) {
    console.error("API Error:", error);
    return "Sorry, I encountered an error. Please try again.";
  }
};


function addMessage(role, content) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", `${role}-message`);
  messageDiv.textContent = content;
  chatBody.appendChild(messageDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
}

async function handleSendMessage() {
  const now = Date.now();
  if (now - lastRequestTime < MIN_DELAY) {
    alert("You're sending messages too fast. Please wait a moment.");
    return;
  }
  lastRequestTime = now;

  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  // Add user message
  addMessage("user", userMessage);
  userInput.value = "";
  userInput.disabled = true;
  sendButton.disabled = true;

  // Show typing indicator
  const loadingDiv = document.createElement("div");
  loadingDiv.classList.add("message", "bot-message");
  loadingDiv.textContent = "Alex is typing...";
  loadingDiv.id = "typing-indicator";
  chatBody.appendChild(loadingDiv);
  chatBody.scrollTop = chatBody.scrollHeight;

  try {
    const botResponse = await getAIResponse(userMessage);
    document.getElementById("typing-indicator").remove();
    addMessage("bot", botResponse);
  } catch (error) {
    document.getElementById("typing-indicator").remove();
    addMessage("bot", "Error: " + error.message);
  } finally {
    userInput.disabled = false;
    sendButton.disabled = false;
    userInput.focus();
  }
}

// Event listeners
sendButton.addEventListener("click", handleSendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleSendMessage();
  }
});

// Initial greeting
setTimeout(() => {
  addMessage("bot", "Hello! I'm Alex. How can I help you today?");
}, 500);
