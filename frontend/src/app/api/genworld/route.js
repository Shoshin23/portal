import * as admin from 'firebase-admin';
import { upScale } from "./upscale";
import { depth } from "./depth";
import { dalle } from "./dalle";
import { stitch } from "./stitch";
import { soundscape } from "./sound";


const serviceAccount = require("../../../../somnium-1d497-firebase-adminsdk-280ot-655a36a8ce.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

export async function POST(request) {
   
    try {
        const requestData = await request.json();
        const imageUrl = await dalle(requestData.prompt);
        //already show the three.js scene here and improve quality over time?
        const sound = await soundscape(requestData.prompt);
        const stitchImage = await stitch(imageUrl);
        const upscaledImageUrl = await upScale(stitchImage);
        const depthMap = await depth(upscaledImageUrl);
        
        await saveToFirestore(requestData.prompt, imageUrl,upscaledImageUrl, depthMap, sound);

        return new Response(JSON.stringify({ message: 'success', imageUrl: upscaledImageUrl, depthMap: depthMap, sound: sound }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error('Error processing request:', error);
        return new Response(JSON.stringify({ message: 'error', error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

async function saveToFirestore(prompt, initialImageUrl,imageUrl, depthMap, sound) {
    const timestamp = admin.firestore.Timestamp.now();
    await db.collection('scapes').add({
        prompt: prompt,
        initialImage: initialImageUrl,
        image: imageUrl,
        depth: depthMap,
        sound: sound,
        time: timestamp
    });
}