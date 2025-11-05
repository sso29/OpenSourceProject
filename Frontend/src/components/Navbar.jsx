// import React from 'react';
// import { Link } from 'react-router-dom';
// import './Navbar.css';

// const Navbar = () => {
//     return (
//         <nav className="navbar">
//             <Link to="/" className="navbar-brand">앱 이름 정하기</Link>
//             <div className="navbar-links">
//                 <Link to="/">Home</Link>
//                 <Link to="login">Login</Link>
//                 <Link to="register">Register</Link>
//             </div>
//         </nav>
//     );
// };

// export default Navbar;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        🎬 오픈소스 프로젝트 
        
      </Link>

      <div className="navbar-links">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          Home
        </Link>
        <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>
          Login
        </Link>
        <Link to="/register" className={location.pathname === '/register' ? 'active' : ''}>
          Register
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
