import { useMemo, useState } from "react";

const traitGroups = {
  Figure: [
    { label: "Face", max: 20 },
    { label: "Hair", max: 10 },
    { label: "Legs", max: 10 },
    { label: "Overall", max: 10 },
  ],
  Intellect: [
    { label: "Knowledgeable", max: 15 },
    { label: "Humor", max: 15 },
    { label: "Confidence", max: 10 },
    { label: "Empathy / Kindness", max: 10 },
    { label: "Communication", max: 10 },
  ],
  Nature: [
    { label: "Ambition / Drive", max: 10 },
    { label: "Independence / Responsibility", max: 10 },
    { label: "Mental / Physical Health", max: 10 },
    { label: "Hygiene", max: 10 },
  ],
  Extra: [{ label: "Wildcard", max: 10 }],
};

const compatibilityQuestions = [
  {
    label: "Ideal weekend pace",
    options: ["Out and social", "Balanced", "Quiet and private"],
    weight: 12,
  },
  {
    label: "Texting style",
    options: ["Fast replies", "Flexible", "Low maintenance"],
    weight: 10,
  },
  {
    label: "Conflict style",
    options: ["Talk immediately", "Cool off first", "Avoid tension"],
    weight: 16,
  },
  {
    label: "Ambition level",
    options: ["All-in", "Steady growth", "Chill life"],
    weight: 12,
  },
  {
    label: "Affection style",
    options: ["Very expressive", "Balanced", "Subtle"],
    weight: 10,
  },
  {
    label: "Social battery",
    options: ["Always around people", "Depends", "Mostly solo"],
    weight: 10,
  },
  {
    label: "Money mindset",
    options: ["Spend for experiences", "Balanced", "Save first"],
    weight: 12,
  },
  {
    label: "Future planning",
    options: ["Long-term focused", "Some planning", "Day by day"],
    weight: 10,
  },
  {
    label: "Humor match",
    options: ["Dry / sarcastic", "Playful", "Silly / chaotic"],
    weight: 8,
  },
];

const tierDescriptions = {
  Unicorn: [
    "Unicorn Tier - Marry her immediately.",
    "Unicorn Tier - This is cosmic alignment.",
    "Unicorn Tier - Cancel your dating apps forever.",
  ],
  Elite: [
    "Elite - Too good to be true, investigate further.",
    "Elite - Where has she been all your life?",
    "Elite - Lock in before someone else does.",
  ],
  Exceptional: [
    "Exceptional - A rare gem, lock that down.",
    "Exceptional - Might be the one.",
    "Exceptional - Strong long-term potential.",
  ],
  High: [
    "High Quality - Built different in all the right ways.",
    "High Quality - Serious contender status.",
    "High Quality - Definitely worth your time.",
  ],
  Average: [
    "Average - There's potential.",
    "Average - Could grow into something.",
    "Average - Some sparks, but not fireworks.",
  ],
  Rough: [
    "Rough - Proceed at your own risk.",
    "Rough - May contain emotional turbulence.",
    "Rough - You're better off solo tonight.",
  ],
};

function getFineTier(score, hasWildcard) {
  const effectiveScore = score + (hasWildcard ? 10 : 0);
  if (effectiveScore >= 150) return "Unicorn";
  if (effectiveScore >= 140) return "Elite";
  if (effectiveScore >= 120) return "Exceptional";
  if (effectiveScore >= 90) return "High";
  if (effectiveScore >= 50) return "Average";
  return "Rough";
}

function getCompatibilityTier(score) {
  if (score >= 92) return "Dangerously Aligned";
  if (score >= 80) return "Strong Match";
  if (score >= 65) return "Promising";
  if (score >= 48) return "Needs Chemistry";
  return "Beautiful Disaster";
}

function getCompatibilityNote(score) {
  if (score >= 92) return "Same frequency, same nonsense, same direction.";
  if (score >= 80) return "A lot lines up. The differences are probably workable.";
  if (score >= 65) return "There is enough overlap to explore, with a few watch zones.";
  if (score >= 48) return "Some attraction may be doing heavy lifting here.";
  return "Could be fun. Could also become a group chat case study.";
}

function getSliderColor(value, max) {
  const percent = max ? value / max : 0;
  if (percent < 0.34) return "#fb7185";
  if (percent < 0.67) return "#facc15";
  return "#4ade80";
}

function BackButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-6 text-xs font-black uppercase tracking-[0.24em] text-rose-300 transition hover:text-white"
    >
      Back to tests
    </button>
  );
}

