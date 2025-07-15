import { useState } from "react";
import "./index.css";

/* -------- Trait groups -------- */
const traitGroups = {
  Appearance: [
    { label: "Face", max: 20 },
    { label: "Hair", max: 10 },
    { label: "Legs", max: 10 },
    { label: "Body Proportion", max: 10 },
  ],
  "Personality & Mind": [
    { label: "Intelligence", max: 15 },
    { label: "Humor", max: 15 },
    { label: "Confidence", max: 10 },
    { label: "Empathy / Kindness", max: 10 },
    { label: "Communication", max: 10 },
  ],
  "Lifestyle & Values": [
    { label: "Ambition / Drive", max: 10 },
    { label: "Independence / Responsibility", max: 10 },
    { label: "Mental / Physical Health", max: 10 },
    { label: "Hygiene", max: 10 },
  ],
};

/* Extra (Wildcard) group */
const extraTraits = [
  {
    label: "Wildcard Bonus",
    max: 25,
    description: "(quirks, magic, chemistry, mystery, freak factor)",
  },
];

/* Flatten arrays for indexing */
const coreTraits = Object.values(traitGroups).flat();
const allTraits  = [...coreTraits, ...extraTraits];

/* -------- Tier logic -------- */
function getTier(score) {
  if (score >= 150) return "God Tier — Marry her immediately.";
  if (score >= 140) return "Elite — Too good to be true, investigate further.";
  if (score >= 120) return "Exceptional — A rare gem, lock that down.";
  if (score >= 90)  return "High Quality — Built different in all the right ways.";
  if (score >= 50)  return "Average — There’s potential!";
  return "Rough — Probably not the one for you.";
}

export default function App() {
  const [scores, setScores] = useState(Array(allTraits.length).fill(0));

  /* Core total (exclude wildcard) */
  const coreTotal = scores
    .slice(0, coreTraits.length)
    .reduce((sum, val) => sum + Number(val), 0);

  const wildcard = scores[coreTraits.length]; // last item
  const tier     = getTier(coreTotal);

  const handleChange = (index, value) => {
    const updated = [...scores];
    updated[index] = value;
    setScores(updated);
  };

  /* Helper: slider gradient */
  const sliderBG = (pct) => {
    const color =
      pct <= 20  ? "#ef4444" :  // red
      pct <= 50  ? "#facc15" :  // yellow
                   "#22c55e";   // green
    return `linear-gradient(to right, ${color} ${pct}%, #1f2937 ${pct}%)`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4 font-sans">
      <h1 className="text-3xl font-bold text-center">The FINE Test</h1>
      <p className="text-center text-gray-300 mb-8">
        Rate each trait below; Wildcard bonus is extra flair.
      </p>

      {/* -------- Core groups -------- */}
      {Object.entries(traitGroups).map(([group, traits]) => (
        <section key={group} className="mb-8">
          <h2 className="text-xl font-semibold text-cyan-400 mb-4">{group}</h2>
          {traits.map((t, idx) => {
            const i   = coreTraits.findIndex(ct => ct.label === t.label);
            const val = scores[i];
            const pct = (val / t.max) * 100;
            return (
              <div key={t.label} className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  {t.label} ({val}/{t.max})
                </label>
                <input
                  type="range"
                  min="0"
                  max={t.max}
                  value={val}
                  onChange={(e) => handleChange(i, e.target.value)}
                  className="w-full h-2 rounded-full appearance-none"
                  style={{ background: sliderBG(pct) }}
                />
              </div>
            );
          })}
        </section>
      ))}

      {/* -------- Wildcard group -------- */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-purple-400 mb-4">Extra</h2>
        {extraTraits.map((t, idx) => {
          const i   = coreTraits.length + idx;     // wildcard index
          const val = scores[i];
          const pct = (val / t.max) * 100;
          return (
            <div key={t.label} className="mb-4">
              <label className="block text-sm font-medium mb-1">
                {t.label} ({val}/{t.max}){" "}
                <span className="text-gray-400 text-xs">{t.description}</span>
              </label>
              <input
                type="range"
                min="0"
                max={t.max}
                value={val}
                onChange={(e) => handleChange(i, e.target.value)}
                className="w-full h-2 rounded-full appearance-none bg-gradient-to-r from-indigo-500 to-pink-500"
              />
            </div>
          );
        })}
      </section>

      {/* -------- Summary -------- */}
      <hr className="border-gray-700 my-6" />
      <div className="text-center space-y-1">
        <p className="text-2xl font-bold">
          Core Score: {coreTotal} / 150
        </p>
        <p className="text-lg text-purple-300">
          Wildcard Bonus: +{wildcard}
        </p>
        <p className="text-xl text-cyan-300 mt-2 font-semibold">
          {tier}
        </p>
      </div>
    </div>
  );
}
