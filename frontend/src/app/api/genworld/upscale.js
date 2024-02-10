const REPLICATE_API_TOKEN = "r8_3DUVTLC4hSChEzhGQ5F4gwjX3iLv1zM1SsSme";

async function imageUrlToBase64(imageUrl) {
  try {
      // Fetch the image as a binary buffer
      const response = await axios.get(imageUrl, {
          responseType: 'arraybuffer'
      });

      // Convert the binary buffer to base64
      const base64String = Buffer.from(response.data, 'binary').toString('base64');
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
  const base64Data = imageUrlToBase64(imageUrl);
  const dataUrl = `data:image/jpeg;base64,${base64Data}`;

    const postData = {
        version: "4af11083a13ebb9bf97a88d7906ef21cf79d1f2e5fa9d87b70739ce6b8113d29",
        input: {
          hdr: 0.7,
          image: dataUrl,
          steps: 20,
          prompt: "",
          scheduler: "DDIM",
          creativity: 0.75,
          guess_mode: false,
          resolution: 2048,
          resemblance: 1,
          guidance_scale: 5,
          negative_prompt: "Teeth, tooth, open mouth, longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, mutant"
        }
    };

    console.log("Running upscale!");

    const response = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
            "Authorization": `Token ${REPLICATE_API_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postData)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();

    const upscaledImageUrl = await pollGeneration(responseData.urls.get);

    return upscaledImageUrl;
}
