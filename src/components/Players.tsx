import { useEffect, useState } from 'react'
import Button from './CustomButtonComponent';
import { useNavigate } from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import ItemsModal from './ItemsModal';
import PlayerSearch from './PlayerSearch';
import LoadingSpinner from './LoadingSpinner';

export enum PlayerType {
    DEPOSIT = 'DEPOSIT',
    CREDIT = 'CREDIT',
    STAKE = 'STAKE',
}

export type PlayerLinks = {
    self: { href: string },
    player: { href: string },
    accounts: { href: string },
    specialDeals: { href: string },
}

export type Player = {
    id: string,
    playerName: string,
    playerType: PlayerType,
    creditAmount: number,
    dateRegistration: string | number,
    href: string,
    _links: PlayerLinks,
}

function Players() {
    const [players, setPlayers] = useState<Player[] | []>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        // call the function
        fetchData();
    }, [])

    // declare the async data fetching function
    const fetchData = async () => {
        setIsLoading(true);
        try {
            setIsLoading(false);
            const data = await fetch('http://localhost:8080/api/players');
            const json = await data.json();

            const players = json._embedded.players.map((player: { _links: { player: { href: string; }; }; }) => {
                const playerHref = player._links.player.href;
                const attrs = playerHref.split('players/');
                return { ...player, id: attrs[1], href: playerHref };
            });

            setPlayers(players);
        } catch (err: any) {
            console.log("This is the error: ", err);
            setIsLoading(false);
        };
    }

    const navigate = useNavigate();
    const routeChange = (id: string, href: string) => {
        navigate(`/players/${id}`, { state: { href } });
    }

    const removePlayer = async (href: string) => {
        await fetch(href, { method: 'DELETE' }).then(() => {
            const currentPlayers = players.filter(player => player.href !== href);
            setPlayers(currentPlayers);
        }).catch((err) => console.log(err));
    }

    const openModal = () => {
        setIsOpen(prev => !prev);
    }

    const findPlayer = (player: Player) => {
        isEmpty(player) ? fetchData() : setPlayers([{ ...player }]);
    }

    const isEmpty = (obj: {}) => {
        return Object.keys(obj).length === 0;
    }

    const setLoading = (loading: boolean) => {
        setIsLoading(loading);
    }

    const submit = (href: string) => {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure that you want to delete this player?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => removePlayer(href)
                },
                {
                    label: 'No',
                }
            ],
            //TODO I added a custom class so I can play with the styles of the pop-up window
            overlayClassName: "delete-player-alert"
        });
    }

    return (
        <>
            <div className='item-header'>
                <h1>Players list</h1>
                <Button
                    color="#f5bc42"
                    height="30px"
                    onClick={() => openModal()}
                    width="200px"
                    radius='0.5rem'
                    cursor="pointer"
                > Add New Player </Button>
                <PlayerSearch findPlayer={findPlayer} setIsLoading={setLoading} />
            </div>
            {
                isLoading ? <LoadingSpinner /> : (
                    players?.map(({ id, href, playerName, playerType }) => (
                        <div className="item-container" key={id}>
                            <div className="item">
                                <div className='item-details'>
                                    <div>Name: {playerName}</div>
                                    <div>Type: {playerType}</div>
                                </div>
                                <div className='item-actions'>
                                    <Button
                                        color="#f5bc42"
                                        height="30px"
                                        onClick={() => routeChange(id, href)}
                                        width="200px"
                                        radius='0.5rem'
                                        cursor="pointer"
                                    > Details </Button>
                                    <Button
                                        color="#f5bc42"
                                        height="30px"
                                        onClick={() => submit(href)}
                                        width="200px"
                                        radius='0.5rem'
                                        cursor="pointer"
                                    > Delete </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}

            {isOpen && <ItemsModal isOpen={isOpen} openModal={openModal} fetchData={fetchData} />}
        </>
    )
}

export default Players
