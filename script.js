const SUPABASE_URL = "https://byyndiszcvlhykfksves.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5eW5kaXN6Y3ZsaHlrZmtzdmVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2NjY2MzksImV4cCI6MjA4NzI0MjYzOX0.6Wx86lrF36m1FwOBLgFGPbSKW26zpYzopw4ZTKKJ4qo";

// Supabase客户端
const supabaseClient = window.Supabase
  ? window.Supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const toDate = (value) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const daysBetween = (from, to) => {
  const ms = to.getTime() - from.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
};

const formatDate = (value) => dateFormatter.format(toDate(value));

const createTimelineCard = (item) => {
  const card = document.createElement("div");
  card.className = "timeline-card";
  card.innerHTML = `
    <div class="timeline-date">${formatDate(item.date)}</div>
    <div>
      <div class="timeline-title">${item.title}</div>
      <div class="timeline-detail">${item.detail}</div>
    </div>
  `;
  return card;
};

const createStoryCard = (story) => {
  const card = document.createElement("article");
  card.className = "story-card";
  card.innerHTML = `
    <h3>${story.title}</h3>
    <p>${story.text}</p>
  `;
  return card;
};

const createPhotoItem = (photo) => {
  const wrapper = document.createElement("div");
  wrapper.className = "photo-item";
  const img = document.createElement("img");
  img.src = photo.src;
  img.alt = photo.caption || "照片";
  img.onerror = () => {
    img.remove();
    wrapper.style.background = "linear-gradient(135deg, #f7d6dc 0%, #cfe0f7 100%)";
  };
  const caption = document.createElement("span");
  caption.textContent = photo.caption || "";
  wrapper.appendChild(img);
  wrapper.appendChild(caption);
  return wrapper;
};

const createAnniversaryCard = (item) => {
  const card = document.createElement("div");
  card.className = "anniversary-card";
  const target = toDate(item.date);
  const today = new Date();
  const diff = daysBetween(today, target);
  const statusText = diff >= 0 ? "还有" : "已过去";
  const daysNum = Math.abs(diff);
  card.innerHTML = `
    <h3>${item.title}</h3>
    <p class="date">${formatDate(item.date)}</p>
    <p class="countdown">${statusText} <span class="number">${daysNum}</span> 天</p>
    <p class="timeline-detail">${item.note || ""}</p>
  `;
  return card;
};

const createWishCard = (item) => {
  const card = document.createElement("div");
  card.className = "wish-card";
  card.innerHTML = `
    <h3>${item.title}</h3>
    <p>${item.status}</p>
  `;
  return card;
};

const createSongItem = (item) => {
  const row = document.createElement("div");
  row.className = "song-item";
  row.textContent = `${item.title} · ${item.artist}`;
  return row;
};

const createQaItem = (item) => {
  const row = document.createElement("div");
  row.className = "qa-item";
  row.innerHTML = `\n    <h4>${item.question}</h4>\n    <p>${item.answer}</p>\n  `;
  return row;
};

const createLocalQaItem = (item) => {
  const row = document.createElement("div");
  row.className = "qa-item";
  // 支持Supabase格式 (created_at) 和 localStorage格式 (date)
  const dateStr = item.created_at
    ? new Date(item.created_at).toLocaleDateString("zh-CN")
    : item.date || "";
  row.innerHTML = `
    <div class="qa-meta">${item.name || "她"} · ${dateStr}</div>
    <h4>${item.question}</h4>
    <p>${item.answer || "等待回答"}</p>
  `;
  return row;
};

const createVocabItem = (item) => {
  const row = document.createElement("div");
  row.className = "vocab-item";
  row.innerHTML = `
    <h4>${item.word}</h4>
    <p class="vocab-meaning">${item.meaning}</p>
    <p>${item.note || ""}</p>
  `;
  return row;
};

const createSmItem = (item, index) => {
  const row = document.createElement("label");
  row.className = "sm-item";
  row.innerHTML = `\n    <input type="checkbox" ${item.done ? "checked" : ""} data-index="${index}" />\n    <span>${item.title}</span>\n    <em>${item.note || ""}</em>\n  `;
  return row;
};

