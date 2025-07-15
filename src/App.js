import { useState } from "react";
import "./index.css";

const traitGroups = {
  "Figure (Appearance)": [
    { label: "Face", max: 20 },
    { label: "Hair", max: 10 },
    { label: "Legs", max: 10 },
    { label: "Body Proportion", max: 10 }
  ],
  "Intellect (Personality & Mind)": [
    { label: "Intelligence", max: 15 },
    { label: "Humor", max: 15 },
    { label: "Confidence", max: 10 },
    { label: "Empathy / Kindness", max: 10 },
    { label: "Communication", max: 10 }
  ],
  "Nature (Lifestyle & Values)": [
    { label: "Ambition / Drive", max: 10 },
    { label: "Independence / Responsibility", max: 10 },
    { label: "Mental / Physical Health", max: 10 },
    { label: "Hygiene", max: 10 }
  ],
  "Extra": [
    { label: "Wildcard Bonus (quirks, magic, chemistry, mystery, freak factor)", max: 25 }
  ]
};

const mainTraits = Object.values(traitGroups).flat().slice(0, -1); // All except wildcard
const wildcardTrait = Object.values(traitGroups).flat().slice(-1); // Just wildcard
const allTraits = [...mainTraits, ...wildcardTrait];

function getTier(score) {
  if (score >= 150) return "God Tier — Marry her immediately.";
  if (score >= 140) return "Elite — Too good to be true, investigate further.";
  if (score >= 120) return "Exceptional — A rare gem, lock that down.";
  if (score >= 90) return "High Quality — Built different in all the right ways.";
  if (score >= 50) return "Average — There’s potential!";
  return "Rough — Probably not the one for you.";
}

export default function App() {
  const [scores, setScores] = useState(Array(allTraits.length).fill(0));

  const mainTotal = scores.slice(0, mainTraits.length).reduce((sum, val) => sum + Number(val), 0);
  const wildcardTotal = scores[allTraits.length - 1];
  const tier = getTier(mainTotal);

  const handleChange = (index, value) => {
    const updated = [...scores];
    updated[index] = value;
    setScores(updated);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4 font-sans">
      <h1 className="text-4xl font-extrabold text-center mb-2">The F.I.N.E. Test</h1>
      <p className="text-center text-cyan-300 text-lg mb-1">
        (Figure, Intellect, Nature, Extra)
      </p>
      <p className="text-center text-gray-300 mb-8">
        Rate each trait to find out how much you really want someone.
      </p>
      <hr className="border-gray-700 mb-6" />

      {Object.entries(traitGroups).map(([groupName, traits], groupIndex) => (
        <div key={groupName} className="mb-8">
          <h2 className="text-xl font-semibold text-cyan-400 mb-4">{groupName}</h2>
          {traits.map((trait, index) => {
            const globalIndex = Object.values(traitGroups).slice(0, groupIndex).flat().length + index;
            const value = scores[globalIndex];
            const max = trait.max;
            const percentage = (value / max) * 100;
            let color;

            if (percentage <= 20) color = "red";
            else if (percentage <= 50) color = "yellow";
            else color = "green";

            const style = {
              background: `linear-gradient(to right, ${
                color === "red"
                  ? "#f87171"
                  : color === "yellow"
                  ? "#facc15"
                  : "#4ade80"
              } ${percentage}%, #1f2937 ${percentage}%)`
            };

            return (
              <div key={trait.label} className="mb-4">
                <label className="block text-sm font-medium text-white mb-1">
                  {trait.label} ({value}/{max})
                </label>
                <input
                  type="range"
                  min="0"
                  max={max}
                  value={value}
                  onChange={(e) => handleChange(globalIndex, e.target.value)}
                  className="w-full h-2 rounded-full appearance-none"
                  style={style}
                />
              </div>
            );
          })}
        </div>
      ))}

      <hr className="border-gray-700 my-6" />
      <h2 className="text-2xl font-bold text-center">
        Main Score: {mainTotal} / 150
      </h2>
      <h3 className="text-xl text-center text-cyan-300 mt-2">Tier: {tier}</h3>
      <p className="text-center text-sm text-gray-400 mt-1">
        +{wildcardTotal} Extra Credit from Wildcard
      </p>
    </div>
  );
}