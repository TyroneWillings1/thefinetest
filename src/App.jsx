import { createClient } from "@supabase/supabase-js";
import { useEffect, useMemo, useState } from "react";

const supabase = createClient(
  "https://cwchbeqfhxdsumbrtgen.supabase.co",
  "sb_publishable_wbFiHMgmZ57MlhVl0htp1g_uoyYXb_Y"
);

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

const routes = {
  landing: "/",
  dashboard: "/dashboard",
  calculator: "/calculator",
  compatibility: "/compatibility",
  login: "/login",
  admin: "/admin",
  settings: "/settings",
};

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

const randomQuestionBank = [
  {
    prompt: "What kind of weekend sounds best?",
    description: "Pick the answer that feels most natural to you.",
    answers: [
      ["Quiet night in", 10],
      ["Dinner and drinks", 8],
      ["A full party weekend", 4],
      ["Whatever everyone else wants", 2],
    ],
  },
  {
    prompt: "How do you handle conflict?",
    description: "Be honest. This one matters.",
    answers: [
      ["Talk it out directly", 10],
      ["Cool off, then talk", 8],
      ["Make jokes until it passes", 4],
      ["Avoid it completely", 1],
    ],
  },
  {
    prompt: "What is your texting style?",
    description: "No judgment. Mostly.",
    answers: [
      ["Normal human pace", 10],
      ["Fast replies", 8],
      ["Depends on the day", 6],
      ["I vanish randomly", 2],
    ],
  },
  {
    prompt: "How important is ambition to you?",
    description: "This is about direction, not job title.",
    answers: [
      ["Very important", 10],
      ["Important, but balanced", 9],
      ["Somewhat important", 6],
      ["Not really important", 2],
    ],
  },
  {
    prompt: "What kind of humor do you like most?",
    description: "Pick the one you naturally gravitate toward.",
    answers: [
      ["Dry and clever", 10],
      ["Playful teasing", 9],
      ["Silly and chaotic", 7],
      ["I barely joke around", 2],
    ],
  },
  {
    prompt: "How do you feel about personal space?",
    description: "Everybody has a different setting here.",
    answers: [
      ["I need a healthy amount", 10],
      ["I like closeness, with balance", 9],
      ["I want constant attention", 4],
      ["I disappear when overwhelmed", 3],
    ],
  },
  {
    prompt: "How do you prefer to make plans?",
    description: "Planning style says a lot.",
    answers: [
      ["Plan ahead", 10],
      ["Loose plan, flexible details", 9],
      ["Spontaneous is better", 6],
      ["I avoid planning", 2],
    ],
  },
  {
    prompt: "What is your money style?",
    description: "Not about wealth. About habits.",
    answers: [
      ["Save first, enjoy second", 10],
      ["Balanced", 9],
      ["Spend on experiences", 7],
      ["I wing it financially", 2],
    ],
  },
  {
    prompt: "What is your ideal first date vibe?",
    description: "The energy matters.",
    answers: [
      ["Low-pressure and conversational", 10],
      ["Dinner with effort", 9],
      ["Something adventurous", 7],
      ["Club or party", 3],
    ],
  },
  {
    prompt: "How do you recharge?",
    description: "Social battery check.",
    answers: [
      ["Alone time", 10],
      ["One-on-one time", 9],
      ["Small group hangout", 7],
      ["Big social scene", 4],
    ],
  },
  {
    prompt: "How direct are you?",
    description: "Can you say the thing?",
    answers: [
      ["Very direct", 10],
      ["Direct but gentle", 10],
      ["Depends on the situation", 6],
      ["I bottle things up", 2],
    ],
  },
  {
    prompt: "How do you feel about fitness or health?",
    description: "General lifestyle alignment.",
    answers: [
      ["It is part of my life", 10],
      ["I try to stay balanced", 8],
      ["I am inconsistent", 5],
      ["I do not care much", 2],
    ],
  },
  {
    prompt: "How affectionate are you?",
    description: "Public and private affection count.",
    answers: [
      ["Very affectionate", 10],
      ["Warm but not clingy", 10],
      ["A little reserved", 6],
      ["Not affectionate", 2],
    ],
  },
  {
    prompt: "How do you handle jealousy?",
    description: "Green flag or problem area.",
    answers: [
      ["I communicate calmly", 10],
      ["I need reassurance sometimes", 7],
      ["I get suspicious easily", 3],
      ["I test people", 0],
    ],
  },
  {
    prompt: "What pace feels right in dating?",
    description: "How fast should things move?",
    answers: [
      ["Intentional but not rushed", 10],
      ["Slow and steady", 8],
      ["Fast if it feels right", 7],
      ["No direction, just vibes", 3],
    ],
  },
  {
    prompt: "What is your relationship goal?",
    description: "This one should be obvious, but here we are.",
    answers: [
      ["Something serious", 10],
      ["Open to serious with the right person", 9],
      ["Keeping it casual", 4],
      ["I do not know", 3],
    ],
  },
  {
    prompt: "How do you treat routines?",
    description: "Structure or chaos?",
    answers: [
      ["I like routine", 10],
      ["Some routine, some flexibility", 9],
      ["I prefer spontaneity", 6],
      ["My life is chaos", 2],
    ],
  },
  {
    prompt: "How do you act around friends?",
    description: "Social character check.",
    answers: [
      ["Loyal and present", 10],
      ["Fun but grounded", 9],
      ["I am the wildcard", 5],
      ["I bring drama", 0],
    ],
  },
  {
    prompt: "How do you feel about sarcasm?",
    description: "Important for survival.",
    answers: [
      ["Love it when it is clever", 10],
      ["Fine in moderation", 8],
      ["Not really my thing", 5],
      ["I take everything personally", 2],
    ],
  },
  {
    prompt: "What kind of communication feels best?",
    description: "The default channel.",
    answers: [
      ["Clear and consistent", 10],
      ["Warm and expressive", 9],
      ["Short and practical", 6],
      ["Hard to reach", 2],
    ],
  },
  {
    prompt: "How do you respond to stress?",
    description: "Pressure reveals a lot.",
    answers: [
      ["I get quiet and solve it", 10],
      ["I talk it through", 9],
      ["I need support", 7],
      ["I spiral outward", 2],
    ],
  },
  {
    prompt: "How clean are you?",
    description: "Simple but important.",
    answers: [
      ["Very clean", 10],
      ["Reasonably clean", 8],
      ["Messy but functional", 4],
      ["Disaster zone", 1],
    ],
  },
  {
    prompt: "How do you feel about learning new things?",
    description: "Curiosity check.",
    answers: [
      ["I love learning", 10],
      ["I am curious about some things", 8],
      ["Only when necessary", 4],
      ["Not interested", 1],
    ],
  },
  {
    prompt: "What kind of loyalty matters most?",
    description: "Pick the one that sounds like you.",
    answers: [
      ["Private consistency", 10],
      ["Public support", 8],
      ["Emotional reassurance", 7],
      ["I keep my options open", 1],
    ],
  },
  {
    prompt: "What makes someone attractive long-term?",
    description: "Past the first impression.",
    answers: [
      ["Character and consistency", 10],
      ["Humor and chemistry", 9],
      ["Ambition and lifestyle", 8],
      ["Looks mostly", 4],
    ],
  },
];

