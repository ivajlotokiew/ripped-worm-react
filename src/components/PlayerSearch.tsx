import { ChangeEvent, useEffect, useState } from 'react'
import { Player } from './Players';
import useDebounce from "../hooks/useDebounce";

function PlayerSearch({ findPlayer, setIsLoading }: { findPlayer: (player: Player) => void, setIsLoading: (loading: boolean) => void }) {
    const [search, setSearch] = useState<string | null>(null);
    const debouncedSearch = useDebounce(search, 1000);

    const handleInputResponse = (event: ChangeEvent<HTMLInputElement>) => {
        setIsLoading(true);
        setSearch(event.target.value);
    }

    useEffect(() => {
        fetchData();
    }, [debouncedSearch]);

    const fetchData = async () => {
        const url = `http://localhost:8080/api/players/search/findByPlayerName?playerName=${debouncedSearch}`
        await fetch(url)
            .then(async (response) => {
                setIsLoading(false);
                if (response.ok) {
                    const data = await response.json();
                    const attrs = data?._links?.self.href.split('players/');
                    const player: Player = {
                        ...data, href: data?._links?.self.href, fasko: '',
                        id: attrs[1], url: attrs[0]
                    };

                    findPlayer(player);
                } else {
                    findPlayer({} as Player);
                    throw new Error('Player Search, smt goes wrong: ');
                }
            })
            .catch(err => {
                setIsLoading(false);
                console.log('Error: ', err);
            });
    }

    return (
        <>
            <div>
                <label htmlFor="" style={{ marginRight: '5px' }}>Search: </label>
                <input type="search" placeholder="Search..." onChange={handleInputResponse} />
            </div>
        </>
    )
}

export default PlayerSearch
