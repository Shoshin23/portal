
import Replicate from "replicate";


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
