(function () {
  function initNavigation() {
    const button = document.querySelector('.md-nav-toggle');
    const nav = document.querySelector('#primary-navigation');
    if (!button || !nav) return;

    button.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('open');
      button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  function initHeroSlideshow() {
    const hero = document.querySelector('.home-hero-slideshow');
    if (!hero) return;

    const slideshow = hero.querySelector('[data-slideshow]');
    const slides = Array.from(hero.querySelectorAll('.hero-slide'));
    const dots = Array.from(hero.querySelectorAll('.hero-dots button'));
    const caption = hero.querySelector('.hero-caption');
    const delay = Number.parseInt(slideshow?.dataset.interval || '6500', 10);
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (slides.length === 0) return;

    let current = slides.findIndex((slide) => slide.classList.contains('is-active'));
    if (current < 0) current = 0;
    let timer = null;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;

      slides.forEach((slide, i) => {
        const active = i === current;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', active ? 'false' : 'true');
      });

      dots.forEach((dot, i) => {
        const active = i === current;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-current', active ? 'true' : 'false');
      });

      if (caption) {
        caption.textContent = slides[current].dataset.caption || '';
      }
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    function start() {
      if (reduceMotion || slides.length < 2) return;
      stop();
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, Number.isFinite(delay) ? delay : 6500);
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', function () {
        const explicitIndex = Number.parseInt(dot.dataset.slideTo || String(i), 10);
        showSlide(Number.isFinite(explicitIndex) ? explicitIndex : i);
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop();
      else start();
    });

    showSlide(current);
    start();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initNavigation();
      initHeroSlideshow();
    });
  } else {
    initNavigation();
    initHeroSlideshow();
  }
})();
