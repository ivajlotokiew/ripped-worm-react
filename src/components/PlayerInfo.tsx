import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react'
import { Player } from './Players';

function PlayerInfo() {
    const location = useLocation();
    const { href } = location.state;
    const [player, setPlayer] = useState<Player | null>(null);


    useEffect(() => {
        debugger;
        // declare the async data fetching function
        const fetchData = async () => {
            // get the data from the api
            const data = await fetch(href);
            // convert the data to json
            const json = await data.json();
            setPlayer(json);
        }

        // call the function
        fetchData()
            // make sure to catch any error
            .catch(console.error);
    }, []);

    return (
        <div>This is the player {player?.playerName}</div>

    )
}

export default PlayerInfo
