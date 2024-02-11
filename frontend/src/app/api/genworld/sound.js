

import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export const soundscape = async (userPrompt) => {
  console.log("soundscape started")
 
  const output = await replicate.run(
    "haoheliu/audio-ldm:b61392adecdd660326fc9cfc5398182437dbe5e97b5decfb36e1a36de68b5b95",
    {
      input: {
        text: `${userPrompt}, looping ambient`,
        duration: "15.0",
        n_candidates: 1,
        guidance_scale: 2.5
      }
    }
  );
  console.log(output);
  return output;
  
}
