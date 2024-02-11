

import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const pollGeneration = async (url) => {
    var status = '';
    while (status !== 'succeeded' || status !== 'failed') {
      try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`
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
      console.log('polling');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
  }
}

export const genrep = async (prompt) => {
  const postData = {
      version: "fd1f53277a424000168dfceeef58934c43bb3c27a3843a75e7b6d72c46cfc8fa",
      input: {
          width: 768,
          height: 768,
          prompt: `hdri environment, ${prompt}, in the style of TOK`,
          refine: "expert_ensemble_refiner",
          scheduler: "K_EULER",
          lora_scale: 0.6,
          num_outputs: 1,
          guidance_scale: 7.5,
          apply_watermark: false,
          high_noise_frac: 0.8,
          negative_prompt: "",
          prompt_strength: 0.8,
          num_inference_steps: 25
      }
  };

  const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
          "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json"
      },
      body: JSON.stringify(postData)
  });

  if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
  }

  const responseData = await response.json();

  const imageUrl = await pollGeneration(responseData.urls.get);

  return imageUrl;
}



