import React, { useState } from "react";
import { supabase } from "../firebase/supabaseClient";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Card,
  Alert,
  Spinner,
} from "react-bootstrap";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        // Redirect to the home page or dashboard
        navigate("/");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={4}>
          <Card className="shadow-lg p-4">
            <Card.Body>
              <Card.Title className="text-center mb-4">
                <h2>Login</h2>
              </Card.Title>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaEnvelope className="me-2" /> Email
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>
                    <FaLock className="me-2" /> Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-100"
                >
                  {loading ? <Spinner animation="border" size="sm" /> : "Login"}
                </Button>
              </Form>
              <div className="text-center mt-3">
                <p>
                  Don't have an account? <Link to="/signup">Sign up</Link>
                </p>
                <p>
                  <Link to="/reset-password">Forgot your password?</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;