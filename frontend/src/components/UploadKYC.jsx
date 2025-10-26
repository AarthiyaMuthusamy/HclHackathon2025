import React, { useState } from "react";

function UploadKYC() {
  const [email, setEmail] = useState("");
  const [kycType, setKycType] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("kyc_document_type", kycType);
    formData.append("file", file);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/users/upload-kyc/username", // replace username
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("KYC Uploaded Successfully!");
    } catch (err) {
      console.error(err);
      alert("Error uploading KYC");
    }
   
  };

  return (
    <div>
      <h2>Upload KYC</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><br /><br />
      <input placeholder="KYC Document Type" value={kycType} onChange={e => setKycType(e.target.value)} /><br /><br />
      <input type="file" onChange={e => setFile(e.target.files[0])} /><br /><br />
      <button onClick={handleUpload}>Upload</button>
      <p>{message}</p>
    </div>
  );
}

export default UploadKYC;
