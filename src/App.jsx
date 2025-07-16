import React, { useState } from "react"; import html2canvas from "html2canvas"; import "./App.css";

const traits = [ { category: "Appearance", description: "Physical appeal, style, body proportion", traits: [ "Face", "Hair", "Legs", "Body Proportion" ], }, { category: "Personality & Mind", description: "Cognitive ability, humor, empathy, etc.", traits: [ "Intelligence", "Humor", "Confidence", "Empathy / Kindness", "Communication" ], }, { category: "Lifestyle & Values", description: "Drive, responsibility, wellness, hygiene", traits: [ "Ambition / Drive", "Independence / Responsibility", "Mental / Physical Health", "Hygiene" ], }, { category: "Extra +", description: "(quirks, magic, chemistry, mystery, freak factor)", traits: ["Wildcard"] } ];

const tierDescriptions = { Unicorn: [ "Unicorn Tier — This is once in a lifetime.", "Unicorn Tier — The legend is real.", "Unicorn Tier — Marry her yesterday.", "Unicorn Tier — This breaks the simulation.", "Unicorn Tier — Nothing else compares.", "Unicorn Tier — She's what songs are written about." ], Elite: [ "Elite — Practically unfair to the rest.", "Elite — Where has she been all your life?", "Elite — Too good to be true, investigate further." ], Exceptional: [ "Exceptional — You’ll regret letting this go.", "Exceptional — She’s passing with honors.", "Exceptional — A rare gem, lock that down." ], High: [ "High Quality — Built different in all the right ways.", "High Quality — Could be something real.", "High Quality — Serious contender status." ], Average: [ "Average — Could grow into something.", "Average — Some sparks, but not fireworks.", "Average — There’s potential!" ], Rough: [ "Rough — You're dating with beer goggles.", "Rough — That dog ain’t gonna hunt.", "Rough — Proceed at your own risk." ] };

function getTier(score, hasWildcard) { const effectiveScore = score + (hasWildcard ? 10 : 0); if (effectiveScore >= 150) return "Unicorn"; if (effectiveScore >= 140) return "Elite"; if (effectiveScore >= 120) return "Exceptional"; if (effectiveScore >= 90) return "High"; if (effectiveScore >= 50) return "Average"; return "Rough"; }

function App() { const [scores, setScores] = useState({}); const [showResults, setShowResults] = useState(false);

const handleSlider = (trait, value) => { setScores({ ...scores, [trait]: parseInt(value, 10) }); };

const calculateCategoryTotal = (categoryTraits) => categoryTraits.reduce((total, trait) => total + (scores[trait] || 0), 0);

const totalScore = Object.entries(scores) .filter(([key]) => key !== "Wildcard") .reduce((acc, [_, val]) => acc + val, 0);

const hasWildcard = scores["Wildcard"] > 0; const tier = getTier(totalScore, hasWildcard);

return ( <div className="App"> {!showResults ? ( <div> <h1 className="text-4xl font-bold mb-2 text-center">The F.I.N.E. Test</h1> <h2 className="text-cyan-400 text-xl mb-6 text-center"> Figure · Intellect · Nature · Energy </h2> <p className="mb-6 text-sm italic text-center"> Rate each trait to find out how much you really want someone. </p>

{traits.map((group) => (
        <div key={group.category} className="mb-10 px-4">
          <h3 className="text-xl font-semibold mb-1">{group.category}</h3>
          <p className="text-xs italic mb-4">{group.description}</p>
          {group.traits.map((trait) => (
            <div key={trait} className="mb-4">
              <label className="block font-medium mb-1">
                {trait} ({scores[trait] || 0})
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={scores[trait] || 0}
                onChange={(e) => handleSlider(trait, e.target.value)}
                className="w-full slider"
              />
            </div>
          ))}
        </div>
      ))}

      <div className="flex justify-center mb-12">
        <button
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          onClick={() => setShowResults(true)}
        >
          See Results
        </button>
      </div>
    </div>
  ) : (
    <div id="results" className="text-left px-4">
      <h1 className="text-3xl font-bold mb-2 underline text-blue-500 text-center">
        thefinetest.com
      </h1>
      <h2 className="text-xl mb-4 text-center">F.I.N.E. RESULTS</h2>

      {traits.slice(0, 3).map((group) => (
        <div key={group.category} className="mb-3">
          <p>
            <strong>{group.category}:</strong> {calculateCategoryTotal(group.traits)}
          </p>
        </div>
      ))}
      {scores["Wildcard"] > 0 && <p><strong>+ Wildcard Bonus:</strong> {scores["Wildcard"]}</p>}

      <p className="mt-4 text-lg">
        <strong>Total Score:</strong> {totalScore}
      </p>
      <p className="mb-6 text-lg">
        <strong>Tier:</strong> {
          tierDescriptions[tier][
            Math.floor(Math.random() * tierDescriptions[tier].length)
          ]
        }
      </p>

      <div className="flex gap-4 justify-center">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          onClick={() => setShowResults(false)}
        >
          Go Back
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => window.location.reload()}
        >
          Start New Test
        </button>
      </div>
    </div>
  )}
</div>

); }

export default App;

