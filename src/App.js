import { useState } from "react";
import "./index.css";

const traitGroups = {
  "Appearance": [
    { label: "Face", max: 20 },
    { label: "Hair", max: 10 },
    { label: "Legs", max: 10 },
    { label: "Body Proportion", max: 10 }
  ],
  "Personality & Mind": [
    { label: "Intelligence", max: 15 },
    { label: "Humor", max: 15 },
    { label: "Confidence", max: 10 },
    { label: "Empathy / Kindness", max: 10 },
    { label: "Communication", max: 10 }
  ],
  "Lifestyle & Values": [
    { label: "Ambition / Drive", max: 10 },
    { label: "Independence / Responsibility", max: 10 },
    { label: "Mental / Physical Health", max: 10 },
    { label: "Hygiene", max: 10 },
    { label: "Wildcard Bonus", max: 25 }
  ]
};

const allTraits = Object.values(traitGroups).flat();

function getTier(score) {
  if (score >= 150) return "God Tier — You’re legally required to fall in love";
  if (score >= 140) return "Elite — Marry them yesterday";
  if (score >= 120) return "Exceptional — A rare gem";
  if (score >= 90) return "High Quality — Built different in all the right ways";
  if (score >= 50) return "Average — There’s potential!";
  return "Rough Draft — Needs DLCs and a patch update";
}

export default function App() {
  const [scores, setScores] = useState(Array(allTraits.length).fill(0));
  const total = scores.reduce((sum, val) => sum + Number(val), 0);
  const tier = getTier(total);

  const handleChange = (index, value) => {
    const updated = [...scores];
    updated[index] = value;
    setScores(updated);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4 font-sans">
      <h1 className="text-3xl font-bold text-center">The FINE Test</h1>
      <p className="text-center text-gray-300 mb-8">Rate each trait to calculate your score and tier.</p>
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
                color === "red" ? "#f87171" : color === "yellow" ? "#facc15" : "#4ade80"
              } ${percentage}%, #1f2937 ${percentage}%)`,
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
      <h2 className="text-2xl font-bold text-center">Total Score: {total} / 175</h2>
      <h3 className="text-xl text-center text-cyan-300 mt-2">Tier: {tier}</h3>
    </div>
  );
}
