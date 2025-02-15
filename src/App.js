import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [presentationName, setPresentationName] = useState("");
  const [file, setFile] = useState(null);
  const [fetchedPresentation, setFetchedPresentation] = useState(null);
  const [newQuestions, setNewQuestions] = useState([]);

  // Handle file upload
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle presentation name input
  const handleNameChange = (e) => {
    setPresentationName(e.target.value);
  };

  // Upload a new presentation
  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", presentationName);

    try {
      const response = await axios.post("http://localhost:8080/presentations/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Presentation uploaded successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error uploading presentation:", error);
      alert("Failed to upload presentation.");
    }
  };

  // Fetch a presentation by name
  const handleFetchPresentation = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/presentations/${presentationName}`);
      console.log("this is response", response);
      setFetchedPresentation(response.data);
      setNewQuestions(response.data.slides.map((slide) => slide.questions || []));
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching presentation:", error);
      alert("Presentation not found.");
    }
  };

  // Handle adding a question to a slide
  const handleAddQuestion = (slideIndex, question) => {
    const updatedQuestions = [...newQuestions];
    updatedQuestions[slideIndex] = [...updatedQuestions[slideIndex], question];
    setNewQuestions(updatedQuestions);
  };

  // Handle removing a question from a slide
  const handleRemoveQuestion = (slideIndex, questionIndex) => {
    const updatedQuestions = [...newQuestions];
    updatedQuestions[slideIndex].splice(questionIndex, 1);
    setNewQuestions(updatedQuestions);
  };

  // Update questions for a presentation
  const handleUpdateQuestions = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8080/presentations/${presentationName}/questions`,
        newQuestions
      );
      alert("Questions updated successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error updating questions:", error);
      alert("Failed to update questions.");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Vr Classroom Web Tool</h1>

      {/* Upload Section */}
      <div className="card mb-4">
        <div className="card-body">
          <h2>Upload Presentation</h2>
          <div className="mb-3">
            <label htmlFor="presentationName" className="form-label">
              Presentation Name:
            </label>
            <input
              type="text"
              className="form-control"
              id="presentationName"
              value={presentationName}
              onChange={handleNameChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="file" className="form-label">
              Choose PPTX File:
            </label>
            <input
              type="file"
              className="form-control"
              id="file"
              accept=".pptx"
              onChange={handleFileChange}
            />
          </div>
          <button className="btn btn-primary" onClick={handleUpload}>
            Upload
          </button>
        </div>
      </div>

      {/* Fetch and Manage Questions Section */}
      <div className="card">
        <div className="card-body">
          <h2>Manage Presentation Questions</h2>
          <div className="mb-3">
            <label htmlFor="fetchPresentationName" className="form-label">
              Enter Presentation Name:
            </label>
            <input
              type="text"
              className="form-control"
              id="fetchPresentationName"
              value={presentationName}
              onChange={handleNameChange}
            />
          </div>
          <button className="btn btn-secondary mb-3" onClick={handleFetchPresentation}>
            Fetch Presentation
          </button>

          {fetchedPresentation && (
            <div>
              <h3>Slides:</h3>
              {fetchedPresentation.slides.map((slide, slideIndex) => (
                <div key={slide.id} className="mb-4">
                  <h4>Slide {slide.index + 1}</h4>
                  <img
                    src={`data:image/png;base64,${slide.data}`}
                    alt={`Slide ${slide.index + 1}`}
                    className="img-fluid mb-2"
                  />
                  <h5>Questions:</h5>
                  <ul className="list-group mb-2">
                    {newQuestions[slideIndex].map((question, questionIndex) => (
                      <li key={questionIndex} className="list-group-item d-flex justify-content-between align-items-center">
                        {question}
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemoveQuestion(slideIndex, questionIndex)}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Add a question"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleAddQuestion(slideIndex, e.target.value);
                          e.target.value = "";
                        }
                      }}
                    />
                  </div>
                </div>
              ))}
              <button className="btn btn-success" onClick={handleUpdateQuestions}>
                Save Questions
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;