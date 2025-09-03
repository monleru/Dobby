import axios from 'axios';

const response = await axios.post("https://api.fireworks.ai/inference/v1/chat/completions", {
  model: "accounts/sentientfoundation/models/dobby-unhinged-llama-3-3-70b-new",
  max_tokens: 4096,
  top_p: 1,
  top_k: 40,
  presence_penalty: 0,
  frequency_penalty: 0,
  temperature: 0.6,
  messages: [
    {
      role: "user",
      content: "hello"
    }
  ]
}, {
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": "Bearer fw_3ZWkCuRfNimD94zWvzB9HmbP"
  }
}).then(r => r.data)

console.log(response.choices);