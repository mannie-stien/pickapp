import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Accordion,
  Pagination,
} from "react-bootstrap";
import { FaSync, FaMap, FaFilter } from "react-icons/fa";
import { supabase } from "../firebase/supabaseClient";
import Layout from "../components/Layout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import GameCard from "./GameCard";
import GameMap from "./GameMap";

const Games = () => {
  const [games, setGames] = useState([]);
  const [userLocation, setUserLocation] = useState({
    latitude: 0,
    longitude: 0,
  }); // Default location
  const [searchQuery, setSearchQuery] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [itemsPerPage, setItemsPerPage] = useState(10); // Items per page
  const [totalGames, setTotalGames] = useState(0); // Total number of games
  const navigate = useNavigate();

  // Fetch user's current location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.warn("Error getting location:", error);
          toast.error("Unable to fetch your location. Using default location.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
    }
  }, []);

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    fetchUser();
  }, []);

  // Fetch games with filters applied and pagination
  const fetchGames = useCallback(async () => {
    setIsLoading(true);
    try {
      let locationIds = null;

      // Fetch location IDs if filtering by state, city, or country
      if (stateFilter || cityFilter || countryFilter) {
        const { data: locations, error: locationError } = await supabase
          .from("locations")
          .select("id")
          .match({
            ...(stateFilter && { state: stateFilter }),
            ...(cityFilter && { city: cityFilter }),
            ...(countryFilter && { country: countryFilter }),
          });

        if (locationError) throw locationError;

        locationIds = locations.map((loc) => loc.id);

        // If no matching locations are found, return early
        if (locationIds.length === 0) {
          setGames([]);
          setTotalGames(0);
          setIsLoading(false);
          return;
        }
      }

      // Calculate range for pagination
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      // Fetch games with pagination
      let query = supabase
        .from("games")
        .select("*, location:locations(name, city, state, country)", {
          count: "exact",
        })
        .eq("is_active", true)
        .range(from, to);

      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
      }

      if (skillLevel) {
        query = query.eq("level", skillLevel);
      }

      if (locationIds) {
        query = query.in("location_id", locationIds);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      setGames(data || []);
      setTotalGames(count || 0);
    } catch (error) {
      toast.error("Error fetching games. Please try again.");
      console.log(error);
      setGames([]);
      setTotalGames(0);
    } finally {
      setIsLoading(false);
    }
  }, [
    searchQuery,
    skillLevel,
    stateFilter,
    cityFilter,
    countryFilter,
    currentPage,
    itemsPerPage,
  ]);

  // Fetch games when filters or pagination changes
  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle Join, Edit, and Delete Games
  const handleJoinGame = async (gameId) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error: joinError } = await supabase
        .from("attendees")
        .insert([{ user_id: user.id, game_id: gameId }]);

      if (joinError) {
        if (joinError.code === "23505") {
          toast.info("You have already joined this game.");
        } else {
          toast.error(joinError.message || "Failed to join the game.");
        }
        throw joinError;
      }

      toast.success("Successfully joined the game!");
    } catch (error) {
      console.error("Error joining game:", error);
    }
  };

  const handleEditGame = (gameId) => {
    navigate(`/edit-game/${gameId}`);
  };

  const handleDeleteGame = async (gameId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this game?"
    );
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from("games")
        .delete()
        .eq("id", gameId)
        .eq("created_by", currentUser?.id);

      if (error) throw error;

      toast.success("Game deleted successfully!");
      setGames((prevGames) => prevGames.filter((game) => game.id !== gameId));
    } catch (error) {
      toast.error("Failed to delete game.");
      console.error("Error deleting game:", error);
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalGames / itemsPerPage);

  return (
    <Layout>
      <Container className="py-5">
        <h2 className="text-center mb-5">Find Open Pickup Games Near You</h2>

        {/* Toast Notifications */}
        <ToastContainer position="top-right" autoClose={3000} />

        {/* Controls Section */}
        <Row className="mb-4">
          <Col md={6}>
            <Form.Group controlId="search">
              <Form.Control
                type="text"
                placeholder="Search by activity name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Button
              variant="outline-primary"
              onClick={fetchGames}
              disabled={isLoading}
            >
              <FaSync /> {isLoading ? "Refreshing..." : "Refresh"}
            </Button>
          </Col>
          <Col md={3}>
            <Button
              variant="outline-secondary"
              onClick={() => setShowMap(!showMap)}
            >
              <FaMap /> {showMap ? "Show List" : "Show Map"}
            </Button>
          </Col>
        </Row>

        {/* Filter Section */}
        <Accordion className="mb-4">
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <FaFilter className="me-2" /> Filters
            </Accordion.Header>
            <Accordion.Body>
              <Row>
                <Col md={3}>
                  <Form.Group controlId="skillLevel">
                    <Form.Label>Skill Level</Form.Label>
                    <Form.Select
                      value={skillLevel}
                      onChange={(e) => setSkillLevel(e.target.value)}
                    >
                      <option value="">All Skill Levels</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group controlId="state">
                    <Form.Label>State</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Filter by state"
                      value={stateFilter}
                      onChange={(e) => setStateFilter(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group controlId="city">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Filter by city"
                      value={cityFilter}
                      onChange={(e) => setCityFilter(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group controlId="country">
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Filter by country"
                      value={countryFilter}
                      onChange={(e) => setCountryFilter(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        {/* Map Section */}
        {showMap && (
          <GameMap
            userLocation={userLocation}
            games={games.map((game) => ({
              ...game,
              coords: game.coords?.coordinates || null,
            }))}
          />
        )}

        {/* Game List Section */}
        <Row>
          {games.length > 0 ? (
            games.map((game) => (
              <Col md={4} key={game.id} className="mb-4">
                <GameCard
                  game={game}
                  currentUser={currentUser}
                  handleJoinGame={handleJoinGame}
                  handleEditGame={handleEditGame}
                  handleDeleteGame={handleDeleteGame}
                />
              </Col>
            ))
          ) : (
            <Col className="text-center">
              <h4>No games found matching your filters</h4>
            </Col>
          )}
        </Row>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <Row className="mt-4">
            <Col className="d-flex justify-content-center">
              <Pagination>
                <Pagination.Prev
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                />
                {Array.from({ length: totalPages }, (_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={i + 1 === currentPage}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </Col>
          </Row>
        )}
      </Container>
    </Layout>
  );
};

export default Games;