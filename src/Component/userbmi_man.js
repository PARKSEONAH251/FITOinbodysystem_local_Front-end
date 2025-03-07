import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bf, setBf] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Height: ${height}, Weight: ${weight}, BF%: ${bf}`);
  };

  return (
    <div className="container">
      <header className="header">
        <h1>FitEnd</h1>
      </header>
      <main>
        <h2>MAN BMI INPUT</h2>
        <form onSubmit={handleSubmit} className="form">
          <div className="input-group">
            <label htmlFor="height">Height</label>
            <input
              type="number"
              id="height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Value"
            />
          </div>
          <div className="input-group">
            <label htmlFor="weight">Weight</label>
            <input
              type="number"
              id="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Value"
            />
          </div>
          <div className="input-group">
            <label htmlFor="bf">BF%</label>
            <input
              type="number"
              id="bf"
              value={bf}
              onChange={(e) => setBf(e.target.value)}
              placeholder="Value"
            />
          </div>
          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
      </main>
      <footer className="footer">
        <div className="footer-icons">
          <div>Home</div>
          <div>Repair</div>
          <div>Graph</div>
          <div>Communication</div>
          <div>Food</div>
        </div>
      </footer>
    </div>
  );
};

export default App;
