const REPLICATE_API_TOKEN = "r8_3DUVTLC4hSChEzhGQ5F4gwjX3iLv1zM1SsSme";


import Replicate from "replicate";

const replicate = new Replicate({
  auth: REPLICATE_API_TOKEN,
});

export const depth = async (imageUrl) => {
    
    console.log("Start running depth!")
    const output = await replicate.run(
        "cjwbw/depth-anything:e5b0454205013708df48492a13a8ee4b3c412173362fc56c6b5558eb54e527e5",
        {
          input: {
            image: imageUrl,
            encoder: "vitl"
          }
        }
    );
    
    console.log("Done with depth!")

    console.log(output);


    return output;
}
