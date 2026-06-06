// === Page Load Transition ===
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('page-transition');
});

// === Theme Toggle ===
(function() {
  const toggle = document.getElementById('themeToggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const saved = localStorage.getItem('hfr-theme');

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('hfr-theme', theme);
  }

  // Init
  if (saved === 'light' || (!saved && !prefersDark)) {
    setTheme('light');
  }

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'light' ? 'dark' : 'light');
  });
})();

// === Navigation scroll behavior ===
(function() {
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');
  const allLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  let lastScrollY = 0;
  let ticking = false;

  // Hide nav on scroll down, show on scroll up
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > 100 && currentScrollY > lastScrollY) {
          nav.classList.add('hidden');
        } else {
          nav.classList.remove('hidden');
        }
        lastScrollY = currentScrollY;

        // Update active nav link
        let currentId = '';
        sections.forEach(section => {
          const top = section.offsetTop - 100;
          if (window.scrollY >= top) {
            currentId = section.getAttribute('id');
          }
        });
        allLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
        });

        ticking = false;
      });
      ticking = true;
    }
  });

  // Mobile nav toggle
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('nav-open');
  });

  // Close mobile nav on link click
  allLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('nav-open');
    });
  });

  // Fade-up animations on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeUp 0.6s ease-out both';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.feature-card, .project-card, .tech-group, .arch-node, .platform-item, .df-step, .stat').forEach(el => {
    observer.observe(el);
  });
})();

// === PWA Service Worker（含更新检测） ===
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then((reg) => {
      console.log('[PWA] SW registered:', reg.scope);

      // 检测更新：新 SW 已安装但等待激活
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            showUpdateToast(reg);
          }
        });
      });
    }).catch((err) => {
      console.log('[PWA] SW registration failed:', err);
    });
  });

  // 如果已有 SW 在等待，立即显示提示
  navigator.serviceWorker.ready.then((reg) => {
    if (reg.waiting) {
      showUpdateToast(reg);
    }
  });
}

function showUpdateToast(reg) {
  // 避免重复显示
  if (document.getElementById('pwa-update-toast')) return;

  const toast = document.createElement('div');
  toast.id = 'pwa-update-toast';
  toast.style.cssText = `
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
    background: var(--accent, #6c63ff); color: #fff; padding: 12px 24px;
    border-radius: 8px; font-size: 14px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    z-index: 9999; display: flex; align-items: center; gap: 12px;
    animation: fadeUp 0.4s ease-out both;
  `;
  toast.innerHTML = `
    <span>有新版本可用</span>
    <button id="pwa-refresh-btn" style="
      background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.4);
      color: #fff; padding: 4px 12px; border-radius: 4px; cursor: pointer; font-size: 13px;
    ">立即刷新</button>
  `;
  document.body.appendChild(toast);

  document.getElementById('pwa-refresh-btn').addEventListener('click', () => {
    toast.remove();
    if (reg.waiting) {
      reg.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
    window.location.reload();
  });
}
