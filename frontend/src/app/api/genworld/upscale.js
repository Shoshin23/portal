const REPLICATE_API_TOKEN = "r8_3DUVTLC4hSChEzhGQ5F4gwjX3iLv1zM1SsSme";

import Replicate from "replicate";

async function imageUrlToBase64(imageUrl) {
  try {
      // Fetch the image as a binary buffer
      const response = await fetch(imageUrl);
      const buffer = await response.arrayBuffer();

      // Convert the binary buffer to base64
      const base64String = Buffer.from(buffer).toString('base64');
      return base64String;
  } catch (error) {
      console.error('An error occurred:', error.message);
      return null;
  }
}

const pollGeneration = async (url) => {
    var status = '';
    while (status !== 'succeeded' || status !== 'failed') {
      try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Authorization': `Token ${REPLICATE_API_TOKEN}`
            }
          });

          const data = await response.json();
          status = data.status;

          if(status === 'succeeded'){
            const imageUrl = data.output;
            return imageUrl
          }
      } catch (error) {
          console.error('Error fetching data:', error);
      }
      console.log('polling upscale');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
  }
}

export const upScale = async (imageUrl) => {
  const img_response = await fetch(imageUrl);
  const arrayBuffer = await img_response.arrayBuffer();

  // Convert the image data to base64
  const base64Image = Buffer.from(arrayBuffer).toString('base64');

  const datauri = `data:image/png;base64,${base64Image}`;

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  console.log("Running upscale!")
  const output = await replicate.run(
    "batouresearch/high-resolution-controlnet-tile:4af11083a13ebb9bf97a88d7906ef21cf79d1f2e5fa9d87b70739ce6b8113d29",
    {
      input: {
        prompt: "",
        image: datauri
      }
    }
  );
  
  return output;
}
