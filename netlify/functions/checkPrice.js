const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async function (event, context) {
  try {
    // Controllo presenza corpo JSON
    if (!event.body) {
      throw new Error("Il body della richiesta è vuoto");
    }

    const { product, price, location } = JSON.parse(event.body);

    // Controllo dati obbligatori
    if (!product || !price || !location) {
      throw new Error("Dati mancanti: assicurati di specificare prodotto, prezzo e luogo");
    }

    const prompt = `Un utente sta acquistando "${product}" per ${price}€ a "${location}". Sulla base del prezzo medio di mercato, valuta se è un buon prezzo, nella media o troppo alto. Rispondi in modo sintetico con: prezzo medio stimato in €, e livello ("sotto la media", "nella media", "sopra la media", "molto sopra la media").`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 100,
    });

    const result = response.choices?.[0]?.message?.content?.trim();

    if (!result) {
      throw new Error("Nessuna risposta valida da OpenAI");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ result }),
    };
  } catch (error) {
    console.error("Errore nella funzione checkPrice:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};