import React from "react";
import { Card, Button, Dropdown, Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaTrophy,
  FaInfoCircle,
  FaEllipsisV,
} from "react-icons/fa";

const GameCard = ({
  game,
  currentUser,
  handleJoinGame,
  handleEditGame,
  handleDeleteGame,
}) => {
  // Function to generate a Google Maps URL
  const getGoogleMapsUrl = (location) => {
    const { name, city, state, country } = location;
    const query = encodeURIComponent(`${name}, ${city}, ${state}, ${country}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  // Format the game time
  const gameTime = new Date(game.game_time);
  const formattedDate = gameTime.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = gameTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Truncate long titles
  const truncateTitle = (title, maxLength = 30) => {
    return title.length > maxLength ? `${title.slice(0, maxLength)}...` : title;
  };

  return (
    <Card
      className="h-100 shadow-sm border-0 rounded-4 p-3"
      style={{
        background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
        transition: "transform 0.2s, box-shadow 0.2s",
        position: "relative",
        overflow: "visible",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
      }}
    >
      <Card.Body className="d-flex flex-column">
        {/* Game Title & Date */}
        <Card.Title className="fw-bold d-flex justify-content-between align-items-center mb-3">
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>{game.title}</Tooltip>}
          >
            <span className="text-primary" style={{ maxWidth: "70%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {truncateTitle(game.title)}
            </span>
          </OverlayTrigger>
          <span className="text-muted small">
            <FaCalendarAlt className="me-1" />
            {formattedDate} at {formattedTime}
          </span>
        </Card.Title>

        {/* Location */}
        {game.location ? (
          <Card.Text className="text-muted mb-3 d-flex align-items-center">
            <FaMapMarkerAlt className="text-danger me-2" />
            <a
              href={getGoogleMapsUrl(game.location)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none text-muted"
              style={{ transition: "color 0.2s" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#007bff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "inherit";
              }}
            >
              {game.location.name}, {game.location.city}, {game.location.state},{" "}
              {game.location.country}
            </a>
          </Card.Text>
        ) : (
          <Card.Text className="text-muted mb-3 d-flex align-items-center">
            <FaMapMarkerAlt className="text-danger me-2" />
            Location not available
          </Card.Text>
        )}

        {/* Attendees */}
        <Card.Text className="d-flex align-items-center mb-3">
          <FaUsers className="text-primary me-2" />
          <span>
            {game.current_attendees}/{game.max_attendees} attendees
          </span>
          {game.current_attendees >= game.max_attendees && (
            <Badge bg="danger" className="ms-2">
              Full
            </Badge>
          )}
        </Card.Text>

        {/* Level */}
        <Card.Text className="d-flex align-items-center mb-3">
          <FaTrophy className="text-warning me-2" />
          <Badge bg="secondary">{game.level || "Any"}</Badge>
        </Card.Text>

        {/* Description */}
        <Card.Text className="text-muted mb-4 d-flex align-items-center">
          <FaInfoCircle className="me-2" />
          {game.description || "No description provided."}
        </Card.Text>

        {/* Join Button & Dropdown */}
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <Button
            variant={
              game.current_attendees >= game.max_attendees
                ? "secondary"
                : "primary"
            }
            className="flex-grow-1 me-2"
            onClick={() => handleJoinGame(game.id)}
            disabled={game.current_attendees >= game.max_attendees}
            style={{
              transition: "background-color 0.2s, transform 0.2s",
            }}
            onMouseEnter={(e) => {
              if (game.current_attendees < game.max_attendees) {
                e.currentTarget.style.transform = "scale(1.05)";
              }
            }}
            onMouseLeave={(e) => {
              if (game.current_attendees < game.max_attendees) {
                e.currentTarget.style.transform = "scale(1)";
              }
            }}
          >
            {game.current_attendees >= game.max_attendees
              ? "Game Full"
              : "Join Game"}
          </Button>

          {/* Dropdown for Edit/Delete */}
          {game.created_by === currentUser?.id && (
            <Dropdown drop="up-centered">
              <Dropdown.Toggle
                variant="light"
                className="border-0 shadow-none p-1"
                style={{
                  background: "transparent",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "rotate(90deg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "rotate(0deg)";
                }}
              >
                <FaEllipsisV />
              </Dropdown.Toggle>
              <Dropdown.Menu
                style={{
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                }}
              >
                <Dropdown.Item
                  onClick={() => handleEditGame(game.id)}
                  style={{
                    padding: "8px 16px",
                    fontSize: "14px",
                    color: "#333",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f8f9fa";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  Edit
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => handleDeleteGame(game.id)}
                  style={{
                    padding: "8px 16px",
                    fontSize: "14px",
                    color: "#dc3545",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f8f9fa";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  Delete
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default React.memo(GameCard);