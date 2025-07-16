// App.jsx import React, { useState } from "react"; import html2canvas from "html2canvas"; import "./App.css";

/* ---------- Trait data ---------- */ const traitGroups = { Appearance: [ { label: "Face", max: 20 }, { label: "Hair", max: 10 }, { label: "Legs", max: 10 }, { label: "Body Proportion", max: 10 }, ], "Personality & Mind": [ { label: "Intelligence", max: 15 }, { label: "Humor", max: 15 }, { label: "Confidence", max: 10 }, { label: "Empathy / Kindness", max: 10 }, { label: "Communication", max: 10 }, ], "Lifestyle & Values": [ { label: "Ambition / Drive", max: 10 }, { label: "Independence / Responsibility", max: 10 }, { label: "Mental / Physical Health", max: 10 }, { label: "Hygiene", max: 10 }, ], Extra: [ { label: "Wildcard", max: 10 }, ], };

const tierDescriptions = { Unicorn: [ "Unicorn — Marry her immediately.", "Unicorn — This is cosmic alignment.", "Unicorn — You’re not choosing her, the universe is.", "Unicorn — Literally once in a lifetime.", "Unicorn — A fantasy turned real.", "Unicorn — You hit the cosmic jackpot." ], Elite: [ "Elite — Too good to be true, investigate further.", "Elite — Where has she been all your life?", "Elite — Practically unfair to the rest.", "Elite — Top 1%, no notes.", "Elite — The gold standard.", "Elite — Near flawless."
], Exceptional: [ "Exceptional — A rare gem, lock that down.", "Exceptional — She’s passing with honors.", "Exceptional — You’ll regret letting this go.", "Exceptional — Premium partner material.", "Exceptional — Worth the effort.", "Exceptional — She’s the exception, not the rule." ], High: [ "High Quality — Built different in all the right ways.", "High Quality — Serious contender status.", "High Quality — Could be something real.", "High Quality — Solid and steady.", "High Quality — Would recommend.", "High Quality — Better than most." ], Average: [ "Average — There’s potential!", "Average — Could grow into something.", "Average — Some sparks, but not fireworks.", "Average — Hit or miss.", "Average — Room for growth.", "Average — Not bad, not amazing." ], Rough: [ "Rough — Proceed at your own risk.", "Rough — That dog ain’t gonna hunt.", "Rough — You're dating with beer goggles.", "Rough — Red flags meet caution tape.", "Rough — Not for the faint of heart.", "Rough — Might be a growth experience."
]
};

function getTier(score, hasWildcard) { const effectiveScore = score + (hasWildcard ? 10 : 0); if (effectiveScore >= 150) return "Unicorn"; if (effectiveScore >= 140) return "Elite"; if (effectiveScore >= 120) return "Exceptional"; if (effectiveScore >= 90) return "High"; if (effectiveScore >= 50) return "Average"; return "Rough"; }

function App() { const [scores, setScores] = useState({}); const [showResults, setShowResults] = useState(false);

const handleSlider = (label, value) => { setScores({ ...scores, [label]: parseInt(value, 10) }); };

const calculateCategoryTotal = (group) => group.reduce((sum, trait) => sum + (scores[trait.label] || 0), 0);

const totalScore = Object.entries(scores) .filter(([label]) => label !== "Wildcard") .reduce((sum, [, value]) => sum + value, 0);

const hasWildcard = scores["Wildcard"] > 0; const tier = getTier(totalScore, hasWildcard);

return ( <div className="container"> {!showResults ? ( <div className="form"> <h1 className="title">The F.I.N.E. Test</h1> <h2 className="subtitle">Figure · Intellect · Nature · Energy</h2> <p className="instruction">Rate each trait to find out how much you really want someone.</p>

{Object.entries(traitGroups).map(([group, traits]) => (
        <div className="group" key={group}>
          <h3 className="group-title">{group}</h3>
          {traits.map((trait, index) => (
            <div className="trait" key={trait.label}>
              <label>{trait.label}</label>
              <input
                type="range"
                min="0"
                max={trait.max}
                step="1"
                value={scores[trait.label] || 0}
                onChange={(e) => handleSlider(trait.label, e.target.value)}
                className="slider"
              />
              <span className="slider-value">{scores[trait.label] || 0}</span>
            </div>
          ))}
        </div>
      ))}

      <button className="submit-btn" onClick={() => setShowResults(true)}>
        See Results
      </button>
    </div>
  ) : (
    <div className="results">
      <h1 className="title">thefinetest.com</h1>
      <h2 className="subtitle">F.I.N.E. RESULTS</h2>

      {Object.entries(traitGroups).map(([group, traits]) => {
        if (group === "Extra") return null;
        const total = calculateCategoryTotal(traits);
        let color = total >= 40 ? "green" : total >= 25 ? "yellow" : "red";
        return (
          <div className="result-block" key={group} style={{ borderLeft: `4px solid ${color}` }}>
            <strong>{group}</strong>: {total}
          </div>
        );
      })}

      {hasWildcard && (
        <p className="wildcard">+ Wildcard Bonus: {scores["Wildcard"]}</p>
      )}

      <p className="final-score">Total Score: {totalScore}</p>
      <p className="final-tier">
        Tier: {tierDescriptions[tier][Math.floor(Math.random() * tierDescriptions[tier].length)]}
      </p>

      <div className="result-buttons">
        <button onClick={() => setShowResults(false)}>Go Back</button>
        <button onClick={() => window.location.reload()}>Start New Test</button>
      </div>
    </div>
  )}
</div>

); }

export default App;

