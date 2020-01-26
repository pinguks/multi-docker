import React, { useState, useEffect } from "react";
import axios from "axios";

const Fib = () => {
  const [index, setIndex] = useState("");
  const [seenIndexes, setSeenIndexes] = useState([]);
  const [values, setValues] = useState({});

  useEffect(() => {
    fetchValues();
    fetchIndexes();
  }, []);

  const fetchValues = async () => {
    const { data } = await axios.get("/api/values/current");
    setValues(data);
  };

  const fetchIndexes = async () => {
    const { data } = await axios.get("/api/values/all");
    setSeenIndexes(data);
  };

  const renderSeenIndexes = () => {
    return seenIndexes.map(({ number }) => number).join(", ");
  };

  const renderValues = () => {
    const entries = [];

    for (let key in values) {
      entries.push(
        <div key={key}>
          For index {key} I calulated {values[key]}
        </div>
      );
    }

    return entries;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    await axios.post("/api/values", { index });

    setIndex("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Enter your index:</label>
        <input
          value={index}
          type="text"
          onChange={e => setIndex(e.target.value)}
        />
        <button>Submit</button>
      </form>

      <h3>Indexes i have seen:</h3>
      {renderSeenIndexes()}
      <h3>Calculated values:</h3>
      {renderValues()}
    </div>
  );
};

export default Fib;
