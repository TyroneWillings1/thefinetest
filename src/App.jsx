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
  tests: "/tests",
  admin: "/compatible",
  settings: "/settings",
};

const ADVANCED_RESULTS_KEY = "fine_test_advanced_results_enabled";
const SELECTED_TEST_KEY = "fine_test_selected_test_id";
const TEST_DRAFT_KEY_PREFIX = "fine_test_editor_draft_";

const DEFAULT_QUIZ_DETAILS = {
  title: "Compatibility Test",
  description: "",
  public_id: "",
  email_notifications_enabled: false,
  short_test_enabled: false,
  short_question_count: 10,
};

const USERNAME_PATTERN = /^[a-z0-9_]{3,24}$/;
const TEST_ID_PATTERN = /^[a-z0-9]{6,12}$/;

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
  if (getSharedTestRoute(pathname).testId) return "compatibility";
  if (getAdminTestRoute(pathname).testId) return "admin";
  if (pathname === routes.dashboard) return "dashboard";
  if (pathname === routes.calculator) return "calculator";
  if (pathname === routes.compatibility) return "compatibility";
  if (pathname === routes.login) return "login";
  if (pathname === routes.tests) return "tests";
  if (pathname === routes.admin) return "admin";
  if (pathname === routes.settings) return "settings";
  return "landing";
}

function getSharedTestRoute(pathname) {
  const match = pathname.match(/^\/t\/([a-z0-9]{6,12})\/?$/i);
  return {
    testId: match?.[1]?.toLowerCase() || "",
  };
}

function getAdminTestRoute(pathname) {
  const match = pathname.match(/^\/compatible\/([a-z0-9]{6,12})\/?$/i);
  return {
    testId: match?.[1]?.toLowerCase() || "",
  };
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

function advancedResultsEnabled() {
  return window.localStorage.getItem(ADVANCED_RESULTS_KEY) === "true";
}

function getAdvancedResultsValue(settingData) {
  return settingData?.value?.enabled === true;
}

function getQuizDetailsValue(settingData) {
  const value = settingData?.value || settingData || {};
  return {
    title: value.title || DEFAULT_QUIZ_DETAILS.title,
    description: value.description || DEFAULT_QUIZ_DETAILS.description,
    public_id: value.public_id || DEFAULT_QUIZ_DETAILS.public_id,
    email_notifications_enabled: value.email_notifications_enabled === true,
    short_test_enabled: value.short_test_enabled === true,
    short_question_count: Number(
      value.short_question_count || DEFAULT_QUIZ_DETAILS.short_question_count
    ),
  };
}

function settingsByKey(settings = []) {
  return settings.reduce((all, item) => ({ ...all, [item.key]: item }), {});
}

function getTestDraftKey(testId) {
  return `${TEST_DRAFT_KEY_PREFIX}${testId}`;
}

function normalizeUsername(value = "") {
  return value.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 24);
}

function createTestId() {
  return Math.random().toString(36).replace(/[^a-z0-9]/g, "").slice(2, 8);
}

async function notifyResultSubmission(submissionId) {
  try {
    await fetch("/api/notify-result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submissionId }),
    });
  } catch (error) {
    console.warn("Result notification could not be sent.", error);
  }
}

function resultMarginRows(testId) {
  return fallbackResultBands.map(({ id, ...band }) => ({ ...band, test_id: testId }));
}

async function createCompatibilityTest(user, details = DEFAULT_QUIZ_DETAILS) {
  const publicId = TEST_ID_PATTERN.test(details.public_id) ? details.public_id : createTestId();
  const { data, error } = await supabase
    .from("compatibility_tests")
    .insert({
      owner_id: user.id,
      public_id: publicId,
      title: details.title || DEFAULT_QUIZ_DETAILS.title,
      description: details.description || "",
      email_notifications_enabled: details.email_notifications_enabled === true,
      short_test_enabled: details.short_test_enabled === true,
      short_question_count:
        Number(details.short_question_count) || DEFAULT_QUIZ_DETAILS.short_question_count,
      advanced_results_enabled: false,
    })
    .select("*")
    .single();

  if (error) return { data: null, error };

  await supabase.from("compatibility_result_bands").insert(resultMarginRows(data.id));
  return { data, error: null };
}

function usernameFromUser(user) {
  const source =
    user?.user_metadata?.user_name ||
    user?.user_metadata?.preferred_username ||
    user?.email?.split("@")[0] ||
    "user";
  const base = normalizeUsername(source) || "user";
  return base.length >= 3 ? base : `${base}123`;
}

async function ensureUserProfile(user) {
  if (!user) return null;

  const { data: existing, error: existingError } = await supabase
    .from("compatibility_profiles")
    .select("user_id,username,display_name")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) return existing;
  if (existingError) return null;

  const base = usernameFromUser(user);
  const candidates = [
    base,
    `${base}_${String(user.id).slice(0, 4)}`,
    `${base}_${Math.floor(1000 + Math.random() * 9000)}`,
  ];

  for (const username of candidates) {
    const { data, error } = await supabase
      .from("compatibility_profiles")
      .insert({
        user_id: user.id,
        username,
        display_name: user.email || "",
      })
      .select("user_id,username,display_name")
      .single();

    if (!error) return data;
  }

  return null;
}

function pickResultBand(percent, bands = fallbackResultBands) {
  const match = bands.find(
    (band) => percent >= Number(band.min_percent) && percent <= Number(band.max_percent)
  );
  if (match) return match;

  if (bands.length) {
    return bands.reduce((nearest, band) => {
      const bandDistance = Math.min(
        Math.abs(percent - Number(band.min_percent)),
        Math.abs(percent - Number(band.max_percent))
      );
      const nearestDistance = Math.min(
        Math.abs(percent - Number(nearest.min_percent)),
        Math.abs(percent - Number(nearest.max_percent))
      );

      return bandDistance < nearestDistance ? band : nearest;
    }, bands[0]);
  }

  const fallbackMatch = fallbackResultBands.find(
    (band) => percent >= Number(band.min_percent) && percent <= Number(band.max_percent)
  );
  return fallbackMatch || fallbackResultBands[fallbackResultBands.length - 1];
}

function pickRandomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffleItems(items = []) {
  return [...items].sort(() => Math.random() - 0.5);
}

