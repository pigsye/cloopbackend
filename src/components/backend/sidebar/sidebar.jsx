import "./sidebar.scss"
import { NavLink  } from "react-router-dom";
export default function Sidebar({current}) {

    return (
        <>
            <div className="sidebar">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Joan&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet" />
                <div className="title-section">
                    <h1 className="title">Cloop</h1>
                </div>
                <span className = "white-line"></span>
                <nav className="navbar">
                    <ul>
                        <li><NavLink to="/accounts">Accounts</NavLink></li>
                        <li><NavLink to="/clothing">Clothing</NavLink></li>
                        <li><NavLink to="/orders">Orders</NavLink></li>
                        <li><NavLink to="/tags">Tags</NavLink></li>
                        <li><NavLink to="/logs">Chat Logs</NavLink></li>
                        <li><NavLink to="/feedbacks">Feedback</NavLink></li>
                    </ul>
                </nav>
            </div>
            <div className="sidebar-disconnect"></div>
        </>
    )
}