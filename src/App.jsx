// App.jsx import React, { useState } from "react"; import html2canvas from "html2canvas"; import "./App.css";

const traitGroups = { Appearance: [ { label: "Face", max: 20 }, { label: "Hair", max: 10 }, { label: "Legs", max: 10 }, { label: "Body Proportion", max: 10 }, ], "Personality & Mind": [ { label: "Intelligence", max: 15 }, { label: "Humor", max: 15 }, { label: "Confidence", max: 10 }, { label: "Empathy / Kindness", max: 10 }, { label: "Communication", max: 10 }, ], "Lifestyle & Values": [ { label: "Ambition / Drive", max: 10 }, { label: "Independence / Responsibility", max: 10 }, { label: "Mental / Physical Health", max: 10 }, { label: "Hygiene", max: 10 }, ], Extra: [ { label: "Wildcard", max: 10 }, ], };

const tierDescriptions = { Unicorn: [ "Unicorn — Marry her immediately.", "Unicorn — This is cosmic alignment.", "Unicorn — You’re not choosing her, the universe is.", "Unicorn — A fantasy come to life.", "Unicorn — Literal perfection, suspiciously so.", "Unicorn — Reality may not deserve this person." ], Elite: [ "Elite — Too good to be true, investigate further.", "Elite — Where has she been all your life?", "Elite — Practically unfair to the rest.", "Elite — High stats across the board.", "Elite — Makes others look like side quests." ], Exceptional: [ "Exceptional — A rare gem, lock that down.", "Exceptional — She’s passing with honors.", "Exceptional — You’ll regret letting this go.", "Exceptional — Top-tier potential.", "Exceptional — Great ROI emotionally." ], High: [ "High Quality — Built different in all the right ways.", "High Quality — Serious contender status.", "High Quality — Could be something real.", "High Quality — Not perfect, but very strong.", "High Quality — Easy to build with." ], Average: [ "Average — There’s potential!", "Average — Could grow into something.", "Average — Some sparks, but not fireworks.", "Average — Mixed bag, proceed wisely.", "Average — Room for development." ], Rough: [ "Rough — Proceed at your own risk.", "Rough — That dog ain’t gonna hunt.", "Rough — You're dating with beer goggles.", "Rough — The bar is underground.", "Rough — For educational purposes only." ] };

function getTier(score, hasWildcard) { const effectiveScore = score + (hasWildcard ? 10 : 0); if (effectiveScore >= 150) return "Unicorn"; if (effectiveScore >= 140) return "Elite"; if (effectiveScore >= 120) return "Exceptional"; if (effectiveScore >= 90) return "High"; if (effectiveScore >= 50) return "Average"; return "Rough"; }

export default function App() { const [scores, setScores] = useState({}); const [showResults, setShowResults] = useState(false);

const handleSlider = (trait, value) => { setScores({ ...scores, [trait]: parseInt(value, 10) }); };

const calculateTotal = (group) => group.reduce((sum, trait) => sum + (scores[trait.label] || 0), 0);

const hasWildcard = scores["Wildcard"] > 0; const totalScore = Object.entries(scores) .filter(([key]) => key !== "Wildcard") .reduce((acc, [_, val]) => acc + val, 0); const tier = getTier(totalScore, hasWildcard);

return ( <div className="app-container"> {!showResults ? ( <div className="form-wrapper"> <h1 className="main-title">The F.I.N.E. Test</h1> <h2 className="subtitle">Figure · Intelligence · Nature · Energy</h2> <p className="intro">Rate each trait to find out how much you really want someone.</p>

{Object.entries(traitGroups).map(([groupName, traits]) => (
        <div key={groupName} className="trait-group">
          <h3 className="group-title">{groupName}</h3>
          {traits.map(({ label, max }) => (
            <div key={label} className="slider-wrapper">
              <div className="slider-label-row">
                <label>{label}</label>
                <span className="slider-value">{scores[label] || 0}/{max}</span>
              </div>
              <input
                type="range"
                min="0"
                max={max}
                step="1"
                value={scores[label] || 0}
                onChange={(e) => handleSlider(label, e.target.value)}
                className="trait-slider"
              />
            </div>
          ))}
        </div>
      ))}

      <div className="button-wrapper">
        <button className="submit-button" onClick={() => setShowResults(true)}>
          See Results
        </button>
      </div>
    </div>
  ) : (
    <div className="results-wrapper">
      <h1 className="results-title">thefinetest.com</h1>
      <h2 className="results-sub">F.I.N.E. RESULTS</h2>

      {Object.entries(traitGroups).map(([groupName, traits]) => (
        groupName !== "Extra" && (
          <div key={groupName} className="result-block">
            <strong>{groupName}:</strong> {calculateTotal(traits)}
          </div>
        )
      ))}
      {hasWildcard && (
        <div className="result-block">
          + Wildcard Bonus: {scores["Wildcard"]}
        </div>
      )}

      <div className="total-score">Total Score: {totalScore}</div>
      <div className="tier-result">{
        tierDescriptions[tier][
          Math.floor(Math.random() * tierDescriptions[tier].length)
        ]
      }</div>

      <div className="results-buttons">
        <button onClick={() => setShowResults(false)}>Go Back</button>
        <button onClick={() => setScores({})}>Start New Test</button>
      </div>
    </div>
  )}
</div>

); }

