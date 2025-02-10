import React, { useState } from "react";
import { supabase } from "../firebase/supabaseClient";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import { FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
        // Replace with your app's URL
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess("Password reset email sent. Please check your inbox.");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Reset Password</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
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
          <Button
            variant="primary"
            onClick={handleResetPassword}
            disabled={loading}
            className="w-100"
          >
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </Form>
        <div className="text-center mt-3">
          <p>
            Remember your password? <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </Container>
  );
};

export default ResetPassword;
