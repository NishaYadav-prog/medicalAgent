import { useState } from "react";
import axios from "axios";
import "./App.css";
function App() {
  const [disease, setDisease] = useState("");
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState(null);

  const handleSearch = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/research`,
        {
          disease,
          query,
        },
      );

      setResponse(res.data);
    } catch (error) {
      console.error(error);
      alert("Error fetching data");
    }
  };

  return (
    <div className="container">
      <h1 className="title">🧠 Curalink AI Assistant</h1>

      <div className="input-group">
        <input
          className="input"
          type="text"
          placeholder="Enter Disease"
          value={disease}
          onChange={(e) => setDisease(e.target.value)}
        />

        <input
          className="input"
          type="text"
          placeholder="Enter Query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button className="button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {response && (
        <>
          <div className="card">
            <h2>🧠 AI Response</h2>
            <p>{response.aiResponse}</p>
          </div>

          <div className="card">
            <h2>📚 Articles</h2>
            {response.articles.map((item, index) => (
              <div key={index} className="article-card">
                <strong>{item.title}</strong>
                <p>{item.source}</p>
              </div>
            ))}
          </div>

          <div className="card">
            <h2>🧪 Clinical Trials</h2>
            {response.clinicalTrials.map((trial, index) => (
              <div key={index} className="trial-card">
                <strong>{trial.title}</strong>
                <p>Status: {trial.status}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
export default App;
