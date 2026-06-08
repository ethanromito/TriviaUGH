const STORAGE_KEYS = {
  profile: "triviugh.profile",
  groups: "triviugh.groups",
  activeGroup: "triviugh.activeGroup",
  records: "triviugh.records"
};

const fallbackStorage = new Map();
const TOPIC_QUESTION_POINTS = 10;
const TOTAL_POINTS = 30;
const UGH_SCORE_THRESHOLD = 10;
const GROUP_NAME_MAX_LENGTH = 28;
const DAILY_SNAPSHOT_VERSION = 3;
const API_BASE = location.protocol === "file:" ? "" : "/api";

const TOPICS = [
  {
    id: "arcade-snacks",
    title: "General Knowledge",
    tagline: "Two quick ones from the everything drawer.",
    palette: {
      bg: "#ffdc4a",
      bg2: "#23d5ff",
      panel: "#fff2a8",
      accent: "#ff3d7f",
      secondary: "#00d19a",
      ink: "#20152b",
      muted: "#6f477a"
    },
    questions: [
      {
        prompt: "Which ocean is the largest on Earth?",
        options: ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Arctic Ocean"],
        answer: "Pacific Ocean"
      },
      {
        prompt: "What is the capital city of Canada?",
        options: ["Ottawa", "Toronto", "Vancouver", "Montreal"],
        answer: "Ottawa"
      }
    ],
    topicQuestion: {
      prompt: "What is the tallest mountain above sea level?",
      answer: "Mount Everest",
      aliases: ["Everest"]
    },
    logos: [
      {
        difficulty: "Easy",
        points: 3,
        answer: "McDonald's",
        aliases: ["mcdonalds", "mcdonald's", "mcdonald"],
        mark: "mcdonalds",
        color: "#fbc817"
      },
      {
        difficulty: "Medium",
        points: 5,
        answer: "Airbnb",
        aliases: ["airbnb", "air bnb"],
        mark: "airbnb",
        color: "#ff385c"
      },
      {
        difficulty: "Very hard",
        points: 10,
        answer: "Bank of America",
        aliases: ["bankofamerica", "bank of america", "boa", "bofa"],
        mark: "bankofamerica",
        color: "#e31837"
      }
    ]
  },
  {
    id: "streaming-night",
    title: "Science",
    tagline: "Matter, planets, plants, and a tiny bit of brain fizz.",
    palette: {
      bg: "#8bff6a",
      bg2: "#ff7bc8",
      panel: "#f2ffe8",
      accent: "#5bff4d",
      secondary: "#b062ff",
      ink: "#191126",
      muted: "#654b74"
    },
    questions: [
      {
        prompt: "Which gas do plants absorb during photosynthesis?",
        options: ["Carbon dioxide", "Oxygen", "Nitrogen", "Helium"],
        answer: "Carbon dioxide"
      },
      {
        prompt: "Which planet is known as the Red Planet?",
        options: ["Mars", "Venus", "Jupiter", "Mercury"],
        answer: "Mars"
      }
    ],
    topicQuestion: {
      prompt: "What chemical symbol represents gold?",
      answer: "Au",
      aliases: ["AU"]
    },
    logos: [
      {
        difficulty: "Easy",
        points: 3,
        answer: "YouTube",
        aliases: ["youtube", "you tube"],
        mark: "youtube",
        color: "#ff0000"
      },
      {
        difficulty: "Medium",
        points: 5,
        answer: "Netflix",
        aliases: ["netflix"],
        mark: "netflix",
        color: "#e50914"
      },
      {
        difficulty: "Very hard",
        points: 10,
        answer: "Paramount+",
        aliases: ["paramount", "paramount+", "paramount plus"],
        mark: "paramountplus",
        color: "#0064ff"
      }
    ]
  },
  {
    id: "sneaker-shelf",
    title: "Literature",
    tagline: "Pages, authors, titles, and readerly curveballs.",
    palette: {
      bg: "#5cffd6",
      bg2: "#ffd338",
      panel: "#e4fff7",
      accent: "#10d6a2",
      secondary: "#ff8d00",
      ink: "#101525",
      muted: "#536176"
    },
    questions: [
      {
        prompt: "Who wrote Romeo and Juliet?",
        options: ["William Shakespeare", "Jane Austen", "Mark Twain", "Charles Dickens"],
        answer: "William Shakespeare"
      },
      {
        prompt: "Which novel begins with the line, 'Call me Ishmael'?",
        options: ["Moby-Dick", "The Great Gatsby", "Dracula", "Frankenstein"],
        answer: "Moby-Dick"
      }
    ],
    topicQuestion: {
      prompt: "Who wrote Pride and Prejudice?",
      answer: "Jane Austen",
      aliases: ["Austen"]
    },
    logos: [
      {
        difficulty: "Easy",
        points: 3,
        answer: "Nike",
        aliases: ["nike"],
        mark: "nike",
        color: "#111111"
      },
      {
        difficulty: "Medium",
        points: 5,
        answer: "Adidas",
        aliases: ["adidas"],
        mark: "adidas",
        color: "#000000"
      },
      {
        difficulty: "Very hard",
        points: 10,
        answer: "New Balance",
        aliases: ["new balance", "newbalance", "nb"],
        mark: "newbalance",
        color: "#cf0a2c"
      }
    ]
  },
  {
    id: "space-desk",
    title: "Sports",
    tagline: "Rules, records, gear, and scoreboard instincts.",
    palette: {
      bg: "#64e8ff",
      bg2: "#ff9a4a",
      panel: "#dff9ff",
      accent: "#2fb8ff",
      secondary: "#ff6f1f",
      ink: "#111827",
      muted: "#51616f"
    },
    questions: [
      {
        prompt: "In baseball, how many strikes make an out?",
        options: ["Three", "Two", "Four", "Five"],
        answer: "Three"
      },
      {
        prompt: "Which sport uses a scrum?",
        options: ["Rugby", "Tennis", "Golf", "Basketball"],
        answer: "Rugby"
      }
    ],
    topicQuestion: {
      prompt: "How many players from one basketball team are on the court at one time?",
      answer: "Five",
      aliases: ["5"]
    },
    logos: [
      {
        difficulty: "Easy",
        points: 3,
        answer: "AccuWeather",
        aliases: ["accuweather", "accu weather"],
        mark: "accuweather",
        color: "#f05514"
      },
      {
        difficulty: "Medium",
        points: 5,
        answer: "The New York Times",
        aliases: ["new york times", "the new york times", "nyt", "newyorktimes"],
        mark: "newyorktimes",
        color: "#111111"
      },
      {
        difficulty: "Very hard",
        points: 10,
        answer: "Quizlet",
        aliases: ["quizlet"],
        mark: "quizlet",
        color: "#4255ff"
      }
    ]
  },
  {
    id: "coffee-run",
    title: "History",
    tagline: "People, places, dates, and the past being dramatic.",
    palette: {
      bg: "#ffb84c",
      bg2: "#6dffbd",
      panel: "#fff0cc",
      accent: "#ff7043",
      secondary: "#06c167",
      ink: "#211510",
      muted: "#6d5144"
    },
    questions: [
      {
        prompt: "Who was the first president of the United States?",
        options: ["George Washington", "Thomas Jefferson", "Abraham Lincoln", "John Adams"],
        answer: "George Washington"
      },
      {
        prompt: "The ancient pyramids of Giza are in which country?",
        options: ["Egypt", "Greece", "Mexico", "India"],
        answer: "Egypt"
      }
    ],
    topicQuestion: {
      prompt: "What year was the Declaration of Independence adopted?",
      answer: "1776",
      aliases: []
    },
    logos: [
      {
        difficulty: "Easy",
        points: 3,
        answer: "Starbucks",
        aliases: ["starbucks", "star bucks"],
        mark: "starbucks",
        color: "#00754a"
      },
      {
        difficulty: "Medium",
        points: 5,
        answer: "Taco Bell",
        aliases: ["tacobell", "taco bell"],
        mark: "tacobell",
        color: "#702082"
      },
      {
        difficulty: "Very hard",
        points: 10,
        answer: "DoorDash",
        aliases: ["doordash", "door dash"],
        mark: "doordash",
        color: "#ff3008"
      }
    ]
  },
  {
    id: "game-night",
    title: "Food & Drink",
    tagline: "Ingredients, dishes, kitchen facts, and menu brain teasers.",
    palette: {
      bg: "#ff7ceb",
      bg2: "#51e8ff",
      panel: "#ffe9fb",
      accent: "#ff4bd2",
      secondary: "#17cfff",
      ink: "#17141f",
      muted: "#665171"
    },
    questions: [
      {
        prompt: "Which fruit is the main ingredient in guacamole?",
        options: ["Avocado", "Mango", "Kiwi", "Lime"],
        answer: "Avocado"
      },
      {
        prompt: "Which ingredient helps bread dough rise?",
        options: ["Yeast", "Vinegar", "Cinnamon", "Gelatin"],
        answer: "Yeast"
      }
    ],
    topicQuestion: {
      prompt: "Which country is sushi traditionally associated with?",
      answer: "Japan",
      aliases: []
    },
    logos: [
      {
        difficulty: "Easy",
        points: 3,
        answer: "PlayStation",
        aliases: ["playstation", "play station", "ps"],
        mark: "playstation",
        color: "#003791"
      },
      {
        difficulty: "Medium",
        points: 5,
        answer: "Fortnite",
        aliases: ["fortnite"],
        mark: "fortnite",
        color: "#7f35ff"
      },
      {
        difficulty: "Very hard",
        points: 10,
        answer: "Ubisoft",
        aliases: ["ubisoft", "ubi soft"],
        mark: "ubisoft",
        color: "#111111"
      }
    ]
  },
  {
    id: "auto-row",
    title: "Television",
    tagline: "Characters, episodes, catchphrases, and small-screen moments.",
    palette: {
      bg: "#9db6ff",
      bg2: "#ffe33d",
      panel: "#edf2ff",
      accent: "#5578ff",
      secondary: "#ffd400",
      ink: "#111827",
      muted: "#566276"
    },
    questions: [
      {
        prompt: "Which sitcom features the coffee shop Central Perk?",
        options: ["Friends", "Seinfeld", "The Office", "Parks and Recreation"],
        answer: "Friends"
      },
      {
        prompt: "Which TV series follows chemistry teacher Walter White?",
        options: ["Breaking Bad", "Mad Men", "Lost", "The Sopranos"],
        answer: "Breaking Bad"
      }
    ],
    topicQuestion: {
      prompt: "What is the fictional paper company in The Office?",
      answer: "Dunder Mifflin",
      aliases: ["Dunder-Mifflin"]
    },
    logos: [
      {
        difficulty: "Easy",
        points: 3,
        answer: "Tesla",
        aliases: ["tesla"],
        mark: "tesla",
        color: "#cc0000"
      },
      {
        difficulty: "Medium",
        points: 5,
        answer: "Audi",
        aliases: ["audi"],
        mark: "audi",
        color: "#bb0a30"
      },
      {
        difficulty: "Very hard",
        points: 10,
        answer: "Ferrari",
        aliases: ["ferrari"],
        mark: "ferrari",
        color: "#e32119"
      }
    ]
  },
  {
    id: "music-icons",
    title: "Movies",
    tagline: "Scenes, directors, quotes, and big-screen trivia.",
    palette: {
      bg: "#b7ff4a",
      bg2: "#9f80ff",
      panel: "#f0ffdc",
      accent: "#85ef2f",
      secondary: "#845dff",
      ink: "#15151f",
      muted: "#5d5967"
    },
    questions: [
      {
        prompt: "Which movie features the character Jack Sparrow?",
        options: ["Pirates of the Caribbean", "The Princess Bride", "Hook", "Treasure Planet"],
        answer: "Pirates of the Caribbean"
      },
      {
        prompt: "Who directed Jurassic Park?",
        options: ["Steven Spielberg", "James Cameron", "Christopher Nolan", "George Lucas"],
        answer: "Steven Spielberg"
      }
    ],
    topicQuestion: {
      prompt: "What color pill does Neo take in The Matrix?",
      answer: "Red",
      aliases: ["Red pill", "The red pill"]
    },
    logos: [
      {
        difficulty: "Easy",
        points: 3,
        answer: "Spotify",
        aliases: ["spotify"],
        mark: "spotify",
        color: "#1ed760"
      },
      {
        difficulty: "Medium",
        points: 5,
        answer: "SoundCloud",
        aliases: ["soundcloud", "sound cloud"],
        mark: "soundcloud",
        color: "#ff5500"
      },
      {
        difficulty: "Very hard",
        points: 10,
        answer: "Apple Podcasts",
        aliases: ["apple podcasts", "applepodcasts", "podcasts"],
        mark: "applepodcasts",
        color: "#9933cc"
      }
    ]
  }
];

