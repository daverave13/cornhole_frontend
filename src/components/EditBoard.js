import React from "react";
import { useState } from "react";
import "./editboard.css";

const EditBoard = (props) => {
    const [teamA, setTeamA] = useState(props.gameState.teamA);
    const [teamB, setTeamB] = useState(props.gameState.teamB);
    const [scoreA, setScoreA] = useState(props.gameState.scoreA);
    const [scoreB, setScoreB] = useState(props.gameState.scoreB);
    const [score_to_win, setScoreToWin] = useState(
        props.gameState.score_to_win
    );

    const onTeamAUpdate = (e) => {
        setTeamA(e.target.value);
    };

    const onTeamBUpdate = (e) => {
        setTeamB(e.target.value);
    };

    const onScoreAUpdate = (e) => {
        setScoreA(e.target.value);
    };

    const onScoreBUpdate = (e) => {
        setScoreB(e.target.value);
    };

    const onScoreToWinUpdate = (e) => {
        setScoreToWin(e.target.value);
    };

    const cancelEdit = (e) => {
        e.preventDefault();

        props.setEditMode(false);
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        const { game_id } = props.gameState;
        const body = {
            game_id,
            teamA,
            teamB,
            scoreA,
            scoreB,
            score_to_win,
        };

        console.log(body);

        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        };

        await fetch(
            "https://dslusser.com:5000/api/games/" + game_id,
            requestOptions
        ).then((response) => response.json());
        props.setEditMode(false);
        props.setGameState(body);
    };

    return (
        <div className='EditBoard'>
            <form onSubmit={(e) => onSubmit(e)}>
                <div className='input'>
                    <label htmlFor='teamA'>Team A:</label>
                    <input
                        type='text'
                        name='teamA'
                        id='teamAInput'
                        value={teamA}
                        onChange={(e) => onTeamAUpdate(e)}
                    />
                </div>
                <div className='input'>
                    <label htmlFor='teamB'>Team B:</label>
                    <input
                        type='text'
                        name='teamB'
                        id='teamBInput'
                        value={teamB}
                        onChange={(e) => onTeamBUpdate(e)}
                    />
                </div>
                <div className='input'>
                    <label htmlFor='scoreA'>Score A:</label>
                    <input
                        type='number'
                        name='scoreA'
                        id='scoreAInput'
                        value={scoreA}
                        onChange={(e) => onScoreAUpdate(e)}
                    />
                </div>
                <div className='input'>
                    <label htmlFor='scoreB'>Score B:</label>
                    <input
                        type='number'
                        name='scoreB'
                        id='scoreBInput'
                        value={scoreB}
                        onChange={(e) => onScoreBUpdate(e)}
                    />
                </div>
                <div className='input'>
                    <label htmlFor='scoreToWin'>Score to win:</label>
                    <input
                        type='number'
                        name='scoreToWin'
                        id='scoreToWinInput'
                        value={score_to_win}
                        onChange={(e) => onScoreToWinUpdate(e)}
                    />
                </div>
                <div className='edit-buttons'>
                    <button type='submit'>Submit</button>
                    <button id='cancel-button' onClick={cancelEdit}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditBoard;