const loadLocalQuestions = () => {
  const raw = localStorage.getItem("spanishQuestions");
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const saveLocalQuestions = (items) => {
  localStorage.setItem("spanishQuestions", JSON.stringify(items));
};

// 从Supabase加载问答数据
const loadQuestionsFromSupabase = async () => {
  if (!supabaseClient) return null;
  try {
    const { data, error } = await supabaseClient
      .from("questions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.warn("Supabase加载失败:", e);
    return null;
  }
};

// 提交问题到Supabase
const submitQuestionToSupabase = async (name, question) => {
  if (!supabaseClient) return null;
  try {
    const { data, error } = await supabaseClient
      .from("questions")
      .insert([{ question, name, status: "pending" }])
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (e) {
    console.warn("Supabase提交失败:", e);
    return null;
  }
};

const applyData = (data) => {
  console.log("applyData called with data:", data);
  document.querySelector(".hero-badge").textContent = data.couple.names;
  document.querySelector(".hero-title").textContent = data.couple.heroTitle;
  document.querySelector(".hero-subtitle").textContent = data.couple.heroSubtitle;
  document.title = `恋爱记录 · ${data.couple.names}`;

  const metDate = document.getElementById("met-date");
  const startDate = document.getElementById("start-date");
  metDate.textContent = data.couple.metDate;
  startDate.textContent = data.couple.startDate;

  const togetherDays = document.getElementById("together-days");
  const today = new Date();
  const start = toDate(data.couple.startDate);
  togetherDays.textContent = `${Math.max(0, daysBetween(start, today))} 天`;

  const timelineList = document.getElementById("timeline-list");
  timelineList.innerHTML = "";
  data.timeline.forEach((item) => timelineList.appendChild(createTimelineCard(item)));

  const storyList = document.getElementById("story-list");
  storyList.innerHTML = "";
  data.stories.forEach((story) => storyList.appendChild(createStoryCard(story)));

  const photoGrid = document.getElementById("photo-grid");
  photoGrid.innerHTML = "";
  data.photos.forEach((photo) => photoGrid.appendChild(createPhotoItem(photo)));

  const anniversaryList = document.getElementById("anniversary-list");
  anniversaryList.innerHTML = "";
  data.anniversaries.forEach((item) =>
    anniversaryList.appendChild(createAnniversaryCard(item))
  );

  const wishList = document.getElementById("wish-list");
  wishList.innerHTML = "";
  data.wishes.forEach((item) => wishList.appendChild(createWishCard(item)));

  const songList = document.getElementById("song-list");
  songList.innerHTML = "";
  data.songs.forEach((item) => songList.appendChild(createSongItem(item)));

  const qaList = document.getElementById("qa-list");
  qaList.innerHTML = "";
  data.spanish.qa.forEach((item) => qaList.appendChild(createQaItem(item)));

  // 加载用户提交的问答（优先Supabase，降级localStorage）
  const loadUserQuestions = async () => {
    let userQuestions = await loadQuestionsFromSupabase();
    if (!userQuestions) {
      userQuestions = loadLocalQuestions();
    }
    return userQuestions;
  };

  loadUserQuestions().then((userQuestions) => {
    userQuestions.forEach((item) => qaList.appendChild(createLocalQaItem(item)));
  });

  const askSubmit = document.getElementById("ask-submit");
  const askName = document.getElementById("ask-name");
  const askQuestion = document.getElementById("ask-question");

  console.log("askSubmit:", askSubmit, "askName:", askName, "askQuestion:", askQuestion);

  // 提问提交处理
  const handleSubmit = async () => {
    console.log("handleSubmit called");
    const name = askName.value.trim() || "她";
    const question = askQuestion.value.trim();
    if (!question) {
      console.log("No question entered");
      return;
    }

    const item = {
      name,
      question,
      answer: "",
      date: new Date().toLocaleDateString("zh-CN"),
      created_at: new Date().toISOString(),
    };

    // 优先提交到Supabase，失败则降级到localStorage
    const supabaseData = await submitQuestionToSupabase(name, question);
    if (supabaseData) {
      item.id = supabaseData.id;
      item.created_at = supabaseData.created_at;
    } else {
      localQuestions = [item, ...localQuestions];
      saveLocalQuestions(localQuestions);
    }

    qaList.prepend(createLocalQaItem(item));
    askQuestion.value = "";
  };

  askSubmit.addEventListener("click", handleSubmit);
  askQuestion.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.ctrlKey) handleSubmit();
  });

  let localQuestions = loadLocalQuestions();

  const vocabList = document.getElementById("vocab-list");
  vocabList.innerHTML = "";
  data.spanish.vocab.forEach((item) => vocabList.appendChild(createVocabItem(item)));

  const smList = document.getElementById("sm-list");
  smList.innerHTML = "";
  if (!data.smTasks || data.smTasks.length === 0) {
    const empty = document.createElement("div");
    empty.className = "sm-empty";
    empty.textContent = "暂时没有任务。";
    smList.appendChild(empty);
  } else {
    data.smTasks.forEach((item, index) => smList.appendChild(createSmItem(item, index)));
    smList.addEventListener("change", (event) => {
      const target = event.target;
      if (target && target.matches("input[type='checkbox']")) {
        const idx = Number(target.dataset.index);
        data.smTasks[idx].done = target.checked;
      }
    });
  }
};

