'use client'

import MicIcon from "@/components/micicon"
import {useState, useRef} from 'react';
import { useRouter } from 'next/navigation'
import Worlds from "@/components/worlds";
import Link from 'next/link'
import GlobeIcon from "@/components/globeicon";
// import annyang from 'annyang';

export default function Home() {
  const [transcription, setTranscription] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);
  const router = useRouter()
  
  const fetchData = async (prompt, view) => {
    try {
      const response = await fetch('/api/genworld', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt }),
      });
      const jsonData = await response.json();

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const startListening = () => {
    setIsListening(true);
    const listenSound = new Audio('/listen.mp3')
    listenSound.play();
    const recognition = new window.webkitSpeechRecognition();
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      console.log('Speech recognition started');
    };

    recognition.onresult = (event) => {
      const successSound = new Audio('/success.mp3');
      successSound.play();
      clearTimeout(timeoutRef.current);
      const transcript = event.results[0][0].transcript;
      setTranscription(transcript);
      timeoutRef.current = setTimeout(() => {
        stopListening();
      }, 2000); // Adjust this value as needed
      fetchData(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      const errorSound = new Audio('/fail.mp3');
      errorSound.play();
      stopListening();
    };

    recognition.onend = () => {
      setIsListening(false);
      console.log('Speech recognition ended');
    };

    recognition.start();
  };

  const stopListening = () => {
    setIsListening(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    clearTimeout(timeoutRef.current);
  };

      return(
        <div className="flex flex-col h-screen">
        <header className="flex items-center justify-center w-full py-4">
          <div className="container flex flex-col items-center gap-2 px-4 text-center md:gap-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Somnium</h2>
            <h1 className="text-2xl tracking-tighter sm:text-4xl">
              Just say where you want to go, and we will take you
            </h1>
          </div>
        </header>
        <main className="flex flex-col justify-center w-full">
          <div className="items-center w-full my-8">
            <div className="grid items-center justify-center gap-4 px-4 text-center md:px-6">
              <button onClick={isListening ? stopListening : startListening} size="xl" className={`items-center justify-center border rounded-xl p-4 transition ease-in-out delay-50 hover:bg-slate-500 ${isListening ? 'bg-red-600' : ''}`} variant="outline">
                <MicIcon className="h-12 w-12" />
              </button>
            </div>
            <div className="grid items-center justify-center gap-4 px-4 text-center md:px-6">
              <p className="text-xl">{transcription}</p>
            </div>
          </div>

          <div className="items-center w-full my-8">
            <div className="grid items-center justify-center gap-4 px-4 text-center md:px-6">
              <Link className="items-center justify-center border rounded-xl p-4 transition ease-in-out delay-50 hover:bg-slate-500" href="interactivescapes">
                <GlobeIcon className="h-12 w-12" />
              </Link>
            </div>
            <div className="grid items-center justify-center gap-4 px-4 text-center md:px-6">
              <p className="text-xl">{transcription}</p>
            </div>
          </div>



          <div className="items-center  w-full">
            <Worlds/>
          </div>
        </main>
        <footer className="flex items-center justify-center w-full py-4">
          <div className="container flex flex-col items-center gap-2 px-4 text-center md:gap-4 md:px-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">All rights reserved HackWeekend 2014</p>
          </div>
        </footer>
      </div>
      );
}