function Hub({ setView }) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-5 py-12">
      <p className="mb-5 text-sm font-black uppercase tracking-[0.32em] text-rose-300">
        Choose your test
      </p>

      <section className="grid gap-4">
        <button
          type="button"
          onClick={() => setView("calculator")}
          className="group rounded-lg border border-white/10 bg-white p-6 text-left text-zinc-950 shadow-2xl shadow-black/30 transition hover:-translate-y-1"
        >
          <div className="mb-12 flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-rose-600">
              Original
            </span>
            <span className="text-2xl font-black transition group-hover:translate-x-1">Go</span>
          </div>
          <h1 className="text-3xl font-black">FINE Calculator</h1>
          <p className="mt-3 text-zinc-600">Rate the traits and reveal the tier.</p>
        </button>

        <button
          type="button"
          onClick={() => setView("compatibility")}
          className="group rounded-lg border border-white/10 bg-zinc-900 p-6 text-left text-white shadow-2xl shadow-black/30 transition hover:-translate-y-1 hover:border-rose-300/40"
        >
          <div className="mb-12 flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-rose-300">
              New
            </span>
            <span className="text-2xl font-black transition group-hover:translate-x-1">Go</span>
          </div>
          <h2 className="text-3xl font-black">Compatibility Test</h2>
          <p className="mt-3 text-zinc-300">Compare answers and get a match score.</p>
        </button>
      </section>
    </main>
  );
}

