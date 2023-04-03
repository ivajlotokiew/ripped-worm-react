import { ChangeEvent, useState, FormEvent } from 'react'
import Modal from 'react-modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import { PlayerType } from './Players';

const customStyles = {
    content: {
        top: '30%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '40%',
        background: '#282c34',
        color: 'white',
        border: '5px solid rgb(245, 188, 66)',
        borderRadius: '1rem',
    },
};

export default function ItemsModal(props: { isOpen: boolean, openModal: () => void, fetchData: () => Promise<void> }) {
    let subtitle: HTMLHeadingElement | null;
    const [modalIsOpen, setIsOpen] = useState(props.isOpen);
    const [name, setName] = useState<string>('');
    const [type, setType] = useState<PlayerType | undefined>();

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        if (subtitle) subtitle.style.color = '#ffffff';
    }

    function closeModal() {
        setIsOpen(false);
        props.openModal();
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleSelectChange = (event: FormEvent<HTMLSelectElement>) => {
        let safeSearchTypeValue: PlayerType = PlayerType[event.currentTarget.value as keyof typeof PlayerType];
        setType(safeSearchTypeValue);
    };

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ playerName: name, playerType: type })
        };
        const url = 'http://localhost:8080/api/players';
        await fetch(url, requestOptions).then(() => {
            props.fetchData();
            closeModal();
        }).catch((err) => console.log(err));
    }

    return (
        <div>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Add new player</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Player name:</Form.Label>
                        <Form.Control type="text" placeholder="Enter your name" value={name} onChange={handleInputChange} />
                    </Form.Group>
                    <Form.Label>Player type:</Form.Label>
                    <Form.Select aria-label="Player type" value={type} onChange={handleSelectChange} >
                        {Object.values(PlayerType).map(value => (
                            <option value={value} key={value}>{value}</option>
                        ))}
                    </Form.Select>
                    <Stack className="mt-3 justify-content-end" direction='horizontal' gap={3}>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                        <Button variant="secondary" onClick={closeModal}>
                            Close
                        </Button>
                    </Stack>
                </Form>
            </Modal>
        </div >
    )
}
