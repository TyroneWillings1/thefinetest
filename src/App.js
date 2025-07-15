import { useState } from "react";
import html2canvas from "html2canvas";
import "./index.css";

const traitGroups = {
  "Figure": [
    { label: "Face", max: 20 },
    { label: "Hair", max: 10 },
    { label: "Legs", max: 10 },
    { label: "Body Proportion", max: 10 },
  ],
  "Intellect": [
    { label: "Intelligence", max: 15 },
    { label: "Humor", max: 15 },
    { label: "Confidence", max: 10 },
    { label: "Communication", max: 10 },
  ],
  "Nature": [
    { label: "Empathy / Kindness", max: 10 },
    { label: "Ambition / Drive", max: 10 },
    { label: "Independence / Responsibility", max: 10 },
    { label: "Mental / Physical Health", max: 10 },
    { label: "Hygiene", max: 10 },
  ],
  "+": [
    { label: "Wildcard Bonus (quirks, magic, chemistry, mystery, freak factor)", max: 25 },
  ],
};

const allTraits = Object.values(traitGroups).flat();

function getTier(score) {
  const messages = {
    "God Tier": ["Marry her immediately.", "You’re legally required to fall in love.", "This is endgame."],
    "Elite": ["Too good to be true, investigate further.", "Probably makes your mom like her too.", "You’ll be dreaming about this one."],
    "Exceptional": ["A rare gem, lock that down.", "Great genes, greater vibes.", "You’re punching up.", "They understood the assignment."],
    "High Quality": ["Built different in all the right ways.", "Solid across the board.", "Could be The One with the right patch update."],
    "Average": ["There’s potential!", "Standard issue with room for modding.", "You’ve definitely seen her before on IG explore."],
    "Rough": ["Probably not the one for you.", "Reconsider your standards.", "You’re doing charity work."],
  };

  let tier;
  if (score >= 150) tier = "God Tier";
  else if (score >= 140) tier = "Elite";
  else if (score >= 120) tier = "Exceptional";
  else if (score >= 90) tier = "High Quality";
  else if (score >= 50) tier = "Average";
  else tier = "Rough";

  const options = messages[tier];
  const description = options[Math.floor(Math.random() * options.length)];
  return { tier, description };
}

export default function App() {
  const [scores, setScores] = useState(Array(allTraits.length).fill(0));
  const [showResults, setShowResults] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const visibleTraits = Object.values(traitGroups).slice(0, 3).flat();
  const wildcardScore = scores[scores.length - 1];
  const total = visibleTraits.reduce((sum, _, i) => sum + Number(scores[i]), 0);
  const tierData = getTier(total + Number(wildcardScore));

  const handleChange = (index, value) => {
    const updated = [...scores];
    updated[index] = value;
    setScores(updated);
  };

  const exportResults = () => {
    const element = document.getElementById("results-section");
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL("image/webp");
      setImageUrl(imgData);
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4 font-sans">
      <h1 className="text-4xl font-bold text-center mb-2">The F.I.N.E. Test</h1>
      <p className="text-center text-cyan-400 mb-6 text-lg">Figure, Intellect, Nature, Energy</p>
      <p className="text-center text-gray-300 mb-8">Rate each trait to find out how much you really want someone.</p>
      <hr className="border-gray-700 mb-6" />

      {!showResults && (
        <>
          {Object.entries(traitGroups).map(([groupName, traits], groupIndex) => (
            <div key={groupName} className="mb-8">
              <h2 className="text-xl font-semibold text-cyan-400 mb-4">{groupName}</h2>
              {traits.map((trait, index) => {
                const globalIndex = Object.values(traitGroups).slice(0, groupIndex).flat().length + index;
                const value = scores[globalIndex];
                const max = trait.max;
                const percentage = (value / max) * 100;
                let gradient;

                if (percentage <= 33) gradient = "from-red-500 to-yellow-500";
                else if (percentage <= 66) gradient = "from-yellow-500 to-green-400";
                else gradient = "from-green-500 to-green-300";

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
                      className={`w-full h-2 rounded-full appearance-none bg-gradient-to-r ${gradient}`}
                    />
                  </div>
                );
              })}
            </div>
          ))}
          <div className="text-center">
            <button
              onClick={() => {
                exportResults();
                setShowResults(true);
              }}
              className="mt-6 px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full shadow"
            >
              Share Results
            </button>
            <p className="text-xs text-gray-500 mt-2">(I'm not responsible if you get in trouble for this)</p>
          </div>
        </>
      )}

      {showResults && (
        <div id="results-section" className="bg-gray-800 p-6 rounded-xl mt-10">
          <h2 className="text-3xl text-center font-bold mb-4">F.I.N.E. Results</h2>
          {Object.entries(traitGroups).slice(0, 3).map(([group, traits]) => {
            const sectionTotal = traits.reduce((sum, _, i) => sum + Number(scores[Object.values(traitGroups).flat().indexOf(traits[i])]), 0);
            return (
              <p key={group} className="text-lg text-center">
                {group}: {sectionTotal}
              </p>
            );
          })}
          <p className="text-lg text-center">+: {wildcardScore}</p>
          <h3 className="text-xl text-cyan-300 text-center mt-4">{tierData.tier}</h3>
          <p className="text-center text-gray-300">{tierData.description}</p>
          {imageUrl && (
            <div className="mt-6 text-center">
              <img src={imageUrl} alt="FINE Results Screenshot" className="rounded-lg mx-auto max-w-xs" />
              <a
                href={imageUrl}
                download="fine-results.webp"
                className="mt-2 inline-block px-4 py-1 text-sm text-white bg-cyan-500 rounded-full hover:bg-cyan-600"
              >
                Download Image
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
