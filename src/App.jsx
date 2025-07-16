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
    "Unicorn Tier — Literally unbelievable, and yet, here she is.",
    "Unicorn Tier — Statistically impossible. Emotionally undeniable.",
    "Unicorn Tier — Mythical levels of compatibility."
  ],
  Elite: [
    "Elite — Too good to be true, investigate further.",
    "Elite — Where has she been all your life?",
    "Elite — Practically unfair to the rest.",
    "Elite — Couldn’t build her better in a lab.",
    "Elite — Probably has a waitlist.",
    "Elite — You’ll need a strategy and a suit."
  ],
  Exceptional: [
    "Exceptional — A rare gem, lock that down.",
    "Exceptional — She’s passing with honors.",
    "Exceptional — You’ll regret letting this go.",
    "Exceptional — One-of-a-kind personality fusion.",
    "Exceptional — Chemistry and character, check.",
    "Exceptional — Impressively well-rounded."
  ],
  High: [
    "High Quality — Built different in all the right ways.",
    "High Quality — Serious contender status.",
    "High Quality — Could be something real.",
    "High Quality — Strong foundation to build on.",
    "High Quality — You're not settling, you're selecting.",
    "High Quality — Consider this your sleeper pick."
  ],
  Average: [
    "Average — There’s potential!",
    "Average — Could grow into something.",
    "Average — Some sparks, but not fireworks.",
    "Average — Depends on what you’re looking for.",
    "Average — Manage expectations.",
    "Average — Give it a few episodes."
  ],
  Rough: [
    "Rough — Proceed at your own risk.",
    "Rough — That dog ain’t gonna hunt.",
    "Rough — You're dating with beer goggles.",
    "Rough — It’s not looking good, champ.",
    "Rough — Ask yourself: Am I lonely or desperate?",
    "Rough — Respect yourself."
  ]
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
    const slider = document.getElementById(`slider-${trait}`);
    const val = parseInt(value, 10);
    if (slider) {
      const pct = (val / 10) * 100;
      let color = "#555";
      if (val > 0) {
        color = `linear-gradient(90deg, red, yellow ${pct / 2}%, lime ${pct}%, #222 ${pct}%)`;
      }
      slider.style.background = color;
      slider.classList.toggle("hasValue", val > 0);
    }
  };

  const calculateCategoryTotal = (categoryTraits) =>
    categoryTraits.reduce((total, trait) => total + (scores[trait] || 0), 0);

  const totalScore = Object.entries(scores)
    .filter(([key]) => key !== "Wildcard")
    .reduce((acc, [_, val]) => acc + val, 0);

  const hasWildcard = scores["Wildcard"] > 0;
  const tier = getTier(totalScore, hasWildcard);

  return (
    <div className="App">
      {!showResults ? (
        <div>
          <h1>The F.I.N.E. Test</h1>
          <h2>Figure · Intellect · Nature · Energy</h2>
          <p>Rate each trait to find out how much you really want someone.</p>

          {traits.map((group) => (
            <div key={group.category} className="group">
              <h3>{group.category}</h3>
              <p className="text-xs italic mb-2">{group.description}</p>
              {group.traits.map((trait) => (
                <div key={trait} className="mb-4">
                  <label>{trait}</label>
                  <input
                    id={`slider-${trait}`}
                    type="range"
                    min="0"
                    max="10"
                    value={scores[trait] || 0}
                    onChange={(e) => handleSlider(trait, e.target.value)}
                    className={`slider ${scores[trait] ? "hasValue" : ""}`}
                  />
                </div>
              ))}
            </div>
          ))}

          <button
            className="btn newTest"
            onClick={() => setShowResults(true)}
          >
            See Results
          </button>
        </div>
      ) : (
        <div id="results" className="results">
          <h1>F.I.N.E. RESULTS</h1>
          {traits.slice(0, 4).map((group) => {
            const total = calculateCategoryTotal(group.traits);
            const className =
              total >= 40 ? "scoreBlock high" :
              total >= 25 ? "scoreBlock mid" : "scoreBlock low";
            return (
              <div key={group.category} className={className}>
                <span>{group.category}</span>
                <span>{total}</span>
              </div>
            );
          })}

          {scores["Wildcard"] > 0 && (
            <p className="text-sm italic mt-2">+ Wildcard Bonus: {scores["Wildcard"]}</p>
          )}

          <p className="mt-4 text-lg">
            <strong>Total Score: </strong>{totalScore}
          </p>
          <p className="mb-4 text-lg">
            <strong>Tier: </strong>{
              tierDescriptions[tier][
                Math.floor(Math.random() * tierDescriptions[tier].length)
              ]
            }
          </p>

          <div className="flex gap-2">
            <button
              className="btn goBack"
              onClick={() => setShowResults(false)}
            >
              Go Back
            </button>
            <button
              className="btn newTest"
              onClick={() => {
                setScores({});
                setShowResults(false);
              }}
            >
              Start New Test
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
