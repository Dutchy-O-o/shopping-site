import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Navbar.css';

interface NavbarProps {
  isLoggedIn: boolean;
  admin: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, admin }) => {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-link">Home</Link>
      {admin && <Link to="/customers" className="nav-link">AdminLog</Link>}
      {!isLoggedIn && <Link to="/signup-or-login" className="nav-link">Signup or Login</Link>} {/* Hide this link if logged in */}
      <Link to="/cart" className="nav-link">Cart</Link>
      {/* <Link to="/checkout" className="nav-link">Checkout</Link> */} {/* Removed Checkout Link */}
      <Link to="/contact-us" className="nav-link">Contact Us</Link>
      <Link to="/profile" className="nav-link">Profile</Link>
    </nav>
  );
};

export default Navbar;
