'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import WebXR from '@/components/webXR';

export default function Scapes() {
    const [image, setImage] = useState();
    const [depth, setDepth] = useState();
    const [sound, setSound] = useState();
    const searchParams = useSearchParams()
 
    const scapeId = searchParams.get('scapeId')


    console.log(scapeId);

    useEffect(() => {
        // TODO: Get all of the things from scapeId

        // TODO: Remove this
        setImage("./championsimg.png");
        setDepth("./championsdepth.png");
        setSound("./champions.wav");
    }, []);

    return(
        <WebXR image={image} depthmap={depth} sound={sound} />
    )
}