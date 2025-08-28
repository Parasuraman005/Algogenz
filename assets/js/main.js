(function() {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const navToggle = $('.nav-toggle');
  const nav = $('.site-nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Active nav link based on current path or data-page
  const currentPage = document.body.getAttribute('data-page');
  if (currentPage) {
    $$('.site-nav a').forEach((a) => {
      const href = a.getAttribute('href') || '';
      if (href.includes(currentPage)) {
        a.classList.add('active');
      }
    });
  }

  // Dynamic year
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Simple smooth scroll for hash links
  $$("a[href^='#']").forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#' || !$(targetId)) return;
      e.preventDefault();
      $(targetId).scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Parallax mouse glow on hero
  const holoCard = $('.holo-card');
  if (holoCard) {
    holoCard.addEventListener('mousemove', (e) => {
      const rect = holoCard.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      holoCard.style.setProperty('--mx', `${x}%`);
      holoCard.style.setProperty('--my', `${y}%`);
      holoCard.style.background = `radial-gradient(180px 160px at ${x}% ${y}%, rgba(0,229,255,.18), transparent 60%), linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02))`;
    });
    holoCard.addEventListener('mouseleave', () => {
      holoCard.style.background = '';
    });
  }

  // Fake contact form submit
  const contactForm = $('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const name = formData.get('name') || 'there';
      alert(`Thanks, ${name}! We'll reach out shortly.`);
      contactForm.reset();
    });
  }

  // Coin flip auto-rotating slider
  const coinCard = document.querySelector('.coin-card');
  const front = document.querySelector('.coin-front');
  const back = document.querySelector('.coin-back');
  if (coinCard && front && back) {
    const images = [
      'img/club.png','img/assocation.png', 'img/club.png','img/assocation.png'
    ];
    let idx = 0;
    let showingFront = true;

    const setFace = (el, url) => { el.style.backgroundImage = `url("${url}")`; };

    setFace(front, images[0]);
    setFace(back, images[1 % images.length]);

    setInterval(() => {
      // Next image index to load on the hidden face
      idx = (idx + 1) % images.length;
      if (showingFront) {
        setFace(back, images[idx]);
      } else {
        setFace(front, images[idx]);
      }
      // Flip
      coinCard.classList.toggle('flip');
      showingFront = !showingFront;
    }, 3000);
  }
})();


