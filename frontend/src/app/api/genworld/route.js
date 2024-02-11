import * as admin from 'firebase-admin';
import { upScale } from "./upscale";
import { depth } from "./depth";
import { dalle } from "./dalle";
import { stitch } from "./stitch";
import { soundscape } from "./sound";
import fs from 'fs';
import stream from 'stream';
import util from 'util';


const serviceAccount = require("../../../../somnium-1d497-firebase-adminsdk-280ot-655a36a8ce.json");

if (!admin.apps.length) {
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://somnium-1d497.appspot.com'

});
}

const db = admin.firestore();
const storage = admin.storage();
const storageRef = storage.bucket();

async function downloadAndUploadFile(url, destination) {
    const pipeline = util.promisify(stream.pipeline);
    const response = await fetch(url);
    const tempFilePath = `/tmp/${Math.random().toString(36).substring(7)}`;
    const fileStream = fs.createWriteStream(tempFilePath);
    await pipeline(response.body, fileStream);
    await storageRef.upload(tempFilePath, { destination });
    console.log(`Upload of ${destination} successful.`);
    fs.unlinkSync(tempFilePath); // delete the temp file
    return `gs://${storageRef.name}/${destination}`;
}


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

    const pipeline = util.promisify(stream.pipeline);
    const timestamp = admin.firestore.Timestamp.now().toDate().toISOString();
    const filePrefix = `env_${timestamp}`; // Prefix for the file names

    // Download the image and save it to a local file
    const response = await fetch(initialImageUrl);
    const fileStream = fs.createWriteStream('env.png');
    await pipeline(response.body, fileStream);

    // Upload the local file to Firebase Storage
    const initialImageURL = await downloadAndUploadFile(initialImageUrl, `${filePrefix}_initial.png`);
    const imageURL = await downloadAndUploadFile(imageUrl, `${filePrefix}_image.png`);
    const depthMapURL = await downloadAndUploadFile(depthMap, `${filePrefix}_depth.png`);
    const soundURL = await downloadAndUploadFile(sound, `${filePrefix}_sound.wav`);

    await db.collection('scapes').add({
        prompt: prompt,
        initialImage: initialImageURL,
        image: imageURL,
        depth: depthMapURL,
        sound: soundURL,
        time: timestamp
    });
}