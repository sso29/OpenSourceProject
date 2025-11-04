import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">앱 이름 정하기</Link>
            <div className="navbar-links">
                <Link to="/">Home</Link>
                <Link to="login">Login</Link>
                <Link to="register">Register</Link>
            </div>
        </nav>
    );
};

export default Navbar;