const fallbackResultBands = [
  {
    id: "fallback-0",
    min_percent: 0,
    max_percent: 39,
    title: "Not My Type",
    message: "The compatibility is low, but thanks for taking the test.",
    sort_order: 1,
  },
  {
    id: "fallback-1",
    min_percent: 40,
    max_percent: 59,
    title: "Mixed Signal",
    message: "There are some overlaps, but some important gaps too.",
    sort_order: 2,
  },
  {
    id: "fallback-2",
    min_percent: 60,
    max_percent: 79,
    title: "Promising",
    message: "This has enough alignment to be interesting.",
    sort_order: 3,
  },
  {
    id: "fallback-3",
    min_percent: 80,
    max_percent: 100,
    title: "Strong Match",
    message: "This looks like a strong compatibility match.",
    sort_order: 4,
  },
];

function getViewFromPath(pathname) {
  if (pathname === routes.dashboard) return "dashboard";
  if (pathname === routes.calculator) return "calculator";
  if (pathname === routes.compatibility) return "compatibility";
  if (pathname === routes.login) return "login";
  if (pathname === routes.admin) return "admin";
  if (pathname === routes.settings) return "settings";
  return "landing";
}

function getFineTier(score, hasWildcard) {
  const effectiveScore = score + (hasWildcard ? 10 : 0);
  if (effectiveScore >= 150) return "Unicorn";
  if (effectiveScore >= 140) return "Elite";
  if (effectiveScore >= 120) return "Exceptional";
  if (effectiveScore >= 90) return "High";
  if (effectiveScore >= 50) return "Average";
  return "Rough";
}

function getCompatibilityTier(percent) {
  if (percent >= 90) return "Elite Match";
  if (percent >= 75) return "Strong Match";
  if (percent >= 60) return "Promising";
  if (percent >= 40) return "Mixed Signal";
  return "Not My Type";
}

function pickResultBand(percent, bands = fallbackResultBands) {
  return (
    bands.find(
      (band) => percent >= Number(band.min_percent) && percent <= Number(band.max_percent)
    ) || bands[bands.length - 1]
  );
}

function pickRandomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getSliderColor(value, max) {
  const percent = max ? value / max : 0;
  if (percent < 0.34) return "#38bdf8";
  if (percent < 0.67) return "#22d3ee";
  return "#a3e635";
}

function BackButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-6 text-xs font-black uppercase tracking-[0.24em] text-cyan-300 transition hover:text-white"
    >
      Back to tests
    </button>
  );
}

function AccountDrawer({ onClose, navigate }) {
  return (
    <div className="fixed inset-0 z-20">
      <button
        type="button"
        aria-label="Close account menu"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-xs flex-col border-l border-white/10 bg-zinc-950 p-5 shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">Account</p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 px-3 py-1 text-sm font-black text-zinc-200 transition hover:border-white/30"
          >
            Close
          </button>
        </div>

        <nav className="mt-8 grid gap-3">
          <button
            type="button"
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-4 text-left transition hover:border-white/30"
          >
            <span className="block text-lg font-black text-white">Calculator Saves</span>
            <span className="mt-1 block text-sm text-zinc-400">Coming soon</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("admin")}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-4 text-left transition hover:border-cyan-300/50"
          >
            <span className="block text-lg font-black text-white">Compatibility Tests</span>
            <span className="mt-1 block text-sm text-zinc-400">Manage questions and results</span>
          </button>
        </nav>

        <div className="mt-auto border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={() => navigate("settings")}
            className="w-full rounded-lg border border-white/10 px-4 py-3 text-left font-black text-zinc-200 transition hover:border-white/30"
          >
            Settings
          </button>
        </div>
      </aside>
    </div>
  );
}

