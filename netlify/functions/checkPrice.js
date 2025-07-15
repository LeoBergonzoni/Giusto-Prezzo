const OpenAI = require("openai");

let openai;

if (!openai) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

exports.handler = async function (event, context) {
  try {
    const { product, price, location } = JSON.parse(event.body);

    const prompt = `Un utente sta acquistando "${product}" per ${price}€ a "${location}". Sulla base del prezzo medio di mercato, valuta se è un buon prezzo, nella media o troppo alto. Rispondi in modo sintetico con: prezzo medio stimato in €, e livello ("sotto la media", "nella media", "sopra la media", "molto sopra la media").`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 100,
    });

    const text = response.choices[0].message.content.trim();

    return {
      statusCode: 200,
      body: JSON.stringify({ result: text }),
    };
  } catch (error) {
    console.error("Errore nella funzione checkPrice:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Errore interno nella funzione" }),
    };
  }
};