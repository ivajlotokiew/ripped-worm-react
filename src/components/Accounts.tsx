import { useEffect, useState } from 'react'
import { FaWindowClose } from "react-icons/fa";
import Button from './CustomButtonComponent';
import { useNavigate } from "react-router-dom";
import './Players.css';

export type AccountLinks = {
    self: { href: string },
    player: { href: string },
    account: { href: string },
    club: { href: string },
}

export type Account = {
    accountId: string,
    accountName: string,
    url: string,
    href: string,
    _links: AccountLinks,
}

function Accounts() {
    const [accounts, setAccounts] = useState<Account[] | []>([]);
    const [isSubscribed, setIsSubscribed] = useState(true);

    useEffect(() => {
        // declare the async data fetching function
        const fetchData = async () => {
            // get the data from the api
            const data = await fetch('http://localhost:8080/api/accounts');
            // convert the data to json
            const json = await data.json();

            // set state with the result if `isSubscribed` is true
            if (isSubscribed) {
                const accounts = json._embedded.accounts.map((account: { _links: { account: { href: string; }; }; }) => {
                    const attrs = account._links.account.href.split('accounts/');
                    return { ...account, id: attrs[1], url: attrs[0] + 'accounts' };
                });

                setAccounts(accounts);
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
            <h1>Accounts</h1>
            {accounts?.map(({ accountId, url, accountName }) => (
                <div className="player-container" key={accountId}>
                    <div className="player">
                        <div>Category: {accountName}</div>
                        <div className="delete-element" onClick={() => removeElement(accountId)}>
                            <FaWindowClose />
                        </div>
                        <Button
                            color="#f5bc42"
                            height="30px"
                            onClick={() => routeChange(accountId, url)}
                            width="200px"
                            cursor="pointer"
                        > Choose </Button>
                    </div>
                </div>
            ))}
        </header>
    </div>
}

export default Accounts