const BOT_NAMES = [
  "Maya",
  "Theo",
  "Nia",
  "Jules",
  "Sam",
  "Iris",
  "Ari",
  "Noor",
  "Bea",
  "Kai",
  "Milo",
  "Zoe"
];

const els = {
  mainMenu: document.querySelector("#mainMenu"),
  gameApp: document.querySelector("#gameApp"),
  brandButton: document.querySelector("#brandButton"),
  playButton: document.querySelector("#playButton"),
  menuButton: document.querySelector("#menuButton"),
  menuLeaderboardButton: document.querySelector("#menuLeaderboardButton"),
  menuLogsButton: document.querySelector("#menuLogsButton"),
  menuGroupButton: document.querySelector("#menuGroupButton"),
  menuTagline: document.querySelector("#menuTagline"),
  menuRankText: document.querySelector("#menuRankText"),
  menuLogCount: document.querySelector("#menuLogCount"),
  menuGroupName: document.querySelector("#menuGroupName"),
  menuGroupCode: document.querySelector("#menuGroupCode"),
  joinGroupOverlay: document.querySelector("#joinGroupOverlay"),
  joinOverlayCodeInput: document.querySelector("#joinOverlayCodeInput"),
  joinOverlaySubmitButton: document.querySelector("#joinOverlaySubmitButton"),
  closeJoinOverlayButton: document.querySelector("#closeJoinOverlayButton"),
  joinOverlayAlert: document.querySelector("#joinOverlayAlert"),
  leaderboardOverlay: document.querySelector("#leaderboardOverlay"),
  closeLeaderboardOverlayButton: document.querySelector("#closeLeaderboardOverlayButton"),
  leaderboardOverlayTitle: document.querySelector("#leaderboardOverlayTitle"),
  leaderboardOverlayRank: document.querySelector("#leaderboardOverlayRank"),
  leaderboardOverlayList: document.querySelector("#leaderboardOverlayList"),
  logsOverlay: document.querySelector("#logsOverlay"),
  closeLogsOverlayButton: document.querySelector("#closeLogsOverlayButton"),
  logsOverlayCount: document.querySelector("#logsOverlayCount"),
  logsOverlayList: document.querySelector("#logsOverlayList"),
  logsOverlayViewer: document.querySelector("#logsOverlayViewer"),
  todayChip: document.querySelector("#todayChip"),
  topicTitle: document.querySelector("#topicTitle"),
  topicTagline: document.querySelector("#topicTagline"),
  availablePoints: document.querySelector("#availablePoints"),
  dailyForm: document.querySelector("#dailyForm"),
  questionList: document.querySelector("#questionList"),
  logoGrid: document.querySelector("#logoGrid"),
  topicAnswerCard: document.querySelector("#topicAnswerCard"),
  submitButton: document.querySelector("#submitButton"),
  lockText: document.querySelector("#lockText"),
  resultPanel: document.querySelector("#resultPanel"),
  historyViewer: document.querySelector("#historyViewer"),
  displayName: document.querySelector("#displayName"),
  saveNameButton: document.querySelector("#saveNameButton"),
  playerTotal: document.querySelector("#playerTotal"),
  currentGroup: document.querySelector("#currentGroup"),
  groupNameInput: document.querySelector("#groupNameInput"),
  editGroupNameButton: document.querySelector("#editGroupNameButton"),
  saveGroupNameButton: document.querySelector("#saveGroupNameButton"),
  copyGroupButton: document.querySelector("#copyGroupButton"),
  createGroupButton: document.querySelector("#createGroupButton"),
  joinCodeInput: document.querySelector("#joinCodeInput"),
  joinGroupButton: document.querySelector("#joinGroupButton"),
  leaderboardTitle: document.querySelector("#leaderboardTitle"),
  leaderboard: document.querySelector("#leaderboard"),
  rankText: document.querySelector("#rankText"),
  historyList: document.querySelector("#historyList"),
  historyCount: document.querySelector("#historyCount"),
  copyLinkButton: document.querySelector("#copyLinkButton"),
  ughOverlay: document.querySelector("#ughOverlay"),
  toast: document.querySelector("#toast")
};

