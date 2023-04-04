import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react'
import { Player } from './Players';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import './PlayerInfo.css'

function PlayerInfo() {
    const location = useLocation();
    const { href } = location.state;
    const [player, setPlayer] = useState<Player | null>(null);

    useEffect(() => {
        // declare the async data fetching function
        const fetchData = async () => {
            // get the data from the api
            const data = await fetch(href);
            // convert the data to json
            const json = await data.json();
            let player: Player = {} as Player;
            player._links = json._links;
            player.playerName = json.playerName;
            player.playerType = json.playerType;
            player.creditAmount = json.creditAmount;
            const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
            player.dateRegistration = new Date(json.registrationTimestamp).toLocaleDateString(undefined, options);
            const playerHref = player._links.self.href;
            const attrs = playerHref.split('players/');
            player.id = attrs[1];
            setPlayer(player);
        }

        // call the function
        fetchData()
            // make sure to catch any error
            .catch(console.error);
    }, []);

    const handleSubmit = () => {
        //Do smt
    }

    return (
        <>
            <div className='item-header'>
                <h1>Player details</h1>
            </div>
            <Form onSubmit={handleSubmit} className='form-width'>
                <Row className="mb-3">
                    <Form.Group>
                        <Form.Label>ID</Form.Label>
                        <Form.Control type="text" placeholder="Id" value={player?.id} disabled />
                    </Form.Group>
                    <Form.Group >
                        <Form.Label>Player name</Form.Label>
                        <Form.Control type="text" placeholder="Name" value={player?.playerName} required />
                    </Form.Group>
                    <Form.Group >
                        <Form.Label>Player type</Form.Label>
                        <Form.Control type="text" placeholder="Type" value={player?.playerType} />
                    </Form.Group>
                    <Form.Group >
                        <Form.Label>Credit amount</Form.Label>
                        <Form.Control type="text" placeholder="State" value={player?.creditAmount} />
                    </Form.Group>
                    <Form.Group >
                        <Form.Label>Date registration</Form.Label>
                        <Form.Control type="text" placeholder="Date" value={player?.dateRegistration} disabled />
                    </Form.Group>
                </Row>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "right", margin: '0px' }}>
                    <Button type="submit">Submit form</Button>
                </div>
            </Form>
        </>
    )
}

export default PlayerInfo
