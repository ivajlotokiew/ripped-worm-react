import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Players from './components/Players';
import PlayerInfo from './components/PlayerInfo';

function App() {
  return (
    <>
      <Link to={"/players"}>Players</Link>
      <Routes>
        <Route path="/players" element={<Players />} />
        <Route path="/players/:id" element={<PlayerInfo />} />
        <Route path="/clubs" />
      </Routes>
    </>
  );
}

export default App;
