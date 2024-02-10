const REPLICATE_API_TOKEN = "r8_3DUVTLC4hSChEzhGQ5F4gwjX3iLv1zM1SsSme";


import Replicate from "replicate";

const replicate = new Replicate({
  auth: REPLICATE_API_TOKEN,
});

export const depth = async (imageUrl) => {
  const img_response = await fetch(imageUrl);
  const arrayBuffer = await img_response.arrayBuffer();

  // Convert the image data to base64
  const base64Image = Buffer.from(arrayBuffer).toString('base64');

  const datauri = `data:image/png;base64,${base64Image}`;
    
    console.log("Start running depth!")
    const output = await replicate.run(
        "cjwbw/depth-anything:e5b0454205013708df48492a13a8ee4b3c412173362fc56c6b5558eb54e527e5",
        {
          input: {
            image: datauri,
            encoder: "vitl"
          }
        }
    );
    
    console.log("Done with depth!")

    console.log(output);


    return output;
}
