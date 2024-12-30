import React from "react";
import "./CardText.css";
import { useState } from "react";
function CardText() {
  const [selectedCard, setSelectedCard] = useState(null);

  const cardData = [
    {
      id: 1,
      title: "24 Hours Service",
      shortDescription:
        "Round-the-clock healthcare services, ensuring you receive the care you need, whenever you need it....",
      fullDescription:
        "Round-the-clock healthcare services, ensuring you receive the care you need, whenever you need it. Our dedicated team is here to support you 24/7.",
    },
    {
      id: 2,
      title: "Qualified Doctor",
      shortDescription:
        "Highly skilled and experienced doctors committed to providing top-notch medical care...",
      fullDescription:
        "Highly skilled and experienced doctors committed to providing top-notch medical care. Trust in our qualified professionals for your health and wellness.",
    },
    {
      id: 3,
      title: "Emergency Care",
      shortDescription:
        "Immediate and efficient emergency care available for critical situations. Our expert team is...",
      fullDescription:
        "Immediate and efficient emergency care available for critical situations. Our expert team is equipped to handle emergencies with the utmost urgency and expertise.",
    },
  ];

  const handleReadMore = (id) => {
    setSelectedCard(id);
  };

  const handleClose = () => {
    setSelectedCard(null);
  };

  return (
    <div className="card-container">
      {cardData.map((card) => (
        <div
          key={card.id}
          className={`card ${selectedCard === card.id ? "expanded" : ""}`}
        >
          <h2>{card.title}</h2>
          <p>
            {selectedCard === card.id
              ? card.fullDescription
              : card.shortDescription}
          </p>
          {selectedCard === card.id ? (
            <button onClick={handleClose} className="btn">
              Close
            </button>
          ) : (
            <button onClick={() => handleReadMore(card.id)} className="btn">
              View More →
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default CardText;
