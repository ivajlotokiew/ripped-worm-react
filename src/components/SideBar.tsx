import { Link } from 'react-router-dom';
import './SideBar.css';

function SideBar() {
    return (
        <div className='sidebar-wrapper'>
            <Link to="/"><h1>Players</h1></Link>
            <Link to="/accounts"><h1>Accounts</h1></Link>
            <Link to="/clubs"><h1>Clubs</h1></Link>
        </div>
    )
}

export default SideBar