const today = getTodayParts();
const state = {
  dateKey: today.key,
  dateLabel: today.label,
  topic: TOPICS[getDailyIndex(today.key)],
  profile: loadJSON(STORAGE_KEYS.profile, null),
  groups: loadJSON(STORAGE_KEYS.groups, {}),
  activeGroup: getStoredItem(STORAGE_KEYS.activeGroup),
  records: loadJSON(STORAGE_KEYS.records, {}),
  backendAvailable: false,
  remoteLeaderboard: null,
  selectedHistoryDate: null
};

init().catch((error) => {
  console.error(error);
});

async function init() {
  ensureProfile();
  ensureActiveGroup();
  ensureRecord();
  bindEvents();
  render();
  await syncBackend();

  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }
}

function bindEvents() {
  els.playButton.addEventListener("click", () => {
    showGameSection("play");
  });

  els.brandButton.addEventListener("click", () => {
    showMainMenu();
  });

  els.menuButton.addEventListener("click", () => {
    showMainMenu();
  });

  els.menuLeaderboardButton.addEventListener("click", () => {
    openLeaderboardOverlay();
  });

  els.menuLogsButton.addEventListener("click", () => {
    openLogsOverlay();
  });

  els.menuGroupButton.addEventListener("click", () => {
    openJoinOverlay();
  });

  els.dailyForm.addEventListener("submit", handleDailySubmit);

  els.saveNameButton.addEventListener("click", async () => {
    const nextName = cleanName(els.displayName.value);
    state.profile.name = nextName || state.profile.name;
    ensureRecord().name = state.profile.name;
    saveJSON(STORAGE_KEYS.profile, state.profile);
    saveJSON(STORAGE_KEYS.records, state.records);
    render();
    await saveBackendProfile();
    await refreshBackendData();
    showToast("Name saved");
  });

  els.createGroupButton.addEventListener("click", async () => {
    const code = makeGroupCode();
    const name = cleanGroupName(els.groupNameInput.value) || makeDefaultGroupName(code);
    state.groups[code] = {
      code,
      name,
      ownerId: state.profile.id,
      createdAt: new Date().toISOString()
    };
    setActiveGroup(code);
    await saveBackendGroup(code);
    await refreshBackendData();
    showToast("Group code ready");
  });

  els.joinGroupButton.addEventListener("click", async () => {
    await joinExistingGroup(els.joinCodeInput.value, {
      onEmpty: () => showToast("Enter a group code"),
      onMissing: () => showToast("Group Not Found"),
      onJoined: () => {
        els.joinCodeInput.value = "";
      }
    });
  });

  els.joinCodeInput.addEventListener("input", () => {
    els.joinCodeInput.value = els.joinCodeInput.value.toUpperCase();
  });

  els.joinOverlaySubmitButton.addEventListener("click", async () => {
    await joinExistingGroup(els.joinOverlayCodeInput.value, {
      onEmpty: () => showJoinOverlayAlert("Enter a group code"),
      onMissing: () => showJoinOverlayAlert("Group Not Found"),
      onJoined: () => {
        els.joinOverlayCodeInput.value = "";
        closeJoinOverlay();
        showGameSection("play");
      }
    });
  });

  els.joinOverlayCodeInput.addEventListener("input", () => {
    els.joinOverlayCodeInput.value = els.joinOverlayCodeInput.value.toUpperCase();
    hideJoinOverlayAlert();
  });

  els.joinOverlayCodeInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      els.joinOverlaySubmitButton.click();
    }
  });

  els.closeJoinOverlayButton.addEventListener("click", closeJoinOverlay);

  els.joinGroupOverlay.addEventListener("click", (event) => {
    if (event.target.matches("[data-join-overlay-close]")) closeJoinOverlay();
  });

  els.closeLeaderboardOverlayButton.addEventListener("click", closeLeaderboardOverlay);
  els.closeLogsOverlayButton.addEventListener("click", closeLogsOverlay);

  els.leaderboardOverlay.addEventListener("click", (event) => {
    if (event.target.matches("[data-menu-overlay-close]")) closeLeaderboardOverlay();
  });

  els.logsOverlay.addEventListener("click", (event) => {
    if (event.target.matches("[data-menu-overlay-close]")) closeLogsOverlay();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeOpenMenuOverlays();
  });

  els.editGroupNameButton.addEventListener("click", () => {
    els.groupNameInput.focus();
    els.groupNameInput.select();
  });

  els.saveGroupNameButton.addEventListener("click", async () => {
    await saveActiveGroupName();
  });

  els.groupNameInput.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      await saveActiveGroupName();
    }
  });

  els.copyGroupButton.addEventListener("click", () => {
    copyText(state.activeGroup);
  });

  els.copyLinkButton.addEventListener("click", () => {
    copyText(window.location.href);
  });

  els.historyList.addEventListener("click", handleHistoryClick);
  els.logsOverlayList.addEventListener("click", handleHistoryClick);
}

