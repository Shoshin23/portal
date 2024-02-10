const REPLICATE_API_TOKEN = "r8_3DUVTLC4hSChEzhGQ5F4gwjX3iLv1zM1SsSme";


import Replicate from "replicate";

const replicate = new Replicate({
  auth: REPLICATE_API_TOKEN,
});

export const soundscape = async (userPrompt) => {
 
  const output = await replicate.run(
    "haoheliu/audio-ldm:b61392adecdd660326fc9cfc5398182437dbe5e97b5decfb36e1a36de68b5b95",
    {
      input: {
        text: userPrompt,
        duration: "5.0",
        n_candidates: 3,
        guidance_scale: 2.5
      }
    }
  );
  console.log(output);
  return output;
  
}
