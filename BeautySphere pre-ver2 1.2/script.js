// ======== Подключение общего меню (header.html) ============
document.addEventListener('DOMContentLoaded', () => {
  const pathname = window.location.pathname;
  const isNested = pathname.includes('/news/') || pathname.includes('/services/') || pathname.includes('/about/');
  const prefix = isNested ? '../' : '';

  fetch(`${prefix}header.html`)
    .then(res => res.text())
    .then(data => {
      document.getElementById('header-placeholder').innerHTML = data;

      // Обновим путь к логотипу
      const logoImg = document.querySelector('.logo-image');
      if (logoImg && isNested) {
        logoImg.src = `${prefix}${logoImg.getAttribute('src')}`;
      }

      // Обновим все ссылки, если они относительные
      document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (
          href &&
          !href.startsWith('http') &&
          !href.startsWith('#') &&
          !href.startsWith('/') &&
          !href.startsWith(prefix) &&
          (href.endsWith('.html') || href.includes('.html#'))
        ) {
          link.setAttribute('href', `${prefix}${href}`);
        }
      });
    });
});



// ======== HERO‑SLIDER =======================================
document.addEventListener('DOMContentLoaded', () => {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const slides = [...hero.querySelectorAll('.slide')];
  const prevBtn = hero.querySelector('.slider-arrow.prev');
  const nextBtn = hero.querySelector('.slider-arrow.next');

  if (slides.length < 2) return;

  let idx = 0;
  let timer = null;

  const show = i => {
    slides[idx].classList.remove('active');
    idx = (i + slides.length) % slides.length;
    slides[idx].classList.add('active');
  };

  const next = () => show(idx + 1);
  const prev = () => show(idx - 1);

  const resetAutoplay = () => {
    clearInterval(timer);
    timer = setInterval(next, 6000);
  };
  resetAutoplay();

  nextBtn.addEventListener('click', () => { next(); resetAutoplay(); });
  prevBtn.addEventListener('click', () => { prev(); resetAutoplay(); });
});

// ======== Новости: Главная и Все Новости ====================
document.addEventListener('DOMContentLoaded', () => {
  const newsData = [
    {
      title: 'Ботулинотерапия: гладкая кожа без операций',
      date: '2025-04-18',
      text: 'Ботокс – это препараты на основе ботулинического токсина, которые мягко расслабляют мимические мышцы и разглаживают морщины...',
      url: 'news/news-botox.html'
    },
    {
      title: 'RF-лифтинг – молодость без операции',
      date: '2025-03-27',
      text: 'Познакомьтесь с инновационной процедурой RF-лифтинга и забудьте о морщинах...',
      url: 'news/news-rf-lifting.html'
    },
    {
      title: 'Как подготовить тело к летнему сезону?',
      date: '2025-03-15',
      text: 'Лето уже близко! Узнайте, какие процедуры помогут вам встретить его во всеоружии...',
      url: 'news/news-summer-body.html'
    }
  ];

  const sortedNews = newsData.sort((a, b) => new Date(b.date) - new Date(a.date));
  const latest = sortedNews.slice(0, 3);

  const latestContainer = document.getElementById('latest-news');
  const allContainer = document.getElementById('all-news');

  if (latestContainer) {
    latest.forEach(item => {
      const article = document.createElement('article');
      article.className = 'news-item';
      article.innerHTML = `
        <a href="${item.url}" class="news-title">${item.title}</a>
        <div class="news-date">${new Date(item.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
        <p>${item.text}</p>
        <div class="button-container">
          <a href="${item.url}" class="button secondary">ПОДРОБНЕЕ</a>
        </div>
      `;
      latestContainer.appendChild(article);
    });
  }

  if (allContainer) {
    sortedNews.forEach(item => {
      const article = document.createElement('article');
      article.className = 'news-item';
      article.innerHTML = `
        <a href="${item.url}" class="news-title">${item.title}</a>
        <div class="news-date">${new Date(item.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
        <p>${item.text}</p>
        <a href="${item.url}" class="button secondary">ПОДРОБНЕЕ</a>
      `;
      allContainer.appendChild(article);
    });
  }
});