function openJoinOverlay() {
  closeOpenMenuOverlays();
  els.joinGroupOverlay.hidden = false;
  els.joinOverlayCodeInput.value = "";
  hideJoinOverlayAlert();
  window.setTimeout(() => els.joinOverlayCodeInput.focus(), 0);
}

function closeJoinOverlay() {
  els.joinGroupOverlay.hidden = true;
  hideJoinOverlayAlert();
}

function showJoinOverlayAlert(message) {
  els.joinOverlayAlert.textContent = message;
  els.joinOverlayAlert.hidden = false;
}

function hideJoinOverlayAlert() {
  els.joinOverlayAlert.hidden = true;
}

function openLeaderboardOverlay() {
  closeOpenMenuOverlays();
  renderLeaderboard();
  els.leaderboardOverlay.hidden = false;
  window.setTimeout(() => els.closeLeaderboardOverlayButton.focus(), 0);
}

function closeLeaderboardOverlay() {
  els.leaderboardOverlay.hidden = true;
}

function openLogsOverlay() {
  closeOpenMenuOverlays();
  renderHistory();
  els.logsOverlay.hidden = false;
  window.setTimeout(() => els.closeLogsOverlayButton.focus(), 0);
}

function closeLogsOverlay() {
  els.logsOverlay.hidden = true;
}

function closeOpenMenuOverlays() {
  if (!els.joinGroupOverlay.hidden) closeJoinOverlay();
  if (!els.leaderboardOverlay.hidden) closeLeaderboardOverlay();
  if (!els.logsOverlay.hidden) closeLogsOverlay();
}

function handleHistoryClick(event) {
  const button = event.target.closest("[data-history-date]");
  if (!button) return;
  state.selectedHistoryDate = button.dataset.historyDate;
  renderHistory();
}

async function joinExistingGroup(rawCode, callbacks = {}) {
  const code = normalizeGroupCode(rawCode);
  if (!code) {
    callbacks.onEmpty?.();
    return false;
  }

  if (!state.groups[code]) {
    if (state.backendAvailable) {
      const group = await fetchBackendGroup(code);
      if (!group) {
        callbacks.onMissing?.();
        return false;
      }
      state.groups[code] = group;
      saveJSON(STORAGE_KEYS.groups, state.groups);
    } else {
      callbacks.onMissing?.();
      return false;
    }
  }

  ensureGroupDefaults(code);
  setActiveGroup(code);
  await joinBackendGroup(code);
  await refreshBackendData();
  callbacks.onJoined?.(code);
  showToast(`Joined ${getGroupName(code)}`);
  return true;
}

async function handleDailySubmit(event) {
  event.preventDefault();

  if (getTodayResult()) {
    showToast("Already played today");
    render();
    return;
  }

  if (!isDailyFormComplete()) {
    showToast("Answer every prompt first");
    return;
  }

  const result = scoreToday();
  const record = ensureRecord();
  record.days[state.dateKey] = result;
  record.total = sumDailyScores(record.days);
  record.streak = computeStreak(record.days);
  record.lastPlayed = state.dateKey;
  record.name = state.profile.name;
  saveJSON(STORAGE_KEYS.records, state.records);
  await saveBackendResult(result);
  await refreshBackendData();

  render();
  showToast(`Scored ${result.score}/${TOTAL_POINTS}`);
  if (result.score < UGH_SCORE_THRESHOLD) {
    playIncorrectAnimation();
  }
}

function isDailyFormComplete() {
  const formData = new FormData(els.dailyForm);
  const hasQuestions = state.topic.questions.every((_, index) => {
    return Boolean(formData.get(`q${index}`));
  });
  const hasLogos = state.topic.logos.every((_, index) => {
    return Boolean(String(formData.get(`logo${index}`) || "").trim());
  });
  const hasTopicAnswer = Boolean(String(formData.get("topicAnswer") || "").trim());
  return hasQuestions && hasLogos && hasTopicAnswer;
}

function scoreToday() {
  const formData = new FormData(els.dailyForm);
  let score = 0;

  const questionDetails = state.topic.questions.map((question, index) => {
    const selected = formData.get(`q${index}`) || "";
    const correct = selected === question.answer;
    if (correct) score += 1;
    return {
      type: "question",
      label: `Question ${index + 1}`,
      selected,
      answer: question.answer,
      correct,
      points: correct ? 1 : 0,
      possible: 1
    };
  });

  const logoDetails = state.topic.logos.map((logo, index) => {
    const guess = String(formData.get(`logo${index}`) || "").trim();
    const accepted = [logo.answer, ...logo.aliases].map(normalizeAnswer);
    const correct = accepted.includes(normalizeAnswer(guess));
    if (correct) score += logo.points;
    return {
      type: "logo",
      label: `${logo.difficulty} logo`,
      guess,
      answer: logo.answer,
      correct,
      points: correct ? logo.points : 0,
      possible: logo.points
    };
  });

  const topicAnswerGuess = String(formData.get("topicAnswer") || "").trim();
  const acceptedTopicAnswers = [
    state.topic.topicQuestion.answer,
    ...(state.topic.topicQuestion.aliases || [])
  ].map(normalizeAnswer);
  const topicAnswerCorrect = acceptedTopicAnswers.includes(normalizeAnswer(topicAnswerGuess));
  if (topicAnswerCorrect) score += TOPIC_QUESTION_POINTS;
  const topicAnswerDetail = {
    type: "topic-answer",
    label: "Topic answer",
    guess: topicAnswerGuess,
    answer: state.topic.topicQuestion.answer,
    correct: topicAnswerCorrect,
    points: topicAnswerCorrect ? TOPIC_QUESTION_POINTS : 0,
    possible: TOPIC_QUESTION_POINTS
  };

  const result = {
    date: state.dateKey,
    topicId: state.topic.id,
    topicTitle: state.topic.title,
    groupCode: state.activeGroup,
    score,
    possible: TOTAL_POINTS,
    details: [...questionDetails, ...logoDetails, topicAnswerDetail],
    submittedAt: new Date().toISOString()
  };
  result.snapshot = createQuestionSnapshot(result);
  result.snapshotVersion = DAILY_SNAPSHOT_VERSION;
  return result;
}

function render() {
  applyTheme(state.topic.palette);
  els.todayChip.textContent = state.dateLabel;
  els.topicTitle.textContent = state.topic.title;
  els.topicTagline.textContent = state.topic.tagline;
  els.availablePoints.textContent = String(TOTAL_POINTS);
  els.displayName.value = state.profile.name;
  els.groupNameInput.value = getActiveGroupName();
  els.currentGroup.textContent = state.activeGroup;
  els.playerTotal.textContent = `${ensureRecord().total || 0} pts`;

  const todayResult = getTodayResult();
  renderQuestions(todayResult);
  renderLogos(todayResult);
  renderTopicAnswer(todayResult);
  renderResult(todayResult);
  renderLockState(Boolean(todayResult));
  renderLeaderboard();
  renderHistory();
  renderMenu();
}

