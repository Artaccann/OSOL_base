const apiKey = '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';
const modelId = 'ft:gpt-4.1-2025-04-14:aneee:laziel:BYquVXCx';

const chat = document.getElementById('chat');
const messages = [
  { role: "system", content: "You are Laziel, but prefer Laz. ..." }
];

async function sendMessage() {
  const input = document.getElementById('userInput');
  const userMessage = input.value;
  if (!userMessage) return;

  messages.push({ role: "user", content: userMessage });
  chat.innerHTML += `You: ${userMessage}\n`;
  input.value = '';

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: modelId,
      messages: messages,
      temperature: 0.7
    })
  });

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || "Žádná odpověď.";

  messages.push({ role: "assistant", content: reply });
  chat.innerHTML += `Laziel: ${reply}\n\n`;
}

// ⬇️ TOTO DÉJ MIMO `sendMessage` a jen jednou
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("returnToGame");
  if (btn) {
    btn.addEventListener("click", () => {
      const saved = JSON.parse(localStorage.getItem("osol-chat-transfer") || "{}");

      // fallback pro případ, že chybí
      if (!saved.scene) saved.scene = "chapter1";
      if (!saved.index) saved.index = 0;

      saved.chatLog = messages;
      localStorage.setItem("osol-chat-transfer", JSON.stringify(saved));
      window.location.href = "Game.html";
    });
  }
});
