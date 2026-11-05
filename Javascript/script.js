/* ==========================================================
   YASH SONI — PORTFOLIO SCRIPT
   Vanilla JS: loader, cursor, scroll reveals, nav, tilt, magnetic
   ========================================================== */

(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Loader ---------- */
  const loader = document.getElementById('loader');
  const finishLoad = () => {
    document.body.classList.remove('is-loading');
    document.body.classList.add('is-ready');
    if (loader) {
      loader.classList.add('done');
      setTimeout(() => loader.remove(), 700);
    }
  };

  document.body.classList.add('is-loading');
  window.addEventListener('load', () => {
    setTimeout(finishLoad, prefersReducedMotion ? 0 : 900);
  });

  /* ---------- Custom Cursor (desktop only) ---------- */
  if (isFinePointer && !prefersReducedMotion) {
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    document.body.classList.add('cursor-ready');

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    }, { passive: true });

    // Smooth trailing ring using lerp
    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      requestAnimationFrame(animateRing);
    };
    animateRing();

    // React to interactive elements
    const hoverTargets = 'a, button, .skill-chip, .project-card, .photo-frame, .info-card';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverTargets)) ring.classList.add('hovering');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverTargets)) ring.classList.remove('hovering');
    });

    document.addEventListener('mousedown', () => ring.classList.add('clicking'));
    document.addEventListener('mouseup', () => ring.classList.remove('clicking'));

    document.addEventListener('mouseleave', () => {
      dot.style.opacity = 0;
      ring.style.opacity = 0;
    });
    document.addEventListener('mouseenter', () => {
      dot.style.opacity = 1;
      ring.style.opacity = 1;
    });
  }

  /* ---------- Navbar: scrolled state & hide on scroll down ---------- */
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  const onScrollNav = () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 40);
    navbar.classList.toggle('hidden', y > lastScroll && y > 400);
    lastScroll = y;
  };
  window.addEventListener('scroll', onScrollNav, { passive: true });

  /* ---------- Mobile menu ---------- */
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  const closeMenu = () => {
    menuToggle.classList.remove('open');
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) =>
    link.addEventListener('click', closeMenu)
  );

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navAnchors = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navAnchors.forEach((a) => {
          a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach((s) => sectionObserver.observe(s));

  /* ---------- Scroll reveals ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- Hero text entrance (after loader) ---------- */
  const heroReveal = () => {
    document.querySelectorAll('.hero .reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('in-view'), 200 + i * 120);
    });
  };
  window.addEventListener('load', () => setTimeout(heroReveal, prefersReducedMotion ? 0 : 900));

  /* ---------- Smooth anchor scrolling with offset ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

  /* ---------- Parallax on hero background ---------- */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg && !prefersReducedMotion) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroBg.style.transform = `translateY(${y * 0.25}px)`;
      }
    }, { passive: true });
  }

  /* ---------- 3D tilt on cards/photos ---------- */
  if (isFinePointer && !prefersReducedMotion) {
    document.querySelectorAll('[data-tilt]').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `perspective(900px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  /* ---------- Magnetic buttons & links ---------- */
  if (isFinePointer && !prefersReducedMotion) {
    document.querySelectorAll('.magnetic').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  /* ---------- Contact headline reveal ---------- */
  const contactTitle = document.querySelector('.contact-title');
  if (contactTitle) {
    const contactObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.reveal-text').forEach((t) => {
            t.style.transform = 'translateY(0)';
          });
          contactObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    contactObserver.observe(contactTitle);
  }

  /* ---------- Staggered chip reveals ---------- */
  document.querySelectorAll('.skill-list').forEach((list) => {
    list.classList.add('stagger');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    io.observe(list);
  });

  /* ---------- Hero title line reveal ---------- */
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        document.querySelector('.hero').classList.add('is-ready');
      }, prefersReducedMotion ? 0 : 1000);
    });
  }

  /* ---------- Contact title line reveal ---------- */
  document.querySelectorAll('.contact-title .reveal-text').forEach((t) => {
    t.style.transform = 'translateY(110%)';
  });

})();