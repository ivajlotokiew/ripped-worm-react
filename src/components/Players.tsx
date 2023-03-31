import React, { useEffect, useState } from 'react'

function Players() {
    const [players, setPlayers] = useState([]);
    const [isSubscribed, setIsSubscribed] = useState(true);

    useEffect(() => {
        // declare the async data fetching function

        const fetchData = async () => {
            // get the data from the api
            const data = await fetch('http://localhost:8080/api/players');
            // convert the data to json
            const json = await data.json();

            // set state with the result if `isSubscribed` is true
            if (isSubscribed) {
                setPlayers(json._embedded.players);
            }
        }

        // call the function
        fetchData()
            // make sure to catch any error
            .catch(console.error);
        // cancel any future `setData`
        return () => setIsSubscribed(prev => !prev);
    }, [])

    return <div className="App">
        {players?.map(({ playerName, playerType }, index) => (
            <div className="question-container">
                <div className="question">
                    <div>Category: {playerName}</div>
                    <div>Difficulty: {playerType}</div>
                </div>
            </div>
        ))}
    </div>
}

export default Players
