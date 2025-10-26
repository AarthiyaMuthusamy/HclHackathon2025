import React, { useState } from "react";

const AccountDetails = () => {
  const [account_number, setAccountNumber] = useState("");
  const [accountData, setAccountData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!account_number.trim()) {
      setError("Please enter an account number");
      setAccountData(null);
      return;
    }

    setLoading(true);
    setError("");
    setAccountData(null);

    try {
      const res = await fetch(`http://127.0.0.1:8000/users/account/${account_number}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Account not found");
      }

      setAccountData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">🔍 Account Lookup</h1>

      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md">
        <label className="block text-gray-700 font-semibold mb-2">
          Enter Account Number:
        </label>

        <input
          type="text"
          value={account_number}
          onChange={(e) => setAccountNumber(e.target.value)}
          className="border border-gray-300 rounded-md w-full px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="e.g., 0338956461"
        />

        <button
          onClick={handleSearch}
          disabled={loading}
          className={`${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          } text-white px-4 py-2 rounded-md w-full`}
        >
          {loading ? "Searching..." : "Search"}
        </button>

        {error && <p className="text-red-500 mt-3 text-center">{error}</p>}

        {accountData && (
  <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-sm">
    <h2 className="text-lg font-bold mb-2 text-gray-700">Account Details</h2>
    <p><strong>Account Number:</strong> {accountData.account_number}</p>
    <p><strong>Account Type:</strong> {accountData.account_type?.toUpperCase()}</p>
    <p><strong>Email:</strong> {accountData.user_email}</p>
    <p><strong>Balance:</strong> ₹{accountData.balance}</p>
    <p><strong>Created At:</strong> {new Date(accountData.created_at).toLocaleString()}</p>
  </div>
)}
      </div>
    </div>
  );
};

export default AccountDetails;
