import { useEffect, useState } from 'react'
import { FaWindowClose } from "react-icons/fa";
import Button from './CustomButtonComponent';
import { useNavigate } from "react-router-dom";
import './Players.css';

export type ClubLinks = {
    self: { href: string },
    account: { href: string },
    club: { href: string },
}

export type Club = {
    id: string,
    clubName: string,
    country: string,
    url: string,
    href: string,
    _links: ClubLinks,
}

function Clubs() {
    const [clubs, setClubs] = useState<Club[] | []>([]);
    const [isSubscribed, setIsSubscribed] = useState(true);

    useEffect(() => {
        // declare the async data fetching function
        const fetchData = async () => {
            // get the data from the api
            const data = await fetch('http://localhost:8080/api/clubs');
            // convert the data to json
            const json = await data.json();

            // set state with the result if `isSubscribed` is true
            if (isSubscribed) {
                const clubs = json._embedded.clubs.map((club: { _links: { club: { href: string; }; }; }) => {
                    const clubHref = club._links.club.href;
                    const attrs = clubHref.split('clubs/');
                    return { ...club, id: attrs[1], href: clubHref };
                });

                setClubs(clubs);
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

    const removeClub = async (href: string) => {
        debugger;
        await fetch(href, { method: 'DELETE' }).then(() => {
            const curClubs = clubs.filter(club => club.href !== href);
            setClubs(curClubs);
        }).catch((err) => console.log(err));
    }

    return <div className="App">
        <header className="App-header">
            <h1>Clubs</h1>
            {clubs?.map(({ id, href, clubName }) => (
                <div className="player-container" key={id}>
                    <div className="player">
                        <div>Category: {clubName}</div>
                        <div className="delete-element" onClick={() => removeClub(href)}>
                            <FaWindowClose />
                        </div>
                        <Button
                            color="#f5bc42"
                            height="30px"
                            onClick={() => routeChange(id, href)}
                            width="200px"
                            cursor="pointer"
                        > Choose </Button>
                    </div>
                </div>
            ))}
        </header>
    </div>
}

export default Clubs
