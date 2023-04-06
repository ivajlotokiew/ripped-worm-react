import { useLocation } from 'react-router-dom';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { Player, PlayerType } from './Players';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './PlayerInfo.css'


function PlayerInfo() {
    const location = useLocation();
    const { href } = location.state;
    const [player, setPlayer] = useState({ id: '', playerName: '', playerType: 'DEPOSIT', creditAmount: 0, dateRegistration: '' } as Player);
    const [fieldsDisabled, setFieldsDisabled] = useState<boolean>(true);

    useEffect(() => {
        // call the function
        fetchData()
            // make sure to catch any error
            .catch(console.error);
    }, []);

    // declare the async data fetching function
    const fetchData = async () => {
        // get the data from the api
        const data = await fetch(href);
        // convert the data to json
        const jsonData = await data.json();
        mapToPlayer(jsonData);
    }

    const mapToPlayer = (data: any) => {
        let player: Player = {} as Player;
        player._links = data._links;
        player.playerName = data.playerName;
        player.playerType = data.playerType;
        player.creditAmount = data.creditAmount;
        const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
        player.dateRegistration = new Date(data.registrationTimestamp).toLocaleDateString(undefined, options);
        const playerHref = player._links.self.href;
        const attrs = playerHref.split('players/');
        player.id = attrs[1];
        setPlayer(player);
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPlayer({ ...player as Player, playerName: event.target.value });
    }

    const handleSelectChange = (event: FormEvent<HTMLSelectElement>) => {
        let safeSearchTypeValue: PlayerType = PlayerType[event.currentTarget.value as keyof typeof PlayerType];
        setPlayer({ ...player as Player, playerType: safeSearchTypeValue });
    }

    const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPlayer({ ...player as Player, creditAmount: parseInt(event.target.value) });
    }

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        const requestOptions = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...player })
        }
        const url = 'http://localhost:8080/api/players/' + player?.id;

        fetch(url, requestOptions).then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Something went wrong');
        })
            .then((responseJson) => {
                mapToPlayer(responseJson);
            })
            .catch((error) => {
                console.log(error)
            });
    }

    return (
        <>
            <div className='item-header'>
                <h1>Player details</h1>
            </div>
            <Form onSubmit={handleSubmit} className='form-width'>
                <Row className="mb-3">
                    <Form.Group as={Col} md="10">
                        <Form.Label>ID</Form.Label>
                        <Form.Control type="text" placeholder="Id" value={player?.id} style={{ cursor: "not-allowed" }} disabled required />
                    </Form.Group>

                    <Form.Group as={Col} md="10">
                        <Form.Label>Player name</Form.Label>
                        <Form.Control type="text" className="col-sm-8" placeholder="Name"
                            value={player?.playerName} disabled={fieldsDisabled} style={fieldsDisabled ? { cursor: "not-allowed" } : {}}
                            required onChange={handleInputChange} />
                    </Form.Group>

                    <Form.Group as={Col} md="10">
                        <Form.Label>Player type</Form.Label>
                        <Form.Select aria-label="Player type" value={player?.playerType} style={fieldsDisabled ? { cursor: "not-allowed" } : {}}
                            disabled={fieldsDisabled} onChange={handleSelectChange}>
                            <option>Choose a player type</option>
                            {Object.values(PlayerType).map(value => (
                                <option value={value} key={value}>{value}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group as={Col} md="10">
                        <Form.Label>Credit amount</Form.Label>
                        <Form.Control type="number" placeholder="State" value={player?.creditAmount} style={fieldsDisabled ? { cursor: "not-allowed" } : {}}
                            disabled={fieldsDisabled} onChange={handleAmountChange} />
                    </Form.Group>

                    <Form.Group as={Col} md="10">
                        <Form.Label>Date registration</Form.Label>
                        <Form.Control type="text" placeholder="Date" value={player?.dateRegistration} style={{ cursor: "not-allowed" }} disabled />
                    </Form.Group>
                </Row>

                <Form.Group as={Col} md="10" style={{ display: "flex", alignItems: "center", justifyContent: "right", margin: '0px' }}>
                    <Button type="button" style={{ marginRight: '10px' }} className="btn btn-secondary" onClick={fetchData}>Reset</Button>
                    <Button type="button" style={{ marginRight: '10px' }} className="btn btn-warning" onClick={() => setFieldsDisabled(!fieldsDisabled)}>Edit</Button>
                    <Button type="submit">Submit form</Button>
                </Form.Group>
            </Form>
        </>
    )
}

export default PlayerInfo
