// App.jsx
import React, { useState } from "react";
import html2canvas from "html2canvas";
import "./App.css";

const traits = [
  {
    category: "Figure",
    description: "Physical appearance, attraction, style, health",
    traits: ["Face", "Body", "Style", "Hygiene", "Health"],
  },
  {
    category: "Intellect",
    description: "Cognitive ability, curiosity, humor, interests",
    traits: ["Curiosity", "Creativity", "Humor", "Interests", "Logic"],
  },
  {
    category: "Nature",
    description: "Personality, behavior, character, stability",
    traits: ["Kindness", "Patience", "Drive", "Stability", "Temper"],
  },
  {
    category: "Energy",
    description: "Lifestyle, goals, spirituality, ambition",
    traits: ["Ambition", "Spirituality", "Goals", "Lifestyle", "Values"],
  },
  {
    category: "Extra +",
    description: "(quirks, magic, chemistry, mystery, freak factor)",
    traits: ["Wildcard"],
  },
];

const tierDescriptions = {
  God: [
    "God Tier — Marry her immediately.",
    "God Tier — This is cosmic alignment.",
    "God Tier — You’re not choosing her, the universe is.",
  ],
  Elite: [
    "Elite — Too good to be true, investigate further.",
    "Elite — Where has she been all your life?",
    "Elite — Practically unfair to the rest.",
  ],
  Exceptional: [
    "Exceptional — A rare gem, lock that down.",
    "Exceptional — She’s passing with honors.",
    "Exceptional — You’ll regret letting this go.",
  ],
  High: [
    "High Quality — Built different in all the right ways.",
    "High Quality — Serious contender status.",
    "High Quality — Could be something real.",
  ],
  Average: [
    "Average — There’s potential!",
    "Average — Could grow into something.",
    "Average — Some sparks, but not fireworks.",
  ],
  Rough: [
    "Rough — Proceed at your own risk.",
    "Rough — That dog ain’t gonna hunt.",
    "Rough — You're dating with beer goggles.",
  ],
};

function getTier(score, hasWildcard) {
  const effectiveScore = score + (hasWildcard ? 10 : 0);
  if (effectiveScore >= 150) return "God";
  if (effectiveScore >= 140) return "Elite";
  if (effectiveScore >= 120) return "Exceptional";
  if (effectiveScore >= 90) return "High";
  if (effectiveScore >= 50) return "Average";
  return "Rough";
}

function App() {
  const [scores, setScores] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleSlider = (trait, value) => {
    setScores({ ...scores, [trait]: parseInt(value, 10) });
  };

  const calculateCategoryTotal = (categoryTraits) =>
    categoryTraits.reduce((total, trait) => total + (scores[trait] || 0), 0);

  const totalScore = Object.entries(scores)
    .filter(([key]) => key !== "Wildcard")
    .reduce((acc, [_, val]) => acc + val, 0);

  const hasWildcard = scores["Wildcard"] > 0;
  const tier = getTier(totalScore, hasWildcard);

  const resetTest = () => {
    setScores({});
    setShowResults(false);
  };

  return (
    <div className="App">
      {!showResults ? (
        <div className="header-section">
          <h1 className="title">The F.I.N.E. Test</h1>
          <h2 className="subtitle">Figure · Intellect · Nature · Energy</h2>
          <p className="tagline">Rate each trait to find out how much you really want someone.</p>

          {traits.map((group) => (
            <div key={group.category} className="category-block">
              <h3>{group.category}</h3>
              <p className="description">{group.description}</p>
              {group.traits.map((trait) => (
                <div key={trait} className="trait-slider">
                  <label>{trait}</label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={scores[trait] || 0}
                    onChange={(e) => handleSlider(trait, e.target.value)}
                    className="slider"
                  />
                </div>
              ))}
            </div>
          ))}

          <button className="submit-btn" onClick={() => setShowResults(true)}>
            See Results
          </button>
        </div>
      ) : (
        <div id="results" className="results">
          <h1 className="site-name">
            <a href="/">thefinetest.com</a>
          </h1>
          <h2 className="results-header">F.I.N.E. RESULTS</h2>
          {traits.slice(0, 4).map((group) => (
            <div
              key={group.category}
              className={`result-block score-${calculateCategoryTotal(group.traits)}`}
            >
              <strong>{group.category}</strong>: {calculateCategoryTotal(group.traits)}
            </div>
          ))}
          {hasWildcard && <p className="wildcard-bonus">+ Wildcard Bonus: {scores["Wildcard"]}</p>}

          <p className="total-score">
            <strong>Total Score:</strong> {totalScore}
          </p>
          <p className="tier-description">
            <strong>Tier:</strong> {
              tierDescriptions[tier][
                Math.floor(Math.random() * tierDescriptions[tier].length)
              ]
            }
          </p>

          <div className="button-group">
            <button className="back-btn" onClick={() => setShowResults(false)}>
              Go Back
            </button>
            <button className="reset-btn" onClick={resetTest}>
              Start New Test
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;