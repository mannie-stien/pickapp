import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaFutbol,
  FaBasketballBall,
  FaMapMarkerAlt,
  FaSignOutAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaBaseballBall,
  FaVolleyballBall,
  FaTableTennis,
  FaGolfBall,
} from "react-icons/fa";
import { supabase } from "../firebase/supabaseClient";
import "../styles/Layout.css"; // Custom CSS for additional styling

const rotatingIcons = [
  <FaGolfBall style={{ color: "#ff1493" }} />,

  <FaFutbol style={{ color: "#00bfff" }} />,
  <FaBasketballBall style={{ color: "#ff8c00" }} />,
  <FaBaseballBall style={{ color: "#d3d3d3" }} />,
  <FaVolleyballBall style={{ color: "#ff1493" }} />,
  <FaTableTennis style={{ color: "#ff1493" }} />,



];

const Layout = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentIconIndex, setCurrentIconIndex] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      }
    };
    fetchUser();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const iconChangeInterval = setInterval(() => {
      setCurrentIconIndex(
        (prevIndex) => (prevIndex + 1) % rotatingIcons.length
      );
    }, 2000); // Change icon every 2 seconds

    return () => clearInterval(iconChangeInterval); // Clear the interval on unmount
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/"; // Redirect after logout
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="navbar-custom">
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            {rotatingIcons[currentIconIndex]}
            <span className="fw-bold ms-2">PickApp Games</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <Nav.Link as={Link} to="/create-game" className="nav-link-custom">
                <FaBasketballBall className="me-2" /> Create a Game
              </Nav.Link>
              <Nav.Link as={Link} to="/games" className="nav-link-custom">
                <FaMapMarkerAlt className="me-2" /> Find a Game
              </Nav.Link>

              {user ? (
                <>
                  <Nav.Link as={Link} to="/profile" className="nav-link-custom">
                    <FaUser className="me-2" /> Profile
                  </Nav.Link>
                  <Button
                    variant="outline-light"
                    size="sm"
                    onClick={handleSignOut}
                    className="ms-2 sign-out-btn"
                  >
                    <FaSignOutAlt className="me-1" /> Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login" className="nav-link-custom">
                    Login
                  </Nav.Link>
                  <Nav.Link as={Link} to="/signup" className="nav-link-custom">
                    Sign Up
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Page Content */}
      <main className="flex-grow-1 content-container">{children}</main>

      {/* Footer */}
      <footer className="footer bg-dark text-light p-4">
        <Container className="text-center">
          <p>
            &copy; {new Date().getFullYear()} Pickapp Games. All Rights Reserved.
          </p>
          {/* <div className="social-icons">
            <a
              href="mailto:contact@pickupgames.com"
              className="text-light me-3"
            >
              <FaEnvelope /> contact@pickupgames.com
            </a>
            <span className="me-3">
              <FaPhone /> +1 (123) 456-7890
            </span>
            <a href="#" className="text-light me-3">
              <FaFacebook />
            </a>
            <a href="#" className="text-light me-3">
              <FaTwitter />
            </a>
            <a href="#" className="text-light">
              <FaInstagram />
            </a>
          </div> */}
        </Container>
      </footer>
    </div>
  );
};

export default Layout;
