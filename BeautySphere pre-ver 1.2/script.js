// hero‑slider ---------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const hero      = document.getElementById('hero');
    if (!hero) return;
  
    const slides    = [...hero.querySelectorAll('.slide')];
    const prevBtn   = hero.querySelector('.slider-arrow.prev');
    const nextBtn   = hero.querySelector('.slider-arrow.next');
  
    if (slides.length < 2) return;          // один слайд — стрелки/автоплей не нужны
  
    let idx   = 0;
    let timer = null;
  
    const show = i => {
      slides[idx].classList.remove('active');
      idx = (i + slides.length) % slides.length;  // циклическая навигация
      slides[idx].classList.add('active');
    };
  
    const next = () => show(idx + 1);
    const prev = () => show(idx - 1);
  
    // автоперелистование
    const resetAutoplay = () => {
      clearInterval(timer);
      timer = setInterval(next, 6000);      // каждые 6 секунд
    };
    resetAutoplay();
  
    // обработчики стрелок
    nextBtn.addEventListener('click', () => { next(); resetAutoplay(); });
    prevBtn.addEventListener('click', () => { prev(); resetAutoplay(); });
  });
  
  document.addEventListener('DOMContentLoaded', () => {
    const newsData = [
      {
        title: 'Торжественное открытие новой клиники!',
        date: '2025-04-03',
        text: 'Мы рады сообщить, что BeautySphere открывает двери новой современной клиники…',
        url: 'news/news-opening.html'
      },
      {
        title: 'RF‑лифтинг — молодость без операции',
        date: '2025-03-27',
        text: 'Познакомьтесь с инновационной процедурой RF‑лифтинга и забудьте о морщинах…',
        url: 'news/news-rf-lifting.html'
      },
      {
        title: 'Как подготовить тело к летнему сезону?',
        date: '2025-03-15',
        text: 'Лето уже близко! Узнайте, какие процедуры помогут встретить его во всеоружии…',
        url: 'news/news-summer-body.html'
      },
      {
        title: 'Ботулинотерапия: гладкая кожа без операций',
        date: '2025-04-18',
        text: 'Ботокс – это препараты на основе ботулинического токсина...',
        url: 'news/news-botox.html'
      }
    ];
  
    const sortedNews = newsData
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);
  
    const container = document.getElementById('latest-news');
  
    sortedNews.forEach(item => {
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
      container.appendChild(article);
    });
  });
  
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

  const sorted = newsData.sort((a, b) => new Date(b.date) - new Date(a.date));
  const container = document.getElementById('all-news');

  sorted.forEach(item => {
    const article = document.createElement('article');
    article.className = 'news-item';
    article.innerHTML = `
      <a href="${item.url}" class="news-title">${item.title}</a>
      <div class="news-date">${new Date(item.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
      <p>${item.text}</p>
      <a href="${item.url}" class="button secondary">ПОДРОБНЕЕ</a>
    `;
    container.appendChild(article);
  });
});
