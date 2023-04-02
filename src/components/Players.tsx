import { useEffect, useState } from 'react'
import Button from './CustomButtonComponent';
import { useNavigate } from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Modal from 'react-modal';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

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
    let subtitle: HTMLHeadingElement | null;
    const [modalIsOpen, setIsOpen] = useState(false);
    const [players, setPlayers] = useState<Player[] | []>([]);
    const [isSubscribed, setIsSubscribed] = useState(true);

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        if (subtitle) subtitle.style.color = '#f00';
    }

    function closeModal() {
        setIsOpen(false);
    }

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
                    onClick={() => submit('test')}
                    width="200px"
                    radius='0.5rem'
                    cursor="pointer"
                > Add New Player </Button>
            </div>
            {
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
            }
            <div>
                <button onClick={openModal}>Open Modal</button>
                <Modal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
                    <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Hello</h2>
                    <button onClick={closeModal}>close</button>
                    <div>I am a modal</div>
                    <form>
                        <input />
                        <button>tab navigation</button>
                        <button>stays</button>
                        <button>inside</button>
                        <button>the modal</button>
                    </form>
                </Modal>
            </div>
        </>
    )

}

export default Players