fetch("data.json")
  .then((response) => response.json())
  .then(applyData)
  .catch(() => {
    const note = document.querySelector(".hero-subtitle");
    if (note) note.textContent = "数据加载失败，请检查 data.json。";
  });

// 独立初始化问答功能，不依赖data.json
(function initQaForm() {
  const askSubmit = document.getElementById("ask-submit");
  const askName = document.getElementById("ask-name");
  const askQuestion = document.getElementById("ask-question");
  const qaList = document.getElementById("qa-list");

  console.log("initQaForm:", { askSubmit, askName, askQuestion, qaList });

  if (!askSubmit || !askQuestion) {
    console.log("问答表单元素未找到");
    return;
  }

  const handleSubmit = async () => {
    console.log("handleSubmit called");
    const name = askName ? askName.value.trim() || "她" : "她";
    const question = askQuestion.value.trim();
    if (!question) {
      console.log("No question entered");
      return;
    }

    const item = {
      name,
      question,
      answer: "",
      date: new Date().toLocaleDateString("zh-CN"),
      created_at: new Date().toISOString(),
    };

    console.log("Submitting question:", item);

    // 优先提交到Supabase，失败则降级到localStorage
    const supabaseData = await submitQuestionToSupabase(name, question);
    console.log("Supabase result:", supabaseData);

    if (supabaseData) {
      item.id = supabaseData.id;
      item.created_at = supabaseData.created_at;
    } else {
      const localQuestions = loadLocalQuestions();
      localQuestions.unshift(item);
      saveLocalQuestions(localQuestions);
      console.log("Saved to localStorage:", item);
    }

    if (qaList) {
      const qaItem = createLocalQaItem(item);
      qaList.prepend(qaItem);
      console.log("Added to DOM:", item);
    } else {
      console.log("qaList not found, cannot display");
    }
    askQuestion.value = "";
  };

  askSubmit.addEventListener("click", handleSubmit);
  askQuestion.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.ctrlKey) handleSubmit();
  });

  console.log("问答事件绑定完成");
})();

// 侧边导航栏逻辑
(function initSideNav() {
  const sideNav = document.getElementById("side-nav");
  if (!sideNav) return;

  const navDots = sideNav.querySelectorAll(".side-nav__dot");
  const sections = ["hero", "timeline", "stories", "photos", "anniversary", "wishes", "playlist", "spanish"];

  // 使用滚动事件监听，比 IntersectionObserver 更可靠
  function updateActiveSection() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    let currentSection = "hero";

    // 遍历所有 section，找到当前最靠上的可见 section
    for (const id of sections) {
      const el = document.getElementById(id);
      if (!el) continue;

      const rect = el.getBoundingClientRect();
      const elementTop = rect.top + scrollY;

      // 如果滚动位置超过了元素的一半，认为该元素是当前可见的
      if (scrollY >= elementTop - windowHeight / 2) {
        currentSection = id;
      }
    }

    // 更新 active 状态
    navDots.forEach(dot => {
      dot.classList.toggle("active", dot.dataset.target === currentSection);
    });
  }

  // 监听滚动事件
  window.addEventListener("scroll", updateActiveSection, { passive: true });

  // 初始化时调用一次
  updateActiveSection();

  // 点击导航跳转
  navDots.forEach(dot => {
    dot.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = dot.dataset.target;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
})();
