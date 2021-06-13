import React from "react";
import { useState, useEffect } from "react";
import "./scoreBoard.css";
import EditBoard from "./EditBoard";

const Scoreboard = (props) => {
    const [gameState, setGameState] = useState({});
    const [roundScoreA, setRoundScoreA] = useState(0);
    const [roundScoreB, setRoundScoreB] = useState(0);
    const [editMode, setEditMode] = useState(false);

    const getGameState = async () => {
        const response = await fetch("https://dslusser.com:5000/api/games/", {
            method: "GET",
        }).then((response) => response.json());
        // console.log(response);
        const currentGame = [...response].filter(
            (game) => game.game_id === props.selectedGameId
        )[0];
        setGameState(currentGame);
    };

    useEffect(() => {
        getGameState();
    }, [editMode, props.selectedGameId]);

    const { game_id, teamA, teamB, scoreA, scoreB, score_to_win } = gameState;

    const updateGameState = async () => {
        const newBody = {
            teamA: teamA,
            teamB: teamB,
            scoreA: scoreA + roundScoreA,
            scoreB: scoreB + roundScoreB,
            score_to_win: score_to_win,
            display_scoreA: 0,
            display_scoreB: 0,
        };

        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newBody),
        };

        await fetch(
            "https://dslusser.com:5000/api/games/" + game_id,
            requestOptions
        ).then((response) => response.json());

        setRoundScoreA(0);
        setRoundScoreB(0);
        setGameState(newBody);
        getGameState();
    };

    const updateDislay = async (
        updateScoreA = roundScoreA,
        updateScoreB = roundScoreB
    ) => {
        const newBody = {
            teamA: teamA,
            teamB: teamB,
            scoreA: scoreA,
            scoreB: scoreB,
            score_to_win: score_to_win,
            display_scoreA: updateScoreA,
            display_scoreB: updateScoreB,
        };

        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newBody),
        };

        await fetch(
            "https://dslusser.com:5000/api/games/" + game_id,
            requestOptions
        ).then((response) => response.json().then(getGameState()));
    };

    const increaseScore = (team) => {
        let newRoundScoreA;
        let newRoundScoreB;

        if (team === "teamA") {
            if (roundScoreB > 0) {
                newRoundScoreB = roundScoreB - 1;
                setRoundScoreB(newRoundScoreB);
            } else {
                newRoundScoreA = roundScoreA + 1;
                setRoundScoreA(newRoundScoreA);
            }
        } else {
            if (roundScoreA > 0) {
                newRoundScoreA = roundScoreA - 1;
                setRoundScoreA(newRoundScoreA);
            } else {
                newRoundScoreB = roundScoreB + 1;
                setRoundScoreB(newRoundScoreB);
            }
        }
        updateDislay(newRoundScoreA, newRoundScoreB);
    };

    const onReturnToListClick = () => {
        updateGameState();
        props.setSelectedGameId(-1);
    };

    return (
        <div className='score-board'>
            <div className='main-grid'>
                <div className='top-row right-border'></div>
                <div className='top-row right-border grid-text'>{teamA}</div>
                <div className='top-row grid-text'>{teamB}</div>
                <div className='mid-row right-border  grid-text'>Round</div>
                <div
                    className='mid-row right-border score'
                    onClick={() => increaseScore("teamA")}
                >
                    {roundScoreA}
                </div>
                <div
                    className='mid-row score'
                    onClick={() => increaseScore("teamB")}
                >
                    {roundScoreB}
                </div>
                <div className='bot-row right-border  grid-text'>Game</div>
                <div className='bot-row right-border score'>{scoreA}</div>
                <div className='bot-row score'>{scoreB}</div>
            </div>
            <div className='buttons'>
                <button onClick={updateGameState}>End Round</button>
                <button onClick={() => setEditMode(true)}>Edit Game</button>
                <button onClick={onReturnToListClick}>Return to List</button>
            </div>
            {editMode ? (
                <EditBoard
                    gameState={gameState}
                    setEditMode={setEditMode}
                    setGameState={setGameState}
                />
            ) : (
                ""
            )}
        </div>
    );
};

export default Scoreboard;
