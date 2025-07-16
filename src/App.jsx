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

  const handleExport = () => {
    const element = document.getElementById("results");
    html2canvas(element).then((canvas) => {
      const link = document.createElement("a");
      link.download = "fine_results.webp";
      link.href = canvas.toDataURL("image/webp");
      link.click();
    });
  };

  const totalScore = Object.entries(scores)
    .filter(([key]) => key !== "Wildcard")
    .reduce((acc, [_, val]) => acc + val, 0);

  const hasWildcard = scores["Wildcard"] > 0;
  const tier = getTier(totalScore, hasWildcard);

  return (
    <div className="App" style={{ backgroundColor: "#1e1e2f", color: "white", minHeight: "100vh", padding: "1rem" }}>
      {!showResults ? (
        <div>
          <h1 className="text-4xl font-bold mb-2">The F.I.N.E. Test</h1>
          <h2 className="text-cyan-400 text-xl mb-6">Figure · Intellect · Nature · Energy</h2>
          <p className="mb-6 text-sm italic">Rate each trait to find out how much you really want someone.</p>

          {traits.map((group) => (
            <div key={group.category} className="mb-6">
              <h3 className="text-xl font-semibold">{group.category}</h3>
              <p className="text-xs italic mb-2">{group.description}</p>
              {group.traits.map((trait) => (
                <div key={trait} className="mb-4">
                  <label className="block font-medium">{trait}</label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={scores[trait] || 0}
                    onChange={(e) => handleSlider(trait, e.target.value)}
                    className="custom-slider"
                  />
                </div>
              ))}
            </div>
          ))}

          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={() => setShowResults(true)}
          >
            See Results
          </button>
        </div>
      ) : (
        <div id="results" className="text-left">
          <h1 className="text-4xl font-bold mb-2 underline text-blue-400">
            <a href="/">fine-test.com</a>
          </h1>
          <h2 className="text-xl mb-4">F.I.N.E. RESULTS</h2>
          {traits.slice(0, 4).map((group) => (
            <p key={group.category}>
              {group.category}: {calculateCategoryTotal(group.traits)}
            </p>
          ))}
          {scores["Wildcard"] > 0 && <p>+ Wildcard Bonus: {scores["Wildcard"]}</p>}

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
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              onClick={handleExport}
            >
              Share / Download
            </button>
            <button
              className="bg-gray-400 text-black px-3 py-1 rounded hover:bg-gray-500"
              onClick={() => setShowResults(false)}
            >
              Adjust / Retake
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;