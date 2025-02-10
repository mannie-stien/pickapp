// src/pages/Home.js
import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { FaFutbol, FaMapMarkerAlt, FaCalendarAlt, FaBasketballBall, FaUsers } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import pickIcon from "../assets/LOGO5.jpeg";
import Layout from "../components/Layout";
import { supabase } from "../firebase/supabaseClient";
import "../styles/Home.css"; // Custom CSS for additional styling

const Home = () => {
  const navigate = useNavigate();

  // Function to check if the user is signed in
  const checkAuthAndRedirect = async (path) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/login"); // Redirect to login if not signed in
    } else {
      navigate(path); // Proceed to the desired page
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-section text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="text-center text-md-start">
              <h1 className="display-4 fw-bold mb-4">Find or Create Pickup Games Near You</h1>
              <p className="lead mb-4">
                Join local games or organize your own. Soccer, basketball, and more!
              </p>
              <div className="d-flex flex-column flex-md-row gap-3">
                <Button
                  variant="light"
                  size="lg"
                  className="w-100 w-md-auto"
                  onClick={() => checkAuthAndRedirect("/games")}
                >
                  Find a Game
                </Button>
                <Button
                  variant="outline-light"
                  size="lg"
                  className="w-100 w-md-auto"
                  onClick={() => checkAuthAndRedirect("/create-game")}
                >
                  Create a Game
                </Button>
              </div>
            </Col>
            <Col md={6} className="text-center mt-5 mt-md-0">
              <img src={pickIcon} alt="Pickup Game" className="img-fluid rounded shadow-lg" />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5 fw-bold">Why Choose Us?</h2>
          <Row>
            <Col md={4} className="text-center mb-4">
              <Card className="h-100 shadow-sm feature-card">
                <Card.Body className="text-center p-4">
                  <FaFutbol className="display-4 text-primary mb-3" />
                  <h3 className="fw-bold">Multiple Sports</h3>
                  <p className="text-muted">Find games for soccer, basketball, and more.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="text-center mb-4">
              <Card className="h-100 shadow-sm feature-card">
                <Card.Body className="text-center p-4">
                  <FaMapMarkerAlt className="display-4 text-primary mb-3" />
                  <h3 className="fw-bold">Location-Based</h3>
                  <p className="text-muted">Discover games happening near you.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="text-center mb-4">
              <Card className="h-100 shadow-sm feature-card">
                <Card.Body className="text-center p-4">
                  <FaCalendarAlt className="display-4 text-primary mb-3" />
                  <h3 className="fw-bold">Easy Scheduling</h3>
                  <p className="text-muted">Create or join games with just a few clicks.</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="py-5">
        <Container>
          <h2 className="text-center mb-5 fw-bold">How It Works</h2>
          <Row className="g-4">
            <Col md={4} className="mb-4">
              <Card className="h-100 shadow-sm how-it-works-card">
                <Card.Body className="text-center p-4">
                  <div className="step-number">1</div>
                  <FaFutbol className="display-4 text-primary mb-3" />
                  <h3 className="fw-bold">Sign Up</h3>
                  <p className="text-muted">Create an account to get started.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 shadow-sm how-it-works-card">
                <Card.Body className="text-center p-4">
                  <div className="step-number">2</div>
                  <FaMapMarkerAlt className="display-4 text-primary mb-3" />
                  <h3 className="fw-bold">Find or Create a Game</h3>
                  <p className="text-muted">Search for games near you or organize your own.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 shadow-sm how-it-works-card">
                <Card.Body className="text-center p-4">
                  <div className="step-number">3</div>
                  <FaUsers className="display-4 text-primary mb-3" />
                  <h3 className="fw-bold">Play and Connect</h3>
                  <p className="text-muted">Join the game and meet new players.</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      {/*  */}
    </Layout>
  );
};

export default Home;