function cloneQuestions(questions = []) {
  return questions.map((question) => ({
    ...question,
    compatibility_options: (question.compatibility_options || []).map((option) => ({ ...option })),
  }));
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
            onClick={() => navigate("tests")}
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
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate("login", true);
      }
      setCheckingSession(false);
    });
  }, [navigate]);

  const openAccount = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      setMenuOpen(true);
    } else {
      navigate("login");
    }
  };

  if (checkingSession) {
    return <main className="mx-auto w-full max-w-xl px-5 py-12 text-zinc-300">Loading...</main>;
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-5 py-12">
      <button
        type="button"
        onClick={openAccount}
        aria-label="Login"
        className="fixed right-5 top-5 h-9 w-16 rounded-full bg-white shadow-lg shadow-black/20 transition hover:scale-105 hover:bg-cyan-100"
      />

      <section className="grid gap-4">
        <button
          type="button"
          onClick={() => navigate("calculator")}
          className="group rounded-lg border border-white/10 bg-white p-6 text-left text-zinc-950 shadow-2xl shadow-black/30 transition hover:-translate-y-1"
        >
          <h1 className="text-3xl font-black">FINE Calculator</h1>
          <p className="mt-3 text-zinc-600">Rate the traits and reveal the tier.</p>
        </button>

        <button
          type="button"
          onClick={() => navigate("tests")}
          className="group rounded-lg border border-white/10 bg-zinc-900 p-6 text-left text-white shadow-2xl shadow-black/30 transition hover:-translate-y-1 hover:border-cyan-300/40"
        >
          <h2 className="text-3xl font-black">Compatibility Test</h2>
          <p className="mt-3 text-zinc-300">
            Test to see how compatible you are with anyone.
          </p>
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

function CompatibilityTest({ navigate, sharedTest = { testId: "" } }) {
  const [questions, setQuestions] = useState([]);
  const [resultBands, setResultBands] = useState(fallbackResultBands);
  const [useAdvancedResults, setUseAdvancedResults] = useState(false);
  const [quizDetails, setQuizDetails] = useState(DEFAULT_QUIZ_DETAILS);
  const [publicTest, setPublicTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [name, setName] = useState("");
  const [namePromptOpen, setNamePromptOpen] = useState(false);
  const [anonymousConfirmed, setAnonymousConfirmed] = useState(false);
  const [testLength, setTestLength] = useState("full");
  const [testLengthChosen, setTestLengthChosen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const isInviteLink = Boolean(sharedTest.testId);

  useEffect(() => {
    setUseAdvancedResults(advancedResultsEnabled());
    loadPublicQuestions();
  }, []);

  const loadPublicQuestions = async () => {
    setLoading(true);
    setError("");

    const { data: testData, error: testError } = sharedTest.testId
      ? await supabase
          .from("compatibility_tests")
          .select("*")
          .eq("public_id", sharedTest.testId)
          .maybeSingle()
      : { data: null, error: null };

    if (testError || !testData) {
      setError("This test link does not exist yet.");
      setQuestions([]);
      setLoading(false);
      return;
    }

    const [{ data, error: loadError }, { data: bandData }] = await Promise.all([
      supabase
        .from("compatibility_questions")
        .select(
          "id,prompt,description,description_enabled,sort_order,compatibility_options(id,label,points,sort_order)"
        )
        .eq("test_id", testData.id)
        .eq("active", true)
        .order("sort_order", { ascending: true })
        .order("sort_order", { referencedTable: "compatibility_options", ascending: true }),
      supabase
        .from("compatibility_result_bands")
        .select("id,min_percent,max_percent,title,message,sort_order")
        .eq("test_id", testData.id)
        .order("sort_order", { ascending: true }),
    ]);

    setUseAdvancedResults(testData.advanced_results_enabled === true);
    setQuizDetails(getQuizDetailsValue(testData));
    setPublicTest(testData);

    if (loadError) {
      setError("The compatibility test is not set up yet.");
      setQuestions([]);
    } else {
      setQuestions(
        (data || []).map((question) => ({
          ...question,
          compatibility_options: shuffleItems(question.compatibility_options || []),
        }))
      );
      if (bandData?.length) {
        setResultBands(bandData);
      }
    }

    setLoading(false);
  };

  const shortQuestionCount = Math.min(
    Math.max(1, Number(quizDetails.short_question_count) || DEFAULT_QUIZ_DETAILS.short_question_count),
    questions.length
  );
  const shortTestAvailable =
    quizDetails.short_test_enabled === true && questions.length > shortQuestionCount;
  const activeQuestions =
    shortTestAvailable && testLength === "short"
      ? questions.slice(0, shortQuestionCount)
      : questions;
  const estimateMinutes = (count) => Math.max(1, Math.ceil(count * 0.5));

  const totals = useMemo(() => {
    const score = activeQuestions.reduce((sum, question) => {
      const optionId = answers[question.id];
      const option = question.compatibility_options?.find((item) => item.id === optionId);
      return sum + (option?.points || 0);
    }, 0);

    const maxScore = activeQuestions.reduce((sum, question) => {
      const options = question.compatibility_options || [];
      const max = options.length ? Math.max(...options.map((option) => option.points || 0)) : 0;
      return sum + max;
    }, 0);

    const percent = maxScore ? Math.round((score / maxScore) * 100) : 0;
    const band = useAdvancedResults
      ? pickResultBand(percent, resultBands)
      : pickResultBand(percent, fallbackResultBands);
    return {
      score,
      maxScore,
      percent,
      tier: band?.title || getCompatibilityTier(percent),
      message: band?.message || "",
    };
  }, [answers, activeQuestions, resultBands, useAdvancedResults]);

  const submitTest = async (event, forceAnonymous = false) => {
    event.preventDefault();
    setError("");

    if (activeQuestions.some((question) => !answers[question.id])) {
      setError("Answer every question before submitting.");
      return;
    }

    if (!publicTest?.id) {
      setError("This test is not ready yet.");
      return;
    }

    if (!name.trim() && !anonymousConfirmed && !forceAnonymous) {
      setNamePromptOpen(true);
      return;
    }

    setSaving(true);
    const submissionId = crypto.randomUUID();

    const { error: submissionError } = await supabase
      .from("compatibility_submissions")
      .insert({
        id: submissionId,
        test_id: publicTest.id,
        name: name.trim() || null,
        score: totals.score,
        max_score: totals.maxScore,
        percent: totals.percent,
        result_tier: totals.tier,
        result_message: totals.message,
      });

    if (submissionError) {
      setError("Something went wrong saving your result.");
      setSaving(false);
      return;
    }

    const answerRows = activeQuestions.map((question) => {
      const option = question.compatibility_options.find((item) => item.id === answers[question.id]);
      return {
        submission_id: submissionId,
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
      notifyResultSubmission(submissionId);
    }

    setSaving(false);
  };

  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-8 sm:py-12">
      {!isInviteLink && <BackButton onClick={() => navigate("dashboard")} />}

      <section className="rounded-lg border border-white/10 bg-zinc-950/70 p-5 shadow-2xl shadow-black/30 sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-300">
          Compatibility
        </p>
        <h1 className="mt-4 text-4xl font-black text-white">{quizDetails.title}</h1>
        {quizDetails.description && (
          <p className="mt-4 leading-7 text-zinc-300">{quizDetails.description}</p>
        )}

        {loading && <p className="mt-8 text-zinc-300">Loading questions...</p>}

        {!loading && error && (
          <div className="mt-8 rounded-lg border border-cyan-300/30 bg-cyan-950/30 p-4 text-cyan-100">
            {error}
          </div>
        )}

        {!loading && !result && questions.length > 0 && shortTestAvailable && !testLengthChosen && (
          <div className="mt-8">
            <h2 className="text-2xl font-black text-white">Take the short quiz or long quiz?</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setTestLength("short");
                  setTestLengthChosen(true);
                }}
                className="rounded-lg border border-cyan-300/40 bg-white/5 p-5 text-left transition hover:bg-white/10"
              >
                <span className="block text-2xl font-black text-white">Short Quiz</span>
                <span className="mt-2 block text-sm font-bold text-cyan-300">
                  {shortQuestionCount} questions · about {estimateMinutes(shortQuestionCount)} min
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setTestLength("full");
                  setTestLengthChosen(true);
                }}
                className="rounded-lg border border-white/10 bg-white p-5 text-left text-zinc-950 transition hover:bg-cyan-100"
              >
                <span className="block text-2xl font-black">Long Quiz</span>
                <span className="mt-2 block text-sm font-bold text-cyan-700">
                  {questions.length} questions · about {estimateMinutes(questions.length)} min
                </span>
              </button>
            </div>
          </div>
        )}

        {!loading &&
          !result &&
          questions.length > 0 &&
          (!shortTestAvailable || testLengthChosen) && (
          <form onSubmit={submitTest} className="mt-8 grid gap-6">
            {shortTestAvailable && (
              <button
                type="button"
                onClick={() => setTestLengthChosen(false)}
                className="w-fit text-xs font-black uppercase tracking-[0.18em] text-cyan-300 transition hover:text-white"
              >
                Change quiz length
              </button>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-zinc-200">
                Name <span className="text-cyan-300">(optional, but encouraged)</span>
              </span>
              <input
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setNamePromptOpen(false);
                  setAnonymousConfirmed(false);
                }}
                className="w-full rounded-md border border-cyan-300/60 bg-transparent px-4 py-3 text-white shadow-[0_0_0_1px_rgba(103,232,249,0.12),0_0_24px_rgba(34,211,238,0.16)] outline-none transition focus:border-cyan-100 focus:shadow-[0_0_0_1px_rgba(103,232,249,0.28),0_0_34px_rgba(34,211,238,0.32)]"
                placeholder="Your name"
              />
            </label>

            {activeQuestions.map((question, index) => (
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

            {namePromptOpen && (
              <div className="rounded-lg border border-cyan-300/30 bg-cyan-950/20 p-4">
                <p className="font-black text-white">Are you sure you do not want to attach a name?</p>
                <p className="mt-1 text-sm leading-6 text-zinc-300">
                  It makes your result easier to recognize later.
                </p>
                <button
                  type="button"
                  onClick={(event) => {
                    setAnonymousConfirmed(true);
                    setNamePromptOpen(false);
                    submitTest(event, true);
                  }}
                  className="mt-3 rounded-md border border-white/10 px-4 py-2 text-sm font-black text-zinc-200 transition hover:border-cyan-300"
                >
                  Submit without a name
                </button>
              </div>
            )}

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
    const isPasswordRecovery = window.location.hash.includes("type=recovery");

    supabase.auth.getSession().then(({ data }) => {
      if (isPasswordRecovery) {
        setMode("reset");
      } else if (data.session) {
        navigate("dashboard", true);
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setMode("reset");
        setLoading(false);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [navigate]);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");

    const result =
      mode === "reset"
        ? await supabase.auth.updateUser({ password })
        : mode === "signin"
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
    } else if (mode === "reset") {
      setMessage("Password updated. You can sign in with the new password now.");
      setMode("signin");
      setPassword("");
      await supabase.auth.signOut();
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
      setError(
        socialError.message.toLowerCase().includes("provider")
          ? `${provider === "google" ? "Google" : "Facebook"} login is not enabled in Supabase yet. Enable the provider in Supabase Auth, then this button will work.`
          : socialError.message
      );
      setBusy(false);
    }
  };

  const sendPasswordReset = async () => {
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Enter your email first, then hit forgot password.");
      return;
    }

    setBusy(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/login`,
    });

    if (resetError) {
      setError(resetError.message);
    } else {
      setMessage("Password reset email sent. Check your inbox.");
    }
    setBusy(false);
  };

  if (loading) {
    return <main className="mx-auto w-full max-w-md px-5 py-12 text-zinc-300">Loading...</main>;
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-5 py-12">
      {!isLanding && <BackButton onClick={() => navigate("landing")} />}

      <section className="rounded-lg border border-white/10 bg-zinc-950/70 p-6 shadow-2xl shadow-black/30">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-300">
          {mode === "reset" ? "Reset password" : mode === "signin" ? "Coming back?" : "New here?"}
        </p>
        <h1 className="mt-4 text-4xl font-black text-white">
          {mode === "reset" ? "New password" : mode === "signin" ? "Sign in" : "Sign up"}
        </h1>
        <p className="mt-3 leading-7 text-zinc-300">
          {mode === "reset"
            ? "Choose a new password for your account."
            : mode === "signin"
              ? "Log in to manage your tests, saves, and settings."
              : "Create an account to build tests and collect results."}
        </p>

        {mode !== "reset" && <div className="mt-6 grid grid-cols-2 rounded-full bg-white/5 p-1">
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
        </div>}

        {mode !== "reset" && <div className="mt-6 grid gap-3">
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
        </div>}

        {mode !== "reset" && <div className="my-6 flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
          <span className="h-px flex-1 bg-white/10" />
          or
          <span className="h-px flex-1 bg-white/10" />
        </div>}

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
          {mode !== "reset" && <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-md border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-300"
            placeholder="Email"
            required
          />}
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded-md border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-300"
            placeholder={mode === "reset" ? "New password" : "Password"}
            required
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded-md bg-cyan-300 px-6 py-3 font-black text-zinc-950 transition hover:bg-white disabled:opacity-60"
          >
            {busy
              ? "One sec..."
              : mode === "reset"
                ? "Update Password"
                : mode === "signin"
                  ? "Sign In"
                  : "Create Account"}
          </button>
        </form>

        {mode === "signin" && (
          <button
            type="button"
            onClick={sendPasswordReset}
            disabled={busy}
            className="mt-4 text-sm font-black text-cyan-200 underline-offset-4 hover:underline disabled:opacity-60"
          >
            Forgot password?
          </button>
        )}

        <p className="mt-5 text-sm leading-6 text-zinc-400">
          Google and Facebook require Supabase Auth provider setup before those buttons work.
        </p>
      </section>
    </main>
  );
}

function SettingsPage({ navigate }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      if (!data.session) {
        navigate("login", true);
      } else {
        const loadedProfile = await ensureUserProfile(data.session.user);
        setProfile(loadedProfile);
        setUsername(loadedProfile?.username || "");
      }
      setLoading(false);
    });
  }, [navigate]);

  useEffect(() => {
    const nextUsername = normalizeUsername(username);
    setUsernameStatus("");

    if (!session || !nextUsername || nextUsername === profile?.username) return;
    if (!USERNAME_PATTERN.test(nextUsername)) {
      setUsernameStatus("Use 3-24 lowercase letters, numbers, or underscores.");
      return;
    }

    const checkUsername = window.setTimeout(async () => {
      const { data, error: checkError } = await supabase
        .from("compatibility_profiles")
        .select("user_id")
        .eq("username", nextUsername)
        .maybeSingle();

      if (checkError) {
        setUsernameStatus("");
      } else if (data && data.user_id !== session.user.id) {
        setUsernameStatus("Username taken.");
      } else {
        setUsernameStatus("Username available.");
      }
    }, 350);

    return () => window.clearTimeout(checkUsername);
  }, [username, profile?.username, session]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("landing", true);
  };

  const saveUsername = async () => {
    setError("");
    setMessage("");

    const nextUsername = normalizeUsername(username);
    if (!USERNAME_PATTERN.test(nextUsername)) {
      setError("Use 3-24 characters: lowercase letters, numbers, and underscores only.");
      return;
    }

    const { data: existingUsername } = await supabase
      .from("compatibility_profiles")
      .select("user_id")
      .eq("username", nextUsername)
      .maybeSingle();

    if (existingUsername && existingUsername.user_id !== session.user.id) {
      setError("That username is already taken.");
      setUsernameStatus("Username taken.");
      return;
    }

    const { data, error: updateError } = await supabase
      .from("compatibility_profiles")
      .upsert({
        user_id: session.user.id,
        username: nextUsername,
        display_name: session.user.email || "",
        updated_at: new Date().toISOString(),
      })
      .select("user_id,username,display_name")
      .single();

    if (updateError) {
      setError(
        updateError.code === "23505"
          ? "That username is already taken."
          : updateError.message
      );
      return;
    }

    setProfile(data);
    setUsername(data.username);
    setUsernameStatus("Username saved.");
    setMessage("Username saved.");
  };

  const deleteAccount = async () => {
    setError("");
    setMessage("");
    setDeleting(true);

    const { error: deleteError } = await supabase.rpc("delete_current_user");

    if (deleteError) {
      setError(
        deleteError.message.includes("function")
          ? "Account deletion needs the newest Supabase SQL setup first."
          : deleteError.message
      );
      setDeleting(false);
      return;
    }

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
            <h2 className="text-xl font-black text-white">Username</h2>
            <p className="mt-2 leading-7 text-zinc-300">
              Your username is saved to your account for identity and future profile features.
              Share links currently use short test IDs.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
              <label>
                <span className="mb-1 block text-xs font-black uppercase tracking-[0.18em] text-zinc-400">
                  Account username
                </span>
                <input
                  value={username}
                  onChange={(event) => setUsername(normalizeUsername(event.target.value))}
                  className="w-full rounded-md border border-white/10 bg-zinc-950 px-3 py-2 text-white"
                  placeholder="username"
                />
                {usernameStatus && (
                  <span
                    className={`mt-2 block text-sm font-bold ${
                      usernameStatus.includes("available") || usernameStatus.includes("saved")
                        ? "text-emerald-300"
                        : "text-cyan-200"
                    }`}
                  >
                    {usernameStatus}
                  </span>
                )}
              </label>
              <button
                type="button"
                onClick={saveUsername}
                className="self-end rounded-md bg-cyan-300 px-5 py-2 font-black text-zinc-950 transition hover:bg-white"
              >
                Save
              </button>
            </div>
            {message && <p className="mt-3 text-sm font-bold text-emerald-300">{message}</p>}
            {error && <p className="mt-3 text-sm font-bold text-cyan-200">{error}</p>}
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <h2 className="text-xl font-black text-white">Legal Information</h2>
            <p className="mt-2 leading-7 text-zinc-300">
              The FINE Test stores account details, quiz content, and compatibility results so
              users can manage their own tests. Do not submit sensitive personal information.
              User-created quiz text belongs to the user who created it.
            </p>
            <p className="mt-3 leading-7 text-zinc-300">
              Copyright 2026 The FINE Test. All rights reserved. The site design, scoring tools,
              and original interface content may not be copied or republished without permission.
            </p>
          </div>

          <div className="rounded-lg border border-cyan-300/20 bg-cyan-950/20 p-4">
            <h2 className="text-xl font-black text-white">Delete My Account</h2>
            <p className="mt-2 leading-7 text-zinc-300">
              This permanently deletes your account, profile, tests, questions, and collected
              results. This cannot be undone.
            </p>
            {!deleteConfirm ? (
              <button
                type="button"
                onClick={() => setDeleteConfirm(true)}
                className="mt-4 rounded-md border border-red-400/40 px-4 py-2 font-black text-red-200 hover:bg-red-950/40"
              >
                Delete My Account
              </button>
            ) : (
              <div className="mt-4 flex flex-wrap items-center gap-2 rounded-md border border-red-400/40 bg-red-950/30 p-3">
                <span className="text-sm font-bold text-red-100">Are you sure?</span>
                <button
                  type="button"
                  onClick={deleteAccount}
                  disabled={deleting}
                  className="rounded-md bg-red-400 px-3 py-2 text-sm font-black text-zinc-950 disabled:opacity-60"
                >
                  {deleting ? "Deleting..." : "Yes, Delete"}
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(false)}
                  disabled={deleting}
                  className="rounded-md bg-white/10 px-3 py-2 text-sm font-black text-white disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            )}
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

function TestManager({ navigate, navigateToPath }) {
  const [session, setSession] = useState(null);
  const [tests, setTests] = useState([]);
  const [questionCounts, setQuestionCounts] = useState({});
  const [submissions, setSubmissions] = useState([]);
  const [expandedSubmissionIds, setExpandedSubmissionIds] = useState([]);
  const [mode, setMode] = useState("");
  const [confirmDelete, setConfirmDelete] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (!data.session) {
        navigate("login", true);
        setLoading(false);
        return;
      }

      loadTests(data.session);
    });
  }, [navigate]);

  const loadTests = async (activeSession = session) => {
    if (!activeSession?.user?.id) return;
    setError("");
    const { data: testRows, error: testsError } = await supabase
      .from("compatibility_tests")
      .select("*")
      .eq("owner_id", activeSession.user.id)
      .order("created_at", { ascending: true });

    if (testsError) {
      setError(testsError.message);
      setLoading(false);
      return;
    }

    setTests(testRows || []);

    const counts = {};
    await Promise.all(
      (testRows || []).map(async (test) => {
        const { count } = await supabase
          .from("compatibility_questions")
          .select("id", { count: "exact", head: true })
          .eq("test_id", test.id);
        counts[test.id] = count || 0;
      })
    );
    setQuestionCounts(counts);

    const testIds = (testRows || []).map((test) => test.id);
    const { data: submissionData, error: submissionError } = await supabase
      .from("compatibility_submissions")
      .select("id,test_id,name,score,max_score,percent,result_tier,result_message,owner_note,created_at,compatibility_answers(question_prompt,option_label,points)")
      .order("created_at", { ascending: false });

    if (submissionError) {
      setError(submissionError.message);
    } else {
      setSubmissions((submissionData || []).filter((submission) => testIds.includes(submission.test_id)));
    }

    setLoading(false);
  };

  const ensureShareId = async (test) => {
    if (TEST_ID_PATTERN.test(test.public_id)) return test.public_id;

    const nextTestId = createTestId();
    const { error: saveError } = await supabase
      .from("compatibility_tests")
      .update({ public_id: nextTestId, updated_at: new Date().toISOString() })
      .eq("id", test.id)
      .eq("owner_id", session.user.id);

    if (saveError) {
      setError(saveError.message);
      return "";
    }

    setTests((current) =>
      current.map((item) => (item.id === test.id ? { ...item, public_id: nextTestId } : item))
    );
    return nextTestId;
  };

  const copyShareLink = async (test) => {
    setError("");
    const testId = await ensureShareId(test);
    if (!testId) return;

    await navigator.clipboard.writeText(`${window.location.origin}/t/${testId}`);
    setMessage("Share link copied.");
  };

  const createNewTest = async () => {
    const created = await createCompatibilityTest(session.user);
    if (created.error) {
      setError(created.error.message);
      return;
    }

    window.localStorage.setItem(SELECTED_TEST_KEY, created.data.id);
    navigateToPath(`/compatible/${created.data.public_id}`, "admin");
  };

  const editTest = async (test) => {
    const testId = await ensureShareId(test);
    if (!testId) return;

    window.localStorage.setItem(SELECTED_TEST_KEY, test.id);
    navigateToPath(`/compatible/${testId}`, "admin");
  };

  const deleteTest = async (test) => {
    setError("");
    setMessage("");

    const { error: deleteError } = await supabase
      .from("compatibility_tests")
      .delete()
      .eq("id", test.id)
      .eq("owner_id", session.user.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setConfirmDelete("");
    setTests((current) => current.filter((item) => item.id !== test.id));
    setSubmissions((current) => current.filter((submission) => submission.test_id !== test.id));
    setMessage("Test deleted.");
  };

  const deleteSubmission = async (id) => {
    setError("");
    setMessage("");

    const { error: deleteError } = await supabase
      .from("compatibility_submissions")
      .delete()
      .eq("id", id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setSubmissions((current) => current.filter((submission) => submission.id !== id));
    setExpandedSubmissionIds((current) => current.filter((submissionId) => submissionId !== id));
    setMessage("Result deleted.");
  };

  const updateSubmissionNote = (id, note) => {
    setSubmissions((current) =>
      current.map((submission) =>
        submission.id === id ? { ...submission, owner_note: note } : submission
      )
    );
  };

  const saveSubmissionNote = async (id, note) => {
    setError("");
    setMessage("");

    const { error: noteError } = await supabase
      .from("compatibility_submissions")
      .update({ owner_note: note.trim() })
      .eq("id", id);

    if (noteError) {
      setError(noteError.message);
      return;
    }

    updateSubmissionNote(id, note.trim());
    setMessage("Result note saved.");
  };

  const toggleSubmissionAnswers = (id) => {
    setExpandedSubmissionIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  if (loading) {
    return <main className="mx-auto w-full max-w-2xl px-5 py-12 text-zinc-300">Loading tests...</main>;
  }

  if (!session) {
    return <main className="mx-auto w-full max-w-2xl px-5 py-12 text-zinc-300">Redirecting...</main>;
  }

  const currentTest = tests[0];
  const quizDetails = getQuizDetailsValue(currentTest || DEFAULT_QUIZ_DETAILS);
  const questionCount = currentTest ? questionCounts[currentTest.id] || 0 : 0;
  const visibleSubmissions = currentTest
    ? submissions.filter((submission) => submission.test_id === currentTest.id)
    : [];

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-8 sm:py-12">
      <BackButton onClick={() => navigate("dashboard")} />

      <section className="rounded-lg border border-white/10 bg-zinc-950/70 p-5 shadow-2xl shadow-black/30 sm:p-6">
        <h1 className="text-3xl font-black text-white">Compatibility Tests</h1>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => setMode("list")}
            className="rounded-lg border border-cyan-300/40 bg-white/5 p-4 text-left transition hover:bg-white/10"
          >
            <span className="block text-xl font-black text-white">Edit Existing Test</span>
            <span className="mt-1 block text-sm text-zinc-400">Open your saved tests</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("results")}
            className="rounded-lg border border-white/10 bg-white/5 p-4 text-left transition hover:border-cyan-300/40 hover:bg-white/10"
          >
            <span className="block text-xl font-black text-white">Test Results</span>
            <span className="mt-1 block text-sm text-zinc-400">Review submissions</span>
          </button>
          <button
            type="button"
            onClick={createNewTest}
            className="rounded-lg border border-white/10 bg-white p-4 text-left text-zinc-950 transition hover:bg-cyan-100"
          >
            <span className="block text-xl font-black">Create New Test</span>
            <span className="mt-1 block text-sm text-zinc-600">Start with a blank editor</span>
          </button>
        </div>

        {error && (
          <div className="animate-soft-in mt-4 rounded-md border border-cyan-300/30 bg-cyan-950/30 p-3 text-cyan-100">
            {error}
          </div>
        )}
        {message && (
          <div className="mt-5 rounded-md border border-emerald-300/30 bg-emerald-950/30 p-3 text-emerald-100">
            {message}
          </div>
        )}

        {mode === "list" && (
          <div className="mt-6 grid gap-3">
            <article className="rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-white">{quizDetails.title}</h2>
                  {quizDetails.description && (
                    <p className="mt-1 text-sm leading-6 text-zinc-400">{quizDetails.description}</p>
                  )}
                  <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
                    {questionCount} questions
                    {quizDetails.public_id ? ` · /t/${quizDetails.public_id}` : ""}
                  </p>
                </div>
                <div className="grid w-full gap-2 sm:w-auto sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => currentTest && editTest(currentTest)}
                    className="rounded-md bg-cyan-300 px-4 py-2 text-sm font-black text-zinc-950 transition hover:bg-white"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => currentTest && copyShareLink(currentTest)}
                    className="rounded-md border border-cyan-300/30 px-4 py-2 text-sm font-black text-cyan-200 transition hover:bg-cyan-950/50"
                  >
                    Share
                  </button>
                  <button
                    type="button"
                    onClick={() => currentTest && setConfirmDelete(currentTest.id)}
                    className="rounded-md border border-red-400/40 px-4 py-2 text-sm font-black text-red-200 transition hover:bg-red-950/40"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {confirmDelete === currentTest?.id && (
                <div className="mt-4 flex flex-wrap items-center gap-2 rounded-md border border-red-400/40 bg-red-950/30 p-3">
                  <span className="text-sm font-bold text-red-100">Delete this test?</span>
                  <button
                    type="button"
                    onClick={() => currentTest && deleteTest(currentTest)}
                    className="rounded-md bg-red-400 px-3 py-2 text-sm font-black text-zinc-950"
                  >
                    Yes, Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete("")}
                    className="rounded-md bg-white/10 px-3 py-2 text-sm font-black text-white"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </article>
          </div>
        )}

        {mode === "results" && (
          <div className="mt-6 grid gap-4">
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                Test Results
              </p>
              <h2 className="mt-2 text-2xl font-black text-white">{quizDetails.title}</h2>
              <p className="mt-1 text-sm text-zinc-400">
                {visibleSubmissions.length} saved {visibleSubmissions.length === 1 ? "submission" : "submissions"}
              </p>
            </div>

            {visibleSubmissions.length === 0 && (
              <p className="rounded-lg border border-white/10 bg-white/5 p-4 text-zinc-300">
                No results yet.
              </p>
            )}

            {visibleSubmissions.map((submission) => {
              const answersExpanded = expandedSubmissionIds.includes(submission.id);
              const answerCount = submission.compatibility_answers?.length || 0;

              return (
              <article key={submission.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-black text-white">
                      {submission.name || "Anonymous"}
                    </h3>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                      {new Date(submission.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-md bg-white p-4 text-center text-zinc-950">
                    <p className="text-3xl font-black">{submission.percent}%</p>
                    <p className="text-sm font-black text-cyan-600">{submission.result_tier}</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto]">
                  <label>
                    <span className="mb-1 block text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
                      Private note
                    </span>
                    <input
                      value={submission.owner_note || ""}
                      onChange={(event) => updateSubmissionNote(submission.id, event.target.value)}
                      className="w-full rounded-md border border-white/10 bg-zinc-950/70 px-3 py-2 text-sm text-white"
                      placeholder="Add a note about who this might be..."
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => saveSubmissionNote(submission.id, submission.owner_note || "")}
                    className="self-end rounded-md border border-white/10 px-4 py-2 text-sm font-black text-zinc-200 transition hover:border-cyan-300 hover:text-cyan-200"
                  >
                    Save Note
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => toggleSubmissionAnswers(submission.id)}
                    className="rounded-md border border-cyan-300/30 px-4 py-2 text-sm font-black text-cyan-200 transition hover:bg-cyan-950/50"
                  >
                    {answersExpanded ? "Hide Answers" : `Show Answers (${answerCount})`}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteSubmission(submission.id)}
                    className="rounded-md border border-red-400/40 px-4 py-2 text-sm font-black text-red-200 transition hover:bg-red-950/40"
                  >
                    Delete Result
                  </button>
                </div>

                {answersExpanded && (
                  <div className="animate-soft-in mt-4 grid gap-2">
                    {(submission.compatibility_answers || []).map((answer) => (
                      <div
                        key={`${submission.id}-${answer.question_prompt}`}
                        className="rounded-md bg-zinc-950/70 p-3"
                      >
                        <p className="font-bold text-zinc-200">{answer.question_prompt}</p>
                        <p className="mt-1 text-sm text-zinc-400">
                          {answer.option_label} ({answer.points} pts)
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

function AdminPanel({ navigate, adminTest = { testId: "" } }) {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [questions, setQuestions] = useState([]);
  const [savedQuestions, setSavedQuestions] = useState([]);
  const [resultBands, setResultBands] = useState([]);
  const [savedResultBands, setSavedResultBands] = useState([]);
  const [advancedResultsOn, setAdvancedResultsOn] = useState(false);
  const [savedAdvancedResultsOn, setSavedAdvancedResultsOn] = useState(false);
  const [deletedResultBandIds, setDeletedResultBandIds] = useState([]);
  const [quizDetails, setQuizDetails] = useState(DEFAULT_QUIZ_DETAILS);
  const [savedQuizDetails, setSavedQuizDetails] = useState(DEFAULT_QUIZ_DETAILS);
  const [activeTest, setActiveTest] = useState(null);
  const [profile, setProfile] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [expandedSubmissionIds, setExpandedSubmissionIds] = useState([]);
  const [tab, setTab] = useState("questions");
  const [loading, setLoading] = useState(true);
  const [editorReady, setEditorReady] = useState(false);
  const [savingTest, setSavingTest] = useState(false);
  const [saveConfirmed, setSaveConfirmed] = useState(false);
  const [setupNeeded, setSetupNeeded] = useState(false);
  const [confirmClearQuestions, setConfirmClearQuestions] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setAdvancedResultsOn(advancedResultsEnabled());
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
  }, [session?.user?.id, adminTest.testId]);

  useEffect(() => {
    if (!activeTest?.id || !editorReady || setupNeeded || loading) return;

    window.localStorage.setItem(
      getTestDraftKey(activeTest.id),
      JSON.stringify({
        quizDetails,
        questions,
        updatedAt: new Date().toISOString(),
      })
    );
  }, [activeTest?.id, quizDetails, questions, editorReady, setupNeeded, loading]);

  useEffect(() => {
    if (!loading && !session) {
      navigate("login", true);
    }
  }, [loading, session, navigate]);

  const loadAdminData = async () => {
    setError("");
    setMessage("");
    setSetupNeeded(false);
    setEditorReady(false);

    const { data: testRows, error: testsError } = await supabase
      .from("compatibility_tests")
      .select("*")
      .eq("owner_id", session.user.id)
      .order("created_at", { ascending: true });

    if (testsError) {
      setSetupNeeded(true);
      setError(testsError.message);
      return;
    }

    const requestedTestId = adminTest.testId;
    let currentTest =
      (requestedTestId && testRows?.find((test) => test.public_id === requestedTestId)) ||
      testRows?.find((test) => test.id === window.localStorage.getItem(SELECTED_TEST_KEY)) ||
      testRows?.[0];

    if (requestedTestId && !currentTest) {
      setError("That editor link is not connected to this account.");
      setQuestions([]);
      setSubmissions([]);
      setResultBands([]);
      setEditorReady(false);
      return;
    }

    if (!currentTest) {
      const created = await createCompatibilityTest(session.user);
      if (created.error) {
        setSetupNeeded(true);
        setError(created.error.message);
        return;
      }
      currentTest = created.data;
    }

    window.localStorage.setItem(SELECTED_TEST_KEY, currentTest.id);
    setActiveTest(currentTest);

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
          .eq("test_id", currentTest.id)
          .order("sort_order", { ascending: true })
          .order("sort_order", { referencedTable: "compatibility_options", ascending: true }),
        supabase
          .from("compatibility_submissions")
          .select("id,name,score,max_score,percent,result_tier,result_message,owner_note,created_at,compatibility_answers(question_prompt,option_label,points)")
          .eq("test_id", currentTest.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("compatibility_result_bands")
          .select("id,min_percent,max_percent,title,message,sort_order")
          .eq("test_id", currentTest.id)
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

    const loadedQuestions = cloneQuestions(questionData || []);
    const advancedEnabled = currentTest.advanced_results_enabled === true;
    const loadedQuizDetails = getQuizDetailsValue(currentTest);
    let draft = null;

    try {
      draft = JSON.parse(window.localStorage.getItem(getTestDraftKey(currentTest.id)) || "null");
    } catch {
      draft = null;
    }

    const draftQuestions = Array.isArray(draft?.questions) ? cloneQuestions(draft.questions) : null;
    const draftQuizDetails = draft?.quizDetails
      ? getQuizDetailsValue(draft.quizDetails)
      : null;

    setQuestions(draftQuestions || loadedQuestions);
    setSavedQuestions(cloneQuestions(loadedQuestions));
    setSubmissions(submissionData || []);
    let loadedBands = bandData || [];
    if (loadedBands.length === 0) {
      await supabase.from("compatibility_result_bands").insert(resultMarginRows(currentTest.id));
      const { data: freshBands } = await supabase
        .from("compatibility_result_bands")
        .select("id,min_percent,max_percent,title,message,sort_order")
        .eq("test_id", currentTest.id)
        .order("sort_order", { ascending: true });
      loadedBands = freshBands || [];
    }
    setResultBands(loadedBands);
    setSavedResultBands(loadedBands);
    setDeletedResultBandIds([]);
    setAdvancedResultsOn(advancedEnabled);
    setSavedAdvancedResultsOn(advancedEnabled);
    setQuizDetails(draftQuizDetails || loadedQuizDetails);
    setSavedQuizDetails(loadedQuizDetails);
    window.localStorage.setItem(ADVANCED_RESULTS_KEY, String(advancedEnabled));
    setEditorReady(true);

    const loadedProfile = await ensureUserProfile(session.user);
    setProfile(loadedProfile);
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
    if (!activeTest?.id) {
      setError("The test is still loading. Try again in a second.");
      return;
    }

    const nextOrder = questions.length + 1;
    const { data, error: insertError } = await supabase
      .from("compatibility_questions")
      .insert({
        test_id: activeTest.id,
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

    const { data: optionData, error: optionInsertError } = await supabase
      .from("compatibility_options")
      .insert(
        answers.map(([label, points], index) => ({
          question_id: data.id,
          label,
          points,
          sort_order: index + 1,
        }))
      )
      .select("id,label,points,sort_order");

    if (optionInsertError) {
      await supabase.from("compatibility_questions").delete().eq("id", data.id);
      setError(optionInsertError.message);
      return;
    }

    const nextQuestion = {
      id: data.id,
      prompt: template?.prompt || "New question",
      description: template?.description || "",
      description_enabled: Boolean(template?.description),
      sort_order: nextOrder,
      active: true,
      compatibility_options: optionData || [],
    };

    setMessage(template ? "Random question added." : "Question added.");
    setQuestions((current) => [...current, nextQuestion]);
    setSavedQuestions((current) => [...current, cloneQuestions([nextQuestion])[0]]);
  };

  const addRandomQuestion = () => {
    addQuestion(pickRandomItem(randomQuestionBank));
  };

  const fillRandomQuestion = async (questionId) => {
    const template = pickRandomItem(randomQuestionBank);
    updateQuestion(questionId, {
      prompt: template.prompt,
      description: template.description,
      description_enabled: true,
    });

    setQuestions((current) =>
      current.map((question) =>
        question.id === questionId
          ? {
              ...question,
              compatibility_options: (question.compatibility_options || []).map(
                (option, index) => {
                  const answer =
                    template.answers[index] || template.answers[template.answers.length - 1];
                  return { ...option, label: answer[0], points: answer[1], sort_order: index + 1 };
                }
              ),
            }
          : question
      )
    );
    setMessage("Question randomized. Hit Save Test to keep it.");
  };

  const fillRandomAnswer = (questionId, optionId) => {
    const template = pickRandomItem(randomQuestionBank);
    const answer = pickRandomItem(template.answers);
    updateOption(questionId, optionId, { label: answer[0], points: answer[1] });
  };

  const updateQuestion = (id, changes) => {
    setQuestions((current) =>
      current.map((question) => (question.id === id ? { ...question, ...changes } : question))
    );
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
    setSavedQuestions((current) => current.filter((question) => question.id !== id));
    setMessage("Question deleted.");
  };

  const clearAllQuestions = async () => {
    setError("");
    const { error: deleteError } = await supabase
      .from("compatibility_questions")
      .delete()
      .eq("test_id", activeTest.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setQuestions([]);
    setSavedQuestions([]);
    setConfirmClearQuestions(false);
    setMessage("All questions cleared.");
  };

  const saveQuizDetails = async () => {
    setError("");
    setMessage("");
    setSavingTest(true);
    setSaveConfirmed(false);

    const nextTestId = TEST_ID_PATTERN.test(quizDetails.public_id)
      ? quizDetails.public_id
      : createTestId();
    const cleanedDetails = {
      title: quizDetails.title.trim() || DEFAULT_QUIZ_DETAILS.title,
      description: quizDetails.description.trim(),
      public_id: nextTestId,
      email_notifications_enabled: quizDetails.email_notifications_enabled === true,
      short_test_enabled: quizDetails.short_test_enabled === true,
      short_question_count: Math.max(
        1,
        Number(quizDetails.short_question_count) || DEFAULT_QUIZ_DETAILS.short_question_count
      ),
    };

    const { error: saveError } = await supabase
      .from("compatibility_tests")
      .update({
        public_id: cleanedDetails.public_id,
        title: cleanedDetails.title,
        description: cleanedDetails.description,
        email_notifications_enabled: cleanedDetails.email_notifications_enabled,
        short_test_enabled: cleanedDetails.short_test_enabled,
        short_question_count: cleanedDetails.short_question_count,
        updated_at: new Date().toISOString(),
      })
      .eq("id", activeTest.id)
      .eq("owner_id", session.user.id);

    if (saveError) {
      setError(saveError.message);
      setSavingTest(false);
      return;
    }

    const saveResults = await Promise.all([
      ...questions.map((question) =>
        supabase
        .from("compatibility_questions")
        .update({
          prompt: question.prompt,
          description: question.description || "",
          description_enabled: question.description_enabled !== false,
          sort_order: question.sort_order,
          active: question.active !== false,
        })
        .eq("id", question.id)
      ),
      ...questions.flatMap((question) =>
        (question.compatibility_options || []).map((option) =>
          supabase
          .from("compatibility_options")
          .update({
            label: option.label,
            points: Number(option.points) || 0,
            sort_order: option.sort_order,
          })
            .eq("id", option.id)
        )
      ),
    ]);

    const failedSave = saveResults.find((result) => result.error);
    if (failedSave?.error) {
      setError(failedSave.error.message);
      setSavingTest(false);
      return;
    }

    setQuizDetails(cleanedDetails);
    setSavedQuizDetails(cleanedDetails);
    setSavedQuestions(cloneQuestions(questions));
    setSavingTest(false);
    setSaveConfirmed(true);
    setMessage(`Test saved at ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}.`);
    window.setTimeout(() => setSaveConfirmed(false), 2500);
  };

  const discardQuizDetails = () => {
    setQuizDetails(savedQuizDetails);
    setQuestions(cloneQuestions(savedQuestions));
    setError("");
    setMessage("Unsaved test edits discarded.");
  };

  const copyShareLink = async () => {
    let details = quizDetails;
    if (!TEST_ID_PATTERN.test(details.public_id)) {
      const nextTestId = createTestId();
      details = { ...details, public_id: nextTestId };
      const { error: saveError } = await supabase
        .from("compatibility_tests")
        .update({
          public_id: nextTestId,
          title: details.title.trim() || DEFAULT_QUIZ_DETAILS.title,
          description: details.description.trim(),
          email_notifications_enabled: details.email_notifications_enabled === true,
          short_test_enabled: details.short_test_enabled === true,
          short_question_count: Math.max(
            1,
            Number(details.short_question_count) || DEFAULT_QUIZ_DETAILS.short_question_count
          ),
          updated_at: new Date().toISOString(),
        })
        .eq("id", activeTest.id)
        .eq("owner_id", session.user.id);

      if (saveError) {
        setError(saveError.message);
        return;
      }

      setQuizDetails(details);
      setSavedQuizDetails(details);
    }

    const link = `${window.location.origin}/t/${details.public_id}`;
    await navigator.clipboard.writeText(link);
    setMessage("Share link copied.");
  };

  const updateOption = (questionId, optionId, changes) => {
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
  };

  const addOption = async (question) => {
    const nextOrder = (question.compatibility_options || []).length + 1;
    const { data, error: insertError } = await supabase
      .from("compatibility_options")
      .insert({
        question_id: question.id,
        label: "New answer",
        points: 0,
        sort_order: nextOrder,
      })
      .select("id,label,points,sort_order")
      .single();

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setQuestions((current) =>
      current.map((item) =>
        item.id === question.id
          ? {
              ...item,
              compatibility_options: [...(item.compatibility_options || []), data],
            }
          : item
      )
    );
    setSavedQuestions((current) =>
      current.map((item) =>
        item.id === question.id
          ? {
              ...item,
              compatibility_options: [...(item.compatibility_options || []), { ...data }],
            }
          : item
      )
    );
    setMessage("Answer added.");
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

    setQuestions((current) =>
      current.map((question) => ({
        ...question,
        compatibility_options: (question.compatibility_options || []).filter(
          (option) => option.id !== optionId
        ),
      }))
    );
    setSavedQuestions((current) =>
      current.map((question) => ({
        ...question,
        compatibility_options: (question.compatibility_options || []).filter(
          (option) => option.id !== optionId
        ),
      }))
    );
    setMessage("Answer deleted.");
  };

  const updateResultBand = (id, changes) => {
    setResultBands((current) =>
      current.map((band) => (band.id === id ? { ...band, ...changes } : band))
    );
  };

  const addResultBand = () => {
    setResultBands((current) => [
      ...current,
      {
        id: `draft-${Date.now()}`,
        test_id: activeTest?.id,
        min_percent: 0,
        max_percent: 100,
        title: "Custom Result",
        message: "Write the result text here.",
        sort_order: current.length + 1,
      },
    ]);
  };

  const deleteResultBand = (id) => {
    if (!String(id).startsWith("draft-")) {
      setDeletedResultBandIds((current) => [...new Set([...current, id])]);
    }

    setResultBands((current) => current.filter((band) => band.id !== id));
  };

  const discardAdvancedSettings = () => {
    setResultBands(savedResultBands);
    setAdvancedResultsOn(savedAdvancedResultsOn);
    setQuizDetails(savedQuizDetails);
    setDeletedResultBandIds([]);
    setError("");
    setMessage("Advanced settings discarded.");
  };

  const saveAdvancedSettings = async () => {
    setError("");
    setMessage("");
    const cleanedDetails = {
      ...quizDetails,
      title: quizDetails.title.trim() || DEFAULT_QUIZ_DETAILS.title,
      description: quizDetails.description.trim(),
      email_notifications_enabled: quizDetails.email_notifications_enabled === true,
      short_test_enabled: quizDetails.short_test_enabled === true,
      short_question_count: Math.max(
        1,
        Number(quizDetails.short_question_count) || DEFAULT_QUIZ_DETAILS.short_question_count
      ),
    };

    const { error: settingError } = await supabase
      .from("compatibility_tests")
      .update({
        advanced_results_enabled: advancedResultsOn,
        title: cleanedDetails.title,
        description: cleanedDetails.description,
        email_notifications_enabled: cleanedDetails.email_notifications_enabled,
        short_test_enabled: cleanedDetails.short_test_enabled,
        short_question_count: cleanedDetails.short_question_count,
        updated_at: new Date().toISOString(),
      })
      .eq("id", activeTest.id)
      .eq("owner_id", session.user.id);

    if (settingError) {
      setError(settingError.message);
      return;
    }

    const deleteIds = deletedResultBandIds.filter((id) => !String(id).startsWith("draft-"));
    if (deleteIds.length) {
      const { error: deleteError } = await supabase
        .from("compatibility_result_bands")
        .delete()
        .in("id", deleteIds);

      if (deleteError) {
        setError(deleteError.message);
        return;
      }
    }

    const existingBands = resultBands.filter((band) => !String(band.id).startsWith("draft-"));
    const draftBands = resultBands.filter((band) => String(band.id).startsWith("draft-"));

    for (const band of existingBands) {
      const { id, ...changes } = band;
      const { error: updateError } = await supabase
        .from("compatibility_result_bands")
        .update(changes)
        .eq("id", id);

      if (updateError) {
        setError(updateError.message);
        return;
      }
    }

    if (draftBands.length) {
      const { error: insertError } = await supabase.from("compatibility_result_bands").insert(
        draftBands.map(({ id, ...band }) => ({ ...band, test_id: activeTest.id }))
      );

      if (insertError) {
        setError(insertError.message);
        return;
      }
    }

    window.localStorage.setItem(ADVANCED_RESULTS_KEY, String(advancedResultsOn));
    setQuizDetails(cleanedDetails);
    setSavedQuizDetails(cleanedDetails);
    setMessage("Advanced settings saved.");
    loadAdminData();
  };

  const deleteSubmission = async (id) => {
    const { error: deleteError } = await supabase
      .from("compatibility_submissions")
      .delete()
      .eq("id", id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setSubmissions((current) => current.filter((submission) => submission.id !== id));
    setExpandedSubmissionIds((current) => current.filter((submissionId) => submissionId !== id));
  };

  const updateSubmissionNote = (id, note) => {
    setSubmissions((current) =>
      current.map((submission) =>
        submission.id === id ? { ...submission, owner_note: note } : submission
      )
    );
  };

  const saveSubmissionNote = async (id, note) => {
    setError("");
    setMessage("");

    const { error: noteError } = await supabase
      .from("compatibility_submissions")
      .update({ owner_note: note.trim() })
      .eq("id", id);

    if (noteError) {
      setError(noteError.message);
      return;
    }

    updateSubmissionNote(id, note.trim());
    setMessage("Result note saved.");
  };

  const toggleSubmissionAnswers = (id) => {
    setExpandedSubmissionIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const sortedResultMargins = [...resultBands].sort(
    (a, b) => Number(a.min_percent) - Number(b.min_percent)
  );
  const resultMarginGaps = sortedResultMargins.reduce((gaps, margin, index) => {
    const min = Number(margin.min_percent);
    const previousMax = index === 0 ? -1 : Number(sortedResultMargins[index - 1].max_percent);

    if (index === 0 && min > 0) {
      return [...gaps, `0-${min - 1}%`];
    }

    if (index > 0 && min > previousMax + 1) {
      return [...gaps, `${previousMax + 1}-${min - 1}%`];
    }

    return gaps;
  }, []);
  const lastMarginMax = sortedResultMargins.length
    ? Number(sortedResultMargins[sortedResultMargins.length - 1].max_percent)
    : 100;
  const allResultMarginGaps =
    lastMarginMax < 100 ? [...resultMarginGaps, `${lastMarginMax + 1}-100%`] : resultMarginGaps;

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
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:py-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <BackButton onClick={() => navigate("dashboard")} />
        <button
          type="button"
          onClick={logout}
          className="rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-zinc-200 hover:border-white/30"
        >
          Sign out
        </button>
      </div>

      <section className="animate-soft-in rounded-lg border border-white/10 bg-zinc-950/70 p-4 shadow-2xl shadow-black/30 sm:p-5">
        <h1 className="text-3xl font-black text-white sm:text-4xl">Make your compatibility quiz</h1>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-2">
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
              onClick={() => setTab("advanced")}
              className={`rounded-full px-4 py-2 text-sm font-black ${
                tab === "advanced" ? "bg-white text-zinc-950" : "bg-white/10 text-white"
              }`}
            >
              Advanced Settings
            </button>
          </div>
          <button
            type="button"
            onClick={copyShareLink}
            className="ml-auto rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-black text-cyan-200 hover:bg-cyan-950/50"
          >
            Copy Share Link
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
        </div>

        {error && (
          <div className="mt-5 rounded-md border border-cyan-300/30 bg-cyan-950/30 p-3 text-cyan-100">
            {error}
          </div>
        )}
        {setupNeeded && (
          <div className="animate-soft-in mt-6 rounded-lg border border-cyan-300/30 bg-cyan-950/20 p-4">
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
          <div className="animate-soft-in mt-4 rounded-md border border-emerald-300/30 bg-emerald-950/30 p-3 text-emerald-100">
            {message}
          </div>
        )}

        {!setupNeeded && tab === "questions" && (
          <div className="animate-soft-in mt-4">
            <div className="mb-4 rounded-lg border border-cyan-300/40 bg-transparent p-3 shadow-[0_0_0_1px_rgba(103,232,249,0.08),0_18px_50px_rgba(0,0,0,0.22)]">
              <div className="grid gap-3 md:grid-cols-[1fr_1.25fr_170px]">
                <label>
                  <span className="mb-1 block text-xs font-black uppercase tracking-[0.18em] text-zinc-400">
                    Test name
                  </span>
                  <input
                    value={quizDetails.title}
                    onChange={(event) =>
                      setQuizDetails((current) => ({ ...current, title: event.target.value }))
                    }
                    className="w-full rounded-md border border-cyan-300/25 bg-black/20 px-3 py-2 text-white"
                    placeholder="Compatibility Test"
                  />
                </label>
                <label>
                  <span className="mb-1 block text-xs font-black uppercase tracking-[0.18em] text-zinc-400">
                    Test description
                  </span>
                  <input
                    value={quizDetails.description}
                    onChange={(event) =>
                      setQuizDetails((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-cyan-300/25 bg-black/20 px-3 py-2 text-white"
                    placeholder=""
                  />
                </label>
                <label>
                  <span className="mb-1 block text-xs font-black uppercase tracking-[0.18em] text-zinc-400">
                    Share id
                  </span>
                  <input
                    value={quizDetails.public_id || "created on save"}
                    readOnly
                    className="w-full rounded-md border border-cyan-300/20 bg-black/20 px-3 py-2 text-zinc-400"
                  />
                </label>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-md border border-cyan-300/20 bg-black/20 px-3 py-2">
                <div>
                  <p className="text-sm font-black text-white">
                    Receive email notifications about results?
                  </p>
                  <p className="mt-1 text-xs text-zinc-400">
                    Sends an email when someone submits this quiz.
                  </p>
                </div>
                <label className="flex items-center gap-2 text-sm font-bold text-zinc-200">
                  <button
                    type="button"
                    onClick={() =>
                      setQuizDetails((current) => ({
                        ...current,
                        email_notifications_enabled: !current.email_notifications_enabled,
                      }))
                    }
                    className={`relative h-4 w-8 rounded-full transition ${
                      quizDetails.email_notifications_enabled ? "bg-emerald-400" : "bg-red-500"
                    }`}
                    aria-label="Toggle email notifications for this quiz"
                  >
                    <span
                      className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition ${
                        quizDetails.email_notifications_enabled ? "left-[18px]" : "left-0.5"
                      }`}
                    />
                  </button>
                  {quizDetails.email_notifications_enabled ? "Enabled" : "Disabled"}
                </label>
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              {questions.map((question, questionIndex) => (
                <article
                  key={question.id}
                  className="animate-soft-in rounded-lg border border-cyan-300/25 bg-transparent p-3 shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
                >
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-cyan-300 px-2 text-sm font-black text-zinc-950">
                        {questionIndex + 1}
                      </span>
                      <span className="text-xs font-black uppercase tracking-[0.18em] text-zinc-400">
                        Question {questionIndex + 1} of {questions.length}
                      </span>
                    </div>
                    <label className="flex items-center gap-2 text-sm font-bold text-zinc-200">
                      <button
                        type="button"
                        onClick={() => updateQuestion(question.id, { active: !question.active })}
                        className={`relative h-4 w-8 rounded-full ${
                          question.active ? "bg-emerald-400" : "bg-red-500"
                        }`}
                        aria-label={question.active ? "Disable question" : "Enable question"}
                      >
                        <span
                          className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition ${
                            question.active ? "left-[18px]" : "left-0.5"
                          }`}
                        />
                      </button>
                      {question.active ? "Active" : "Inactive"}
                    </label>
                  </div>

                  <div className="grid gap-2">
                    <label>
                      <span className="mb-1 block text-xs font-black uppercase tracking-[0.18em] text-zinc-400">
                        Question text
                      </span>
                      <input
                        value={question.prompt}
                        onChange={(event) =>
                          updateQuestion(question.id, { prompt: event.target.value })
                        }
                        className="w-full rounded-md border border-cyan-300/20 bg-black/20 px-3 py-2 text-white"
                      />
                    </label>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
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
                      className={`relative h-4 w-8 rounded-full transition ${
                        question.description_enabled !== false ? "bg-emerald-400" : "bg-red-500"
                      }`}
                      aria-label="Toggle description"
                    >
                      <span
                        className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition ${
                          question.description_enabled !== false ? "left-[18px]" : "left-0.5"
                        }`}
                      />
                    </button>
                  </div>

                  {question.description_enabled !== false && (
                    <label className="mt-2 block">
                      <textarea
                        value={question.description || ""}
                        onChange={(event) =>
                          updateQuestion(question.id, { description: event.target.value })
                        }
                        rows="2"
                        className="w-full rounded-md border border-cyan-300/20 bg-black/20 px-3 py-2 text-white"
                      />
                    </label>
                  )}

                  <div className="mt-3 grid gap-2">
                    <div className="hidden grid-cols-[1fr_150px_auto_auto] gap-2 px-3 text-xs font-black uppercase tracking-[0.16em] text-zinc-400 md:grid">
                      <span>Answer</span>
                      <span>Compatibility score (0-10 pts)</span>
                      <span />
                      <span />
                    </div>
                    {(question.compatibility_options || []).map((option) => (
                      <div
                        key={option.id}
                        className="grid gap-2 rounded-md border border-white/10 bg-transparent p-2 md:grid-cols-[1fr_150px_auto_auto]"
                      >
                        <input
                          value={option.label}
                          onChange={(event) =>
                            updateOption(question.id, option.id, { label: event.target.value })
                          }
                          className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-white"
                        />
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={option.points}
                          onChange={(event) =>
                            updateOption(question.id, option.id, {
                              points: Number(event.target.value),
                            })
                          }
                          className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-white"
                          aria-label="Points"
                        />
                        <button
                          type="button"
                          onClick={() => deleteOption(option.id)}
                          className="rounded-md border border-white/10 px-3 py-2 text-sm font-bold text-zinc-300 hover:border-cyan-300 hover:text-cyan-200"
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => fillRandomAnswer(question.id, option.id)}
                          className="rounded-md border border-white/10 px-3 py-2 text-xl hover:border-cyan-300"
                          title="Random answer"
                          aria-label="Random answer"
                        >
                          🎲
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => addOption(question)}
                      className="rounded-md bg-white/10 px-4 py-2 text-sm font-black text-white hover:bg-white/20"
                    >
                      Add Answer
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteQuestion(question.id)}
                      className="rounded-md border border-cyan-300/30 px-4 py-2 text-sm font-black text-cyan-200 hover:bg-cyan-950/50"
                    >
                      Delete Question
                    </button>
                    <button
                      type="button"
                      onClick={() => fillRandomQuestion(question.id)}
                      className="rounded-md border border-white/10 px-4 py-2 text-sm font-black text-zinc-200 hover:border-cyan-300 hover:text-white"
                    >
                      Randomize Question
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="sticky bottom-7 mt-4 grid gap-2 rounded-lg border border-white/10 bg-zinc-950/95 p-2 shadow-2xl shadow-black/40 backdrop-blur sm:flex sm:flex-wrap">
              <button
                type="button"
                onClick={() => addQuestion()}
                className="rounded-md bg-cyan-300 px-4 py-2 text-sm font-black text-zinc-950 hover:bg-white"
              >
                Add Question
              </button>
              <button
                type="button"
                onClick={addRandomQuestion}
                className="rounded-md bg-white/10 px-4 py-2 text-sm font-black text-white hover:bg-white/20"
              >
                Add Random Question
              </button>
              <button
                type="button"
                onClick={saveQuizDetails}
                disabled={savingTest}
                className={`rounded-md px-4 py-2 text-sm font-black text-zinc-950 disabled:cursor-wait ${
                  saveConfirmed
                    ? "bg-emerald-300"
                    : savingTest
                      ? "bg-cyan-200"
                      : "bg-white hover:bg-cyan-100"
                }`}
              >
                {saveConfirmed ? "Saved" : savingTest ? "Saving..." : "Save Test"}
              </button>
              <button
                type="button"
                onClick={discardQuizDetails}
                className="rounded-md border border-white/10 px-4 py-2 text-sm font-black text-white hover:border-white/30"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={copyShareLink}
                className="rounded-md border border-cyan-300/30 px-4 py-2 text-sm font-black text-cyan-200 hover:bg-cyan-950/50"
              >
                Copy Share Link
              </button>
              {!confirmClearQuestions ? (
                <button
                  type="button"
                  onClick={() => setConfirmClearQuestions(true)}
                  className="rounded-md border border-red-400/40 px-4 py-2 text-sm font-black text-red-200 hover:bg-red-950/40 sm:ml-auto"
                >
                  Clear All Questions
                </button>
              ) : (
                <div className="flex flex-wrap items-center gap-2 rounded-md border border-red-400/40 bg-red-950/30 px-3 py-2 sm:ml-auto">
                  <span className="text-sm font-bold text-red-100">Confirm?</span>
                  <button
                    type="button"
                    onClick={clearAllQuestions}
                    className="rounded-md bg-red-400 px-3 py-2 text-sm font-black text-zinc-950"
                  >
                    Yes, Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmClearQuestions(false)}
                    className="rounded-md bg-white/10 px-3 py-2 text-sm font-black text-white"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <p className="mt-6 text-center text-sm text-zinc-400">
              Want to change the outcome message?{" "}
              <button
                type="button"
                onClick={() => setTab("advanced")}
                className="font-black text-cyan-300 underline-offset-4 hover:underline"
              >
                Open Advanced Settings
              </button>
            </p>
          </div>
        )}

        {!setupNeeded && tab === "results" && (
          <div className="mt-8 grid gap-4">
            {submissions.length === 0 && <p className="text-zinc-300">No submissions yet.</p>}
            {submissions.map((submission) => {
              const answersExpanded = expandedSubmissionIds.includes(submission.id);
              const answerCount = submission.compatibility_answers?.length || 0;

              return (
              <article key={submission.id} className="rounded-lg border border-white/10 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-black text-white">
                      {submission.name || "Anonymous"}
                    </h2>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                      {new Date(submission.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-md bg-white p-4 text-center text-zinc-950">
                    <p className="text-3xl font-black">{submission.percent}%</p>
                    <p className="text-sm font-black text-cyan-600">{submission.result_tier}</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto]">
                  <label>
                    <span className="mb-1 block text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
                      Private note
                    </span>
                    <input
                      value={submission.owner_note || ""}
                      onChange={(event) => updateSubmissionNote(submission.id, event.target.value)}
                      className="w-full rounded-md border border-white/10 bg-zinc-950/70 px-3 py-2 text-sm text-white"
                      placeholder="Add a note about who this might be..."
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => saveSubmissionNote(submission.id, submission.owner_note || "")}
                    className="self-end rounded-md border border-white/10 px-4 py-2 text-sm font-black text-zinc-200 transition hover:border-cyan-300 hover:text-cyan-200"
                  >
                    Save Note
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => toggleSubmissionAnswers(submission.id)}
                    className="rounded-md border border-cyan-300/30 px-4 py-2 text-sm font-black text-cyan-200 transition hover:bg-cyan-950/50"
                  >
                    {answersExpanded ? "Hide Answers" : `Show Answers (${answerCount})`}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteSubmission(submission.id)}
                    className="rounded-md border border-red-400/40 px-4 py-2 text-sm font-black text-red-200 transition hover:bg-red-950/40"
                  >
                    Delete Result
                  </button>
                </div>

                {answersExpanded && (
                  <div className="animate-soft-in mt-4 grid gap-2">
                    {(submission.compatibility_answers || []).map((answer) => (
                      <div key={`${submission.id}-${answer.question_prompt}`} className="rounded-md bg-white/5 p-3">
                        <p className="font-bold text-zinc-200">{answer.question_prompt}</p>
                        <p className="mt-1 text-sm text-zinc-400">
                          {answer.option_label} ({answer.points} pts)
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </article>
              );
            })}
          </div>
        )}

        {!setupNeeded && tab === "advanced" && (
          <div className="mt-8 grid gap-5">
            <div className="rounded-lg border border-white/10 bg-white/5 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
                    Test Length
                  </p>
                  <h2 className="mt-3 text-2xl font-black text-white">
                    Want to give an option for a shorter test?
                  </h2>
                  <p className="mt-3 max-w-2xl leading-7 text-zinc-300">
                    When enabled, shared test links ask people to choose between a short quiz and
                    the full quiz before they start.
                  </p>
                </div>
                <label className="flex items-center gap-3 text-sm font-black text-zinc-200">
                  <button
                    type="button"
                    onClick={() =>
                      setQuizDetails((current) => ({
                        ...current,
                        short_test_enabled: !current.short_test_enabled,
                      }))
                    }
                    className={`relative h-4 w-8 rounded-full transition ${
                      quizDetails.short_test_enabled ? "bg-emerald-400" : "bg-red-500"
                    }`}
                    aria-label="Toggle short test option"
                  >
                    <span
                      className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition ${
                        quizDetails.short_test_enabled ? "left-[18px]" : "left-0.5"
                      }`}
                    />
                  </button>
                  {quizDetails.short_test_enabled ? "Enabled" : "Disabled"}
                </label>
              </div>

              {quizDetails.short_test_enabled && (
                <label className="mt-5 block max-w-xs">
                  <span className="mb-1 block text-xs font-black uppercase tracking-[0.16em] text-zinc-400">
                    Questions in short quiz
                  </span>
                  <input
                    type="number"
                    min="1"
                    max={Math.max(1, questions.length - 1)}
                    value={quizDetails.short_question_count}
                    onChange={(event) =>
                      setQuizDetails((current) => ({
                        ...current,
                        short_question_count: Number(event.target.value),
                      }))
                    }
                    className="w-full rounded-md border border-white/10 bg-zinc-950 px-3 py-2 text-white"
                    placeholder="10"
                  />
                  <span className="mt-2 block text-sm text-zinc-400">
                    Example: 10 questions is about {Math.max(1, Math.ceil(10 * 0.5))} minutes.
                  </span>
                </label>
              )}
            </div>

            <div className="rounded-lg border border-white/10 bg-white/5 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
                    Result Text
                  </p>
                  <h2 className="mt-3 text-2xl font-black text-white">
                    Custom result margins
                  </h2>
                  <p className="mt-3 max-w-2xl leading-7 text-zinc-300">
                    Turn this on when you want your own result messages. When it is off, the test
                    uses the default result text below, but your custom margins stay saved.
                  </p>
                </div>
                <label className="flex items-center gap-3 text-sm font-black text-zinc-200">
                  <button
                    type="button"
                    onClick={() => setAdvancedResultsOn((current) => !current)}
                    className={`relative h-4 w-8 rounded-full transition ${
                      advancedResultsOn ? "bg-emerald-400" : "bg-red-500"
                    }`}
                    aria-label="Toggle custom result margins"
                  >
                    <span
                      className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition ${
                        advancedResultsOn ? "left-[18px]" : "left-0.5"
                      }`}
                    />
                  </button>
                  {advancedResultsOn ? "Enabled" : "Disabled"}
                </label>
              </div>
              {!advancedResultsOn && (
                <div className="mt-5 rounded-md border border-white/10 bg-zinc-950/70 p-4 opacity-60">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-400">
                    Default result text
                  </p>
                  <div className="mt-3 grid gap-2 text-sm text-zinc-300">
                    {fallbackResultBands.map((band) => (
                      <p key={band.id}>
                        <span className="font-black text-white">
                          {band.min_percent}-{band.max_percent}%: {band.title}
                        </span>{" "}
                        {band.message}
                      </p>
                    ))}
                  </div>
                </div>
              )}
              {advancedResultsOn && allResultMarginGaps.length > 0 && (
                <div className="mt-5 rounded-md border border-amber-300/30 bg-amber-950/20 p-4 text-amber-100">
                  <p className="font-black">Some percentages do not have a custom margin yet.</p>
                  <p className="mt-1 text-sm leading-6">
                    Missing: {allResultMarginGaps.join(", ")}. Those scores will use the nearest
                    custom margin until you add an exact range.
                  </p>
                </div>
              )}
            </div>

            <div className={`grid gap-4 ${advancedResultsOn ? "" : "pointer-events-none opacity-45"}`}>
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
                    Delete Margin
                  </button>
                </article>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={addResultBand}
                disabled={!advancedResultsOn}
                className="rounded-md bg-cyan-300 px-5 py-3 font-black text-zinc-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Add Result Margin
              </button>
              <button
                type="button"
                onClick={saveAdvancedSettings}
                className="rounded-md bg-white px-5 py-3 font-black text-zinc-950 transition hover:bg-cyan-100"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={discardAdvancedSettings}
                className="rounded-md border border-white/10 px-5 py-3 font-black text-white transition hover:border-white/30"
              >
                Discard Changes
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function SiteFooter() {
  return (
    <footer className="fixed bottom-3 left-0 right-0 z-10 pointer-events-none px-5 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-600">
      Copyright 2026 thefinetest (TM) Brian Inc.
    </footer>
  );
}

export default function App() {
  const [view, setView] = useState(() => getViewFromPath(window.location.pathname));
  const [sharedTest, setSharedTest] = useState(() => getSharedTestRoute(window.location.pathname));
  const [adminTest, setAdminTest] = useState(() => getAdminTestRoute(window.location.pathname));

  useEffect(() => {
    const handlePopState = () => {
      setView(getViewFromPath(window.location.pathname));
      setSharedTest(getSharedTestRoute(window.location.pathname));
      setAdminTest(getAdminTestRoute(window.location.pathname));
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
    setSharedTest({ testId: "" });
    setAdminTest({ testId: "" });
    setView(nextView);
  };

  const navigateToPath = (path, nextView = getViewFromPath(path), replace = false) => {
    if (window.location.pathname !== path) {
      if (replace) {
        window.history.replaceState({}, "", path);
      } else {
        window.history.pushState({}, "", path);
      }
    }
    setSharedTest(getSharedTestRoute(path));
    setAdminTest(getAdminTestRoute(path));
    setView(nextView);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-zinc-950 text-white">
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(135deg,#050505_0%,#09090b_55%,#18181b_100%)]" />
      {view === "landing" && <LoginPage navigate={navigate} isLanding />}
      {view === "dashboard" && <Hub navigate={navigate} />}
      {view === "calculator" && <FineCalculator navigate={navigate} />}
      {view === "compatibility" && (
        <CompatibilityTest navigate={navigate} sharedTest={sharedTest} />
      )}
      {view === "login" && <LoginPage navigate={navigate} />}
      {view === "tests" && <TestManager navigate={navigate} navigateToPath={navigateToPath} />}
      {view === "admin" && <AdminPanel navigate={navigate} adminTest={adminTest} />}
      {view === "settings" && <SettingsPage navigate={navigate} />}
      <SiteFooter />
    </div>
  );
}