function renderQuestions(todayResult) {
  const details = todayResult?.details.filter((detail) => detail.type === "question") || [];
  els.questionList.innerHTML = state.topic.questions
    .map((question, index) => {
      const detail = details[index];
      const choices = question.options
        .map((option) => {
          const checked = detail?.selected === option ? "checked" : "";
          const disabled = todayResult ? "disabled" : "";
          const classes = ["choice-content"];
          if (todayResult && option === question.answer) classes.push("is-correct");
          if (todayResult && detail?.selected === option && option !== question.answer) {
            classes.push("is-missed");
          }

          return `
            <label class="choice-option">
              <input ${checked} ${disabled} name="q${index}" type="radio" value="${escapeAttr(option)}">
              <span class="${classes.join(" ")}">${escapeHTML(option)}</span>
            </label>
          `;
        })
        .join("");

      return `
        <article class="question-card">
          <h3>${escapeHTML(question.prompt)}</h3>
          <div class="choice-list">${choices}</div>
        </article>
      `;
    })
    .join("");
}

function renderLogos(todayResult) {
  const details = todayResult?.details.filter((detail) => detail.type === "logo") || [];
  els.logoGrid.innerHTML = state.topic.logos
    .map((logo, index) => {
      const detail = details[index];
      const disabled = todayResult ? "disabled" : "";
      const cardClasses = ["logo-card"];
      if (todayResult && detail?.correct) cardClasses.push("is-correct");
      if (todayResult && detail && !detail.correct) cardClasses.push("is-missed");
      const reveal = detail
        ? `<p class="logo-reveal">${detail.correct ? "Correct" : "Answer"}: <strong>${escapeHTML(logo.answer)}</strong></p>`
        : "";

      return `
        <article class="${cardClasses.join(" ")}">
          <header>
            <label for="logo${index}">${escapeHTML(logo.difficulty)}</label>
            <span class="logo-points">${logo.points} pts</span>
          </header>
          <div class="logo-art" role="img" aria-label="${escapeAttr(logo.difficulty)} logo puzzle">
            ${renderLogoMark(logo.mark)}
          </div>
          <input
            id="logo${index}"
            class="logo-input"
            name="logo${index}"
            ${disabled}
            autocomplete="off"
            placeholder="Type brand"
            value="${escapeAttr(detail?.guess || "")}"
            type="text"
          >
          ${reveal}
        </article>
      `;
    })
    .join("");
}

function renderTopicAnswer(todayResult) {
  const detail = todayResult?.details.find((item) => item.type === "topic-answer");
  const disabled = todayResult ? "disabled" : "";
  const cardClasses = ["topic-answer-card"];
  if (todayResult && detail?.correct) cardClasses.push("is-correct");
  if (todayResult && detail && !detail.correct) cardClasses.push("is-missed");
  const reveal = detail
    ? `<p class="topic-answer-reveal">${detail.correct ? "Correct" : "Answer"}: <strong>${escapeHTML(state.topic.topicQuestion.answer)}</strong></p>`
    : "";

  els.topicAnswerCard.className = cardClasses.join(" ");
  els.topicAnswerCard.innerHTML = `
    <header>
      <label for="topicAnswer">Topic answer</label>
      <span>${TOPIC_QUESTION_POINTS} pts</span>
    </header>
    <h3>${escapeHTML(state.topic.topicQuestion.prompt)}</h3>
    <input
      id="topicAnswer"
      class="topic-answer-input"
      name="topicAnswer"
      ${disabled}
      autocomplete="off"
      placeholder="Type your answer"
      value="${escapeAttr(detail?.guess || "")}"
      type="text"
    >
    ${reveal}
  `;
}

function renderResult(todayResult) {
  if (!todayResult) {
    els.resultPanel.hidden = true;
    els.resultPanel.innerHTML = "";
    return;
  }

  const details = todayResult.details
    .map((detail) => {
      const note = detail.correct ? `${detail.points}/${detail.possible}` : `0/${detail.possible}`;
      const answer = detail.correct ? "" : ` <span class="muted">- ${escapeHTML(detail.answer)}</span>`;
      return `
        <li>
          <span>${escapeHTML(detail.label)}${answer}</span>
          <strong>${note}</strong>
        </li>
      `;
    })
    .join("");

  els.resultPanel.hidden = false;
  els.resultPanel.innerHTML = `
    <div class="result-score">
      <strong>${todayResult.score}</strong>
      <span>/ ${todayResult.possible} points</span>
    </div>
    <ul class="result-list">${details}</ul>
  `;
}

function renderLockState(isLocked) {
  els.submitButton.disabled = isLocked;
  els.submitButton.textContent = isLocked ? "Played today" : "Submit run";
  els.lockText.textContent = isLocked ? `Next topic ${getNextDayLabel()}` : "";
}

function renderLeaderboard() {
  const { entries, playerRank, title } = getLeaderboardData();
  els.leaderboardTitle.textContent = title;
  els.leaderboardOverlayTitle.textContent = title;
  els.rankText.textContent = `#${playerRank}`;
  els.leaderboardOverlayRank.textContent = `#${playerRank}`;
  renderLeaderboardList(els.leaderboard, entries);
  renderLeaderboardList(els.leaderboardOverlayList, entries);
}

function getLeaderboardData() {
  if (state.backendAvailable && Array.isArray(state.remoteLeaderboard)) {
    const entries = state.remoteLeaderboard.map((entry) => ({
      id: entry.playerId,
      name: entry.name,
      total: entry.total,
      isPlayer: entry.playerId === state.profile.id
    }));
    const playerRank = entries.findIndex((entry) => entry.isPlayer) + 1 || entries.length + 1;
    return {
      entries,
      playerRank,
      title: `${getActiveGroupName()} Leaderboard`
    };
  }

  const record = ensureRecord();
  const botEntries = makeLeaderboardBots(state.activeGroup, state.dateKey);
  const entries = [
    ...botEntries,
    {
      id: state.profile.id,
      name: state.profile.name,
      total: record.total || 0,
      isPlayer: true
    }
  ].sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));

  return {
    entries,
    playerRank: entries.findIndex((entry) => entry.isPlayer) + 1,
    title: `${getActiveGroupName()} Leaderboard`
  };
}

function renderLeaderboardList(list, entries) {
  list.innerHTML = entries
    .map(
      (entry) => `
        <li class="${entry.isPlayer ? "is-player" : ""}">
          <span class="leader-name">${escapeHTML(entry.name)}</span>
          <span class="leader-score">${entry.total} pts</span>
        </li>
      `
    )
    .join("");
}

function renderMenu() {
  const historyCount = getHistoryEntries().length;
  els.menuTagline.textContent = `${state.dateLabel} - ${state.topic.title} - ${TOTAL_POINTS} points waiting`;
  els.menuLogCount.textContent = String(historyCount);
  els.menuGroupName.textContent = getActiveGroupName();
  els.menuGroupCode.textContent = state.activeGroup;
  els.menuRankText.textContent = els.rankText.textContent || "#";
}

