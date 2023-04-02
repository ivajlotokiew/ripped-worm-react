import { useEffect, useState } from 'react'
import Button from './CustomButtonComponent';
import { useNavigate } from "react-router-dom";
import './Accounts.css';

export type AccountLinks = {
    self: { href: string },
    player: { href: string },
    account: { href: string },
    club: { href: string },
}

export type Account = {
    accountId: string,
    accountName: string,
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
                    const accHref = account._links.account.href;
                    const attrs = accHref.split('accounts/');
                    return { ...account, id: attrs[1], href: accHref };
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

    const routeChange = (id: string, href: string) => {
        navigate(`/players/${id}`, { state: { href } });
    }

    const removeAccount = async (href: string) => {
        await fetch(href, { method: 'DELETE' }).then(() => {
            const curAccounts = accounts.filter(acc => acc.href !== href);
            setAccounts(curAccounts);
        }).catch((err) => console.log(err));
    }

    return (
        <>
            <h1>Accounts</h1>
            {accounts?.map(({ accountId, href, accountName }) => (
                <div className="item-container" key={accountId}>
                    <div className="item">
                        <div className="item-details">
                            <div>Name: {accountName}</div>
                        </div>
                        <div className="item-actions">
                            <Button
                                color="#f5bc42"
                                height="30px"
                                onClick={() => routeChange(accountId, href)}
                                width="200px"
                                radius='0.5rem'
                                cursor="pointer"
                            > Details </Button>
                            <Button
                                color="#f5bc42"
                                height="30px"
                                onClick={() => removeAccount(href)}
                                width="200px"
                                cursor="pointer"
                                radius='0.5rem'
                            > Delete </Button>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )

}

export default Accounts
