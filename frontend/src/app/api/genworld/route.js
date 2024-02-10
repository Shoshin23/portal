
import { upScale } from "./upscale";
import { depth } from "./depth";
import { dalle } from "./dalle";
import { stitch } from "./stitch";
import { soundscape } from "./sound";


const REPLICATE_API_TOKEN = "r8_3DUVTLC4hSChEzhGQ5F4gwjX3iLv1zM1SsSme";


export async function POST(request) {
    const requestData = await request.json();
    const sound = soundscape(requestData.prompt);
    const imageUrl = await dalle(requestData.prompt);
    const stitchImage = await stitch(imageUrl);
    
    const upscaledImageUrl = await upScale(stitchImage);
    const depthMap = await depth(upscaledImageUrl);


    return new Response(JSON.stringify({ message: 'success', imageUrl: upscaledImageUrl,depthMap:depthMap,sound:sound }), { status: 200, headers: { 'Content-Type': 'application/json' } });
   
}









