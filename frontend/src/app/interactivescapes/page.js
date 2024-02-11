'use client'

import { useEffect, useState } from 'react';
import InteractiveWebXR from '@/components/interactiveWebXR';
import { getFirestore, doc, getDocs, collection } from "firebase/firestore";
import { app } from "../../firebase";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

export default function InteractiveScapes() {
    const [planets, setPlanets] = useState();
    

    
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

            const planets = []

            worldsData.map((world, index) => {
                const planet = {
                    id: `${index}_planet`, 
                    image: world.image, 
                    depth: world.depth,
                    sound: world.sound
                }
                planets.push(planet);
            });

            setPlanets(planets);
        
          };

          fetchData();
    }, []);

    return(
        <div>
            { planets &&
            <InteractiveWebXR planets={planets} />
            }
        </div>
    )
}