function Hub({ navigate }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const openAccount = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      setMenuOpen(true);
    } else {
      navigate("login");
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-5 py-12">
      <button
        type="button"
        onClick={openAccount}
        aria-label="Login"
        className="fixed right-5 top-5 h-9 w-16 rounded-full bg-white shadow-lg shadow-black/20 transition hover:scale-105 hover:bg-cyan-100"
      />

      <p className="mb-5 text-sm font-black uppercase tracking-[0.32em] text-cyan-300">
        Choose your test
      </p>

      <section className="grid gap-4">
        <button
          type="button"
          onClick={() => navigate("calculator")}
          className="group rounded-lg border border-white/10 bg-white p-6 text-left text-zinc-950 shadow-2xl shadow-black/30 transition hover:-translate-y-1"
        >
          <div className="mb-12 flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-cyan-600">
              Original
            </span>
            <span className="text-2xl font-black transition group-hover:translate-x-1">Go</span>
          </div>
          <h1 className="text-3xl font-black">FINE Calculator</h1>
          <p className="mt-3 text-zinc-600">Rate the traits and reveal the tier.</p>
        </button>

        <button
          type="button"
          onClick={() => navigate("compatibility")}
          className="group rounded-lg border border-white/10 bg-zinc-900 p-6 text-left text-white shadow-2xl shadow-black/30 transition hover:-translate-y-1 hover:border-cyan-300/40"
        >
          <div className="mb-12 flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">
              New
            </span>
            <span className="text-2xl font-black transition group-hover:translate-x-1">Go</span>
          </div>
          <h2 className="text-3xl font-black">Compatibility Test</h2>
          <p className="mt-3 text-zinc-300">Take Tyrone's compatibility test.</p>
        </button>
      </section>

      {menuOpen && <AccountDrawer onClose={() => setMenuOpen(false)} navigate={navigate} />}
    </main>
  );
}

function FineCalculator({ navigate }) {
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
      <BackButton onClick={() => navigate("dashboard")} />

      {!showResults ? (
        <section className="rounded-lg border border-white/10 bg-zinc-950/60 p-5 shadow-2xl shadow-black/30 sm:p-8">
          <h1 className="text-center text-4xl font-black tracking-tight text-white">
            The F.I.N.E. Test
          </h1>
          <p className="mt-3 text-center text-sm font-black uppercase tracking-[0.24em] text-cyan-300">
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
                          className="h-2 w-full cursor-pointer appearance-none rounded-full accent-cyan-400"
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
              className="rounded-md bg-cyan-300 px-8 py-3 text-lg font-black text-zinc-950 transition hover:bg-white"
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
                  <span className="text-xl font-black text-cyan-300">{categoryTotal(traits)}</span>
                </div>
              ))}
          </div>

          {hasWildcard && (
            <p className="mt-5 text-sm font-bold uppercase tracking-[0.22em] text-cyan-300">
              Wildcard Bonus: {scores.Wildcard}
            </p>
          )}

          <p className="mt-7 text-sm font-black uppercase tracking-[0.24em] text-zinc-400">
            Total Score
          </p>
          <p className="mt-1 text-6xl font-black text-white">{totalScore}</p>
          <p className="mt-5 text-2xl font-black text-cyan-300">{resultLine}</p>

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
              className="rounded-md bg-cyan-300 px-5 py-3 font-black text-zinc-950 transition hover:bg-white"
            >
              Start New Test
            </button>
          </div>
        </section>
      )}
    </main>
  );
}

