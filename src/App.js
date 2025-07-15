import { useState } from "react";
import "./index.css";

/* ---------- Trait data ---------- */
const traitGroups = {
  Appearance: [
    { label: "Face", max: 20 },
    { label: "Hair", max: 10 },
    { label: "Legs", max: 10 },
    { label: "Body Proportion", max: 10 },
  ],
  "Personality & Mind": [
    { label: "Intelligence", max: 15 },
    { label: "Humor", max: 15 },
    { label: "Confidence", max: 10 },
    { label: "Empathy / Kindness", max: 10 },
    { label: "Communication", max: 10 },
  ],
  "Lifestyle & Values": [
    { label: "Ambition / Drive", max: 10 },
    { label: "Independence / Responsibility", max: 10 },
    { label: "Mental / Physical Health", max: 10 },
    { label: "Hygiene", max: 10 },
  ],
};

const extraTraits = [
  {
    label: "Wildcard Bonus",
    max: 25,
    description: "(quirks, magic, chemistry, mystery, freak factor)",
  },
];

/* flatten */
const coreTraits = Object.values(traitGroups).flat();
const allTraits = [...coreTraits, ...extraTraits];

/* ---------- Tier logic ---------- */
function getTier(score) {
  if (score >= 150) return "God Tier — Marry her immediately.";
  if (score >= 140) return "Elite — Too good to be true, investigate further.";
  if (score >= 120) return "Exceptional — A rare gem, lock that down.";
  if (score >= 90)  return "High Quality — Built different in all the right ways.";
  if (score >= 50)  return "Average — There’s potential!";
  return "Rough — Probably not the one for you.";
}

/* ---------- Component ---------- */
export default function App() {
  const [scores, setScores] = useState(Array(allTraits.length).fill(0));

  const coreTotal = scores
    .slice(0, coreTraits.length)
    .reduce((s, v) => s + Number(v), 0);
  const wildcard = scores[coreTraits.length];
  const tier = getTier(coreTotal);

  const updateScore = (idx, val) => {
    const next = [...scores];
    next[idx] = val;
    setScores(next);
  };

  /* gradient helper */
  const bar = (pct) => {
    const c =
      pct <= 20 ? "#ef4444" :
      pct <= 50 ? "#facc15" :
                  "#22c55e";
    return `linear-gradient(to right, ${c} ${pct}%, #1f2937 ${pct}%)`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-10 font-sans">
      <h1 className="text-3xl font-bold text-center">The FINE Test</h1>
      <p className="text-center text-gray-300 mb-8">
        Rate each trait; Wildcard is extra credit.
      </p>

      {/* core groups */}
      {Object.entries(traitGroups).map(([group, list]) => (
        <section key={group} className="mb-8">
          <h2 className="text-xl font-semibold text-cyan-400 mb-4">{group}</h2>
          {list.map((t, i) => {
            const idx = coreTraits.findIndex(x => x.label === t.label);
            const val = scores[idx];
            const pct = (val / t.max) * 100;
            return (
              <div key={t.label} className="mb-4">
                <label className="block text-sm mb-1">
                  {t.label} ({val}/{t.max})
                </label>
                <input
                  type="range"
                  min="0"
                  max={t.max}
                  value={val}
                  onChange={(e) => updateScore(idx, e.target.value)}
                  className="w-full h-2 rounded-full appearance-none"
                  style={{ background: bar(pct) }}
                />
              </div>
            );
          })}
        </section>
      ))}

      {/* wildcard */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-purple-400 mb-4">Extra</h2>
        {extraTraits.map((t, j) => {
          const idx = coreTraits.length + j;
          const val = scores[idx];
          const pct = (val / t.max) * 100;
          return (
            <div key={t.label} className="mb-4">
              <label className="block text-sm mb-1">
                {t.label} ({val}/{t.max}){" "}
                <span className="text-gray-400 text-xs">{t.description}</span>
              </label>
              <input
                type="range"
                min="0"
                max={t.max}
                value={val}
                onChange={(e) => updateScore(idx, e.target.value)}
                className="w-full h-2 rounded-full appearance-none"
                style={{ background: bar(pct) }}
              />
            </div>
          );
        })}
      </section>

      {/* summary */}
      <hr className="border-gray-700 my-6" />
      <div className="text-center space-y-1">
        <p className="text-2xl font-bold">Core Score: {coreTotal} / 150</p>
        <p className="text-lg text-purple-300">Wildcard Bonus: +{wildcard}</p>
        <p className="text-xl text-cyan-300 font-semibold">{tier}</p>
      </div>
    </div>
  );
}
