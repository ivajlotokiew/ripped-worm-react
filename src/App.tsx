import { Routes, Route } from 'react-router-dom';
import './App.css';
import Players from './components/Players';
import PlayerInfo from './components/PlayerInfo';
import SideBar from './components/SideBar';
import Accounts from './components/Accounts';
import Clubs from './components/Clubs';

function App() {
  return (
    <>
      <SideBar />
      <Routes>
        <Route path="/" element={<Players />} />
        <Route path="/players/:id" element={<PlayerInfo />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/clubs" element={<Clubs />} />
      </Routes>
    </>
  );
}

export default App;
