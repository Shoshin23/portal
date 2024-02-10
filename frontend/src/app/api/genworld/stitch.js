const REPLICATE_API_TOKEN = "r8_3DUVTLC4hSChEzhGQ5F4gwjX3iLv1zM1SsSme";


import Replicate from "replicate";
import { createCanvas, loadImage } from 'canvas';

const replicate = new Replicate({
  auth: REPLICATE_API_TOKEN,
});

export const stitch = async (imageUrl) => {
  try {
    const modifiedImageBuffer = await flipLeftRight(imageUrl);
    const base64String = modifiedImageBuffer.toString('base64'); 
    const mimeType = 'image/png';
    const dataURI = `data:${mimeType};base64,${base64String}`;
    const output = await replicate.run(
      "lucataco/sdxl-inpainting:f03c01943bacdee38d6a5d216586bf9bfbfd799350aed263aa32980efc173f0b",
      {
        input: {
          mask: "https://remoteteambuilding.nl/stitch.png",
          seed: 26462,
          image: dataURI,
          steps: 20,
          prompt: "modern bed with beige sheet and pillows",
          strength: 0.7,
          scheduler: "K_EULER",
          guidance_scale: 8,
          negative_prompt: "monochrome, lowres, bad anatomy, worst quality, low quality"
        }
      }
    );

    console.log(output);
    return output;
  } catch (error) {
    console.error('An error occurred in stitch function:', error);
    throw error;
  }
}
async function flipLeftRight(imageUrl) {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch the image');
    }
    const imageBuffer = await response.arrayBuffer();
    const image = await loadImage(Buffer.from(imageBuffer));
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, image.width / 2, image.height, image.width / 2, 0, image.width / 2, image.height);
    ctx.drawImage(image, image.width / 2, 0, image.width / 2, image.height, 0, 0, image.width / 2, image.height);
    const flippedImageBuffer = canvas.toBuffer('image/png');
    return flippedImageBuffer;
  } catch (error) {
    console.error('An error occurred:', error);
    throw error;
  }
}

async function uploadToFileIO(imageBuffer) {
  try {
    // Prepare the request to upload image to File.io
    const formData = new FormData();
    formData.append('file', new Blob([imageBuffer], { type: 'image/png' }), 'image.png');

    const response = await fetch('https://file.io/?expires=1w', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload image to File.io');
    }

    const data = await response.json();
    return data.link;
  } catch (error) {
    console.error('An error occurred while uploading to File.io:', error);
    throw error;
  }
}

// Example usage
