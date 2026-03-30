(function () {
  'use strict';

  const LEGACY_PROGRESS_KEY = 'jigmerge_progress_v2';
  const STORAGE_KEY = 'jigmerge_rebrand_progress_v1';
  const COLLECTION_COLORS = [
    '#ff7b68', '#ffa14d', '#2fd28e', '#28ccef', '#5a8cff', '#ff7aa8', '#9f7fff', '#ef6d56', '#2db18b',
  ];

  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.enabled = true;
      this.initialized = false;
      this.sfxVolume = 0.5;
    }

    init() {
      if (this.initialized) return;
      try {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.initialized = true;
      } catch (error) {
        console.warn('Audio unavailable', error);
      }
    }

    _note(freq, type, duration, volume, delay = 0) {
      if (!this.ctx || !this.enabled) return;
      const oscillator = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);
      gain.gain.setValueAtTime(Math.max(volume * this.sfxVolume, 0.0001), this.ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + delay + duration);
      oscillator.connect(gain);
      gain.connect(this.ctx.destination);
      oscillator.start(this.ctx.currentTime + delay);
      oscillator.stop(this.ctx.currentTime + delay + duration);
    }

    click() {
      this._note(620, 'sine', 0.06, 0.13);
    }

    pickup() {
      this._note(880, 'sine', 0.1, 0.22);
      this._note(1320, 'triangle', 0.08, 0.12, 0.02);
    }

    drop() {
      this._note(220, 'sine', 0.13, 0.22);
      this._note(165, 'triangle', 0.09, 0.12, 0.02);
    }

    merge() {
      this._note(523, 'sine', 0.18, 0.22);
      this._note(659, 'triangle', 0.18, 0.16, 0.06);
      this._note(784, 'sine', 0.22, 0.12, 0.12);
    }

    win() {
      [523, 659, 784, 1047].forEach((freq, index) => {
        this._note(freq, 'sine', 0.24, 0.18, index * 0.08);
      });
    }
  }

  class MusicManager {
    constructor() {
      this.tracks = ['/Music/Golden Time.mp3', '/Music/Golden Time Extra.mp3', '/Music/Golden Time Reup.mp3'];
      this.currentAudio = null;
      this.playing = false;
      this.volume = 0.5;
      this._fadeInterval = null;
      this._isLoading = false;
    }

    playRandom() {
      if (!this.playing || this._isLoading || this.tracks.length === 0) return;

      this._isLoading = true;
      let track = this.tracks[Math.floor(Math.random() * this.tracks.length)];
      if (this.currentAudio && this.tracks.length > 1) {
        const currentName = decodeURIComponent(this.currentAudio.src.split('/').pop() || '');
        while (track.endsWith(currentName)) {
          track = this.tracks[Math.floor(Math.random() * this.tracks.length)];
        }
      }

      const audio = new Audio(track);
      audio.volume = 0;
      const playPromise = audio.play();
      if (!playPromise) {
        this._isLoading = false;
        return;
      }

      playPromise.then(() => {
        this._isLoading = false;
        if (!this.playing) {
          audio.pause();
          return;
        }
        if (this.currentAudio) {
          this.currentAudio.pause();
          this.currentAudio.src = '';
        }
        this.currentAudio = audio;
        this.currentAudio.addEventListener('ended', () => this.playRandom());
        this.currentAudio.addEventListener('error', () => {
          setTimeout(() => this.playRandom(), 1000);
        });
        this._fadeIn(this.currentAudio);
      }).catch(() => {
        this._isLoading = false;
      });
    }

    _fadeIn(audio) {
      if (this._fadeInterval) {
        clearInterval(this._fadeInterval);
      }
      this._fadeInterval = setInterval(() => {
        if (!this.playing || !audio) {
          clearInterval(this._fadeInterval);
          return;
        }
        if (audio.volume < this.volume) {
          audio.volume = Math.min(this.volume, audio.volume + 0.05);
        } else {
          clearInterval(this._fadeInterval);
        }
      }, 100);
    }

    setMute(muted) {
      this.playing = !muted;
      if (this._fadeInterval) {
        clearInterval(this._fadeInterval);
      }
      if (muted) {
        if (this.currentAudio) {
          this.currentAudio.pause();
          this.currentAudio.volume = 0;
        }
        return;
      }
      if (this.currentAudio) {
        this.currentAudio.volume = this.volume;
        this.currentAudio.play().catch(() => {});
      } else {
        this.playRandom();
      }
    }

    start() {
      if (this.playing) return;
      this.playing = true;
      if (this.currentAudio) {
        this.currentAudio.volume = this.volume;
        this.currentAudio.play().catch(() => {});
      } else {
        this.playRandom();
      }
    }
  }

  class ConfettiSystem {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.particles = [];
      this.running = false;
      this.colors = ['#ff5e4d', '#28ccef', '#2fd28e', '#ffc82b', '#ff7aa8'];
    }

    resize() {
      this.canvas.width = this.canvas.offsetWidth;
      this.canvas.height = this.canvas.offsetHeight;
    }

    burst(count = 90) {
      this.resize();
      this.particles = [];
      const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height * 0.32;
      for (let index = 0; index < count; index += 1) {
        const angle = (Math.PI * 2 * index) / count + (Math.random() - 0.5) * 0.35;
        const speed = 3 + Math.random() * 6;
        this.particles.push({
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 3,
          size: 4 + Math.random() * 6,
          color: this.colors[Math.floor(Math.random() * this.colors.length)],
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 10,
          gravity: 0.12 + Math.random() * 0.08,
          friction: 0.98,
          opacity: 1,
          shape: Math.random() > 0.5 ? 'rect' : 'circle',
        });
      }
      if (!this.running) {
        this.running = true;
        this._animate();
      }
    }

    _animate() {
      if (!this.running) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      let alive = 0;
      this.particles.forEach((particle) => {
        particle.vy += particle.gravity;
        particle.vx *= particle.friction;
        particle.vy *= particle.friction;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.rotation += particle.rotSpeed;
        particle.opacity -= 0.008;
        if (particle.opacity <= 0) {
          return;
        }
        alive += 1;
        this.ctx.save();
        this.ctx.translate(particle.x, particle.y);
        this.ctx.rotate((particle.rotation * Math.PI) / 180);
        this.ctx.globalAlpha = particle.opacity;
        this.ctx.fillStyle = particle.color;
        if (particle.shape === 'rect') {
          this.ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size * 0.6);
        } else {
          this.ctx.beginPath();
          this.ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
          this.ctx.fill();
        }
        this.ctx.restore();
      });

      if (alive > 0) {
        requestAnimationFrame(() => this._animate());
      } else {
        this.stop();
      }
    }

    stop() {
      this.running = false;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  function buildLevels() {
    const levels = {};
    for (let index = 1; index <= 7; index += 1) {
      levels[index] = { rows: 3, cols: 3, folder: `level${index}` };
    }
    for (let index = 8; index <= 13; index += 1) {
      levels[index] = { rows: 6, cols: 6, folder: `level${index}` };
    }
    for (let index = 14; index <= 19; index += 1) {
      levels[index] = { rows: 9, cols: 9, folder: `level${index}` };
    }
    return levels;
  }

  const LEVELS = buildLevels();

  function getCollectionColor(collectionId) {
    return COLLECTION_COLORS[(collectionId - 1) % COLLECTION_COLORS.length];
  }

  function getCollectionName(collectionId) {
    return `Collection ${String(collectionId).padStart(2, '0')}`;
  }

  function getPuzzleTitle(puzzleIndex) {
    return `Puzzle ${String(puzzleIndex + 1).padStart(2, '0')}`;
  }

  function buildCollections() {
    const collections = [];
    Object.keys(LEVELS).forEach((collectionIdText) => {
      const collectionId = Number(collectionIdText);
      const config = LEVELS[collectionId];
      const images = window.LEVEL_IMAGES ? (window.LEVEL_IMAGES[collectionId] || []) : [];
      if (images.length === 0) {
        return;
      }
      collections.push({
        id: collectionId,
        slug: `collection-${String(collectionId).padStart(2, '0')}`,
        name: getCollectionName(collectionId),
        color: getCollectionColor(collectionId),
        img: images[0],
        folder: config.folder,
        cols: config.cols,
        rows: config.rows,
        levels: images.map((imageName, index) => ({
          id: `${collectionId}:${index}`,
          title: getPuzzleTitle(index),
          cols: config.cols,
          rows: config.rows,
          img: imageName,
          folder: config.folder,
          collectionId,
          puzzleIndex: index,
        })),
      });
    });
    return collections;
  }

  function loadProgress() {
    let solved = {};
    try {
      solved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') || {};
    } catch (error) {
      solved = {};
    }

    if (Object.keys(solved).length > 0) {
      Object.keys(solved).forEach((key) => {
        if (typeof solved[key] === 'boolean') {
          solved[key] = { solved: solved[key] };
        }
      });
      return solved;
    }

    try {
      const legacy = JSON.parse(localStorage.getItem(LEGACY_PROGRESS_KEY) || '{}') || {};
      const bestScores = legacy.bestScores || {};
      Object.keys(bestScores).forEach((key) => {
        const legacyScore = bestScores[key] || {};
        solved[key] = {
          solved: true,
          bestTime: typeof legacyScore.time === 'number' ? legacyScore.time : null,
          bestMoves: typeof legacyScore.moves === 'number' ? legacyScore.moves : null,
          bestStars: null,
        };
      });
    } catch (error) {
      solved = {};
    }

    return solved;
  }

  function saveProgress(progress) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }

  const collections = buildCollections();
  const progress = loadProgress();

  const startScreen = document.getElementById('start-screen');
  const collectionScreen = document.getElementById('collection-screen');
  const puzzleScreen = document.getElementById('puzzle-screen');
  const gameScreen = document.getElementById('game-screen');
  const winScreen = document.getElementById('win-screen');
  const settingsModal = document.getElementById('settings-modal');
  const collectionGrid = document.getElementById('collection-grid');
  const puzzleGrid = document.getElementById('puzzle-grid');
  const puzzleScreenTitle = document.getElementById('puzzle-screen-title');
  const gameLevelTitle = document.getElementById('game-level-title');
  const gameCanvas = document.getElementById('game-canvas');
  const timerValueEl = document.getElementById('timer-value');
  const timerValueMobileEl = document.getElementById('timer-value-mobile');
  const showButton = document.getElementById('btn-show');
  const showActionLabel = document.getElementById('show-action-label');
  const showActionState = document.getElementById('show-action-state');
  const winPreviewImage = document.getElementById('win-preview-image');
  const confetti = new ConfettiSystem(document.getElementById('confetti-canvas'));
  const ctx = gameCanvas.getContext('2d');

  const sfx = new SoundEngine();
  const music = new MusicManager();

  let currentCollection = null;
  let currentLevel = null;
  let currentLevelIndex = 0;
  let state = null;
  let mergedGroups = [];
  let dragController = null;
  let splitResult = null;
  let sourceImage = null;
  let tileW = 0;
  let tileH = 0;
  let moves = 0;
  let seconds = 0;
  let timerInterval = null;
  let isAnimating = false;
  let showingReference = false;
  let previousMergedCount = 0;
  let moveHistory = [];
  let isMuted = false;
  let cardImageObserver = null;
  const preloadedLevelImages = new Map();
  let showUses = 0;
  let showCooldownUntil = 0;

  function initAudio() {
    sfx.init();
    if (!music.playing && !isMuted) {
      music.start();
    }
    document.removeEventListener('click', initAudio);
    document.removeEventListener('touchstart', initAudio);
  }

  document.addEventListener('click', initAudio);
  document.addEventListener('touchstart', initAudio);

  function playSfx(type) {
    sfx.init();
    if (type === 'click') sfx.click();
    if (type === 'pickup') sfx.pickup();
    if (type === 'drop') sfx.drop();
    if (type === 'merge') sfx.merge();
    if (type === 'win') sfx.win();
  }

  function showScreen(screen) {
    [startScreen, collectionScreen, puzzleScreen, gameScreen, winScreen].forEach((element) => {
      element.classList.remove('active');
    });
    screen.classList.add('active');

    if (screen !== startScreen) {
      closeSettingsModal();
    }
  }

  function openSettingsModal() {
    if (!settingsModal) return;
    settingsModal.classList.add('is-open');
    settingsModal.setAttribute('aria-hidden', 'false');
  }

  function closeSettingsModal() {
    if (!settingsModal) return;
    settingsModal.classList.remove('is-open');
    settingsModal.setAttribute('aria-hidden', 'true');
  }

  function getImageUrl(level) {
    return `/levels/${level.folder}/${encodeURIComponent(level.img)}`;
  }

  function getLevelRecord(levelId) {
    const record = progress[levelId];
    if (!record) {
      return null;
    }
    if (typeof record === 'boolean') {
      return { solved: record };
    }
    return record;
  }

  function formatStars(count) {
    return '★'.repeat(count) + '☆'.repeat(Math.max(0, 3 - count));
  }

  function getLevelStars(level, stats) {
    const tileCount = level.cols * level.rows;
    const fastThreshold = Math.round(tileCount * 7.5);
    const steadyThreshold = Math.round(tileCount * 12);
    const cleanMoveThreshold = Math.round(tileCount * 1.9);
    const steadyMoveThreshold = Math.round(tileCount * 2.9);

    if (stats.showUses === 0 && stats.seconds <= fastThreshold && stats.moves <= cleanMoveThreshold) {
      return 3;
    }

    if (stats.showUses <= 1 && stats.seconds <= steadyThreshold && stats.moves <= steadyMoveThreshold) {
      return 2;
    }

    return 1;
  }

  function updateLevelRecord(level, stats) {
    const previous = getLevelRecord(level.id) || {};
    const bestTime = previous.bestTime == null ? stats.seconds : Math.min(previous.bestTime, stats.seconds);
    const bestMoves = previous.bestMoves == null ? stats.moves : Math.min(previous.bestMoves, stats.moves);
    const bestStars = previous.bestStars == null ? stats.stars : Math.max(previous.bestStars, stats.stars);

    progress[level.id] = {
      solved: true,
      bestTime,
      bestMoves,
      bestStars,
    };
    saveProgress(progress);

    return {
      bestTime,
      bestMoves,
      bestStars,
      isNewBestTime: previous.bestTime == null || stats.seconds < previous.bestTime,
      isNewBestMoves: previous.bestMoves == null || stats.moves < previous.bestMoves,
      isNewBestStars: previous.bestStars == null || stats.stars > previous.bestStars,
    };
  }

  function getNextLikelyLevel(collection, puzzleIndex) {
    if (!collection) {
      return null;
    }

    const nextIndex = puzzleIndex + 1;
    if (nextIndex < collection.levels.length && isLevelUnlocked(collection, nextIndex)) {
      return collection.levels[nextIndex];
    }

    return null;
  }

  function preloadLevelImage(level) {
    if (!level) {
      return;
    }

    const url = getImageUrl(level);
    if (preloadedLevelImages.has(url)) {
      return;
    }

    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.decoding = 'async';

    const preloadPromise = new Promise((resolve, reject) => {
      image.onload = () => resolve(image);
      image.onerror = () => {
        preloadedLevelImages.delete(url);
        reject(new Error(`Failed to preload ${url}`));
      };
    });

    preloadedLevelImages.set(url, preloadPromise);
    image.src = url;
  }

  function preloadNextLikelyLevel(collection, puzzleIndex) {
    preloadLevelImage(getNextLikelyLevel(collection, puzzleIndex));
  }

  function ensureCardImageObserver() {
    if (cardImageObserver || !('IntersectionObserver' in window)) {
      return;
    }

    cardImageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const img = entry.target;
        const src = img.dataset.src;
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
          img.classList.remove('grid-card-image-pending');
        }
        cardImageObserver.unobserve(img);
      });
    }, {
      rootMargin: '180px 0px',
      threshold: 0.01,
    });
  }

  function observeCardImage(img) {
    const deferredSrc = img.dataset.src;
    if (!deferredSrc) {
      return;
    }

    ensureCardImageObserver();
    if (!cardImageObserver) {
      img.src = deferredSrc;
      img.removeAttribute('data-src');
      img.classList.remove('grid-card-image-pending');
      return;
    }

    cardImageObserver.observe(img);
  }

  function createDeferredCardImage(level, alt) {
    const img = document.createElement('img');
    img.alt = alt;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.className = 'grid-card-image-pending';
    img.dataset.src = getImageUrl(level);
    observeCardImage(img);
    return img;
  }

  function createLockedCardArt(label) {
    const placeholder = document.createElement('div');
    placeholder.className = 'grid-card-placeholder';
    placeholder.innerHTML = `
      <div class="grid-card-placeholder-badge">Locked</div>
      <div class="grid-card-placeholder-shape"></div>
      <div class="grid-card-placeholder-text">${label}</div>
    `;
    return placeholder;
  }

  function isLevelSolved(levelId) {
    const record = getLevelRecord(levelId);
    return !!(record && record.solved);
  }

  function isLevelUnlocked(collection, index) {
    if (index === 0) {
      return true;
    }
    return isLevelSolved(collection.levels[index - 1].id);
  }

  function getRequestedStart() {
    const params = new URLSearchParams(window.location.search);
    const collectionId = Number.parseInt(params.get('collection') || '', 10);
    const puzzleIndex = Number.parseInt(params.get('puzzle') || '', 10);
    const collection = collections.find((item) => item.id === collectionId);
    if (!collection) {
      return null;
    }
    if (!Number.isInteger(puzzleIndex)) {
      return { collection, puzzleIndex: null };
    }
    if (puzzleIndex < 0 || puzzleIndex >= collection.levels.length) {
      return { collection, puzzleIndex: null };
    }
    return { collection, puzzleIndex };
  }

  function formatTimerValue(totalSeconds) {
    if (totalSeconds < 60) {
      return `${totalSeconds}s`;
    }
    return `${Math.floor(totalSeconds / 60)}m${String(totalSeconds % 60).padStart(2, '0')}s`;
  }

  function updateTimerEl() {
    const value = formatTimerValue(seconds);
    timerValueEl.textContent = value;
    if (timerValueMobileEl) {
      timerValueMobileEl.textContent = value;
    }
    updateShowButtonState();
  }

  function setShowState(text, className, label) {
    if (showActionState) {
      showActionState.textContent = text;
      showActionState.className = `action-state ${className}`;
    }
    if (showActionLabel && label) {
      showActionLabel.textContent = label;
    }
  }

  function updateShowButtonState() {
    if (!showButton) {
      return;
    }

    const remaining = Math.max(0, Math.ceil((showCooldownUntil - Date.now()) / 1000));
    if (remaining > 0) {
      showButton.classList.add('is-cooling');
      showButton.disabled = true;
      setShowState(`${remaining}s`, 'action-state action-state-cooldown'.split(' ').slice(1).join(' '), 'Cooling');
      return;
    }

    showButton.classList.remove('is-cooling');
    showButton.disabled = !!isAnimating || showingReference;
    setShowState('+5s hint', 'action-state-ready', 'Show');
  }

  function flashShowPenalty() {
    setShowState('+5s used', 'action-state-penalty', 'Penalty');
    setTimeout(() => {
      updateShowButtonState();
    }, 900);
  }

  function startTimer() {
    stopTimer();
    timerInterval = setInterval(() => {
      seconds += 1;
      updateTimerEl();
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  function renderCollectionScreen() {
    collectionGrid.innerHTML = '';
    collections.forEach((collection) => {
      const solvedCount = collection.levels.filter((level) => isLevelSolved(level.id)).length;
      const card = document.createElement('button');
      card.className = 'grid-card';
      card.appendChild(createDeferredCardImage(collection.levels[0], collection.name));

      const meta = document.createElement('div');
      meta.className = 'grid-card-meta';
      meta.innerHTML = `
        <span class="grid-card-label">${collection.name}</span>
        <span class="grid-card-subtle">${solvedCount}/${collection.levels.length}</span>
      `;
      card.appendChild(meta);

      card.addEventListener('click', () => {
        playSfx('click');
        currentCollection = collection;
        renderPuzzleScreen(collection);
        showScreen(puzzleScreen);
      });
      collectionGrid.appendChild(card);
    });
  }

  function renderPuzzleScreen(collection) {
    puzzleScreenTitle.textContent = collection.name;
    puzzleGrid.innerHTML = '';

    collection.levels.forEach((level, index) => {
      const unlocked = isLevelUnlocked(collection, index);
      const solved = isLevelSolved(level.id);
      const record = getLevelRecord(level.id);
      const card = document.createElement('button');
      card.className = `grid-card${unlocked ? '' : ' is-locked'}`;
      if (unlocked) {
        card.appendChild(createDeferredCardImage(level, level.title));
      } else {
        card.appendChild(createLockedCardArt(level.title));
      }

      const meta = document.createElement('div');
      meta.className = 'grid-card-meta';
      const metaRight = solved
        ? `<span class="grid-card-subtle grid-card-stars">${formatStars(record && record.bestStars ? record.bestStars : 1)}</span>`
        : `<span class="grid-card-subtle">${level.cols}x${level.rows}</span>`;
      meta.innerHTML = `
        <span class="grid-card-label">${level.title}</span>
        ${metaRight}
      `;
      card.appendChild(meta);

      if (!unlocked) {
        const overlay = document.createElement('div');
        overlay.className = 'locked-overlay';
        overlay.innerHTML = `
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <span class="locked-label">Locked</span>
        `;
        card.appendChild(overlay);
      } else {
        card.addEventListener('click', () => {
          playSfx('click');
          currentCollection = collection;
          currentLevelIndex = index;
          startGame(collection, level);
        });
      }

      puzzleGrid.appendChild(card);
    });
  }

  function quickPlay() {
    for (const collection of collections) {
      for (let index = 0; index < collection.levels.length; index += 1) {
        if (isLevelUnlocked(collection, index) && !isLevelSolved(collection.levels[index].id)) {
          currentCollection = collection;
          currentLevelIndex = index;
          startGame(collection, collection.levels[index]);
          return;
        }
      }
    }

    const fallback = collections[0];
    currentCollection = fallback;
    currentLevelIndex = 0;
    startGame(fallback, fallback.levels[0]);
  }

  function loadImage(url, fallbackColor) {
    const cached = preloadedLevelImages.get(url);
    if (cached) {
      return cached.catch(() => loadImage(url, fallbackColor));
    }

    return new Promise((resolve) => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => resolve(image);
      image.onerror = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 800;
        const fallbackCtx = canvas.getContext('2d');
        fallbackCtx.fillStyle = fallbackColor;
        fallbackCtx.fillRect(0, 0, canvas.width, canvas.height);
        fallbackCtx.fillStyle = '#ffffff';
        fallbackCtx.font = '800 48px Nunito';
        fallbackCtx.textAlign = 'center';
        fallbackCtx.textBaseline = 'middle';
        fallbackCtx.fillText('JigMerge', canvas.width / 2, canvas.height / 2 - 40);
        fallbackCtx.font = '700 28px Nunito';
        fallbackCtx.fillText('Puzzle image unavailable', canvas.width / 2, canvas.height / 2 + 24);
        resolve(canvas);
      };
      image.src = url;
    });
  }

  function getBoardArea() {
    const boardArea = document.querySelector('.game-board-area');
    return {
      width: Math.max(160, boardArea.clientWidth - 24),
      height: Math.max(160, boardArea.clientHeight - 24),
    };
  }

  function drawFullImage(boardW, boardH) {
    ctx.clearRect(0, 0, boardW, boardH);
    ctx.drawImage(sourceImage, 0, 0, boardW, boardH);
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 1;
    for (let col = 1; col < currentLevel.cols; col += 1) {
      ctx.beginPath();
      ctx.moveTo(col * tileW, 0);
      ctx.lineTo(col * tileW, boardH);
      ctx.stroke();
    }
    for (let row = 1; row < currentLevel.rows; row += 1) {
      ctx.beginPath();
      ctx.moveTo(0, row * tileH);
      ctx.lineTo(boardW, row * tileH);
      ctx.stroke();
    }
    ctx.restore();
  }

  function getGroupOf(tileIndex) {
    return GroupEngine.groupOf(mergedGroups, tileIndex);
  }

  function drawTile(tileIndex, xOverride, yOverride, isDragging) {
    const descriptor = splitResult.tiles[state.tiles[tileIndex].correctIndex];
    const position = state.pixelOf(tileIndex, tileW, tileH);
    const x = xOverride !== undefined ? xOverride : position.x;
    const y = yOverride !== undefined ? yOverride : position.y;
    ctx.save();
    if (isDragging) {
      ctx.shadowColor = 'rgba(255, 94, 77, 0.18)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 6;
    }
    ctx.drawImage(sourceImage, descriptor.srcX, descriptor.srcY, descriptor.srcW, descriptor.srcH, x, y, tileW, tileH);
    ctx.restore();
  }

  function drawBorders(tileIndex, xOverride, yOverride, isDragging) {
    const group = getGroupOf(tileIndex);
    const position = state.pixelOf(tileIndex, tileW, tileH);
    const x = xOverride !== undefined ? xOverride : position.x;
    const y = yOverride !== undefined ? yOverride : position.y;
    const grid = state.currentGridOf(tileIndex);

    [
      { dc: 0, dr: -1, edge: 'top' },
      { dc: 1, dr: 0, edge: 'right' },
      { dc: 0, dr: 1, edge: 'bottom' },
      { dc: -1, dr: 0, edge: 'left' },
    ].forEach((side) => {
      const neighborCol = grid.col + side.dc;
      const neighborRow = grid.row + side.dr;
      if (group && neighborCol >= 0 && neighborCol < currentLevel.cols && neighborRow >= 0 && neighborRow < currentLevel.rows) {
        const neighborTile = state.tileAtGrid(neighborCol, neighborRow);
        if (neighborTile !== -1 && group.has(neighborTile)) {
          return;
        }
      }

      ctx.save();
      if (group && group.size >= 2) {
        ctx.strokeStyle = isDragging ? 'rgba(255, 94, 77, 0.5)' : 'rgba(255, 94, 77, 0.26)';
        ctx.lineWidth = isDragging ? 2.5 : 2;
      } else {
        ctx.strokeStyle = isDragging ? 'rgba(15, 23, 42, 0.16)' : 'rgba(15, 23, 42, 0.08)';
        ctx.lineWidth = 1;
      }
      ctx.beginPath();
      if (side.edge === 'top') {
        ctx.moveTo(x, y);
        ctx.lineTo(x + tileW, y);
      } else if (side.edge === 'right') {
        ctx.moveTo(x + tileW, y);
        ctx.lineTo(x + tileW, y + tileH);
      } else if (side.edge === 'bottom') {
        ctx.moveTo(x, y + tileH);
        ctx.lineTo(x + tileW, y + tileH);
      } else {
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + tileH);
      }
      ctx.stroke();
      ctx.restore();
    });
  }

  function drawBoard() {
    if (!state || !splitResult) return;

    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.fillStyle = '#f7fbff';
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

    const dragSnapshot = dragController ? dragController.dragSnapshot : null;
    const draggingSet = new Set(dragSnapshot ? dragSnapshot.groupIndices : []);
    state.tiles.forEach((_, index) => {
      if (!draggingSet.has(index)) {
        drawTile(index);
      }
    });
    state.tiles.forEach((_, index) => {
      if (!draggingSet.has(index)) {
        drawBorders(index);
      }
    });

    if (dragSnapshot) {
      const anchor = state.pixelOf(dragSnapshot.anchorTileIdx, tileW, tileH);
      const dx = dragSnapshot.x - dragSnapshot.offsetX - anchor.x;
      const dy = dragSnapshot.y - dragSnapshot.offsetY - anchor.y;

      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.08)';
      dragSnapshot.groupIndices.forEach((index) => {
        const position = state.pixelOf(index, tileW, tileH);
        ctx.fillRect(position.x + dx + 4, position.y + dy + 4, tileW, tileH);
      });
      ctx.restore();

      dragSnapshot.groupIndices.forEach((index) => {
        const position = state.pixelOf(index, tileW, tileH);
        drawTile(index, position.x + dx, position.y + dy, true);
      });
      dragSnapshot.groupIndices.forEach((index) => {
        const position = state.pixelOf(index, tileW, tileH);
        drawBorders(index, position.x + dx, position.y + dy, true);
      });
    }
  }

  async function animateShuffle(startPositions, endPositions, boardW, boardH) {
    await new Promise((resolve) => {
      const start = performance.now();
      const duration = 800;

      function frame(now) {
        const progressValue = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progressValue, 3);
        ctx.clearRect(0, 0, boardW, boardH);
        ctx.fillStyle = '#f7fbff';
        ctx.fillRect(0, 0, boardW, boardH);
        for (let index = 0; index < state.tiles.length; index += 1) {
          const descriptor = splitResult.tiles[state.tiles[index].correctIndex];
          const x = startPositions[index].x + (endPositions[index].x - startPositions[index].x) * ease;
          const y = startPositions[index].y + (endPositions[index].y - startPositions[index].y) * ease;
          ctx.drawImage(sourceImage, descriptor.srcX, descriptor.srcY, descriptor.srcW, descriptor.srcH, x, y, tileW, tileH);
          ctx.strokeStyle = 'rgba(15, 23, 42, 0.08)';
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, tileW, tileH);
        }
        if (progressValue < 1) {
          requestAnimationFrame(frame);
        } else {
          resolve();
        }
      }

      requestAnimationFrame(frame);
    });
  }

  async function startGame(collection, level) {
    currentCollection = collection;
    currentLevel = level;
    currentLevelIndex = level.puzzleIndex;
    moves = 0;
    seconds = 0;
    moveHistory = [];
    mergedGroups = [];
    previousMergedCount = 0;
    showingReference = false;
    showUses = 0;
    showCooldownUntil = 0;
    isAnimating = true;
    updateShowButtonState();

    if (dragController) {
      dragController.detach();
      dragController = null;
    }

    stopTimer();
    confetti.stop();
    updateTimerEl();
    gameLevelTitle.textContent = `${collection.name} · ${level.title}`;
    showScreen(gameScreen);

    const boardArea = getBoardArea();
    const ratio = level.cols / level.rows;
    let previewWidth;
    let previewHeight;
    if (boardArea.width / boardArea.height > ratio) {
      previewHeight = boardArea.height;
      previewWidth = previewHeight * ratio;
    } else {
      previewWidth = boardArea.width;
      previewHeight = previewWidth / ratio;
    }
    previewWidth = Math.max(level.cols, Math.floor(previewWidth / level.cols) * level.cols);
    previewHeight = Math.max(level.rows, Math.floor(previewHeight / level.rows) * level.rows);
    gameCanvas.width = previewWidth;
    gameCanvas.height = previewHeight;
    ctx.fillStyle = '#f2f7fb';
    ctx.fillRect(0, 0, previewWidth, previewHeight);
    ctx.fillStyle = '#5f7083';
    ctx.font = '700 14px Nunito';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Loading...', previewWidth / 2, previewHeight / 2);

    sourceImage = await loadImage(getImageUrl(level), collection.color);
    preloadNextLikelyLevel(collection, level.puzzleIndex);
    splitResult = ImageSplitter.split(sourceImage, level.cols, level.rows, boardArea.width, boardArea.height);
    tileW = splitResult.tileW;
    tileH = splitResult.tileH;
    gameCanvas.width = splitResult.boardW;
    gameCanvas.height = splitResult.boardH;

    state = new PuzzleState(level.cols, level.rows);
    const cellSize = { tileW, tileH };

    drawFullImage(splitResult.boardW, splitResult.boardH);
    ctx.save();
    const labelWidth = Math.min(180, splitResult.boardW - 24);
    const labelX = (splitResult.boardW - labelWidth) / 2;
    const labelY = (splitResult.boardH - 46) / 2;
    ctx.fillStyle = 'rgba(18, 32, 51, 0.55)';
    ctx.beginPath();
    ctx.roundRect(labelX, labelY, labelWidth, 46, 23);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 16px Nunito';
    ctx.fillText('Memorize!', splitResult.boardW / 2, splitResult.boardH / 2);
    ctx.restore();
    await new Promise((resolve) => setTimeout(resolve, 2200));

    const startPositions = state.tiles.map((tile) => ({
      x: (tile.currentIndex % level.cols) * tileW,
      y: Math.floor(tile.currentIndex / level.cols) * tileH,
    }));

    Shuffle.shuffle(state);

    const endPositions = state.tiles.map((tile) => ({
      x: (tile.currentIndex % level.cols) * tileW,
      y: Math.floor(tile.currentIndex / level.cols) * tileH,
    }));

    await animateShuffle(startPositions, endPositions, splitResult.boardW, splitResult.boardH);

    isAnimating = false;
    mergedGroups = GroupEngine.computeGroups(state);
    previousMergedCount = mergedGroups.reduce((sum, group) => sum + group.size, 0);

    dragController = new DragController(gameCanvas, state, cellSize, {
      onDragStart() {
        playSfx('pickup');
      },
      onDrop(groupIndices, colOffset, rowOffset, targetGridIndex) {
        const snapshot = state.tiles.map((tile) => tile.currentIndex);
        let moved = false;
        if (groupIndices.length === 1) {
          moved = MoveEngine.swapTwo(state, groupIndices[0], targetGridIndex);
        } else {
          moved = MoveEngine.moveGroup(state, groupIndices, colOffset, rowOffset);
        }
        if (!moved) {
          return;
        }
        moveHistory.push(snapshot);
        moves += 1;
        playSfx('drop');
        mergedGroups = GroupEngine.computeGroups(state);
        dragController.updateGroups(mergedGroups);
        const mergedCount = mergedGroups.reduce((sum, group) => sum + group.size, 0);
        if (mergedCount > previousMergedCount && previousMergedCount > 0) {
          playSfx('merge');
        }
        previousMergedCount = mergedCount;
        drawBoard();
        if (isSolved(state)) {
          win();
        }
      },
      onRedraw() {
        drawBoard();
      },
    });
    dragController.updateGroups(mergedGroups);
    dragController.attach();

    startTimer();
    updateShowButtonState();
    drawBoard();
  }

  function quitToPuzzleMenu() {
    stopTimer();
    if (dragController) {
      dragController.detach();
      dragController = null;
    }
    if (currentCollection) {
      renderPuzzleScreen(currentCollection);
      showScreen(puzzleScreen);
    } else {
      renderCollectionScreen();
      showScreen(collectionScreen);
    }
  }

  function win() {
    stopTimer();
    const stars = getLevelStars(currentLevel, { seconds, moves, showUses });
    const recordUpdate = updateLevelRecord(currentLevel, { seconds, moves, stars });
    playSfx('win');

    document.getElementById('win-stars-label').textContent = formatStars(stars);
    document.getElementById('win-time-label').textContent = seconds < 60
      ? `${seconds} SECONDS`
      : `${Math.floor(seconds / 60)}M ${String(seconds % 60).padStart(2, '0')}S`;
    document.getElementById('win-moves-label').textContent = `${moves} MOVES`;
    const bestFlags = [];
    if (recordUpdate.isNewBestTime) bestFlags.push('best time');
    if (recordUpdate.isNewBestMoves) bestFlags.push('best moves');
    if (recordUpdate.isNewBestStars) bestFlags.push('best stars');
    document.getElementById('win-best-label').textContent = bestFlags.length > 0
      ? `New ${bestFlags.join(' · ')}`
      : `Best ${formatStars(recordUpdate.bestStars)} · ${recordUpdate.bestTime}s · ${recordUpdate.bestMoves} moves`;
    winPreviewImage.src = getImageUrl(currentLevel);

    const continueButton = document.getElementById('btn-continue');
    const nextIndex = currentLevelIndex + 1;
    preloadNextLikelyLevel(currentCollection, currentLevelIndex);
    if (nextIndex < currentCollection.levels.length && isLevelUnlocked(currentCollection, nextIndex)) {
      continueButton.style.display = '';
      continueButton.onclick = () => {
        playSfx('click');
        currentLevelIndex = nextIndex;
        startGame(currentCollection, currentCollection.levels[nextIndex]);
      };
    } else {
      continueButton.style.display = 'none';
      continueButton.onclick = null;
    }

    renderPuzzleScreen(currentCollection);
    renderCollectionScreen();

    setTimeout(() => {
      showScreen(winScreen);
      setTimeout(() => confetti.burst(110), 140);
    }, 300);
  }

  function resizeBoard() {
    if (!currentLevel || !sourceImage || !state || !gameScreen.classList.contains('active')) {
      return;
    }
    const boardArea = getBoardArea();
    splitResult = ImageSplitter.split(sourceImage, currentLevel.cols, currentLevel.rows, boardArea.width, boardArea.height);
    tileW = splitResult.tileW;
    tileH = splitResult.tileH;
    gameCanvas.width = splitResult.boardW;
    gameCanvas.height = splitResult.boardH;
    if (dragController) {
      dragController.cellSize.tileW = tileW;
      dragController.cellSize.tileH = tileH;
    }
    drawBoard();
  }

  function updateAudioIcon() {
    const button = document.getElementById('btn-toggle-music');
    if (!button) return;

    if (isMuted || music.volume === 0) {
      button.classList.add('is-muted');
      button.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="1" y1="1" x2="23" y2="23"></line>
          <path d="M9 18V5l12-2v13"></path>
          <circle cx="6" cy="18" r="3"></circle>
          <circle cx="18" cy="16" r="3"></circle>
        </svg>
      `;
    } else {
      button.classList.remove('is-muted');
      button.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 18V5l12-2v13"></path>
          <circle cx="6" cy="18" r="3"></circle>
          <circle cx="18" cy="16" r="3"></circle>
        </svg>
      `;
    }
  }

  document.getElementById('btn-play').addEventListener('click', () => {
    playSfx('click');
    renderCollectionScreen();
    showScreen(collectionScreen);
  });

  document.getElementById('btn-open-settings').addEventListener('click', () => {
    playSfx('click');
    openSettingsModal();
  });

  document.getElementById('btn-close-settings').addEventListener('click', () => {
    playSfx('click');
    closeSettingsModal();
  });

  document.getElementById('settings-backdrop').addEventListener('click', () => {
    closeSettingsModal();
  });

  document.getElementById('btn-back-start').addEventListener('click', () => {
    playSfx('click');
    showScreen(startScreen);
  });

  document.getElementById('btn-back-collection').addEventListener('click', () => {
    playSfx('click');
    renderCollectionScreen();
    showScreen(collectionScreen);
  });

  document.getElementById('btn-quick-play-collection').addEventListener('click', () => {
    playSfx('click');
    quickPlay();
  });

  document.getElementById('btn-quick-play-puzzle').addEventListener('click', () => {
    playSfx('click');
    quickPlay();
  });

  document.getElementById('btn-quit').addEventListener('click', () => {
    playSfx('click');
    quitToPuzzleMenu();
  });

  document.getElementById('btn-restart').addEventListener('click', () => {
    playSfx('click');
    startGame(currentCollection, currentLevel);
  });

  document.getElementById('btn-undo').addEventListener('click', () => {
    if (isAnimating || !state || moveHistory.length === 0) {
      return;
    }
    playSfx('click');
    const snapshot = moveHistory.pop();
    state.tiles.forEach((tile, index) => {
      tile.currentIndex = snapshot[index];
    });
    mergedGroups = GroupEngine.computeGroups(state);
    if (dragController) {
      dragController.updateGroups(mergedGroups);
    }
    drawBoard();
  });

  document.getElementById('btn-show').addEventListener('click', () => {
    const now = Date.now();
    if (isAnimating || !sourceImage || showingReference || now < showCooldownUntil) {
      updateShowButtonState();
      return;
    }
    playSfx('click');
    showingReference = true;
    showUses += 1;
    seconds += 5;
    showCooldownUntil = now + 7000;
    updateTimerEl();
    flashShowPenalty();
    drawFullImage(gameCanvas.width, gameCanvas.height);
    setTimeout(() => {
      showingReference = false;
      updateShowButtonState();
      drawBoard();
    }, currentLevel.cols >= 9 ? 1150 : currentLevel.cols >= 6 ? 1000 : 850);
  });

  document.getElementById('btn-select-level').addEventListener('click', () => {
    playSfx('click');
    confetti.stop();
    if (currentCollection) {
      renderPuzzleScreen(currentCollection);
      showScreen(puzzleScreen);
    } else {
      renderCollectionScreen();
      showScreen(collectionScreen);
    }
  });

  const menuWinButton = document.getElementById('btn-menu-win');
  if (menuWinButton) {
    menuWinButton.addEventListener('click', () => {
      playSfx('click');
      confetti.stop();
      renderCollectionScreen();
      showScreen(collectionScreen);
    });
  }

  document.getElementById('btn-toggle-music').addEventListener('click', (event) => {
    event.stopPropagation();
    initAudio();
    isMuted = !isMuted;
    sfx.enabled = !isMuted;
    music.setMute(isMuted);
    updateAudioIcon();
  });

  document.getElementById('music-volume').addEventListener('input', (event) => {
    event.stopPropagation();
    initAudio();
    const value = parseFloat(event.target.value);
    music.volume = value;
    sfx.sfxVolume = value;
    isMuted = value === 0;
    sfx.enabled = !isMuted;
    music.setMute(isMuted);
    if (!isMuted && music.currentAudio) {
      music.currentAudio.volume = value;
    }
    updateAudioIcon();
  });

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeBoard, 180);
  });

  updateAudioIcon();
  updateShowButtonState();
  const requestedStart = getRequestedStart();
  if (requestedStart) {
    currentCollection = requestedStart.collection;
    renderCollectionScreen();
    if (requestedStart.puzzleIndex !== null) {
      currentLevelIndex = requestedStart.puzzleIndex;
      startGame(requestedStart.collection, requestedStart.collection.levels[requestedStart.puzzleIndex]);
    } else {
      renderPuzzleScreen(requestedStart.collection);
      showScreen(puzzleScreen);
    }
  } else {
    showScreen(startScreen);
  }
})();
