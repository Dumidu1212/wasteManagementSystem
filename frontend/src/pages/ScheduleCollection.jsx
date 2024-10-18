// src/pages/ScheduleCollection.jsx
import React, { useState } from "react";
import {
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import api from "../services/api";
import scheduleImage from "../assets/images/schedule.png";
import styled from "styled-components";
const ScheduleCollection = () => {
  const [formData, setFormData] = useState({
    location: "",
    wasteType: "",
    quantity: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { location, wasteType, quantity } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await api.post("/wastes", formData);
      setMessage("Waste collection scheduled successfully");
      setFormData({ location: "", wasteType: "", quantity: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Scheduling failed");
    }
  };

  const Button1 = styled.button`
    background-color: #1e770f;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 12px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-top: 50px;

    text-align: center;

    margin-right: auto;

    &:hover {
      background-color: #155b0b;
    }
  `;

  return (
    <>
    
      {error && (
        <Typography variant="body1" color="error" className="mb-4">
          {error}
        </Typography>
      )}

      <div
        style={{
          display: "flex",
          height: "100vh",
          background: "radial-gradient(circle, #F2F3F4, #E3ECE6, #D5E5D9)",
          padding: "20px",
          fontFamily: "Poppins, sans-serif", // Poppins font
          alignItems: "center", // Center vertically
        }}
      >
        {/* Title at the top-left corner */}
        <h2
          style={{
            marginBottom: "550px",
            marginLeft: "50px",
            color: "#1E770F", // Title color
            fontWeight: "bold", // Make it bold
          }}
        >
          Schedule Collection
        </h2>

        {/* Image Container */}
        <div style={{ flex: 1, textAlign: "center", padding: "20px" }}>
          <img
            src={scheduleImage}
            alt="Schedule Collection"
            style={{
              maxWidth: "100%", // Adjust width as needed
              marginLeft: "-600px",
            }}
          />
        </div>

        {/* Content Container */}
        <div style={{ flex: 1, textAlign: "left", padding: "20px" }}>
          <p
            style={{
              marginBottom: "100px",
              fontSize: "16px",
              lineHeight: "1.5", // Improve readability
              textAlign: "center",
              color: "black",
            }}
          >
            Schedule your waste collection quickly and easily with our intuitive
            system. Select the type of waste you need collected, choose your
            preferred date and time, and let our system handle the rest. We'll
            optimize the collection route for our waste management team to
            ensure timely and efficient service. Once confirmed, you'll receive
            a notification with all the details. Helping you manage your waste
            responsibly has never been easier!
          </p>

          {/* Schedule Now Button */}
          {/* <div>
            <button
              to="/schedule"
              style={{
                backgroundColor: hoverSchedule ? "#145a08" : "#1E770F",
                color: "white",
                padding: "12px 20px",
                borderRadius: "50px",
                textDecoration: "none",
                display: "block",
                marginBottom: "10px",
                width: "250px",
                textAlign: "center",
                marginLeft: "auto",
                marginRight: "auto",
                transition: "background-color 0.3s ease", // Smooth transition for hover effect
              }}
              onMouseEnter={() => setHoverSchedule(true)}
              onMouseLeave={() => setHoverSchedule(false)}
            >
              Schedule Now
            </button>
          </div> */}
  {message && (
        <Typography variant="body1" color="black" className="mb-4">
          {message}
        </Typography>
      )}
          <form onSubmit={onSubmit}>
            <TextField
              label="Location"
              name="location"
              value={location}
              onChange={onChange}
              variant="outlined"
              fullWidth
              required
              sx={{ mt: 2 }}
              InputProps={{
                style: { color: "black" }, // Set input text color to black
              }}
            />
            <FormControl variant="outlined" fullWidth required sx={{ mt: 2 }}>
              <InputLabel id="waste-type-label">Waste Type</InputLabel>
              <Select
                labelId="waste-type-label"
                label="Waste Type"
                name="wasteType"
                value={wasteType}
                onChange={onChange}
                sx={{ color: "black" }} // Set Select input text color to black
              >
                <MenuItem value="plastic" sx={{ color: "black" }}>
                  Plastic
                </MenuItem>
                <MenuItem value="paper" sx={{ color: "black" }}>
                  Paper
                </MenuItem>
                <MenuItem value="organic" sx={{ color: "black" }}>
                  Organic
                </MenuItem>
                <MenuItem value="metal" sx={{ color: "black" }}>
                  Metal
                </MenuItem>
                <MenuItem value="glass" sx={{ color: "black" }}>
                  Glass
                </MenuItem>
                <MenuItem value="other" sx={{ color: "black" }}>
                  Other
                </MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Quantity (kg)"
              name="quantity"
              type="number"
              value={quantity}
              onChange={onChange}
              variant="outlined"
              fullWidth
              required
              sx={{ mt: 2, mb: 4 }}
              InputProps={{
                style: { color: "black" }, // Set input text color to black
              }}
              inputProps={{ min: "0", step: "0.1" }}
            />
            <Button1 type="submit">Schedule Collection</Button1>
          </form>
        </div>
      </div>
    </>
  );
};

export default ScheduleCollection;
