'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import WebXR from '@/components/webXR';
import { getFirestore, doc, getDoc } from "firebase/firestore";

export default function Scapes() {
    const [image, setImage] = useState();
    const [depth, setDepth] = useState();
    const [sound, setSound] = useState();
    const searchParams = useSearchParams()
 
    const scapeId = searchParams.get('scapeId')


    console.log(scapeId);

    useEffect(() => {
        const fetchData = async () => {
            const firestore = getFirestore();
            const docRef = doc(firestore, 'scapes', scapeId);
            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
                const data = docSnap.data();
                setImage(data.image);
                setDepth(data.depth);
                setSound(data.sound);
            } else {
                console.log("No such document!");
            }
        };
    
        fetchData();
    }, [scapeId]);

    return(
        <WebXR image={image} depthmap={depth} sound={sound} />
    )
}