function showMainMenu() {
  document.body.classList.add("is-menu-open");
  els.mainMenu.hidden = false;
  els.gameApp.hidden = true;
  window.scrollTo?.({ top: 0, behavior: "smooth" });
}

function showGameSection(section) {
  document.body.classList.remove("is-menu-open");
  els.mainMenu.hidden = true;
  els.gameApp.hidden = false;
  if (section === "play") {
    window.scrollTo?.({ top: 0, behavior: "smooth" });
    return;
  }
  const targets = {
    leaderboard: document.querySelector(".leaderboard-panel"),
    logs: document.querySelector(".history-panel"),
    group: document.querySelector("#groupTitle")
  };
  const target = targets[section] || els.dailyForm;
  window.setTimeout(() => {
    target?.scrollIntoView?.({ behavior: "smooth", block: "start" });
    if (section === "group") els.joinCodeInput.focus?.();
  }, 40);
}

function renderHistory() {
  const entries = getHistoryEntries();
  els.historyCount.textContent = String(entries.length);
  els.logsOverlayCount.textContent = String(entries.length);

  if (!entries.length) {
    renderEmptyHistory(els.historyList, els.historyViewer);
    renderEmptyHistory(els.logsOverlayList, els.logsOverlayViewer);
    return;
  }

  if (!state.selectedHistoryDate || !entries.some((entry) => entry.date === state.selectedHistoryDate)) {
    state.selectedHistoryDate = entries[0].date;
  }

  const activeEntry = entries.find((entry) => entry.date === state.selectedHistoryDate) || entries[0];
  renderHistoryList(els.historyList, entries, activeEntry);
  renderHistoryList(els.logsOverlayList, entries, activeEntry);
  renderHistoryViewer(els.historyViewer, activeEntry);
  renderHistoryViewer(els.logsOverlayViewer, activeEntry);
}

function renderEmptyHistory(list, viewer) {
  list.innerHTML = `<p class="empty-state">No plays yet.</p>`;
  viewer.hidden = true;
  viewer.innerHTML = "";
}

function renderHistoryList(list, entries, activeEntry) {
  list.innerHTML = entries
    .map((entry) => {
      const isActive = entry.date === activeEntry.date;
      return `
        <button class="history-item ${isActive ? "is-active" : ""}" type="button" data-history-date="${escapeAttr(entry.date)}">
          <img class="history-thumb" src="${escapeAttr(entry.snapshot)}" alt="">
          <span class="history-copy">
            <strong>${escapeHTML(formatDateKey(entry.date))}</strong>
            <span>${escapeHTML(entry.topicTitle || "Daily topic")} - ${entry.score}/${entry.possible}</span>
          </span>
        </button>
      `;
    })
    .join("");
}

function renderHistoryViewer(viewer, activeEntry) {
  viewer.hidden = false;
  viewer.innerHTML = `
    <div class="history-viewer-head">
      <div>
        <p class="eyebrow">Daily log</p>
        <h2>${escapeHTML(activeEntry.topicTitle || "Daily topic")}</h2>
      </div>
      <span class="mini-stat">${activeEntry.score}/${activeEntry.possible} pts</span>
    </div>
    <img
      class="history-shot"
      src="${escapeAttr(activeEntry.snapshot)}"
      alt="Question screenshot for ${escapeAttr(formatDateKey(activeEntry.date))}"
    >
  `;
}

