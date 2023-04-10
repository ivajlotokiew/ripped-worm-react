import { Link } from 'react-router-dom';
import './SideBar.css';

function SideBar() {
    return (
        <div className='sidebar-wrapper'>
            <Link to="/"><h2>Players</h2></Link>
            <Link to="/accounts"><h2>Accounts</h2></Link>
            <Link to="/clubs"><h2>Clubs</h2></Link>
        </div>
    )
}

export default SideBar
