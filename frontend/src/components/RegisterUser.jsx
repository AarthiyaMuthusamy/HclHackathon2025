import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make sure backend accepts JSON
      const response = await axios.post(
        "http://127.0.0.1:8000/users/register",
        formData
      );
      alert(`User registered successfully: ${response.data.full_name}`);
      navigate("/uploadkyc"); // Go to login page
    } catch (err) {
      console.error(err.response || err);
      alert(
        err.response?.data?.detail || "Error registering user. Check console."
      );
    }
  };

  return (
    <div>
      <h1>Register Users</h1>
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: "10px" }}>
      <input
        type="text"
        name="full_name"
        placeholder="Full Name"
        value={formData.full_name}
        onChange={handleChange}
        required
      />
      </div>
      <div style={{ marginBottom: "10px" }}>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      </div>
      <div style={{ marginBottom: "10px" }}>
      <input
        type="text"
        name="phone_number"
        placeholder="Phone Number"
        value={formData.phone_number}
        onChange={handleChange}
        required
      />
      </div>
      <div style={{ marginBottom: "10px" }}>
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      </div>
      <button type="submit">Register</button>
    </form>
    </div>
  );
}

export default Register;
