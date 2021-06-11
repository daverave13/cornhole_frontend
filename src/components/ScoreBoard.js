import React from 'react';
import { useState, useEffect } from 'react';
import './scoreBoard.css';
import EditBoard from './EditBoard';

const Scoreboard = (props) => {

    const [ gameState, setGameState] = useState({});
    const [ roundScoreA, setRoundScoreA ] = useState(0);
    const [ roundScoreB, setRoundScoreB ] = useState(0);
    const [ editMode, setEditMode ] = useState(false);
    const [ maxGameId, setMaxGameId ] = useState(-1); 

    const getGameState = () => {
        fetch("http://localhost:5000/api/games/", { method: "GET" })
            .then((response) => response.json())
            .then((data) => {
                const currentGame = [...data].filter((game) => game.game_id === props.selectedGameId)[0];
                const mostRecentGame = [...data].sort((a,b) => b.game_id - a.game_id)[0];
                setMaxGameId(mostRecentGame.game_id + 1);
                setGameState(currentGame);
            });
    };

    useEffect(() => {
        getGameState();
    }, [editMode, props.selectedGameId]);
    
    const { game_id, teamA, teamB, scoreA, scoreB, score_to_win } = gameState;

    const updateGameState = (newTeamA = teamA, newTeamB = teamB, newScoreA = scoreA + roundScoreA, newScoreB = scoreB + roundScoreB, newScoreToWin = score_to_win) => {
        const newBody = {
            'teamA': gameState.teamA,
            'teamB':  newTeamB,
            'scoreA': scoreA + roundScoreA,
            'scoreB': scoreB + roundScoreB,
            'score_to_win': newScoreToWin,
        };

       

        setRoundScoreA(0);
        setRoundScoreB(0);
        setGameState(newBody);

        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newBody),
        };

        fetch("http://localhost:5000/api/games/" + game_id, requestOptions).then(
            (response) => response.json());

        getGameState();
    }

    const newGame = () => {
        const body = {
            'teamA': 'teamA',
            'teamB': 'teamB',
            'scoreA': 0,
            'scoreB': 0,
            'score_to_win': 21,
        };

        setRoundScoreA(0);
        setRoundScoreB(0);
        props.setSelectedGameId(maxGameId);

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        };

        fetch("http://localhost:5000/api/games/", requestOptions).then(
            (response) => response.json());

        getGameState();
    }

    const increaseScore = (team) => {
        if (team === 'teamA') {
            if (roundScoreB > 0) {
                const newRoundScoreB = roundScoreB - 1;
                setRoundScoreB(newRoundScoreB);
            } else {
                const newRoundScoreA = roundScoreA + 1;
                setRoundScoreA(newRoundScoreA);
            }
        } else {
            if (roundScoreA > 0) {
                const newRoundScoreA = roundScoreA - 1;
                setRoundScoreA(newRoundScoreA);
            } else {
                const newRoundScoreB = roundScoreB + 1;
                setRoundScoreB(newRoundScoreB);
            }
        }
    }   

    const onReturnToListClick = () => {
        updateGameState();
        props.setSelectedGameId(-1);
    }
 
    return (
        <div className="score-board">
            <div className="main-grid">
                <div className="top-row right-border"></div>
                <div className="top-row right-border">{ teamA }</div>
                <div className="top-row">{ teamB }</div>
                <div className="mid-row right-border">Round</div>
                <div className="mid-row right-border score" onClick={() => increaseScore('teamA')}>{ roundScoreA }</div>
                <div className="mid-row score" onClick={() => increaseScore('teamB')}>{ roundScoreB }</div>
                <div className="bot-row right-border">Game</div>
                <div className="bot-row right-border score" >{ scoreA }</div>
                <div className="bot-row score">{ scoreB }</div>
            </div>
            <div className="score-to-win">
                <div>Score To Win:&nbsp;&nbsp;&nbsp;</div>
                <div className="">
                    <div>{ score_to_win }</div>
                </div>
            </div>
            <div className="buttons">
                <button onClick={updateGameState}>End Round</button>
                <button onClick={() => setEditMode(true)}>Edit Game</button>
                <button onClick={newGame}>New Game</button>
                <button onClick={onReturnToListClick}>Return to List</button>
            </div>
            {editMode ? <EditBoard gameState={gameState} setEditMode={setEditMode} /> : ""}
        </div>
    )
}

export default Scoreboard;