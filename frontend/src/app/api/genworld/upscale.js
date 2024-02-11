
import Replicate from "replicate";

const pollGeneration = async (url) => {
  var status = '';
  while (status !== 'succeeded' || status !== 'failed') {
    try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${process.env.REPLICATE_KARTHIK_API_TOKEN}`
          }
        });

        const data = await response.json();

        status = data.status;

        if(status === 'succeeded'){
          const imageUrl = data.output;
          return imageUrl[0]
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    console.log('polling');
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
    auth: process.env.REPLICATE_KARTHIK_API_TOKEN,
  });

  console.log("Running upscale!")

  const output = await replicate.deployments.predictions.create(
    "shoshin23",
    "upscaling",
    {
      input: {
        prompt: "",
        image: datauri
      }
    }
  );
  
  return await pollGeneration(output.urls.get);
}
