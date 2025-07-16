import React, { useState } from "react";
import html2canvas from "html2canvas";
import "./App.css";

const traitGroups = {
  Figure: [
    { label: "Face", max: 20 },
    { label: "Hair", max: 10 },
    { label: "Legs", max: 10 },
    { label: "Overall", max: 10 },
  ],
  Intellect: [
    { label: "Knowledgeable", max: 15 },
    { label: "Humor", max: 15 },
    { label: "Confidence", max: 10 },
    { label: "Empathy / Kindness", max: 10 },
    { label: "Communication", max: 10 },
  ],
  Nature: [
    { label: "Ambition / Drive", max: 10 },
    { label: "Independence / Responsibility", max: 10 },
    { label: "Mental / Physical Health", max: 10 },
    { label: "Hygiene", max: 10 },
  ],
  "Extra +": [
    { label: "Wildcard", max: 10 },
  ],
};

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
    if (val < 4) return "#e53935";
    if (val < 7) return "#fdd835";
    return "#43a047";
  };

  return (
    <div className="App px-4 md:px-6 lg:px-8 max-w-prose mx-auto">
      {!showResults ? (
        <div className="test-container">
          <h1 className="title">The F.I.N.E. Test</h1>
          <h2 className="subtitle">Figure · Intellect · Nature · Energy</h2>
          <p className="instructions">Rate each trait to find out how much you really want someone.</p>

          {Object.entries(traitGroups).map(([category, traits], i) => (
            <div key={category} className="trait-group mb-6">
              <h3 className={i > 0 ? "mt-8" : ""}>{category}</h3>
              {traits.map(({ label, max }) => (
                <div key={label} className="slider-container">
                  <label>{label} ({scores[label] || 0})</label>
                  <input
                    type="range"
                    min="0"
                    max={max}
                    value={scores[label] || 0}
                    onChange={(e) => handleSlider(label, e.target.value)}
                    className="slider"
                    style={{
                      background: `linear-gradient(to right, ${getColor(scores[label] || 0)} ${(scores[label] || 0) / max * 100}%, #333 ${(scores[label] || 0) / max * 100}%)`
                    }}
                  />
                </div>
              ))}
            </div>
          ))}

          <div className="button-group flex justify-center mt-8">
            <button className="w-40 py-2 text-lg" onClick={() => setShowResults(true)}>See Results</button>
          </div>
        </div>
      ) : (
        <div id="results" className="results">
          <h2>F.I.N.E. RESULTS</h2>
          {Object.entries(traitGroups).filter(([k]) => k !== "Extra +").map(([category, traits]) => (
            <div key={category} className="result-block">
              <p>{category}: <span style={{ color: getColor(calculateCategoryTotal(traits) / traits.length) }}>{calculateCategoryTotal(traits)}</span></p>
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
