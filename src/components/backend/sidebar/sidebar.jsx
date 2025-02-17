import "./sidebar.scss"
import { NavLink  } from "react-router-dom";
export default function Sidebar({current}) {

    return (
        <>
            <div className="sidebar">
                <div className="title-section">
                    <h1 className="title">Cloop</h1>
                </div>
                <span className = "white-line"></span>
                <nav className="navbar">
                    <ul>
                        <li><NavLink to="/accounts">Accounts</NavLink></li>
                        <li><NavLink to="/clothing">Clothing</NavLink></li>
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