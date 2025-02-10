import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../firebase/supabaseClient";
import { Form, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import Layout from "./Layout";

const EditGame = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchGame = async () => {
      const { data, error } = await supabase
        .from("games")
        .select("*")
        .eq("id", gameId)
        .single();

      if (error) {
        toast.error("Error fetching game details.");
        return;
      }
      setGame(data);
    };

    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUser(user);
    };

    fetchGame();
    fetchLocations();

    fetchUser();
  }, [gameId]);

  const fetchLocations = async () => {
    const { data, error } = await supabase.from("locations").select("id, name");
    if (error) {
      toast.error("Error fetching locations.");
      return;
    }
    setLocations(data);
  };

  const handleUpdateGame = async (e) => {
    e.preventDefault();

    if (!game.title || !game.location_id || !game.game_time) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (currentUser?.id !== game.created_by) {
      toast.error("You are not authorized to edit this game.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("games")
        .update({
          title: game.title,
          location_id: game.location_id,
          game_time: game.game_time,
          max_attendees: game.max_attendees,
          level: game.level,
          age_limit: game.age_limit,
          description: game.description,
          is_recurring: game.is_recurring,
          is_active: game.is_active,
          closed_at: game.closed_at || null,
        })
        .eq("id", gameId)
        .eq("created_by", currentUser?.id);

      if (error) throw error;

      toast.success("Game updated successfully!");
      navigate("/games");
    } catch (error) {
      toast.error("Failed to update game.");
      console.error("Error updating game:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!game) return <p className="text-center mt-5">Loading...</p>;

  return (
    <Layout>
      <Container className="mt-4">
        <h2 className="text-center mb-4">Edit Game</h2>

        <Form
          onSubmit={handleUpdateGame}
          className="shadow-sm p-4 rounded bg-white"
        >
          <Row className="mb-3">
            <Form.Group as={Col} controlId="title">
              <Form.Label>
                Title <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                value={game.title}
                onChange={(e) => setGame({ ...game, title: e.target.value })}
                required
              />
            </Form.Group>

             <Form.Group as={Col} controlId="location_id">
              <Form.Label>Location <span className="text-danger">*</span></Form.Label>
              <Form.Select
                value={game.location_id}
                onChange={(e) => setGame({ ...game, location_id: parseInt(e.target.value) })}
                required
              >
                <option value="">Select Location</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="game_time">
              <Form.Label>Game Time <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="datetime-local"
                value={game.game_time.slice(0, 16)}
                onChange={(e) => setGame({ ...game, game_time: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group as={Col} controlId="max_attendees">
              <Form.Label>Max Attendees</Form.Label>
              <Form.Control
                type="number"
                value={game.max_attendees}
                onChange={(e) =>
                  setGame({ ...game, max_attendees: e.target.value })
                }
                min="1"
              />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            {/* <Form.Group as={Col} controlId="current_attendees">
              <Form.Label>Current Attendees</Form.Label>
              <Form.Control
                type="number"
                value={game.current_attendees}
                onChange={(e) =>
                  setGame({ ...game, current_attendees: e.target.value })
                }
                min="0"
              />
            </Form.Group> */}

            <Form.Group as={Col} controlId="is_active">
              <Form.Check
                type="checkbox"
                label="Is Active"
                checked={game.is_active}
                onChange={(e) =>
                  setGame({ ...game, is_active: e.target.checked })
                }
              />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="level">
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

            <Form.Group as={Col} controlId="age_limit">
              <Form.Label>Age Limit</Form.Label>
              <Form.Control
                type="number"
                value={game.age_limit || ""}
                onChange={(e) =>
                  setGame({ ...game, age_limit: e.target.value })
                }
              />
            </Form.Group>
          </Row>

          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={game.description}
              onChange={(e) =>
                setGame({ ...game, description: e.target.value })
              }
            />
          </Form.Group>

          {/* <Form.Group className="mb-3" controlId="closed_at">
            <Form.Label>Closed At</Form.Label>
            <Form.Control
              type="datetime-local"
              value={game.closed_at ? game.closed_at.split(".")[0] : ""}
              onChange={(e) => setGame({ ...game, closed_at: e.target.value })}
            />
          </Form.Group> */}

          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? (
              <Spinner animation="border" size="sm" className="me-2" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </Form>
      </Container>
    </Layout>
  );
};

export default EditGame;
