import "./gameList.css";
import trashCanIcon from "../img/trashCan.png";
import { useEffect, useState } from "react";

const GameList = (props) => {
    const [games, setGames] = useState([]);

    const getGames = () => {
        fetch("https://dslusser.com:5000/api/games", { method: "GET" })
            .then((response) => response.json())
            .then((data) => {
                setGames(data);
            });
    };

    useEffect(() => {
        getGames();
    }, [games.length]);

    const onGameClick = (id) => {
        props.setSelectedGameId(id);
    };

    const onCloseClick = async (id) => {
        const requestOptions = {
            method: "DELETE",
        };

        await fetch(
            "https://dslusser.com:5000/api/games/" + id,
            requestOptions
        ).then((response) => response.text());
        getGames();
    };

    const sortedGames = games.sort((a, b) => b.game_id - a.game_id);
    const mappedGames = sortedGames.map((game, key) => (
        <li key={key}>
            <div onClick={() => onGameClick(game.game_id)}>
                <div>{game.game_id}_</div>
                <div>
                    {game.teamA} ( <span className='bold'> {game.scoreA}</span>{" "}
                    ) vs {game.teamB} ({" "}
                    <span className='bold'>{game.scoreB}</span> )
                </div>
            </div>
            <img
                src={trashCanIcon}
                alt='trashcan'
                onClick={() => onCloseClick(game.game_id)}
            />
        </li>
    ));

    const newGame = async () => {
        const body = {
            teamA: "teamA",
            teamB: "teamB",
            scoreA: 0,
            scoreB: 0,
            score_to_win: 21,
            display_scoreA: 0,
            display_scoreB: 0,
        };

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        };

        await fetch("https://dslusser.com:5000/api/games", requestOptions)
            .then((response) => response.json())
            .then((data) => props.setSelectedGameId(data.insertId));
    };

    return (
        <div className='GameList'>
            <h1>All Games</h1>
            <ul>{mappedGames}</ul>
            <button onClick={newGame}>New Game</button>
        </div>
    );
};

export default GameList;
