import { useState } from "react";
import "./index.css";

const traitGroups = {
  "Figure": [
    { label: "Face", max: 20 },
    { label: "Hair", max: 10 },
    { label: "Legs", max: 10 },
    { label: "Body Proportion", max: 10 }
  ],
  "Intellect": [
    { label: "Intelligence", max: 15 },
    { label: "Humor", max: 15 },
    { label: "Confidence", max: 10 },
    { label: "Empathy / Kindness", max: 10 },
    { label: "Communication", max: 10 }
  ],
  "Nature & Energy": [
    { label: "Ambition / Drive", max: 10 },
    { label: "Independence / Responsibility", max: 10 },
    { label: "Mental / Physical Health", max: 10 },
    { label: "Hygiene", max: 10 }
  ],
  "Extra": [
    { label: "Wildcard Bonus (quirks, magic, chemistry, mystery, freak factor)", max: 25 }
  ]
};

const allTraits = Object.values(traitGroups).flat();
const maxScore = allTraits.reduce((sum, t) => t.label.includes("Wildcard") ? sum : sum + t.max, 0);

function getTier(score, wildcard) {
  const effectiveScore = score + Number(wildcard);

  const tierOptions = {
    god: [
      "You’re legally required to fall in love.",
      "God spent a little extra time on this one.",
      "If you fumble this, it’s a war crime.",
      "This is the one the simulations warned us about.",
      "They’re not real. They’re a glitch in the beauty matrix.",
      "Your soulmate. Your final boss. Your everything app."
    ],
    elite: [
      "Marry them yesterday.",
      "Too good to be true — check for red flags or NDAs.",
      "This is the person your mom warned you not to fumble.",
      "Probably a model, maybe an alien.",
      "Swipe right and prepare for psychological whiplash.",
      "You don’t chase this. You *earn* this."
    ],
    exceptional: [
      "A rare gem, lock that down.",
      "You’ll think about them during other dates.",
      "Like finding a four-leaf clover in a desert.",
      "High-tier with humble energy. Dangerous combo.",
      "Deserves flowers, and probably your PIN.",
      "This is the kind of person people write songs about."
    ],
    high: [
      "Built different in all the right ways.",
      "You’ll brag about dating them once you realize what you had.",
      "Dependable. Kissable. Possibly weird in a good way.",
      "Quality stock. Invest now.",
      "They pass the vibe check, background check, and the playlist check.",
      "Not flashy, but long-term material. Like a Honda with a sunroof."
    ],
    average: [
      "There’s potential!",
      "Mid with sparks of greatness.",
      "Not a hell yes, but not a hell no.",
      "Solid baseline. Could be a sleeper hit.",
      "Might surprise you, or might ghost you after brunch.",
      "Not bad… for now. Jury’s out."
    ],
    rough: [
      "Oh no. Absolutely not.",
      "You’re not ready to explain this to your therapist.",
      "Dating them is a cry for help.",
      "Run. Don't walk.",
      "Every red flag in a trench coat.",
      "You’re trying to fix something your ancestors warned you about."
    ]
  };

  if (effectiveScore >= 150) return { label: "God Tier", desc: randomFrom(tierOptions.god) };
  if (effectiveScore >= 140) return { label: "Elite", desc: randomFrom(tierOptions.elite) };
  if (effectiveScore >= 120) return { label: "Exceptional", desc: randomFrom(tierOptions.exceptional) };
  if (effectiveScore >= 90) return { label: "High Quality", desc: randomFrom(tierOptions.high) };
  if (effectiveScore >= 50) return { label: "Average", desc: randomFrom(tierOptions.average) };
  return { label: "Rough", desc: randomFrom(tierOptions.rough) };
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function App() {
  const [scores, setScores] = useState(Array(allTraits.length).fill(0));
  const total = scores.reduce((sum, val, i) => allTraits[i].label.includes("Wildcard") ? sum : sum + Number(val), 0);
  const wildcard = scores[allTraits.findIndex(t => t.label.includes("Wildcard"))] || 0;
  const { label: tier, desc: tierDesc } = getTier(total, wildcard);

  const handleChange = (index, value) => {
    const updated = [...scores];
    updated[index] = value;
    setScores(updated);
  };

  const exportSummary = () => {
    const groupSums = Object.entries(traitGroups).map(([group, traits]) => {
      const sum = traits.reduce((acc, t) => {
        const index = allTraits.findIndex(tt => tt.label === t.label);
        return acc + Number(scores[index] || 0);
      }, 0);
      return `${group}: ${sum}`;
    }).join("\n");

    const text = `F.I.N.E. RESULTS\n${groupSums}\n\nTier: ${tier}\n${tierDesc}\n\n(I'm not responsible if you get in trouble for this)`;
    alert(text); // Replace this with proper modal/download later
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4 font-sans">
      <h1 className="text-4xl font-bold text-center mb-2">The F.I.N.E. Test</h1>
      <p className="text-center text-gray-300 mb-6">Figure, Intellect, Nature, Energy. Rate each trait to find out how much you really want someone.</p>
      <hr className="border-gray-700 mb-6" />

      {Object.entries(traitGroups).map(([groupName, traits], groupIndex) => (
        <div key={groupName} className="mb-8">
          <h2 className="text-xl font-semibold text-cyan-400 mb-4">{groupName}</h2>
          {traits.map((trait, index) => {
            const globalIndex = Object.values(traitGroups).slice(0, groupIndex).flat().length + index;
            const value = scores[globalIndex];
            const max = trait.max;
            const percentage = (value / max) * 100;
            const style = {
              background: `linear-gradient(to right, red, yellow ${percentage}%, green ${percentage}%, #1f2937 ${percentage}%)`,
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
      <h2 className="text-2xl font-bold text-center">Total Score: {total} / {maxScore}</h2>
      <h3 className="text-xl text-center text-cyan-300 mt-2">Tier: {tier}</h3>
      <p className="text-center text-gray-400 italic">{tierDesc}</p>

      <div className="text-center mt-6">
        <button onClick={exportSummary} className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded text-white">
          Share Results
        </button>
        <p className="text-xs text-gray-500 mt-1">(I'm not responsible if you get in trouble for this)</p>
      </div>
    </div>
  );
}
