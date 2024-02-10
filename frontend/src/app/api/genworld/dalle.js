import { OpenAI } from 'openai';

// Initialize the OpenAI instance with your API key

export const dalle = async (userPrompt) => {

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const prompt = "equirectangular insta 360 degrees image super detailed and layered with the subject: " + userPrompt;

    // Make the API request to generate the image
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1792x1024",
    });
  
  console.log(response);
    // Extract the image URL from the response
    const imageUrl = response.data[0].url;
    console.log(imageUrl);

    return imageUrl;
 
};