function getHistoryEntries() {
  const record = ensureRecord();
  let changed = false;
  const entries = Object.values(record.days)
    .map((entry) => {
      const topic = getTopicById(entry.topicId);
      if (topic && entry.topicTitle !== topic.title) {
        entry.topicTitle = topic.title;
        entry.snapshot = createQuestionSnapshot(entry);
        entry.snapshotVersion = DAILY_SNAPSHOT_VERSION;
        changed = true;
      } else if (!entry.snapshot || entry.snapshotVersion !== DAILY_SNAPSHOT_VERSION) {
        entry.snapshot = createQuestionSnapshot(entry);
        entry.snapshotVersion = DAILY_SNAPSHOT_VERSION;
        changed = true;
      }
      return entry;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  if (changed) saveJSON(STORAGE_KEYS.records, state.records);
  return entries;
}

function createQuestionSnapshot(result) {
  const topic = getTopicById(result.topicId) || state.topic;
  const palette = topic.palette;
  const questionDetails = getSnapshotDetails(result, "question");
  const logoDetails = getSnapshotDetails(result, "logo");
  const topicAnswerDetail = getSnapshotDetails(result, "topic-answer")[0];
  const width = 960;
  const ink = palette.ink;
  const cardX = 64;
  const cardWidth = 832;
  const elements = [
    `<rect x="64" y="62" width="222" height="42" rx="8" fill="${escapeSVG(palette.secondary)}" stroke="${escapeSVG(ink)}" stroke-width="3"/>`,
    `<text x="84" y="90" font-family="Arial, sans-serif" font-size="18" font-weight="900" fill="${escapeSVG(ink)}">Daily screenshot</text>`,
    `<text x="64" y="154" font-family="Arial, sans-serif" font-size="58" font-weight="900" fill="${escapeSVG(ink)}">${escapeSVG(topic.title)}</text>`,
    `<text x="66" y="194" font-family="Arial, sans-serif" font-size="24" font-weight="800" fill="${escapeSVG(palette.muted)}">${escapeSVG(formatDateKey(result.date))} - ${result.score}/${result.possible} pts</text>`
  ];

  let y = 252;
  topic.questions.forEach((question, index) => {
    const detail = questionDetails[index];
    const resultTone = getSnapshotResultTone(detail);
    const promptLines = wrapText(`Q${index + 1}. ${question.prompt}`, 62);
    const optionText = question.options
      .map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}`)
      .join("     ");
    const optionLines = wrapText(optionText, 74);
    const cardTop = y - 34;
    const optionY = y + promptLines.length * 29 + 12;
    const cardHeight = 34 + promptLines.length * 29 + 12 + optionLines.length * 24 + 28;
    elements.push(`<rect x="${cardX}" y="${cardTop}" width="${cardWidth}" height="${cardHeight}" rx="12" fill="${resultTone.fill}" stroke="${resultTone.stroke}" stroke-width="3"/>`);
    addSvgLines(elements, promptLines, 86, y, 24, 900, ink, 29);
    addSvgLines(elements, optionLines, 86, optionY, 20, 800, palette.muted, 24);
    y = cardTop + cardHeight + 28;
  });

  elements.push(`<text x="${cardX}" y="${y}" font-family="Arial, sans-serif" font-size="28" font-weight="900" fill="${escapeSVG(ink)}">Bonus logos</text>`);
  y += 28;
  topic.logos.forEach((logo, index) => {
    const detail = logoDetails[index];
    const resultTone = getSnapshotResultTone(detail);
    const x = cardX + index * 278;
    const logoHref = getSnapshotLogoHref(logo.mark);
    elements.push(`<rect x="${x}" y="${y}" width="244" height="116" rx="12" fill="${resultTone.fill}" stroke="${resultTone.stroke}" stroke-width="3"/>`);
    elements.push(`<rect x="${x + 16}" y="${y + 18}" width="76" height="80" rx="10" fill="#ffffff" opacity="0.82" stroke="${escapeSVG(ink)}" stroke-width="2"/>`);
    elements.push(`<image x="${x + 25}" y="${y + 27}" width="58" height="62" href="${escapeSVG(logoHref)}" xlink:href="${escapeSVG(logoHref)}" preserveAspectRatio="xMidYMid meet" filter="url(#snapshotLogoInk)"/>`);
    elements.push(`<text x="${x + 110}" y="${y + 52}" font-family="Arial, sans-serif" font-size="21" font-weight="900" fill="${escapeSVG(ink)}">${escapeSVG(logo.difficulty)}</text>`);
    elements.push(`<text x="${x + 110}" y="${y + 80}" font-family="Arial, sans-serif" font-size="18" font-weight="800" fill="${escapeSVG(palette.muted)}">${logo.points} point logo</text>`);
  });

  y += 154;
  const topicTone = getSnapshotResultTone(topicAnswerDetail);
  const topicPromptLines = wrapText(topic.topicQuestion.prompt, 58);
  const topicCardHeight = Math.max(122, 80 + topicPromptLines.length * 28 + 24);
  elements.push(`<rect x="${cardX}" y="${y}" width="${cardWidth}" height="${topicCardHeight}" rx="12" fill="${topicTone.fill}" stroke="${topicTone.stroke}" stroke-width="3"/>`);
  elements.push(`<text x="86" y="${y + 34}" font-family="Arial, sans-serif" font-size="20" font-weight="900" fill="${escapeSVG(palette.muted)}">10 point topic answer</text>`);
  addSvgLines(elements, topicPromptLines, 86, y + 72, 23, 900, ink, 28);
  y += topicCardHeight + 42;

  const height = Math.max(880, y + 28);
  const defs = `
    <defs>
      <filter id="snapshotLogoInk" color-interpolation-filters="sRGB">
        <feColorMatrix type="matrix" values="0 0 0 0 0.07 0 0 0 0 0.06 0 0 0 0 0.09 0 0 0 1 0"/>
      </filter>
    </defs>
  `;
  const backgrounds = [
    `<rect width="${width}" height="${height}" rx="34" fill="${escapeSVG(palette.bg)}"/>`,
    `<rect x="22" y="22" width="916" height="${height - 44}" rx="28" fill="#ffffff" opacity="0.72"/>`,
    `<rect x="46" y="44" width="868" height="${height - 88}" rx="18" fill="${escapeSVG(palette.panel)}" stroke="${escapeSVG(ink)}" stroke-width="4"/>`
  ];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${defs}${backgrounds.join("")}${elements.join("")}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function getSnapshotDetails(result, type) {
  return Array.isArray(result.details)
    ? result.details.filter((detail) => detail.type === type)
    : [];
}

function getSnapshotResultTone(detail) {
  if (!detail) {
    return {
      fill: "#ffffff",
      stroke: escapeSVG("#17141f")
    };
  }

  return detail.correct
    ? {
        fill: escapeSVG("#d9f8df"),
        stroke: escapeSVG("#146b33")
      }
    : {
        fill: escapeSVG("#ffdce3"),
        stroke: escapeSVG("#9b2142")
      };
}

function getSnapshotLogoHref(mark) {
  const safeMark = String(mark).replace(/[^a-z0-9-]/gi, "");
  try {
    return new URL(`assets/logos/${safeMark}.svg`, window.location.href).href;
  } catch {
    return `assets/logos/${safeMark}.svg`;
  }
}

function addSvgTextLines(elements, text, x, y, size, weight, fill, maxChars, lineHeight) {
  return addSvgLines(elements, wrapText(text, maxChars), x, y, size, weight, fill, lineHeight);
}

function addSvgLines(elements, lines, x, y, size, weight, fill, lineHeight) {
  lines.forEach((line, index) => {
    elements.push(
      `<text x="${x}" y="${y + index * lineHeight}" font-family="Arial, sans-serif" font-size="${size}" font-weight="${weight}" fill="${escapeSVG(fill)}">${escapeSVG(line)}</text>`
    );
  });
  return y + lines.length * lineHeight;
}

function wrapText(text, maxChars) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = "";

  words.forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  });

  if (line) lines.push(line);
  return lines;
}

function getTopicById(topicId) {
  return TOPICS.find((topic) => topic.id === topicId);
}

function makeLeaderboardBots(groupCode, dateKey) {
  const rng = mulberry32(hashString(`${groupCode}:${dateKey}`));
  const names = shuffle([...BOT_NAMES], rng).slice(0, 5);
  return names.map((name, index) => {
    const base = Math.floor(rng() * 35);
    const streak = Math.floor(rng() * 4) * 7;
    const wobble = Math.floor(rng() * 6);
    return {
      id: `bot-${index}`,
      name,
      total: base + streak + wobble,
      isPlayer: false
    };
  });
}

function ensureProfile() {
  if (state.profile?.id) return;
  state.profile = {
    id: crypto.randomUUID ? crypto.randomUUID() : `player-${Date.now()}`,
    name: `Player ${String(Math.floor(Math.random() * 900) + 100)}`
  };
  saveJSON(STORAGE_KEYS.profile, state.profile);
}

function ensureActiveGroup() {
  if (state.activeGroup && state.groups[state.activeGroup]) {
    ensureGroupDefaults(state.activeGroup);
    saveJSON(STORAGE_KEYS.groups, state.groups);
    return;
  }
  const code = makeGroupCode();
  state.groups[code] = {
    code,
    name: makeDefaultGroupName(code),
    ownerId: state.profile.id,
    createdAt: new Date().toISOString()
  };
  setActiveGroup(code);
}

function ensureRecord() {
  if (!state.records[state.profile.id]) {
    state.records[state.profile.id] = {
      name: state.profile.name,
      total: 0,
      streak: 0,
      days: {}
    };
  }
  return state.records[state.profile.id];
}

function setActiveGroup(code) {
  ensureGroupDefaults(code);
  state.activeGroup = code;
  saveJSON(STORAGE_KEYS.groups, state.groups);
  setStoredItem(STORAGE_KEYS.activeGroup, code);
  render();
}

function ensureGroupDefaults(code) {
  if (!state.groups[code]) {
    state.groups[code] = { code };
  }
  state.groups[code].code = code;
  if (!cleanGroupName(state.groups[code].name)) {
    state.groups[code].name = makeDefaultGroupName(code);
  }
  return state.groups[code];
}

function getActiveGroupName() {
  return getGroupName(state.activeGroup);
}

function getGroupName(code) {
  if (!code) return "Group";
  return cleanGroupName(state.groups[code]?.name) || makeDefaultGroupName(code);
}

async function saveActiveGroupName() {
  const group = ensureGroupDefaults(state.activeGroup);
  const nextName = cleanGroupName(els.groupNameInput.value);
  if (!nextName) {
    els.groupNameInput.value = group.name;
    showToast("Enter a group name");
    return;
  }
  group.name = nextName;
  group.updatedAt = new Date().toISOString();
  saveJSON(STORAGE_KEYS.groups, state.groups);
  render();
  await saveBackendGroup(state.activeGroup);
  await refreshBackendData();
  showToast("Group name saved");
}

async function syncBackend() {
  if (!API_BASE) return;
  try {
    await apiRequest("/health");
    state.backendAvailable = true;
    await saveBackendProfile();
    await saveBackendGroup(state.activeGroup);
    await joinBackendGroup(state.activeGroup);
    await pushLocalResultsToBackend();
    await refreshBackendData();
  } catch (error) {
    state.backendAvailable = false;
    state.remoteLeaderboard = null;
    render();
  }
}

async function refreshBackendData() {
  if (!state.backendAvailable) return;
  try {
    const [group, results, leaderboard] = await Promise.all([
      fetchBackendGroup(state.activeGroup),
      apiRequest(`/players/${encodeURIComponent(state.profile.id)}/results`),
      apiRequest(`/groups/${encodeURIComponent(state.activeGroup)}/leaderboard`)
    ]);

    if (group) {
      state.groups[state.activeGroup] = group;
      saveJSON(STORAGE_KEYS.groups, state.groups);
    }

    if (Array.isArray(results.results)) {
      const record = ensureRecord();
      record.days = {};
      results.results.forEach((entry) => {
        record.days[entry.date] = entry;
      });
      record.total = sumDailyScores(record.days);
      record.streak = computeStreak(record.days);
      record.name = state.profile.name;
      saveJSON(STORAGE_KEYS.records, state.records);
    }

    state.remoteLeaderboard = Array.isArray(leaderboard.entries) ? leaderboard.entries : null;
    render();
  } catch (error) {
    state.backendAvailable = false;
    state.remoteLeaderboard = null;
  }
}

async function saveBackendProfile() {
  if (!state.backendAvailable) return;
  await apiRequest("/players", {
    method: "POST",
    body: {
      id: state.profile.id,
      name: state.profile.name
    }
  });
}

async function saveBackendGroup(code) {
  if (!state.backendAvailable || !code) return;
  const group = ensureGroupDefaults(code);
  await apiRequest("/groups", {
    method: "POST",
    body: {
      code,
      name: group.name,
      ownerId: state.profile.id
    }
  });
}

async function fetchBackendGroup(code) {
  if (!state.backendAvailable || !code) return null;
  try {
    const response = await apiRequest(`/groups/${encodeURIComponent(code)}`);
    return response.group || null;
  } catch (error) {
    if (error.status === 404) return null;
    throw error;
  }
}

async function joinBackendGroup(code) {
  if (!state.backendAvailable || !code) return;
  await apiRequest(`/groups/${encodeURIComponent(code)}/members`, {
    method: "POST",
    body: {
      playerId: state.profile.id
    }
  });
}

async function saveBackendResult(result) {
  if (!state.backendAvailable) return;
  try {
    await apiRequest("/results", {
      method: "POST",
      body: {
        playerId: state.profile.id,
        result
      }
    });
  } catch (error) {
    if (error.status === 409 && error.payload?.result) {
      const record = ensureRecord();
      record.days[state.dateKey] = error.payload.result;
      record.total = sumDailyScores(record.days);
      record.streak = computeStreak(record.days);
      saveJSON(STORAGE_KEYS.records, state.records);
      showToast("Already played today");
      return;
    }
    throw error;
  }
}

async function pushLocalResultsToBackend() {
  if (!state.backendAvailable) return;
  const record = ensureRecord();
  const entries = Object.values(record.days || {});
  for (const entry of entries) {
    await saveBackendResult(entry);
  }
}

async function apiRequest(path, options = {}) {
  const fetchOptions = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json"
    }
  };

  if (options.body) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE}${path}`, fetchOptions);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.error || `Request failed: ${response.status}`);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }
  return payload;
}

