const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.handler = async (event) => {
  const { product, price, location } = JSON.parse(event.body);

  const prompt = `Sto acquistando un/una \"${product}\" per €${price} a ${location}. 
  Qual è il prezzo medio di mercato per questo prodotto in quella zona?
  Rispondi con:
  - stima del prezzo medio
  - se sto spendendo meno della media, nella media, sopra la media o molto sopra la media.`;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const response = completion.data.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ response }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};