function CompatibilityTest({ navigate }) {
  const [questions, setQuestions] = useState([]);
  const [resultBands, setResultBands] = useState(fallbackResultBands);
  const [answers, setAnswers] = useState({});
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    loadPublicQuestions();
  }, []);

  const loadPublicQuestions = async () => {
    setLoading(true);
    setError("");

    const [{ data, error: loadError }, { data: bandData }] = await Promise.all([
      supabase
        .from("compatibility_questions")
        .select(
          "id,prompt,description,description_enabled,sort_order,compatibility_options(id,label,points,sort_order)"
        )
        .eq("active", true)
        .order("sort_order", { ascending: true })
        .order("sort_order", { referencedTable: "compatibility_options", ascending: true }),
      supabase
        .from("compatibility_result_bands")
        .select("id,min_percent,max_percent,title,message,sort_order")
        .order("sort_order", { ascending: true }),
    ]);

    if (loadError) {
      setError("The compatibility test is not set up yet.");
      setQuestions([]);
    } else {
      setQuestions(data || []);
      if (bandData?.length) {
        setResultBands(bandData);
      }
    }

    setLoading(false);
  };

  const totals = useMemo(() => {
    const score = questions.reduce((sum, question) => {
      const optionId = answers[question.id];
      const option = question.compatibility_options?.find((item) => item.id === optionId);
      return sum + (option?.points || 0);
    }, 0);

    const maxScore = questions.reduce((sum, question) => {
      const options = question.compatibility_options || [];
      const max = options.length ? Math.max(...options.map((option) => option.points || 0)) : 0;
      return sum + max;
    }, 0);

    const percent = maxScore ? Math.round((score / maxScore) * 100) : 0;
    const band = pickResultBand(percent, resultBands);
    return {
      score,
      maxScore,
      percent,
      tier: band?.title || getCompatibilityTier(percent),
      message: band?.message || "",
    };
  }, [answers, questions, resultBands]);

  const submitTest = async (event) => {
    event.preventDefault();
    setError("");

    if (questions.some((question) => !answers[question.id])) {
      setError("Answer every question before submitting.");
      return;
    }

    setSaving(true);

    const { data: submission, error: submissionError } = await supabase
      .from("compatibility_submissions")
      .insert({
        name: name.trim() || null,
        score: totals.score,
        max_score: totals.maxScore,
        percent: totals.percent,
        result_tier: totals.tier,
        result_message: totals.message,
      })
      .select("id")
      .single();

    if (submissionError) {
      setError("Something went wrong saving your result.");
      setSaving(false);
      return;
    }

    const answerRows = questions.map((question) => {
      const option = question.compatibility_options.find((item) => item.id === answers[question.id]);
      return {
        submission_id: submission.id,
        question_id: question.id,
        option_id: option.id,
        question_prompt: question.prompt,
        option_label: option.label,
        points: option.points || 0,
      };
    });

    const { error: answersError } = await supabase
      .from("compatibility_answers")
      .insert(answerRows);

    if (answersError) {
      setError("Your score saved, but answer details did not save.");
    } else {
      setResult(totals);
    }

    setSaving(false);
  };

  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-8 sm:py-12">
      <BackButton onClick={() => navigate("dashboard")} />

      <section className="rounded-lg border border-white/10 bg-zinc-950/70 p-5 shadow-2xl shadow-black/30 sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-300">
          Compatibility
        </p>
        <h1 className="mt-4 text-4xl font-black text-white">Tyrone's Test</h1>
        <p className="mt-4 leading-7 text-zinc-300">
          Answer the questions honestly. Your result gets saved privately for review.
        </p>

        {loading && <p className="mt-8 text-zinc-300">Loading questions...</p>}

        {!loading && error && (
          <div className="mt-8 rounded-lg border border-cyan-300/30 bg-cyan-950/30 p-4 text-cyan-100">
            {error}
          </div>
        )}

        {!loading && !result && questions.length > 0 && (
          <form onSubmit={submitTest} className="mt-8 grid gap-6">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-zinc-200">Name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-300"
                placeholder="Optional"
              />
            </label>

            {questions.map((question, index) => (
              <fieldset key={question.id} className="rounded-lg border border-white/10 p-4">
                <legend className="px-2 text-sm font-black uppercase tracking-[0.18em] text-cyan-300">
                  Question {index + 1}
                </legend>
                <h2 className="mt-2 text-xl font-black text-white">{question.prompt}</h2>
                {question.description_enabled !== false && question.description && (
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{question.description}</p>
                )}
                <div className="mt-4 grid gap-2">
                  {(question.compatibility_options || []).map((option) => (
                    <label
                      key={option.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3 transition ${
                        answers[question.id] === option.id
                          ? "border-cyan-300 bg-cyan-300 text-zinc-950"
                          : "border-white/10 bg-white/5 text-zinc-200 hover:border-white/30"
                      }`}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={option.id}
                        checked={answers[question.id] === option.id}
                        onChange={() =>
                          setAnswers((current) => ({ ...current, [question.id]: option.id }))
                        }
                        className="sr-only"
                      />
                      <span className="font-bold">{option.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}

            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-cyan-300 px-8 py-3 text-lg font-black text-zinc-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Submit Test"}
            </button>
          </form>
        )}

        {result && (
          <div className="mt-8 rounded-lg bg-white p-6 text-center text-zinc-950">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-zinc-500">
              Your Result
            </p>
            <p className="mt-3 text-6xl font-black">{result.percent}%</p>
            <p className="mt-4 text-2xl font-black text-cyan-600">{result.tier}</p>
            {result.message && <p className="mt-3 leading-6 text-zinc-600">{result.message}</p>}
            <p className="mt-3 text-zinc-600">
              Your answers were saved. Tyrone can review the full submission.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

function LoginPage({ navigate, isLanding = false }) {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate("dashboard", true);
      }
      setLoading(false);
    });
  }, [navigate]);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");

    const result =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/dashboard`,
            },
          });

    if (result.error) {
      setError(result.error.message);
    } else if (mode === "signup") {
      setMessage("Account created. Check your email if Supabase asks for confirmation.");
    } else {
      navigate("dashboard", true);
    }

    setBusy(false);
  };

  const socialLogin = async (provider) => {
    setBusy(true);
    setError("");
    setMessage("");

    const { error: socialError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (socialError) {
      setError(socialError.message);
      setBusy(false);
    }
  };

  if (loading) {
    return <main className="mx-auto w-full max-w-md px-5 py-12 text-zinc-300">Loading...</main>;
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-5 py-12">
      {!isLanding && <BackButton onClick={() => navigate("landing")} />}

      <section className="rounded-lg border border-white/10 bg-zinc-950/70 p-6 shadow-2xl shadow-black/30">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-300">
          {mode === "signin" ? "Coming back?" : "New here?"}
        </p>
        <h1 className="mt-4 text-4xl font-black text-white">
          {mode === "signin" ? "Sign in" : "Sign up"}
        </h1>
        <p className="mt-3 leading-7 text-zinc-300">
          {mode === "signin"
            ? "Log in to manage your tests, saves, and settings."
            : "Create an account to build tests and collect results."}
        </p>

        <div className="mt-6 grid grid-cols-2 rounded-full bg-white/5 p-1">
          <button
            type="button"
            onClick={() => setMode("signin")}
            className={`rounded-full py-2 text-sm font-black transition ${
              mode === "signin" ? "bg-white text-zinc-950" : "text-zinc-300"
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`rounded-full py-2 text-sm font-black transition ${
              mode === "signup" ? "bg-white text-zinc-950" : "text-zinc-300"
            }`}
          >
            Sign up
          </button>
        </div>

        <div className="mt-6 grid gap-3">
          <button
            type="button"
            onClick={() => socialLogin("google")}
            disabled={busy}
            className="rounded-md border border-white/10 bg-white px-4 py-3 font-black text-zinc-950 transition hover:bg-cyan-100 disabled:opacity-60"
          >
            Continue with Google
          </button>
          <button
            type="button"
            onClick={() => socialLogin("facebook")}
            disabled={busy}
            className="rounded-md border border-white/10 bg-[#1877f2] px-4 py-3 font-black text-white transition hover:bg-[#0f63ce] disabled:opacity-60"
          >
            Continue with Facebook
          </button>
        </div>

        <div className="my-6 flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
          <span className="h-px flex-1 bg-white/10" />
          or
          <span className="h-px flex-1 bg-white/10" />
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-cyan-300/30 bg-cyan-950/30 p-3 text-cyan-100">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-4 rounded-md border border-emerald-300/30 bg-emerald-950/30 p-3 text-emerald-100">
            {message}
          </div>
        )}

        <form onSubmit={submit} className="grid gap-4">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-md border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-300"
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded-md border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-300"
            placeholder="Password"
            required
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded-md bg-cyan-300 px-6 py-3 font-black text-zinc-950 transition hover:bg-white disabled:opacity-60"
          >
            {busy ? "One sec..." : mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="mt-5 text-sm leading-6 text-zinc-400">
          Google and Facebook must be enabled in Supabase before those buttons work.
        </p>
      </section>
    </main>
  );
}

function SettingsPage({ navigate }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
      if (!data.session) {
        navigate("login", true);
      }
    });
  }, [navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("landing", true);
  };

  if (loading) {
    return <main className="mx-auto w-full max-w-md px-5 py-12 text-zinc-300">Loading...</main>;
  }

  if (!session) {
    return <main className="mx-auto w-full max-w-md px-5 py-12 text-zinc-300">Redirecting...</main>;
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-8 sm:py-12">
      <BackButton onClick={() => navigate("dashboard")} />

      <section className="rounded-lg border border-white/10 bg-zinc-950/70 p-6 shadow-2xl shadow-black/30 sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-300">Settings</p>
        <h1 className="mt-4 text-4xl font-black text-white">Account Settings</h1>

        <div className="mt-8 grid gap-4">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-zinc-400">Signed in as</p>
            <p className="mt-2 font-bold text-white">{session.user.email || "Connected account"}</p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <h2 className="text-xl font-black text-white">Legal Information</h2>
            <p className="mt-2 leading-7 text-zinc-300">
              Privacy, terms, and data handling pages will live here before this becomes a real
              public account system.
            </p>
          </div>

          <div className="rounded-lg border border-cyan-300/20 bg-cyan-950/20 p-4">
            <h2 className="text-xl font-black text-white">Delete My Account</h2>
            <p className="mt-2 leading-7 text-zinc-300">
              This needs a secure backend action before it can be safely enabled.
            </p>
            <button
              type="button"
              disabled
              className="mt-4 rounded-md border border-cyan-300/20 px-4 py-2 font-black text-cyan-200 opacity-60"
            >
              Coming Soon
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={signOut}
          className="mt-8 rounded-md bg-white px-5 py-3 font-black text-zinc-950 transition hover:bg-cyan-100"
        >
          Sign Out
        </button>
      </section>
    </main>
  );
}

function AdminPanel({ navigate }) {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [questions, setQuestions] = useState([]);
  const [resultBands, setResultBands] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [tab, setTab] = useState("questions");
  const [loading, setLoading] = useState(true);
  const [setupNeeded, setSetupNeeded] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      loadAdminData();
    }
  }, [session]);

  useEffect(() => {
    if (!loading && !session) {
      navigate("login", true);
    }
  }, [loading, session, navigate]);

  const loadAdminData = async () => {
    setError("");
    setMessage("");
    setSetupNeeded(false);

    const [
      { data: questionData, error: questionError },
      { data: submissionData, error: submissionError },
      { data: bandData, error: bandError },
    ] =
      await Promise.all([
        supabase
          .from("compatibility_questions")
          .select(
            "id,prompt,description,description_enabled,sort_order,active,compatibility_options(id,label,points,sort_order)"
          )
          .order("sort_order", { ascending: true })
          .order("sort_order", { referencedTable: "compatibility_options", ascending: true }),
        supabase
          .from("compatibility_submissions")
          .select("id,name,score,max_score,percent,result_tier,result_message,created_at,compatibility_answers(question_prompt,option_label,points)")
          .order("created_at", { ascending: false }),
        supabase
          .from("compatibility_result_bands")
          .select("id,min_percent,max_percent,title,message,sort_order")
          .order("sort_order", { ascending: true }),
      ]);

    if (questionError || submissionError || bandError) {
      setSetupNeeded(true);
      setError(
        questionError?.message ||
          submissionError?.message ||
          bandError?.message ||
          "Supabase could not load the admin tables."
      );
      setQuestions([]);
      setSubmissions([]);
      setResultBands([]);
      return;
    }

    setQuestions(questionData || []);
    setSubmissions(submissionData || []);
    setResultBands(bandData?.length ? bandData : fallbackResultBands);
  };

  const login = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    if (loginError) {
      setError(loginError.message);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const addQuestion = async (template = null) => {
    setError("");
    const nextOrder = questions.length + 1;
    const { data, error: insertError } = await supabase
      .from("compatibility_questions")
      .insert({
        prompt: template?.prompt || "New question",
        description: template?.description || "",
        description_enabled: Boolean(template?.description),
        sort_order: nextOrder,
        active: true,
      })
      .select("id")
      .single();

    if (insertError) {
      setError(insertError.message);
      return;
    }

    const answers =
      template?.answers || [
        ["Best answer", 10],
        ["Good answer", 7],
        ["Okay answer", 4],
        ["Bad answer", 0],
      ];

    await supabase.from("compatibility_options").insert(
      answers.map(([label, points], index) => ({
        question_id: data.id,
        label,
        points,
        sort_order: index + 1,
      }))
    );

    setMessage(template ? "Random question added." : "Question added.");
    loadAdminData();
  };

  const addRandomQuestion = () => {
    addQuestion(pickRandomItem(randomQuestionBank));
  };

  const fillRandomQuestion = async (questionId) => {
    const template = pickRandomItem(randomQuestionBank);
    await updateQuestion(questionId, {
      prompt: template.prompt,
      description: template.description,
      description_enabled: true,
    });

    const question = questions.find((item) => item.id === questionId);
    const options = question?.compatibility_options || [];
    await Promise.all(
      options.map((option, index) => {
        const answer = template.answers[index] || template.answers[template.answers.length - 1];
        return supabase
          .from("compatibility_options")
          .update({ label: answer[0], points: answer[1], sort_order: index + 1 })
          .eq("id", option.id);
      })
    );
    setMessage("Question randomized.");
    loadAdminData();
  };

  const fillRandomAnswer = async (questionId, optionId) => {
    const template = pickRandomItem(randomQuestionBank);
    const answer = pickRandomItem(template.answers);
    await updateOption(questionId, optionId, { label: answer[0], points: answer[1] });
  };

  const updateQuestion = async (id, changes) => {
    setQuestions((current) =>
      current.map((question) => (question.id === id ? { ...question, ...changes } : question))
    );

    const { error: updateError } = await supabase
      .from("compatibility_questions")
      .update(changes)
      .eq("id", id);

    if (updateError) setError(updateError.message);
  };

  const deleteQuestion = async (id) => {
    const { error: deleteError } = await supabase
      .from("compatibility_questions")
      .delete()
      .eq("id", id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setQuestions((current) => current.filter((question) => question.id !== id));
  };

  const updateOption = async (questionId, optionId, changes) => {
    setQuestions((current) =>
      current.map((question) =>
        question.id === questionId
          ? {
              ...question,
              compatibility_options: question.compatibility_options.map((option) =>
                option.id === optionId ? { ...option, ...changes } : option
              ),
            }
          : question
      )
    );

    const { error: updateError } = await supabase
      .from("compatibility_options")
      .update(changes)
      .eq("id", optionId);

    if (updateError) setError(updateError.message);
  };

  const addOption = async (question) => {
    const nextOrder = (question.compatibility_options || []).length + 1;
    const { error: insertError } = await supabase.from("compatibility_options").insert({
      question_id: question.id,
      label: "New answer",
      points: 0,
      sort_order: nextOrder,
    });

    if (insertError) {
      setError(insertError.message);
      return;
    }

    loadAdminData();
  };

  const deleteOption = async (optionId) => {
    const { error: deleteError } = await supabase
      .from("compatibility_options")
      .delete()
      .eq("id", optionId);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    loadAdminData();
  };

  const updateResultBand = async (id, changes) => {
    setResultBands((current) =>
      current.map((band) => (band.id === id ? { ...band, ...changes } : band))
    );

    const { error: updateError } = await supabase
      .from("compatibility_result_bands")
      .update(changes)
      .eq("id", id);

    if (updateError) setError(updateError.message);
  };

  const addResultBand = async () => {
    const { error: insertError } = await supabase.from("compatibility_result_bands").insert({
      min_percent: 0,
      max_percent: 100,
      title: "Custom Result",
      message: "Write the result text here.",
      sort_order: resultBands.length + 1,
    });

    if (insertError) {
      setError(insertError.message);
      return;
    }

    loadAdminData();
  };

  const deleteResultBand = async (id) => {
    const { error: deleteError } = await supabase
      .from("compatibility_result_bands")
      .delete()
      .eq("id", id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setResultBands((current) => current.filter((band) => band.id !== id));
  };

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-xl px-5 py-12 text-zinc-300">Loading admin...</main>
    );
  }

  if (!session) {
    return (
      <main className="mx-auto w-full max-w-md px-5 py-12 text-zinc-300">
        Redirecting to login...
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:py-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <BackButton onClick={() => navigate("dashboard")} />
        <button
          type="button"
          onClick={logout}
          className="rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-zinc-200 transition hover:border-white/30"
        >
          Sign out
        </button>
      </div>

      <section className="rounded-lg border border-white/10 bg-zinc-950/70 p-5 shadow-2xl shadow-black/30 sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-300">Admin</p>
        <h1 className="mt-4 text-4xl font-black text-white">Compatibility Control</h1>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTab("questions")}
            className={`rounded-full px-4 py-2 text-sm font-black ${
              tab === "questions" ? "bg-white text-zinc-950" : "bg-white/10 text-white"
            }`}
          >
            Questions
          </button>
          <button
            type="button"
            onClick={() => setTab("results")}
            className={`rounded-full px-4 py-2 text-sm font-black ${
              tab === "results" ? "bg-white text-zinc-950" : "bg-white/10 text-white"
            }`}
          >
            Results
          </button>
          <button
            type="button"
            onClick={() => setTab("advanced")}
            className={`rounded-full px-4 py-2 text-sm font-black ${
              tab === "advanced" ? "bg-white text-zinc-950" : "bg-white/10 text-white"
            }`}
          >
            Advanced Settings
          </button>
        </div>

        {error && (
          <div className="mt-5 rounded-md border border-cyan-300/30 bg-cyan-950/30 p-3 text-cyan-100">
            {error}
          </div>
        )}
        {setupNeeded && (
          <div className="mt-8 rounded-lg border border-cyan-300/30 bg-cyan-950/20 p-5">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-cyan-300">
              Database setup needed
            </p>
            <h2 className="mt-3 text-2xl font-black text-white">One Supabase step remains.</h2>
            <p className="mt-3 max-w-2xl leading-7 text-zinc-300">
              The login worked, but Supabase could not load one of the admin tables or columns.
              This usually means the newest SQL setup needs to be run again.
            </p>
            {error && (
              <p className="mt-4 rounded-md border border-cyan-300/20 bg-zinc-950 p-3 font-mono text-sm text-cyan-100">
                {error}
              </p>
            )}
            <p className="mt-4 rounded-md bg-white/5 p-3 font-mono text-sm text-zinc-200">
              Run C:\Users\dog_t\Desktop\thefinetest-live\supabase-setup.sql in Supabase SQL Editor.
            </p>
          </div>
        )}
        {message && (
          <div className="mt-5 rounded-md border border-emerald-300/30 bg-emerald-950/30 p-3 text-emerald-100">
            {message}
          </div>
        )}

        {!setupNeeded && tab === "questions" && (
          <div className="mt-8">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => addQuestion()}
                className="rounded-md bg-cyan-300 px-5 py-3 font-black text-zinc-950 transition hover:bg-white"
              >
                Add Question
              </button>
              <button
                type="button"
                onClick={addRandomQuestion}
                className="rounded-md bg-white/10 px-5 py-3 font-black text-white transition hover:bg-white/20"
              >
                Add Random Question
              </button>
            </div>

            <div className="mt-6 grid gap-5">
              {questions.map((question) => (
                <article key={question.id} className="rounded-lg border border-white/10 p-4">
                  <div className="grid gap-3 md:grid-cols-[88px_1fr_120px]">
                    <label>
                      <span className="mb-1 block text-xs font-black uppercase tracking-[0.18em] text-zinc-400">
                        Order
                      </span>
                      <input
                        type="number"
                        value={question.sort_order}
                        onChange={(event) =>
                          updateQuestion(question.id, { sort_order: Number(event.target.value) })
                        }
                        className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white"
                      />
                    </label>
                    <label>
                      <span className="mb-1 block text-xs font-black uppercase tracking-[0.18em] text-zinc-400">
                        Question
                      </span>
                      <input
                        value={question.prompt}
                        onChange={(event) =>
                          updateQuestion(question.id, { prompt: event.target.value })
                        }
                        className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white"
                      />
                    </label>
                    <label className="flex items-end gap-2 pb-2 text-sm font-bold text-zinc-200">
                      <button
                        type="button"
                        onClick={() => updateQuestion(question.id, { active: !question.active })}
                        className={`relative h-7 w-14 rounded-full transition ${
                          question.active ? "bg-emerald-400" : "bg-red-500"
                        }`}
                        aria-label={question.active ? "Disable question" : "Enable question"}
                      >
                        <span
                          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                            question.active ? "left-8" : "left-1"
                          }`}
                        />
                      </button>
                      {question.active ? "Active" : "Inactive"}
                    </label>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-400">
                      Description
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuestion(question.id, {
                          description_enabled: question.description_enabled === false,
                        })
                      }
                      className={`relative h-7 w-14 rounded-full transition ${
                        question.description_enabled !== false ? "bg-emerald-400" : "bg-red-500"
                      }`}
                      aria-label="Toggle description"
                    >
                      <span
                        className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                          question.description_enabled !== false ? "left-8" : "left-1"
                        }`}
                      />
                    </button>
                  </div>

                  {question.description_enabled !== false && (
                    <label className="mt-3 block">
                      <textarea
                        value={question.description || ""}
                        onChange={(event) =>
                          updateQuestion(question.id, { description: event.target.value })
                        }
                        rows="2"
                        className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white"
                      />
                    </label>
                  )}

                  <div className="mt-4 grid gap-3">
                    <div className="hidden grid-cols-[1fr_180px_auto] gap-2 px-3 text-xs font-black uppercase tracking-[0.16em] text-zinc-400 md:grid">
                      <span>Answer</span>
                      <span>How compatible is this answer?</span>
                      <span />
                    </div>
                    {(question.compatibility_options || []).map((option) => (
                      <div
                        key={option.id}
                        className="grid gap-2 rounded-md bg-white/5 p-3 md:grid-cols-[auto_1fr_180px_auto]"
                      >
                        <button
                          type="button"
                          onClick={() => fillRandomAnswer(question.id, option.id)}
                          className="rounded-md border border-white/10 px-3 py-2 text-lg transition hover:border-cyan-300 hover:-translate-y-1"
                          title="Random answer"
                        >
                          Dice
                        </button>
                        <input
                          value={option.label}
                          onChange={(event) =>
                            updateOption(question.id, option.id, { label: event.target.value })
                          }
                          className="rounded-md border border-white/10 bg-zinc-950 px-3 py-2 text-white"
                        />
                        <input
                          type="number"
                          value={option.points}
                          onChange={(event) =>
                            updateOption(question.id, option.id, {
                              points: Number(event.target.value),
                            })
                          }
                          className="rounded-md border border-white/10 bg-zinc-950 px-3 py-2 text-white"
                          aria-label="Points"
                        />
                        <button
                          type="button"
                          onClick={() => deleteOption(option.id)}
                          className="rounded-md border border-white/10 px-3 py-2 text-sm font-bold text-zinc-300 transition hover:border-cyan-300 hover:text-cyan-200"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => addOption(question)}
                      className="rounded-md bg-white/10 px-4 py-2 text-sm font-black text-white transition hover:bg-white/20"
                    >
                      Add Answer
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteQuestion(question.id)}
                      className="rounded-md border border-cyan-300/30 px-4 py-2 text-sm font-black text-cyan-200 transition hover:bg-cyan-950/50"
                    >
                      Delete Question
                    </button>
                    <button
                      type="button"
                      onClick={() => fillRandomQuestion(question.id)}
                      className="rounded-md border border-white/10 px-4 py-2 text-sm font-black text-zinc-200 transition hover:border-cyan-300 hover:text-white"
                    >
                      Randomize Question
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {!setupNeeded && tab === "results" && (
          <div className="mt-8 grid gap-4">
            {submissions.length === 0 && <p className="text-zinc-300">No submissions yet.</p>}
            {submissions.map((submission) => (
              <article key={submission.id} className="rounded-lg border border-white/10 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-black text-white">
                      {submission.name || "Anonymous"}
                    </h2>
                    {submission.contact && (
                      <p className="mt-1 text-sm text-zinc-400">{submission.contact}</p>
                    )}
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                      {new Date(submission.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-md bg-white p-4 text-center text-zinc-950">
                    <p className="text-3xl font-black">{submission.percent}%</p>
                    <p className="text-sm font-black text-cyan-600">{submission.result_tier}</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-2">
                  {(submission.compatibility_answers || []).map((answer) => (
                    <div key={`${submission.id}-${answer.question_prompt}`} className="rounded-md bg-white/5 p-3">
                      <p className="font-bold text-zinc-200">{answer.question_prompt}</p>
                      <p className="mt-1 text-sm text-zinc-400">
                        {answer.option_label} ({answer.points} pts)
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}

        {!setupNeeded && tab === "advanced" && (
          <div className="mt-8 grid gap-5">
            <div className="rounded-lg border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
                Result Text
              </p>
              <h2 className="mt-3 text-2xl font-black text-white">Compatibility result bands</h2>
              <p className="mt-3 max-w-2xl leading-7 text-zinc-300">
                Set the percentage ranges and the custom text people see after finishing the test.
                Example: 80 to 100 can say whatever you want high matches to see.
              </p>
            </div>

            <div className="grid gap-4">
              {resultBands.map((band) => (
                <article key={band.id} className="rounded-lg border border-white/10 p-4">
                  <div className="grid gap-3 md:grid-cols-[100px_100px_1fr_90px]">
                    <label>
                      <span className="mb-1 block text-xs font-black uppercase tracking-[0.16em] text-zinc-400">
                        From %
                      </span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={band.min_percent}
                        onChange={(event) =>
                          updateResultBand(band.id, { min_percent: Number(event.target.value) })
                        }
                        className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white"
                      />
                    </label>
                    <label>
                      <span className="mb-1 block text-xs font-black uppercase tracking-[0.16em] text-zinc-400">
                        To %
                      </span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={band.max_percent}
                        onChange={(event) =>
                          updateResultBand(band.id, { max_percent: Number(event.target.value) })
                        }
                        className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white"
                      />
                    </label>
                    <label>
                      <span className="mb-1 block text-xs font-black uppercase tracking-[0.16em] text-zinc-400">
                        Result title
                      </span>
                      <input
                        value={band.title}
                        onChange={(event) =>
                          updateResultBand(band.id, { title: event.target.value })
                        }
                        className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white"
                      />
                    </label>
                    <label>
                      <span className="mb-1 block text-xs font-black uppercase tracking-[0.16em] text-zinc-400">
                        Order
                      </span>
                      <input
                        type="number"
                        value={band.sort_order}
                        onChange={(event) =>
                          updateResultBand(band.id, { sort_order: Number(event.target.value) })
                        }
                        className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white"
                      />
                    </label>
                  </div>

                  <label className="mt-3 block">
                    <span className="mb-1 block text-xs font-black uppercase tracking-[0.16em] text-zinc-400">
                      Custom result message
                    </span>
                    <textarea
                      value={band.message || ""}
                      onChange={(event) =>
                        updateResultBand(band.id, { message: event.target.value })
                      }
                      rows="3"
                      className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => deleteResultBand(band.id)}
                    className="mt-3 rounded-md border border-cyan-300/30 px-4 py-2 text-sm font-black text-cyan-200 transition hover:bg-cyan-950/50"
                  >
                    Delete Band
                  </button>
                </article>
              ))}
            </div>

            <button
              type="button"
              onClick={addResultBand}
              className="w-fit rounded-md bg-cyan-300 px-5 py-3 font-black text-zinc-950 transition hover:bg-white"
            >
              Add Result Band
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default function App() {
  const [view, setView] = useState(() => getViewFromPath(window.location.pathname));

  useEffect(() => {
    const handlePopState = () => {
      setView(getViewFromPath(window.location.pathname));
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (nextView, replace = false) => {
    const nextPath = routes[nextView] || routes.landing;
    if (window.location.pathname !== nextPath) {
      if (replace) {
        window.history.replaceState({}, "", nextPath);
      } else {
        window.history.pushState({}, "", nextPath);
      }
    }
    setView(nextView);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-zinc-950 text-white">
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(135deg,#050505_0%,#09090b_55%,#18181b_100%)]" />
      {view === "landing" && <LoginPage navigate={navigate} isLanding />}
      {view === "dashboard" && <Hub navigate={navigate} />}
      {view === "calculator" && <FineCalculator navigate={navigate} />}
      {view === "compatibility" && <CompatibilityTest navigate={navigate} />}
      {view === "login" && <LoginPage navigate={navigate} />}
      {view === "admin" && <AdminPanel navigate={navigate} />}
      {view === "settings" && <SettingsPage navigate={navigate} />}
    </div>
  );
}


