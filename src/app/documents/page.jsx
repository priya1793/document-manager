"use client";

import Image from "next/image";
import React, { useState, useEffect, useCallback } from "react";

const Documents = () => {
  const [docs, setDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const [docsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const lastDocIndex = currentPage * docsPerPage;
  const firstDocIndex = lastDocIndex - docsPerPage;

  const currentDocs = docs.slice(firstDocIndex, lastDocIndex);

  const pageNumbers = [];
  const totalDocs = docs.length;
  for (let i = 1; i <= Math.ceil(totalDocs / docsPerPage); i++) {
    pageNumbers.push(i);
  }

  const searchFilteredDocs = useCallback(
    (documents) => {
      return documents.filter((doc) =>
        doc.name.toLowerCase().includes(search.toLowerCase())
      );
    },
    [search]
  );

  useEffect(() => {
    const docsList = JSON.parse(localStorage.getItem("documents")) || [];

    if (search === "") {
      setDocs(docsList);
    } else {
      setDocs(searchFilteredDocs(docsList));
    }
  }, [search, searchFilteredDocs]);

  const handleSearch = (e) => {
    setSearch(e.target.value);

    if (search !== "") {
      setDocs(searchFilteredDocs(docs));
    }
  };

  const deleteDocument = (id) => {
    const updatedDocs = docs.filter((doc) => doc.id !== id);
    setDocs(updatedDocs);
    localStorage.setItem("documents", JSON.stringify(updatedDocs));
  };

  const viewDocument = (id) => {
    const doc = docs.find((doc) => doc.id === id);
    setSelectedDoc(doc);
    setShowModal(true);
  };

  return (
    <>
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-1 border-end"></div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search documents..."
              value={search}
              onChange={handleSearch}
            />
          </div>

          <div className="col">
            <h3 className="my-3">Documents List</h3>

            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Owner</th>
                  <th>Created Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentDocs.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No documents found!
                    </td>
                  </tr>
                ) : (
                  currentDocs.map((doc, i) => (
                    <tr key={doc.id}>
                      <td>{doc.name}</td>
                      <td>{doc.type}</td>
                      <td>{doc.creator}</td>
                      <td>{doc.date}</td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => viewDocument(doc.id)}
                        >
                          View
                        </button>
                        <button
                          className="btn btn-danger ms-2"
                          onClick={() => deleteDocument(doc.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="row justify-content-end">
          <nav aria-label="Page navigation example">
            <ul className="pagination">
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(pageNumbers.length)}
                >
                  Previous
                </button>
              </li>

              {pageNumbers.map((page) => (
                <li className="page-item" key={page}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                </li>
              ))}

              <li className="page-item">
                <button
                  className="page-link"
                  href="#"
                  onClick={() => setCurrentPage(1)}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {showModal && (
        <div
          className="modal"
          tabIndex="-1"
          role="dialog"
          style={{
            display: "block",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header d-flex justify-content-between">
                <h5 className="modal-title">{selectedDoc?.name}</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowModal(false)}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body d-flex justify-content-center">
                {selectedDoc && selectedDoc.image && (
                  <Image
                    src={selectedDoc.image}
                    alt="Document"
                    className="img-fluid"
                    width={400}
                    height={300}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Documents;
