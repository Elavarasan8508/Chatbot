import { Link } from "react-router-dom";
import { isAuthenticated } from "../services/Auth";
import "./NavBar.css";

export default function NavBar({ logoutUser }) {
    return (
        <nav className="navbar">
            <div className="nav-container">
                {/* Brand Logo */}
                <Link to="/" className="navbar-brand">MindSync AI</Link>

                {/* Mobile Menu Toggle */}
                <input type="checkbox" id="menu-toggle" className="menu-toggle" />
                <label htmlFor="menu-toggle" className="menu-icon">&#9776;</label>

                {/* Navigation Links */}
                <ul className="nav-links">
                    {!isAuthenticated() && <li><Link to="/register">Register</Link></li>}
                    {!isAuthenticated() && <li><Link to="/login">Login</Link></li>}
                    {isAuthenticated() && <li><Link to="/dashboard">Dashboard</Link></li>}
                    {isAuthenticated() && <li><button onClick={logoutUser} className="logout-btn">Logout</button></li>}
                </ul>
            </div>
        </nav>
    );
}
