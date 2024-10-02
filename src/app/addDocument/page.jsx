"use client";

import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const AddDocument = () => {
  const [docName, setDocName] = useState("");
  const [docDesc, setDocDesc] = useState("");
  const [docImg, setDocImg] = useState("");
  const [docType, setDocType] = useState("");
  const [creator, setCreator] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setDocImg(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const addDocument = (e) => {
    e.preventDefault();

    if (!docName.trim() || !docDesc.trim() || !docImg) {
      toast.error("Please fill all the fields!");
      return;
    }

    const currentDate = new Date().toLocaleDateString();
    const oldDocs = JSON.parse(localStorage.getItem("documents")) || [];

    const newDoc = {
      id: Date.now(),
      name: docName,
      desc: docDesc,
      type: docType,
      creator,
      image: docImg,
      date: currentDate,
    };

    const updatedDocs = [...oldDocs, newDoc];
    localStorage.setItem("documents", JSON.stringify(updatedDocs));
    setDocName("");
    setDocDesc("");
    setDocImg("");
    setDocType("");
    setCreator("");
    toast.success("New Document created successfully!");
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-3">Add a new document</h2>
      <form>
        <div className="form-group">
          <label htmlFor="docName" className="form-label">
            Document Name
          </label>
          <input
            type="text"
            className="form-control"
            id="docName"
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
          />
        </div>

        <div className="form-group mt-2">
          <label htmlFor="docType" className="form-label">
            Document Type
          </label>
          <input
            type="text"
            className="form-control"
            id="docType"
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
          />
        </div>

        <div className="form-group mt-2">
          <label htmlFor="creator" className="form-label">
            Document Creator
          </label>
          <input
            type="text"
            className="form-control"
            id="creator"
            value={creator}
            onChange={(e) => setCreator(e.target.value)}
          />
        </div>

        <div className="form-group mt-2">
          <label htmlFor="docDescription" className="form-label mt-3">
            Description
          </label>
          <textarea
            className="form-control"
            id="docDescription"
            value={docDesc}
            onChange={(e) => setDocDesc(e.target.value)}
          />
        </div>

        <div className="form-group mt-2">
          <label htmlFor="docImg" className="form-label mt-3">
            Select Image
          </label>
          <input
            type="file"
            className="form-control"
            id="docImg"
            onChange={handleImageChange}
          />
        </div>

        <button className="btn btn-primary mt-3" onClick={addDocument}>
          Add Document
        </button>

        <ToastContainer />
      </form>
    </div>
  );
};

export default AddDocument;
