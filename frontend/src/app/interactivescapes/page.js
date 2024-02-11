'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import WebXR from '@/components/webXR';
import InteractiveWebXR from '@/components/interactiveWebXR';

export default function InteractiveScapes() {
    const [planets, setPlanets] = useState([
        {id:1, image:'./env.jpg', depth:'./env.jpg'},
        {id:2, image:'./env.png', depth:'./env.png'},
        {id:3, image:'./depth2.jpg', depth:'./depth2.jpg'}
    ]);

    useEffect(() => {
        // TODO: Get all of the scapes from firebase
        const planetsPlaceholder = [
            {id:1, image:'./env.jpg', depth:'./env.jpg'},
            {id:2, image:'./env.png', depth:'./env.png'},
            {id:3, image:'./depth2.jpg', depth:'./depth2.jpg'}
        ];

        setPlanets(planetsPlaceholder);
    }, []);

    return(
        <div>
            { planets &&
            <InteractiveWebXR planets={planets} />
            }
        </div>
    )
}