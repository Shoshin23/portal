'use client'

import { useEffect, useState } from 'react';
import InteractiveWebXR from '@/components/interactiveWebXR';
import { getFirestore, doc, getDocs, collection } from "firebase/firestore";
import { app } from "../../firebase";

export default function InteractiveScapes() {
    const [planets, setPlanets] = useState([
        {id:1, image:'./env.jpg', depth:'./env.jpg'},
        {id:2, image:'./env.png', depth:'./env.png'},
        {id:3, image:'./depth2.jpg', depth:'./depth2.jpg'}
    ]);
    

    // useEffect(() => {
    //     // TODO: Get all of the scapes from firebase
    //     const planetsPlaceholder = [
    //         {id:1, image:'./env.jpg', depth:'./env.jpg'},
    //         {id:2, image:'./env.png', depth:'./env.png'},
    //         {id:3, image:'./depth2.jpg', depth:'./depth2.jpg'}
    //     ];

    //     setPlanets(planetsPlaceholder);
    // }, []);

    useEffect(() => {
        const fetchData = async () => {
            const firestore = getFirestore();      
            const worldsCollection = collection(firestore, 'scapes');
            const worldsSnapshot = await getDocs(worldsCollection);
      
            const worldsData = worldsSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
      
            console.log(worldsData);
          };
      
        fetchData();
    }, []);

    return(
        <div>
            {/* { planets &&
            <InteractiveWebXR planets={planets} />
            } */}
        </div>
    )
}