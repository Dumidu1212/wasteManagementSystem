import React, { useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import binGreen from "../assets/images/binGreen.png"; // Import images properly
import binBlue from "../assets/images/binBlue.png";
import binRed from "../assets/images/binRed.png";
import useAuth from "../hooks/useAuth";
import api from "../services/api";
import axios from "axios";

const PayPalButton = () => {
  const { auth, login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    id: "",
    recyclable: 0,
    bioDegradable:0,
    NonBioDegradable: 0,
    district: "",
    totalWeight: "",
    loyalty: "",
    price:''
  });

  useEffect(() => {
    console.log("hi");
    if (auth.user) {
      console.log(auth.user);
      setFormData({
        name: auth.user.name,
        email: auth.user.email,
        password: "",
        id: auth.user._id,
      });
    }
  }, [auth.user]);

  useEffect(() => {
    // Define the async function to fetch data
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/payments");

        setFormData({
          name: response.name,
          email: response.email,
          id: response._id,
          recyclable: response.recyclable,
          bioDegradable: response.bioDegradable,
          NonBioDegradable: response.NonBioDegradable,
          district: response.district,
          totalWeight: response.totalWeight,
          loyalty: response.loyalty,
          price:response.price
          
        });
      } catch (error) {}
    };

    // Call the fetch function
    fetchData();
  }, []);

  const initialOptions = {
    "client-id":
      "AW1TdvpSGbIM5iP4HJNI5TyTmwpY9Gv9dYw8_8yW5lYIbCqf326vrkrp0ce9TAqjEGMHiV3OqJM_aRT0",
    currency: "USD",
    intent: "capture",
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          height: "100vh",
          background: "radial-gradient(circle, #F2F3F4, #E3ECE6, #D5E5D9)",
          fontFamily: "Poppins, sans-serif",
          padding: "20px",
          color: "black",
        }}
      >
        {/* Left Container for Collection Overview */}
        <div
          style={{
            flex: 1,
            padding: "20px",
            borderRight: "1px solid #B0B0B0",
            textAlign: "left",
          }}
        >
          {/* Moved the Collection Overview down slightly */}
          <h5
            style={{
              color: "#1E770F",

              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            Collection Overview
          </h5>

          {/* Collection Items Container: Moved down with marginTop */}
          <div style={{ marginTop: "100px" }}>
            {/* Individual Collection Items */}
            <div style={{ display: "flex", marginBottom: "50px" }}>
              <img
                src={binGreen}
                alt="Recyclable"
                style={{ width: "30px", marginRight: "10px" }}
              />
              <span style={{ flex: 1 }}>Recyclable</span>
              <span>{formData.recyclable}kg</span>
            </div>

            <div style={{ display: "flex", marginBottom: "50px" }}>
              <img
                src={binBlue}
                alt="Bio Degradable"
                style={{ width: "30px", marginRight: "10px" }}
              />
              <span style={{ flex: 1 }}>Bio Degradable</span>
              <span>{formData.bioDegradable}kg</span>
            </div>

            <div style={{ display: "flex" }}>
              <img
                src={binRed}
                alt="Non-Bio Degradable"
                style={{ width: "30px", marginRight: "10px" }}
              />
              <span style={{ flex: 1 }}>Non-Bio Degradable</span>
              <span>{formData.NonBioDegradable}kg</span>
            </div>
          </div>
        </div>

        {/* Right Container for User Details */}
        <div
          style={{
            flex: 1,
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginLeft: "50px", // Add space between left and right sections
          }}
        >
          <div
            style={{
              border: "1px solid #B0B0B0",
              padding: "30px",
              borderRadius: "10px",
              background: "#EFF4EF",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
              minWidth: "400px", // Maintain consistent width for the container
            }}
          >
            <div style={{ marginBottom: "20px" }}>
              <strong>Name:</strong>
              <span style={{ float: "right" }}>{formData.name}</span>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <strong>E-mail Address:</strong>
              <span style={{ float: "right" }}>{formData.email}</span>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <strong>Phone Number:</strong>
              <span style={{ float: "right" }}>+94 76 26 508</span>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <strong>District:</strong>
              <span style={{ float: "right" }}>{formData.district}</span>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <strong>Total Weight of Garbage:</strong>
              <span style={{ float: "right" }}>{formData.totalWeight}kg</span>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <strong>Price (1kg * LKR 20):</strong>
              <span style={{ float: "right" }}>LKR {formData.price}</span>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <strong>Loyalty Points:</strong>
              <span style={{ float: "right" }}>-LKR {formData.loyalty}</span>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <strong>Grand Total:</strong>
              <span style={{ float: "right" }}>LKR {Number(formData.price) -Number(formData.loyalty)}</span>
            </div>
          </div>
          <div style={{ marginTop: "30px" }}>
            <PayPalScriptProvider options={initialOptions}>
              <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value:"80", // Amount to charge
                        },
                      },
                    ],
                  });
                }}
                onApprove={(data, actions) => {
                  return actions.order.capture().then((details) => {
                    alert(
                      `Transaction completed by ${details.payer.name.given_name}`
                    );
                    // Handle post-payment logic, like updating your database
                  });
                }}
                onError={(err) => {
                  console.error("PayPal Checkout Error:", err);
                  // Handle error in transaction
                }}
              />
            </PayPalScriptProvider>
          </div>
        </div>
      </div>
    </>
  );
};

export default PayPalButton;
