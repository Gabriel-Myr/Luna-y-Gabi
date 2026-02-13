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
  const status = diff >= 0 ? `还有 ${diff} 天` : `已过去 ${Math.abs(diff)} 天`;
  card.innerHTML = `
    <h3>${item.title}</h3>
    <p>${formatDate(item.date)}</p>
    <p>${status}</p>
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
  row.innerHTML = `\n    <div class="qa-meta">${item.name} · ${item.date}</div>\n    <h4>${item.question}</h4>\n    <p>${item.answer || "等待回答"}</p>\n  `;
  return row;
};

const createVocabItem = (item) => {
  const row = document.createElement("div");
  row.className = "vocab-item";
  row.innerHTML = `\n    <h4>${item.word}</h4>\n    <p class=\"vocab-meaning\">${item.meaning}</p>\n    <p>${item.note || \"\"}</p>\n  `;
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

const applyData = (data) => {
  document.querySelector(".hero__badge").textContent = data.couple.names;
  document.querySelector(".hero__title").textContent = data.couple.heroTitle;
  document.querySelector(".hero__subtitle").textContent = data.couple.heroSubtitle;
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

  let localQuestions = loadLocalQuestions();
  localQuestions.forEach((item) => qaList.appendChild(createLocalQaItem(item)));

  const askSubmit = document.getElementById("ask-submit");
  const askName = document.getElementById("ask-name");
  const askQuestion = document.getElementById("ask-question");
  askSubmit.addEventListener("click", () => {
    const name = askName.value.trim() || "她";
    const question = askQuestion.value.trim();
    if (!question) return;
    const item = {
      name,
      question,
      answer: "",
      date: new Date().toLocaleDateString("zh-CN"),
    };
    localQuestions = [item, ...localQuestions];
    saveLocalQuestions(localQuestions);
    qaList.prepend(createLocalQaItem(item));
    askQuestion.value = "";
  });

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
    const note = document.querySelector(".hero__subtitle");
    note.textContent = "数据加载失败，请检查 data.json。";
  });
