import { useState } from "react";

const traits = [
  { label: "Face", max: 20 },
  { label: "Hair", max: 10 },
  { label: "Legs", max: 10 },
  { label: "Body Proportion", max: 10 },
  { label: "Intelligence", max: 15 },
  { label: "Humor", max: 15 },
  { label: "Confidence", max: 10 },
  { label: "Empathy / Kindness", max: 10 },
  { label: "Ambition / Drive", max: 10 },
  { label: "Communication", max: 10 },
  { label: "Independence / Responsibility", max: 10 },
  { label: "Mental / Physical Health", max: 10 },
  { label: "Hygiene", max: 10 },
  { label: "Wildcard Bonus", max: 25 },
];

function getTier(score) {
  if (score >= 150) return "God Tier";
  if (score >= 140) return "Elite";
  if (score >= 120) return "Exceptional";
  if (score >= 90) return "High Quality";
  if (score >= 50) return "Average";
  return "Rough Draft";
}

export default function App() {
  const [scores, setScores] = useState(Array(traits.length).fill(0));

  const total = scores.reduce((sum, value) => sum + Number(value), 0);
  const tier = getTier(total);

  const handleChange = (index, value) => {
    const updated = [...scores];
    updated[index] = value;
    setScores(updated);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "700px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h1>The FINE Test</h1>
      <p>Rate each trait below to calculate the final score.</p>
      <hr />
      {traits.map((trait, index) => (
        <div key={index} style={{ marginBottom: "1rem" }}>
          <label>
            <strong>{trait.label}</strong> ({scores[index]}/{trait.max})
            <input
              type="range"
              min="0"
              max={trait.max}
              value={scores[index]}
              onChange={(e) => handleChange(index, e.target.value)}
              style={{ width: "100%" }}
            />
          </label>
        </div>
      ))}
      <hr />
      <h2>Total Score: {total} / 175</h2>
      <h3>Tier: {tier}</h3>
    </div>
  );
}
