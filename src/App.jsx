import { useMemo, useState } from "react";

const fineTraits = [
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

function getFineTier(score) {
  if (score >= 150) return "God Tier";
  if (score >= 140) return "Elite";
  if (score >= 120) return "Exceptional";
  if (score >= 90) return "High Quality";
  if (score >= 50) return "Average";
  return "Rough Draft";
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

function NavButton({ children, onClick, active }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
        active
          ? "border-white bg-white text-zinc-950"
          : "border-white/15 bg-white/5 text-zinc-200 hover:border-white/40 hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}

function Header({ view, setView }) {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
      <button
        type="button"
        onClick={() => setView("hub")}
        className="text-left"
        aria-label="Return to The FINE Test hub"
      >
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-rose-300">
          The FINE Test
        </p>
        <h1 className="text-xl font-black text-white sm:text-2xl">Score the vibe.</h1>
      </button>

      <nav className="flex shrink-0 gap-2">
        <NavButton onClick={() => setView("calculator")} active={view === "calculator"}>
          Calculator
        </NavButton>
        <NavButton onClick={() => setView("compatibility")} active={view === "compatibility"}>
          Compatibility
        </NavButton>
      </nav>
    </header>
  );
}

function Hub({ setView }) {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-96px)] w-full max-w-6xl items-center gap-8 px-5 pb-12 pt-4 sm:px-8 lg:grid-cols-[1fr_0.82fr]">
      <section>
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.28em] text-rose-300">
          Choose your test
        </p>
        <h2 className="max-w-3xl text-5xl font-black leading-none text-white sm:text-6xl lg:text-7xl">
          A tiny lab for attraction, taste, and questionable judgment.
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
          Use the original calculator, or run the new compatibility test to compare two people
          across communication, pace, ambition, affection, and social rhythm.
        </p>
      </section>

      <section className="grid gap-4">
        <button
          type="button"
          onClick={() => setView("calculator")}
          className="group rounded-lg border border-white/10 bg-white p-6 text-left text-zinc-950 shadow-2xl shadow-rose-950/20 transition hover:-translate-y-1 hover:shadow-rose-500/20"
        >
          <div className="mb-12 flex items-center justify-between">
            <span className="text-sm font-black uppercase tracking-[0.22em] text-rose-600">
              Original
            </span>
            <span className="text-2xl font-black transition group-hover:translate-x-1">Go</span>
          </div>
          <h3 className="text-3xl font-black">FINE Calculator</h3>
          <p className="mt-3 text-zinc-600">Rate traits, total the score, and reveal the tier.</p>
        </button>

        <button
          type="button"
          onClick={() => setView("compatibility")}
          className="group rounded-lg border border-white/10 bg-zinc-900 p-6 text-left text-white shadow-2xl shadow-black/30 transition hover:-translate-y-1 hover:border-rose-300/40"
        >
          <div className="mb-12 flex items-center justify-between">
            <span className="text-sm font-black uppercase tracking-[0.22em] text-rose-300">
              New
            </span>
            <span className="text-2xl font-black transition group-hover:translate-x-1">Go</span>
          </div>
          <h3 className="text-3xl font-black">Compatibility Test</h3>
          <p className="mt-3 text-zinc-300">
            Compare answers and get a match score with a breakdown.
          </p>
        </button>
      </section>
    </main>
  );
}

function FineCalculator() {
  const [scores, setScores] = useState(Array(fineTraits.length).fill(0));
  const total = scores.reduce((sum, value) => sum + Number(value), 0);
  const tier = getFineTier(total);

  const handleChange = (index, value) => {
    const updated = [...scores];
    updated[index] = Number(value);
    setScores(updated);
  };

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-8 px-5 pb-12 pt-4 sm:px-8 lg:grid-cols-[0.76fr_1fr]">
      <aside className="top-6 h-fit rounded-lg border border-white/10 bg-zinc-950/70 p-6 lg:sticky">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-rose-300">
          Original calculator
        </p>
        <h2 className="mt-4 text-4xl font-black text-white">The FINE Test</h2>
        <p className="mt-4 leading-7 text-zinc-300">
          Rate each trait and let the score do what the score does.
        </p>
        <div className="mt-8 rounded-lg bg-white p-5 text-zinc-950">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-zinc-500">
            Total Score
          </p>
          <p className="mt-2 text-5xl font-black">{total}</p>
          <p className="mt-1 text-sm font-semibold text-zinc-500">out of 175</p>
          <p className="mt-5 text-2xl font-black text-rose-600">{tier}</p>
        </div>
      </aside>

      <section className="rounded-lg border border-white/10 bg-white/[0.03] p-5 sm:p-7">
        <div className="grid gap-6">
          {fineTraits.map((trait, index) => (
            <label key={trait.label} className="block">
              <div className="mb-2 flex items-center justify-between gap-4">
                <span className="font-bold text-white">{trait.label}</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-zinc-200">
                  {scores[index]} / {trait.max}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={trait.max}
                value={scores[index]}
                onChange={(event) => handleChange(index, event.target.value)}
                className="w-full accent-rose-400"
              />
            </label>
          ))}
        </div>
      </section>
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

function CompatibilityTest() {
  const [answers, setAnswers] = useState(() =>
    compatibilityQuestions.map(() => ({ you: 1, them: 1 }))
  );

  const results = useMemo(() => {
    const rows = compatibilityQuestions.map((question, index) => {
      const diff = Math.abs(answers[index].you - answers[index].them);
      const earned = diff === 0 ? question.weight : diff === 1 ? question.weight * 0.55 : 0;
      return { ...question, diff, earned };
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
    <main className="mx-auto grid w-full max-w-6xl gap-8 px-5 pb-12 pt-4 sm:px-8 lg:grid-cols-[0.76fr_1fr]">
      <aside className="top-6 h-fit rounded-lg border border-white/10 bg-zinc-950/70 p-6 lg:sticky">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-rose-300">New test</p>
        <h2 className="mt-4 text-4xl font-black text-white">Compatibility</h2>
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
              <h3 className="text-lg font-black text-white">{question.label}</h3>
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
    </main>
  );
}

export default function App() {
  const [view, setView] = useState("hub");

  return (
    <div className="min-h-screen overflow-x-hidden bg-zinc-950 text-white">
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(135deg,#09090b_0%,#18181b_52%,#27272a_100%)]" />
      <Header view={view} setView={setView} />
      {view === "hub" && <Hub setView={setView} />}
      {view === "calculator" && <FineCalculator />}
      {view === "compatibility" && <CompatibilityTest />}
    </div>
  );
}
