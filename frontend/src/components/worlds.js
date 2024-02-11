'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { app } from '../firebase'; // Import your Firestore configuration
import { getFirestore, doc, getDocs, collection } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

export default function Worlds() {
  const [worlds, setWorlds] = useState([]);
  

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
    
        return {
          ...world,
          image: imageUrl
        };
      }));
    
      setWorlds(worldsData);
      console.log(worldsData);
    };

    fetchData();
  }, [])

  return (
    <section className="w-full py-12 lg:py-24">
      <div className=" px-4 grid items-center justify-center gap-4 text-center md:px-6 lg:gap-10">
        <div className="space-y-3">
          <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Explore already created worlds.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {worlds.map(world => (
            <div key={world.id} className="flex flex-col items-stretch gap-2">
              <Link
                className="aspect-[16/9] overflow-hidden rounded-lg object-cover object-center border border-gray-200 border-gray-200 shadow-sm hover:shadow transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950"
                href={`/scapes?scapeId=${world.id}`}
              >
                <img
                  alt="Thumbnail"
                  height="180"
                  src={world.image}
                  style={{
                    aspectRatio: "320/180",
                    objectFit: "cover",
                  }}
                  width="320"
                />
                <div className="absolute inset-0 flex items-center justify-center gap-2">
                  <div className="w-10 h-10 text-gray-500 hover:text-gray-900 transition-colors dark:text-gray-400 dark:hover:text-gray-300" />
                </div>
              </Link>
              <h3 className="text-lg font-bold">{world.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