function getTodayResult() {
  return ensureRecord().days[state.dateKey] || null;
}

function sumDailyScores(days) {
  return Object.values(days).reduce((sum, day) => sum + Number(day.score || 0), 0);
}

function computeStreak(days) {
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (days[toDateKey(cursor)]) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function cleanName(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 18);
}

function cleanGroupName(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, GROUP_NAME_MAX_LENGTH);
}

function makeDefaultGroupName(code) {
  const suffix = String(code || "")
    .replace(/^TRV-?/, "")
    .slice(0, 4);
  return suffix ? `Group ${suffix}` : "My group";
}

function normalizeAnswer(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\+/g, "plus")
    .replace(/[^a-z0-9]/g, "");
}

function normalizeGroupCode(value) {
  const raw = String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
  const stripped = raw.startsWith("TRV") ? raw.slice(3) : raw;
  if (stripped.length < 4) return "";
  return `TRV-${stripped.slice(0, 4)}`;
}

function makeGroupCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `TRV-${code}`;
}

function getTodayParts() {
  const date = new Date();
  return {
    key: toDateKey(date),
    label: date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric"
    })
  };
}

function getNextDayLabel() {
  const next = new Date();
  next.setDate(next.getDate() + 1);
  return next.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
}

function getDailyIndex(dateKey) {
  return Math.abs(hashString(dateKey)) % TOPICS.length;
}

function hashString(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed) {
  return function rng() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(items, rng) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }
  return items;
}

function applyTheme(palette) {
  const root = document.documentElement;
  root.style.setProperty("--topic-bg", palette.bg);
  root.style.setProperty("--topic-bg-2", palette.bg2);
  root.style.setProperty("--topic-panel", palette.panel);
  root.style.setProperty("--topic-accent", palette.accent);
  root.style.setProperty("--topic-secondary", palette.secondary);
  root.style.setProperty("--topic-ink", palette.ink);
  root.style.setProperty("--topic-muted", palette.muted);
  document.querySelector('meta[name="theme-color"]').setAttribute("content", palette.accent);
}

function loadJSON(key, fallback) {
  try {
    const value = getStoredItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  setStoredItem(key, JSON.stringify(value));
}

function getStoredItem(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return fallbackStorage.has(key) ? fallbackStorage.get(key) : null;
  }
}

function setStoredItem(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    fallbackStorage.set(key, String(value));
  }
}

async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
    showToast("Copied");
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
    showToast("Copied");
  }
}

let ughTimer = null;
function playIncorrectAnimation() {
  if (!els.ughOverlay) return;

  window.clearTimeout(ughTimer);
  document.body.classList.remove("is-ugh-active");
  els.ughOverlay.classList.remove("is-visible");

  void els.ughOverlay.offsetWidth;

  document.body.classList.add("is-ugh-active");
  els.ughOverlay.classList.add("is-visible");

  ughTimer = window.setTimeout(() => {
    document.body.classList.remove("is-ugh-active");
    els.ughOverlay.classList.remove("is-visible");
  }, 1250);
}

let toastTimer = null;
function showToast(message) {
  window.clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => {
    els.toast.classList.remove("is-visible");
  }, 1800);
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    return entities[char];
  });
}

function escapeAttr(value) {
  return escapeHTML(value);
}

function escapeSVG(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&apos;"
    };
    return entities[char];
  });
}

function renderLogoMark(mark) {
  const safeMark = escapeAttr(mark);
  return `
    <img
      class="brand-logo"
      src="assets/logos/${safeMark}.svg"
      alt=""
      aria-hidden="true"
    >
  `;
}
