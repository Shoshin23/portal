'use client'

import MicIcon from "@/components/MicIcon"
import {useState, useRef} from 'react';

export default function Home() {
  const [transcription, setTranscription] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);

  const startListening = () => {
    setIsListening(true);
    const recognition = new window.webkitSpeechRecognition();
    recognitionRef.current = recognition;
    recognition.onstart = () => {
      console.log('Speech recognition started');
    };
    recognition.onresult = (event) => {
      clearTimeout(timeoutRef.current);
      const transcript = event.results[0][0].transcript;
      setTranscription(transcript);
      timeoutRef.current = setTimeout(() => {
        stopListening();
      }, 2000); // Adjust this value as needed
    };
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
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

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-center w-full py-4">
        <div className="container flex flex-col items-center gap-2 px-4 text-center md:gap-4 md:px-6">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Just say where you want to go, and we will take you
          </h1>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center w-full">
        <div className="grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <button size="lg" variant="outline">
            <MicIcon onClick={isListening ? stopListening : startListening} className="h-6 w-6" />
            Speak
          </button>
        </div>
        <div className="grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <p className="text-xl">{transcription}</p>
        </div>
      </main>
      <footer className="flex items-center justify-center w-full py-4">
        <div className="container flex flex-col items-center gap-2 px-4 text-center md:gap-4 md:px-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">All rights reserved HackWeekend 2014</p>
        </div>
      </footer>
    </div>
  )
}