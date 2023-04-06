import { ChangeEvent } from 'react'
import { Player } from './Players';


function PlayerSearch(props: { findPlayer: (player: Player) => void }) {

    const handleInputResponse = (event: ChangeEvent<HTMLInputElement>) => {
        fetchResult(event.target.value);
    }

    const fetchResult = async (plName: string) => {
        //TODO use debounce
        const url = `http://localhost:8080/api/players/search/findByPlayerName?playerName=${plName}`
        await fetch(url)
            .then(async (response) => {
                if (response.ok) {
                    const data = await response.json();
                    const attrs = data?._links?.self.href.split('players/');
                    const player: Player = {
                        ...data, href: data?._links?.self.href, fasko: '',
                        id: attrs[1], url: attrs[0]
                    };
                    props.findPlayer(player);
                }

                throw new Error('Something goes wrong')
            })
            .catch((err) => console.log('Error: ', err));
    }

    return (
        <>
            <label htmlFor="">Search: </label>
            <input type="text" onChange={handleInputResponse} />
        </>
    )
}

export default PlayerSearch
