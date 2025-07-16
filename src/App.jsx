// App.js
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
  Unicorn: [
    "Unicorn Tier — Marry her immediately.",
    "Unicorn Tier — This is cosmic alignment.",
    "Unicorn Tier — You’re not choosing her, the universe is.",
    "Unicorn Tier — There’s a glitch in the matrix and it’s her.",
    "Unicorn Tier — The gods weep in envy.",
    "Unicorn Tier — Cancel your dating apps forever."
  ],
  Elite: [
    "Elite — Too good to be true, investigate further.",
    "Elite — Where has she been all your life?",
    "Elite — Practically unfair to the rest.",
    "Elite — Probably has a waiting list.",
    "Elite — You’re punching up, buddy.",
    "Elite — Lock in before someone else does."
  ],
  Exceptional: [
    "Exceptional — A rare gem, lock that down.",
    "Exceptional — She’s passing with honors.",
    "Exceptional — You’ll regret letting this go.",
    "Exceptional — Might be the one.",
    "Exceptional — Strong long-term potential.",
    "Exceptional — Built like a rom-com lead."
  ],
  High: [
    "High Quality — Built different in all the right ways.",
    "High Quality — Serious contender status.",
    "High Quality — Could be something real.",
    "High Quality — Definitely worth your time.",
    "High Quality — Hidden gem energy.",
    "High Quality — She’s got the juice."
  ],
  Average: [
    "Average — There’s potential!",
    "Average — Could grow into something.",
    "Average — Some sparks, but not fireworks.",
    "Average — Feels like a warm-up round.",
    "Average — Decent, not unforgettable.",
    "Average — Swipe with cautious optimism."
  ],
  Rough: [
    "Rough — Proceed at your own risk.",
    "Rough — That dog ain’t gonna hunt.",
    "Rough — You're dating with beer goggles.",
    "Rough — May contain emotional turbulence.",
    "Rough — Handle with wine.",
    "Rough — You’re better off solo tonight."
  ],
};

function getTier(score, hasWildcard) {
  const effectiveScore = score + (hasWildcard ? 10 : 0);
  if (effectiveScore >= 150) return "Unicorn";
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

  const getColor = (val) => {
    if (val < 4) return "#e53935"; // red
    if (val < 7) return "#fdd835"; // yellow
    return "#43a047"; // green
  };

  return (
    <div className="App">
      {!showResults ? (
        <div className="test-container">
          <h1 className="title">The F.I.N.E. Test</h1>
          <h2 className="subtitle">Figure · Intellect · Nature · Energy</h2>
          <p className="instructions">Rate each trait to find out how much you really want someone.</p>

          {traits.map((group) => (
            <div key={group.category} className="trait-group">
              <h3>{group.category}</h3>
              <p className="trait-description">{group.description}</p>
              {group.traits.map((trait) => (
                <div key={trait} className="slider-container">
                  <label>{trait} ({scores[trait] || 0})</label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={scores[trait] || 0}
                    onChange={(e) => handleSlider(trait, e.target.value)}
                    style={{
                      background: `linear-gradient(to right, ${getColor(scores[trait] || 0)} ${(scores[trait] || 0) * 10}%, #333 ${(scores[trait] || 0) * 10}%)`
                    }}
                  />
                </div>
              ))}
            </div>
          ))}

          <div className="button-group">
            <button onClick={() => setShowResults(true)}>See Results</button>
          </div>
        </div>
      ) : (
        <div id="results" className="results">
          <h2>F.I.N.E. RESULTS</h2>
          {traits.slice(0, 4).map((group) => (
            <div key={group.category} className="result-block">
              <p>{group.category}: <span style={{ color: getColor(calculateCategoryTotal(group.traits) / group.traits.length) }}>{calculateCategoryTotal(group.traits)}</span></p>
            </div>
          ))}
          {hasWildcard && <p>+ Wildcard Bonus: {scores["Wildcard"]}</p>}

          <p className="total-score">Total Score: {totalScore}</p>
          <p className="tier">{tierDescriptions[tier][Math.floor(Math.random() * tierDescriptions[tier].length)]}</p>

          <div className="button-group">
            <button onClick={() => setShowResults(false)}>Go Back</button>
            <button onClick={() => {
              setScores({});
              setShowResults(false);
            }}>Start New Test</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
