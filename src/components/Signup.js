import React, { useState } from "react";
import { supabase } from "../firebase/supabaseClient";
import { Container, Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

 const handleSignUp = async () => {
  if (!email || !password) {
    setError("Please fill in all fields.");
    return;
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    setError("Please enter a valid email address.");
    return;
  }

  if (password.length < 6) {
    setError("Password must be at least 6 characters long.");
    return;
  }

  setLoading(true);
  setError("");
  setSuccess("");

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }, // This gets saved in auth.users.raw_user_meta_data
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess("Sign-up successful! Check your email for confirmation.");
    }
  } catch (error) {
    setError("An unexpected error occurred. Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <Container className="d-flex align-items-center justify-content-center vh-100">
      <Card
        className="shadow-lg rounded p-4"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <Card.Body>
          <Card.Title className="text-center mb-4">
            <h2 className="fw-bold">Create Account</h2>
          </Card.Title>

          {/* Success & Error Messages */}
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form>
            {/* Full Name */}
            <Form.Group className="mb-3">
              <Form.Label>
                <FaUser className="me-2 text-primary" />
                Full Name
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </Form.Group>

            {/* Email */}
            <Form.Group className="mb-3">
              <Form.Label>
                <FaEnvelope className="me-2 text-primary" />
                Email
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            {/* Password */}
            <Form.Group className="mb-4">
              <Form.Label>
                <FaLock className="me-2 text-primary" />
                Password
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            {/* Sign Up Button */}
            <Button
              variant="primary"
              onClick={handleSignUp}
              disabled={loading}
              className="w-100 fw-bold py-2"
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />{" "}
                  Signing Up...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </Form>

          {/* Login Link */}
          <div className="text-center mt-3">
            <p className="text-muted">
              Already have an account?{" "}
              <a href="/login" className="fw-bold text-primary">
                Log in
              </a>
            </p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SignUp;
