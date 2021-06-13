import ScoreBoard from "./components/ScoreBoard";
import GameList from "./components/GameList";
import Header from "./components/Header";
import { useState } from "react";
import "./App.css";

function App() {
    const [selectedGameId, setSelectedGameId] = useState(-1);

    const idReadout = (
        <div className='game-id-readout'>ID: {selectedGameId}</div>
    );

    return (
        <div className='App'>
            <Header />
            {selectedGameId > 0 ? (
                <ScoreBoard
                    selectedGameId={selectedGameId}
                    setSelectedGameId={setSelectedGameId}
                />
            ) : (
                <GameList setSelectedGameId={setSelectedGameId} />
            )}
            {selectedGameId > 0 ? idReadout : ""}
        </div>
    );
}

export default App;
