import { useEffect, useState } from 'react'
import { FaWindowClose } from "react-icons/fa";
import Button from './CustomButtonComponent';
import { useNavigate } from "react-router-dom";
import './Players.css';

export type PlayerLinks = {
    self: { href: string },
    player: { href: string },
    accounts: { href: string },
    specialDeals: { href: string },
}

export type Player = {
    id: string,
    url: string,
    playerName: string,
    playerType: string,
    href: string,
    _links: PlayerLinks,
}

function Players() {
    const [players, setPlayers] = useState<Player[] | []>([]);
    const [isSubscribed, setIsSubscribed] = useState(true);

    useEffect(() => {
        // declare the async data fetching function
        const fetchData = async () => {
            // get the data from the api
            const data = await fetch('http://localhost:8080/api/players');
            // convert the data to json
            const json = await data.json();

            // set state with the result if `isSubscribed` is true
            if (isSubscribed) {
                const players = json._embedded.players.map((player: { _links: { player: { href: string; }; }; }) => {
                    const attrs = player._links.player.href.split('players/');
                    return { ...player, id: attrs[1], url: attrs[0] + 'players' };
                });

                setPlayers(players);
            }
        }

        // call the function
        fetchData()
            // make sure to catch any error
            .catch(console.error);
        // cancel any future `setData`
        return () => setIsSubscribed(prev => !prev);
    }, [])

    let navigate = useNavigate();

    const routeChange = (id: string, url: string) => {
        navigate(`/players/${id}`, { state: { id, url } });
    }

    const removeElement = (id: string) => {
        // const newPlayer = players?.filter((_, i) => i !== id);
        // if (newPlayer !== undefined)
        //     setPlayers(newPlayer);
    }

    return <div className="App">
        <header className="App-header">
            {players?.map(({ id, url, playerName, playerType }) => (
                <div className="player-container" key={id}>
                    <div className="player">
                        <div>Category: {playerName}</div>
                        <div>Difficulty: {playerType}</div>
                        <div className="delete-element" onClick={() => removeElement(id)}>
                            <FaWindowClose />
                        </div>
                        <Button
                            color="#f5bc42"
                            height="30px"
                            onClick={() => routeChange(id, url)}
                            width="200px"
                            cursor="pointer"
                        > Choose </Button>
                    </div>
                </div>
            ))}
        </header>
    </div>
}

export default Players
