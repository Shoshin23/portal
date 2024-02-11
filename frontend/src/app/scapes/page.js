'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import WebXR from '@/components/webXR';
import { app } from '../../firebase';
import { getFirestore, doc, getDocs, collection } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

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
            const storage = getStorage(app); // Initialize Firebase Storage
          
            const worldsCollection = collection(firestore, 'scapes');
            const worldsSnapshot = await getDocs(worldsCollection);
          
            let worldsData = worldsSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
          
            // Replace Google Storage links with download URLs
            worldsData = await Promise.all(worldsData.map(async world => {
              const imageRef = ref(storage, world.image); // Replace 'image' with the field name that contains the Google Storage link
              const imageUrl = await getDownloadURL(imageRef);
              const depthRef = ref(storage, world.depth); // Replace 'image' with the field name that contains the Google Storage link
              const depthUrl = await getDownloadURL(depthRef);
              const soundRef = ref(storage, world.sound); // Replace 'image' with the field name that contains the Google Storage link
              const soundUrl = await getDownloadURL(soundRef);
          
              return {
                ...world,
                image: imageUrl,
                depth: depthUrl,
                sound: soundUrl
              };
            }));
          
            const world = worldsData.find(item => item.id === scapeId);
            setImage(world.image);
            setDepth(world.depth);
            setSound(world.sound);
          };

          fetchData();
    }, [scapeId]);

    return(
        <WebXR image={image} depthmap={depth} sound={sound} />
    )
}