import React, { useState } from "react";
import { useNavigate } from "react-router-dom"
const CreateAccount = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [accountType, setAccountType] = useState("savings");
  const [initialDeposit, setInitialDeposit] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/users/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_email: email,
          account_type: accountType,
          initial_deposit: parseFloat(initialDeposit),
        }),
      });

      const data = await response.json();
      if (response.ok) {
         setMessage(`✅ Account created! Account Number: ${data.account_number}`);
         setCreatedAccount(data); 
        alert(`✅ Account created successfully! Account Number: ${data.account_number}`)
        
        navigate("/account")
      } else {
        setError(data.detail || "Failed to create account");
      }
    } catch (err) {
      setError("Server error: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4 text-green-700">🏦 Create New Account</h1>

      <form
        onSubmit={handleCreateAccount}
        className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md"
      >
        <div style={{ marginBottom: "10px" }}>
        <label className="block text-gray-700 font-semibold mb-2">
          Email Address:
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded-md w-full px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Enter your registered email"
          required
        />
       </div>
        <div style={{ marginBottom: "10px" }}>
        <label className="block text-gray-700 font-semibold mb-2">
          Select Account Type:
        </label>
        <select
          value={accountType}
          onChange={(e) => setAccountType(e.target.value)}
          className="border border-gray-300 rounded-md w-full px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="savings">Savings</option>
          <option value="current">Current</option>
          <option value="fd">Fixed Deposit (FD)</option>
        </select>
        </div>
         <div style={{ marginBottom: "10px" }}>
        <label className="block text-gray-700 font-semibold mb-2">
          Initial Deposit (₹):
        </label>
        <input
          type="number"
          value={initialDeposit}
          onChange={(e) => setInitialDeposit(e.target.value)}
          className="border border-gray-300 rounded-md w-full px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Minimum ₹500"
          required
        />
       </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 w-full"
        >
          Create Account
        </button>

      
      </form>
    </div>
  );
};

export default CreateAccount;
