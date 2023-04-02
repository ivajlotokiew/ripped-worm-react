import { useEffect, useState } from 'react'
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
                    const playerHref = player._links.player.href;
                    const attrs = playerHref.split('players/');
                    return { ...player, id: attrs[1], href: playerHref };
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

    const routeChange = (id: string, href: string) => {
        navigate(`/players/${id}`, { state: { href } });
    }

    const removePlayer = async (href: string) => {
        await fetch(href, { method: 'DELETE' }).then(() => {
            const currentPlayers = players.filter(player => player.href !== href);
            setPlayers(currentPlayers);
        }).catch((err) => console.log(err));
    }

    return (
        <>
            <h1>Players</h1>
            {
                players?.map(({ id, href, playerName, playerType }) => (
                    <div className="player-container" key={id}>
                        <div className="player">
                            <div className='player-details'>
                                <div>Name: {playerName}</div>
                                <div>Type: {playerType}</div>
                            </div>
                            <div className='player-actions'>
                                <Button
                                    color="#f5bc42"
                                    height="30px"
                                    onClick={() => removePlayer(href)}
                                    width="200px"
                                    cursor="pointer"
                                > Delete </Button>
                                <Button
                                    color="#f5bc42"
                                    height="30px"
                                    onClick={() => routeChange(id, href)}
                                    width="200px"
                                    cursor="pointer"
                                > Details </Button>
                            </div>
                        </div>
                    </div>
                ))
            }
        </>
    )

}

export default Players