function FineCalculator({ setView }) {
  const [scores, setScores] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [resultLine, setResultLine] = useState("");

  const allTraits = Object.values(traitGroups).flat();
  const totalScore = allTraits
    .filter((trait) => trait.label !== "Wildcard")
    .reduce((sum, trait) => sum + (scores[trait.label] || 0), 0);
  const hasWildcard = (scores.Wildcard || 0) > 0;
  const tier = getFineTier(totalScore, hasWildcard);

  const categoryTotal = (traits) =>
    traits.reduce((sum, trait) => sum + (scores[trait.label] || 0), 0);

  const handleSlider = (trait, value) => {
    setScores((current) => ({ ...current, [trait]: Number(value) }));
  };

  const showFinalResults = () => {
    const lines = tierDescriptions[tier];
    setResultLine(lines[Math.floor(Math.random() * lines.length)]);
    setShowResults(true);
  };

  const resetTest = () => {
    setScores({});
    setResultLine("");
    setShowResults(false);
  };

  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-8 sm:py-12">
      <BackButton onClick={() => setView("hub")} />

      {!showResults ? (
        <section className="rounded-lg border border-white/10 bg-zinc-950/60 p-5 shadow-2xl shadow-black/30 sm:p-8">
          <h1 className="text-center text-4xl font-black tracking-tight text-white">
            The F.I.N.E. Test
          </h1>
          <p className="mt-3 text-center text-sm font-black uppercase tracking-[0.24em] text-rose-300">
            Figure / Intellect / Nature / Energy
          </p>
          <p className="mx-auto mt-4 max-w-md text-center leading-7 text-zinc-300">
            Rate each trait to find out how much you really want someone.
          </p>

          <div className="mt-8 grid gap-8">
            {Object.entries(traitGroups).map(([category, traits]) => (
              <div key={category}>
                <h2 className="mb-4 border-b border-white/10 pb-2 text-lg font-black text-white">
                  {category}
                </h2>
                <div className="grid gap-5">
                  {traits.map((trait) => {
                    const value = scores[trait.label] || 0;
                    const color = getSliderColor(value, trait.max);
                    const fill = (value / trait.max) * 100;

                    return (
                      <label key={trait.label} className="block">
                        <div className="mb-2 flex items-center justify-between gap-4">
                          <span className="font-bold text-white">{trait.label}</span>
                          <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-bold text-zinc-100">
                            {value}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max={trait.max}
                          value={value}
                          onChange={(event) => handleSlider(trait.label, event.target.value)}
                          className="h-2 w-full cursor-pointer appearance-none rounded-full accent-rose-400"
                          style={{
                            background: `linear-gradient(to right, ${color} ${fill}%, #3f3f46 ${fill}%)`,
                          }}
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-9 flex justify-center">
            <button
              type="button"
              onClick={showFinalResults}
              className="rounded-md bg-rose-300 px-8 py-3 text-lg font-black text-zinc-950 transition hover:bg-white"
            >
              See Results
            </button>
          </div>
        </section>
      ) : (
        <section className="rounded-lg border border-white/10 bg-zinc-950/70 p-6 text-center shadow-2xl shadow-black/30 sm:p-8">
          <h1 className="text-3xl font-black text-white">F.I.N.E. Results</h1>

          <div className="mt-8 grid gap-3 text-left">
            {Object.entries(traitGroups)
              .filter(([category]) => category !== "Extra")
              .map(([category, traits]) => (
                <div
                  key={category}
                  className="flex items-center justify-between rounded-md bg-white/5 px-4 py-3"
                >
                  <span className="font-bold text-zinc-200">{category}</span>
                  <span className="text-xl font-black text-rose-300">{categoryTotal(traits)}</span>
                </div>
              ))}
          </div>

          {hasWildcard && (
            <p className="mt-5 text-sm font-bold uppercase tracking-[0.22em] text-rose-300">
              Wildcard Bonus: {scores.Wildcard}
            </p>
          )}

          <p className="mt-7 text-sm font-black uppercase tracking-[0.24em] text-zinc-400">
            Total Score
          </p>
          <p className="mt-1 text-6xl font-black text-white">{totalScore}</p>
          <p className="mt-5 text-2xl font-black text-rose-300">{resultLine}</p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => setShowResults(false)}
              className="rounded-md bg-white/10 px-5 py-3 font-black text-white transition hover:bg-white/20"
            >
              Go Back
            </button>
            <button
              type="button"
              onClick={resetTest}
              className="rounded-md bg-rose-300 px-5 py-3 font-black text-zinc-950 transition hover:bg-white"
            >
              Start New Test
            </button>
          </div>
        </section>
      )}
    </main>
  );
}

function OptionButton({ selected, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
        selected
          ? "border-rose-300 bg-rose-300 text-zinc-950"
          : "border-white/10 bg-white/5 text-zinc-200 hover:border-white/30"
      }`}
    >
      {children}
    </button>
  );
}

function CompatibilityTest({ setView }) {
  const [answers, setAnswers] = useState(() =>
    compatibilityQuestions.map(() => ({ you: 1, them: 1 }))
  );

  const results = useMemo(() => {
    const rows = compatibilityQuestions.map((question, index) => {
      const diff = Math.abs(answers[index].you - answers[index].them);
      const earned = diff === 0 ? question.weight : diff === 1 ? question.weight * 0.55 : 0;
      return { ...question, earned };
    });
    const possible = compatibilityQuestions.reduce((sum, question) => sum + question.weight, 0);
    const earned = rows.reduce((sum, row) => sum + row.earned, 0);
    const score = Math.round((earned / possible) * 100);
    return { rows, score };
  }, [answers]);

  const updateAnswer = (index, person, value) => {
    setAnswers((current) =>
      current.map((answer, answerIndex) =>
        answerIndex === index ? { ...answer, [person]: value } : answer
      )
    );
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-8 sm:py-12">
      <BackButton onClick={() => setView("hub")} />

      <section className="grid gap-8 lg:grid-cols-[0.78fr_1fr]">
        <aside className="top-6 h-fit rounded-lg border border-white/10 bg-zinc-950/70 p-6 lg:sticky">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-rose-300">New test</p>
          <h1 className="mt-4 text-4xl font-black text-white">Compatibility</h1>
          <p className="mt-4 leading-7 text-zinc-300">
            Pick one answer for each person. Exact matches score highest; neighboring answers get
            partial credit.
          </p>
          <div className="mt-8 rounded-lg bg-white p-5 text-zinc-950">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-zinc-500">
              Match Score
            </p>
            <p className="mt-2 text-5xl font-black">{results.score}%</p>
            <p className="mt-5 text-2xl font-black text-rose-600">
              {getCompatibilityTier(results.score)}
            </p>
            <p className="mt-3 leading-6 text-zinc-600">{getCompatibilityNote(results.score)}</p>
          </div>
        </aside>

        <section className="grid gap-4">
          {compatibilityQuestions.map((question, index) => (
            <article
              key={question.label}
              className="rounded-lg border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-black text-white">{question.label}</h2>
                <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-zinc-300">
                  {Math.round(results.rows[index].earned)} / {question.weight}
                </span>
              </div>

              <div className="grid gap-4 xl:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
                    You
                  </p>
                  <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-1">
                    {question.options.map((option, optionIndex) => (
                      <OptionButton
                        key={option}
                        selected={answers[index].you === optionIndex}
                        onClick={() => updateAnswer(index, "you", optionIndex)}
                      >
                        {option}
                      </OptionButton>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
                    Them
                  </p>
                  <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-1">
                    {question.options.map((option, optionIndex) => (
                      <OptionButton
                        key={option}
                        selected={answers[index].them === optionIndex}
                        onClick={() => updateAnswer(index, "them", optionIndex)}
                      >
                        {option}
                      </OptionButton>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}

export default function App() {
  const [view, setView] = useState("hub");

  return (
    <div className="min-h-screen overflow-x-hidden bg-zinc-950 text-white">
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(135deg,#050505_0%,#09090b_55%,#18181b_100%)]" />
      {view === "hub" && <Hub setView={setView} />}
      {view === "calculator" && <FineCalculator setView={setView} />}
      {view === "compatibility" && <CompatibilityTest setView={setView} />}
    </div>
  );
}
