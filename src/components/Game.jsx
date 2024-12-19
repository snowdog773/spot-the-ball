import { useState, useEffect } from "react";
import { imageArray, targets } from "../data/data";
import emailjs from "emailjs-com";
const Game = ({ name }) => {
  const [clicks, setClicks] = useState({});
  const [score, setScore] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Load completion state from local storage
  useEffect(() => {
    const completed = localStorage.getItem("completed");
    const storedScore = localStorage.getItem("score");
    if (completed) {
      setSubmitted(true);
      setScore(Number(storedScore));
    }
  }, []);

  // Handle user clicks
  const handleImageClick = (event, imageIndex) => {
    if (submitted) return; // Prevent changes after submission

    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setClicks((prev) => ({
      ...prev,
      [imageIndex]: { x, y },
    }));
  };

  // Check if all images have been clicked
  const allClicked = imageArray.length === Object.keys(clicks).length;

  // Handle submit
  const handleSubmit = () => {
    if (submitted) return; // Prevent double submission

    let currentScore = 0;

    imageArray.forEach((_, index) => {
      const userClick = clicks[index];
      const target = targets[index];

      if (userClick && target) {
        const distance = Math.sqrt(
          Math.pow(userClick.x - target.x, 2) +
            Math.pow(userClick.y - target.y, 2)
        );

        if (distance <= 50) {
          currentScore += 1; // Award 1 point if within the circle
        }
      }
    });

    setScore(currentScore);
    setShowModal(true);
    setSubmitted(true);

    // Save to local storage
    localStorage.setItem("score", currentScore);
    localStorage.setItem("completed", "true");

    // Prepare email data
    const emailData = {
      user: name,
      score: currentScore,
      clicks: JSON.stringify(clicks, null, 2), // Format clicks nicely
    };

    // Use EmailJS to send the email
    emailjs
      .send(
        "service_nuspn6u", // Replace with your EmailJS Service ID
        "template_vxrrymd", // Replace with your EmailJS Template ID
        emailData,
        "u_g8_7UwyRjyDpWIP" // Replace with your EmailJS Public Key
      )
      .then(
        (response) => {
          console.log(
            "Email sent successfully!",
            response.status,
            response.text
          );
        },
        (err) => {
          console.error("Failed to send email:", err);
        }
      );
  };

  // Close the modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <p>{name} is logged into Game</p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {imageArray.map((e, i) => {
          const target = targets[i];
          return (
            <div key={i} style={{ marginBottom: "40px", textAlign: "center" }}>
              {/* Heading outside the image div */}
              <h2>Image {i + 1}</h2>

              <div
                style={{
                  position: "relative",
                  width: "800px",
                  height: "500px",
                  backgroundImage: `url(/assets/${e})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                onClick={(event) => handleImageClick(event, i)}
              >
                {/* Conditionally render yellow circle */}
                {submitted && target && (
                  <div
                    style={{
                      position: "absolute",
                      top: `${target.y - 50}px`,
                      left: `${target.x - 50}px`,
                      width: "100px",
                      height: "100px",
                      border: "2px solid yellow",
                      borderRadius: "50%",
                      backgroundColor: "transparent",
                      pointerEvents: "none",
                    }}
                  ></div>
                )}

                {/* Render red spot for the user's click */}
                {clicks[i] && (
                  <div
                    style={{
                      position: "absolute",
                      top: `${clicks[i].y - 10}px`,
                      left: `${clicks[i].x - 10}px`,
                      width: "20px",
                      height: "20px",
                      backgroundColor: "red",
                      borderRadius: "50%",
                      pointerEvents: "none",
                    }}
                  ></div>
                )}
              </div>
            </div>
          );
        })}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!allClicked || submitted}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: allClicked && !submitted ? "blue" : "grey",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: allClicked && !submitted ? "pointer" : "not-allowed",
          }}
        >
          Submit
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <h2>Your Score</h2>
            <p>
              You scored {score} out of {imageArray.length}.
            </p>
            <button
              onClick={handleCloseModal}
              style={{
                marginTop: "10px",
                padding: "10px 20px",
                backgroundColor: "blue",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Game;
