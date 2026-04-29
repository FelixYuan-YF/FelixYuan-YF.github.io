/* ============================================
   Apple-style Animations & Interactions
   ============================================ */

(function() {
  'use strict';

  // --- Mobile Navigation Toggle ---
  const navToggle = document.getElementById('navToggle');
  const navMobile = document.getElementById('navMobile');
  
  if (navToggle && navMobile) {
    navToggle.addEventListener('click', function() {
      navMobile.classList.toggle('open');
      navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    const mobileLinks = navMobile.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', function() {
        navMobile.classList.remove('open');
        navToggle.classList.remove('active');
      });
    });
  }

  // --- Scroll-based Navigation Background ---
  const nav = document.getElementById('topNav');
  let lastScroll = 0;

  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      nav.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    } else {
      nav.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
  });

  // --- Fade-in Animation on Scroll (direction-aware) ---
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      const el = entry.target;
      const viewportMid = window.innerHeight / 2;
      const elCenter = entry.boundingClientRect.top + entry.boundingClientRect.height / 2;

      if (entry.isIntersecting) {
        // 进入视口：根据之前记录的离开方向决定动画起点
        const dir = el.dataset.exitDirection;
        if (dir === 'up') {
          // 从上方进入（向上滚动时）：元素从上方飞入，即从负 Y 方向
          el.classList.remove('from-below');
          el.classList.add('from-above');
        } else {
          // 从下方进入（向下滚动时）：元素从下方浮现
          el.classList.remove('from-above');
          el.classList.add('from-below');
        }
        // 触发重排后添加 visible
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            el.classList.add('visible');
          });
        });
      } else {
        // 离开视口：记录离开方向
        if (elCenter < viewportMid) {
          // 元素从视口上方离开（用户向下滚动）
          el.dataset.exitDirection = 'up';
        } else {
          // 元素从视口下方离开（用户向上滚动）
          el.dataset.exitDirection = 'down';
        }
        el.classList.remove('visible', 'from-above', 'from-below');
      }
    });
  }, observerOptions);

  // Observe all sections and cards
  const animatedElements = document.querySelectorAll('h2, .pub-row, .content-wrapper > p, .content-wrapper > ul');
  animatedElements.forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });

  // --- Smooth Scroll for Navigation Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        const navHeight = nav ? nav.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Parallax Effect for Hero Avatar ---
  const heroAvatar = document.querySelector('.image.avatar img');
  
  if (heroAvatar) {
    window.addEventListener('scroll', function() {
      const scrolled = window.pageYOffset;
      const parallaxSpeed = 0.3;
      
      if (scrolled < 500) {
        heroAvatar.style.transform = `translateY(${scrolled * parallaxSpeed}px) scale(${1 - scrolled * 0.0003})`;
      }
    });
  }

  // --- Card Hover Effect Enhancement ---
  const cards = document.querySelectorAll('.pub-row');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)';
    });
  });

  // --- Lazy Load Images ---
  const images = document.querySelectorAll('img[src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
        
        img.onload = function() {
          img.style.opacity = '1';
        };
        
        observer.unobserve(img);
      }
    });
  });

  images.forEach(img => {
    imageObserver.observe(img);
  });

  // --- Active Navigation Link Highlighting ---
  const sections = document.querySelectorAll('h2[id]');
  const navLinks = document.querySelectorAll('.nav-links a, .nav-mobile a');

  window.addEventListener('scroll', function() {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (window.pageYOffset >= sectionTop - 100) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // --- Add active link style ---
  const style = document.createElement('style');
  style.textContent = `
    .nav-links a.active,
    .nav-mobile a.active {
      color: var(--apple-blue) !important;
      font-weight: 500;
    }
  `;
  document.head.appendChild(style);

  // --- Prefers Reduced Motion ---
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  if (prefersReducedMotion.matches) {
    // Disable animations for users who prefer reduced motion
    document.querySelectorAll('.fade-in').forEach(el => {
      el.classList.add('visible');
      el.style.transition = 'none';
    });
  }

  // --- Initialize: Observer handles all elements naturally, no special first-viewport logic needed ---

})();