// ======== Прайс: IndexedDB + Аккордеон ======================
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('accordion');
  if (!container) return;

  /* ---------- 0. Синонимы slug → вариантов в прайсе ---------- */
  const ALIASES = {
    'rf lifting'       : ['RF-лифтинг'],
    'botox'            : ['ботокс'],
    'mesotherapy'      : ['мезотерапия'],
    'biorevitalization': ['биоревитализация'],
    'plasmolifting'    : ['плазмолифтинг'],
    'cryolipolysis'    : ['криолиполиз'],
  };

  /* ---------- 1. Универсальный префикс к корню ---------- */
  const depth   = window.location.pathname.split('/').length - 2;  // 0,1,2…
  const prefix  = '../'.repeat(depth);
  const SQL_WASM_PATH = `${prefix}libs/sqljs`;
  const PRICES_JSON   = `${prefix}data/prices.json`;

  /* ---------- 2. Что за страница? price.html или услуга ---------- */
  const slug     = window.location.pathname.split('/').pop().replace('.html','').toLowerCase();
  const isPrice  = slug === 'price';

  /* ---------- 3. Нормализатор и ключевые слова ---------- */
  const normalize = s => s.toLowerCase()
                          .replace(/[‑–—-]/g,' ')
                          .replace(/\s+/g,' ')
                          .trim();

  const slugNorm = normalize(slug.replace(/^news-/, '').replace(/-/g,' '));   // rf lifting
  const keywords = isPrice
        ? []  // на price.html фильтра нет
        : (ALIASES[slugNorm] ? ALIASES[slugNorm] : [slugNorm])
            .map(normalize);   // массив слов/фраз для includes

  /* ---------- 4. Загружаем json → SQLite → вывод ---------- */
  fetch(PRICES_JSON)
    .then(r => r.json())
    .then(json => initSqlJs({ locateFile: f => `${SQL_WASM_PATH}/${f}` })
      .then(SQL => ({ SQL, json })))
    .then(({ SQL, json }) => {

      /* 4.1  Создаём БД «services» в памяти */
      const db = new SQL.Database();
      db.run('CREATE TABLE services (cat TEXT, name TEXT, price TEXT)');
      const insert = db.prepare('INSERT INTO services VALUES (?,?,?)');
      json.forEach(row => insert.run(row));
      insert.free();

      const rows = db.exec('SELECT cat, name, price FROM services')[0].values;

      /* 4.2  ----- price.html: показать всё ----- */
      if (isPrice) {
        const grouped = rows.reduce((acc,[cat,n,p])=>{
          (acc[cat] = acc[cat] || []).push([n,p]); return acc;
        },{});

        ['Аппаратная косметология','Инъекционная косметология','Уходовые процедуры','Тело']
          .forEach(cat => {
            if (!grouped[cat]) return;
            const details = document.createElement('details');
            details.className = 'price-item';
            details.innerHTML = `<summary>${cat}</summary>`;

            const table = document.createElement('table');
            grouped[cat].forEach(([n,p]) =>
              table.insertAdjacentHTML('beforeend',
                `<tr><td>${n}</td><td>${p}</td></tr>`));

            details.appendChild(table);
            container.appendChild(details);
          });
        return;
      }

      /* 4.3  ----- страница конкретной услуги ----- */
      const filtered = rows.filter(([ , name ]) => {
        const normName = normalize(name);
        return keywords.every(k => normName.includes(k));
      });

      if (!filtered.length) {
        container.textContent = 'Цены на эту услугу временно недоступны.';
        return;
      }

      const details = document.createElement('details');
      details.className = 'price-item';
      details.open = true;

      const title = filtered[0][1].split('—')[0].trim();  // «RF‑лифтинг»
      details.innerHTML = `<summary>${title}</summary>`;

      const table = document.createElement('table');
      filtered.forEach(([ , name, price ]) =>
        table.insertAdjacentHTML('beforeend',
          `<tr><td>${name}</td><td>${price}</td></tr>`));

      details.appendChild(table);
      container.appendChild(details);
    })
    .catch(err => {
      container.textContent = 'Ошибка загрузки прайса :(';
      console.error('price-list error:', err);
    });
});
