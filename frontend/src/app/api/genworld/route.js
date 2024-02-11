import * as admin from 'firebase-admin';
import { upScale } from "./upscale";
import { depth } from "./depth";
import { dalle } from "./dalle";
import { stitch } from "./stitch";
import { soundscape } from "./sound";


const serviceAccount = require("../../../../somnium-1d497-firebase-adminsdk-280ot-655a36a8ce.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://somnium-1d497.appspot.com'

});

const db = admin.firestore();
const storage = admin.storage();
const storageRef = storage.bucket();


export async function POST(request) {
   
    try {
        await saveToFirestore("underwater alien world", "https://remoteteambuilding.nl/env.png"
        , "https://remoteteambuilding.nl/env.png"
        , "https://remoteteambuilding.nl/env.png"
        , "https://remoteteambuilding.nl/env.png"
        );
        // const requestData = await request.json();
        // const imageUrl = await dalle(requestData.prompt);
        // //already show the three.js scene here and improve quality over time?
        // const sound = await soundscape(requestData.prompt);
        // const stitchImage = await stitch(imageUrl);
        // const upscaledImageUrl = await upScale(stitchImage);
        // const depthMap = await depth(upscaledImageUrl);
        
        // await saveToFirestore(requestData.prompt, imageUrl,upscaledImageUrl, depthMap, sound);

         return new Response(JSON.stringify({ message: 'success', imageUrl: upscaledImageUrl, depthMap: depthMap, sound: sound }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error('Error processing request:', error);
        return new Response(JSON.stringify({ message: 'error', error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

async function saveToFirestore(prompt, initialImageUrl, imageUrl, depthMap, sound) {
    
    const timestamp = admin.firestore.Timestamp.now();
    const filePrefix = `${timestamp}`; // Prefix for the file names
    
    const initialImageUpload = storageRef.upload(initialImageUrl, { destination: `${filePrefix}_initial.png` });
    const imageUpload = storageRef.upload(imageUrl, { destination: `${filePrefix}_image.png` });
    const depthMapUpload = storageRef.upload(depthMap, { destination: `${filePrefix}_depth.png` });
    const soundUpload = storageRef.upload(sound, { destination: `${filePrefix}_sound.wav` });

    await Promise.all([initialImageUpload, imageUpload, depthMapUpload, soundUpload]);

    const initialImageURL = `gs://${storageRef.name}/${filePrefix}_initial.png`;
    const imageURL = `gs://${storageRef.name}/${filePrefix}_image.png`;
    const depthMapURL = `gs://${storageRef.name}/${filePrefix}_depth.png`;
    const soundURL = `gs://${storageRef.name}/${filePrefix}_sound.wav`;

    await db.collection('scapes').add({
        prompt: prompt,
        initialImage: initialImageURL,
        image: imageURL,
        depth: depthMapURL,
        sound: soundURL,
        time: timestamp
    });
}