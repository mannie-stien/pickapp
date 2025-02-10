import React, { useState, useEffect } from "react";
import { supabase } from "../firebase/supabaseClient";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Col,
  Row,
  Card,
  Spinner,
} from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Layout from "./Layout";

const CreateGame = () => {
  const [game, setGame] = useState({
    title: "",
    location_id: "",
    game_time: "",
    is_recurring: false,
    max_attendees: 10,
    level: "",
    age_limit: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    country: "",
  });

  const navigate = useNavigate();

  // Fetch existing locations
  useEffect(() => {
    const fetchLocations = async () => {
      const { data, error } = await supabase.from("locations").select("*");
      if (error) {
        toast.error("Failed to load locations");
        return;
      }
      setLocations(data);
    };

    fetchLocations();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // console.log(name, value, type, checked);
    setGame((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNewLocationChange = (e) => {
    const { name, value } = e.target;
    setNewLocation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) throw new Error("User not authenticated.");

      let locationId = game.location_id;

      // If user enters a new location, insert it first
      if (!game.location_id && newLocation.address) {
        const { data: locationData, error: locationError } = await supabase
          .from("locations")
          .insert([newLocation])
          .select()
          .single();

        if (locationError) throw locationError;
        locationId = locationData.id;
      }

      const { error: insertError } = await supabase.from("games").insert([
        {
          ...game,
          location_id: locationId || null,
          age_limit: game.age_limit ? parseInt(game.age_limit, 10) : null,
          created_by: user.id,
          level: game.level,
        },
      ]);

      if (insertError) throw insertError;

      toast.success("Game created successfully!");
      setTimeout(() => navigate("/games"), 3000);
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Container className="mt-4">
        <ToastContainer position="top-right" autoClose={3000} />

        <Card>
          <Card.Body>
            <Card.Title>Create a Pickup Game</Card.Title>
            <Form onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="title">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    placeholder="Game Title"
                    value={game.title}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col} controlId="location">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    as="select"
                    name="location_id"
                    value={game.location_id}
                    onChange={handleChange}
                  >
                    <option value="">Select Existing Location</option>
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name ? `${loc.name} - ${loc.city}` : loc.address}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Row>

              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Add a New Location</Card.Title>
                  <Row className="mb-3">
                    <Form.Group as={Col} controlId="locationName">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="Venue Name (optional)"
                        value={newLocation.name}
                        onChange={handleNewLocationChange}
                      />
                    </Form.Group>
                    <Form.Group as={Col} controlId="address">
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        placeholder="Street Address"
                        value={newLocation.address}
                        onChange={handleNewLocationChange}
                      />
                    </Form.Group>
                  </Row>
                  <Row className="mb-3">
                    <Form.Group as={Col} controlId="city">
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={newLocation.city}
                        onChange={handleNewLocationChange}
                      />
                    </Form.Group>
                    <Form.Group as={Col} controlId="state">
                      <Form.Label>State</Form.Label>
                      <Form.Control
                        type="text"
                        name="state"
                        value={newLocation.state}
                        onChange={handleNewLocationChange}
                      />
                    </Form.Group>

                    <Form.Group as={Col} controlId="country">
                      <Form.Label>Country</Form.Label>
                      <Form.Control
                        type="text"
                        name="country"
                        value={newLocation.country}
                        onChange={handleNewLocationChange}
                      />
                    </Form.Group>
                  </Row>
                </Card.Body>
              </Card>

              <Form.Group className="mb-3" controlId="game_time">
                <Form.Label>Game Time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="game_time"
                  value={game.game_time}
                  onChange={handleChange}
                  min={new Date().toISOString().slice(0, 16)}
                  required
                />
              </Form.Group>
              <Form.Group as={Col} className="mb-3" controlId="level">
                <Form.Label>Experience Level</Form.Label>
                <Form.Select
                  value={game.level}
                  onChange={(e) => setGame({ ...game, level: e.target.value })}
                >
                  <option value="">Select Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="is_recurring">
                <Form.Check
                  type="checkbox"
                  label="Recurring Game"
                  name="is_recurring"
                  checked={game.is_recurring}
                  onChange={handleChange}
                />
              </Form.Group>

              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <Spinner as="span" animation="border" size="sm" />
                ) : (
                  "Create Game"
                )}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </Layout>
  );
};

export default CreateGame;
