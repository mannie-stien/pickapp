import React, { useState, useEffect } from "react";
import { supabase } from "../firebase/supabaseClient";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import { FaLock } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const UpdatePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if the user is authenticated (i.e., clicked the reset link)
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        navigate("/login"); // Redirect to login if not authenticated
      }
    };
    checkAuth();
  }, [navigate]);

  const handleUpdatePassword = async () => {
    if (!password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess("Password updated successfully. Redirecting to login...");
        setTimeout(() => navigate("/login"), 3000); // Redirect to login after 3 seconds
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
        <h2 className="text-center mb-4">Update Password</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaLock className="me-2" /> New Password
            </Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>
              <FaLock className="me-2" /> Confirm Password
            </Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button
            variant="primary"
            onClick={handleUpdatePassword}
            disabled={loading}
            className="w-100"
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Update Password"}
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default UpdatePassword;