'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import WebXR from '@/components/webXR';
import InteractiveWebXR from '@/components/interactiveWebXR';

export default function InteractiveScapes() {
    const [planets, setPlanets] = useState([
        {id:1, image:'https://remoteteambuilding.nl/env.jpg', depth:'https://remoteteambuilding.nl/env.jpg'},
        {id:2, image:'https://remoteteambuilding.nl/env3.jpg', depth:'https://remoteteambuilding.nl/env3.jpg'},
        {id:3, image:'https://remoteteambuilding.nl/depth.jpg', depth:'https://remoteteambuilding.nl/depth.jpg'}
    ]);

    useEffect(() => {
        // TODO: Get all of the scapes from firebase
        const planetsPlaceholder = [
            {id:1, image:'https://remoteteambuilding.nl/env.jpg', depth:'https://remoteteambuilding.nl/env.jpg'},
            {id:2, image:'https://remoteteambuilding.nl/env3.jpg', depth:'https://remoteteambuilding.nl/env3.jpg'},
            {id:3, image:'https://remoteteambuilding.nl/depth.jpg', depth:'https://remoteteambuilding.nl/depth.jpg'}
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