/**
 * saurabhmishra.dev — Minimal Vanilla JS
 * Features:
 *  - IntersectionObserver for active navigation highlighting (desktop & drawer)
 *  - Mobile Flyout Drawer toggle, backdrop, ESC key handling, and body scroll-lock
 *  - Copy Email action with tactile feedback
 *  - Image error fallback handling
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavObserver();
  initMobileDrawer();
  initCopyEmail();
  initImageFallback();
});

/**
 * Observes page sections and highlights the corresponding nav link in the sticky header and mobile drawer.
 */
function initNavObserver() {
  const sections = document.querySelectorAll('section[id], header[id]');
  const desktopLinks = document.querySelectorAll('.site-nav .nav-link');
  const drawerLinks = document.querySelectorAll('.drawer-nav .drawer-link');

  if (!sections.length) return;

  const linkMap = new Map();
  desktopLinks.forEach((link) => {
    const targetId = link.getAttribute('href');
    if (targetId && targetId.startsWith('#')) {
      linkMap.set(targetId.substring(1), link);
    }
  });

  const drawerMap = new Map();
  drawerLinks.forEach((link) => {
    const targetId = link.getAttribute('href');
    if (targetId && targetId.startsWith('#')) {
      drawerMap.set(targetId.substring(1), link);
    }
  });

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;

        // Desktop nav update
        desktopLinks.forEach((link) => link.classList.remove('active'));
        const activeDesktop = linkMap.get(id);
        if (activeDesktop) {
          activeDesktop.classList.add('active');
          activeDesktop.setAttribute('aria-current', 'page');
        }

        // Drawer nav update
        drawerLinks.forEach((link) => link.classList.remove('active'));
        const activeDrawer = drawerMap.get(id);
        if (activeDrawer) {
          activeDrawer.classList.add('active');
          activeDrawer.setAttribute('aria-current', 'page');
        }
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}

/**
 * Handles the responsive hamburger menu and fly-out drawer.
 */
function initMobileDrawer() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const closeBtn = document.getElementById('drawer-close-btn');
  const backdrop = document.getElementById('drawer-backdrop');
  const drawer = document.getElementById('mobile-drawer');
  const drawerLinks = document.querySelectorAll('.drawer-link, .drawer-resume-btn');

  if (!hamburgerBtn || !drawer || !backdrop) return;

  const openDrawer = () => {
    drawer.classList.add('is-open');
    backdrop.classList.add('is-open');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  hamburgerBtn.addEventListener('click', openDrawer);

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }

  backdrop.addEventListener('click', closeDrawer);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });

  // Close drawer smoothly upon navigating to any section
  drawerLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });
}

/**
 * Handles tactile feedback for copying contact email addresses to clipboard.
 */
function initCopyEmail() {
  const copyBtns = document.querySelectorAll('[data-copy-text]');

  copyBtns.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy-text');
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.borderColor = '#FFFFFF';
        btn.style.color = '#FFFFFF';

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.borderColor = '';
          btn.style.color = '';
        }, 2000);
      } catch (err) {
        window.prompt('Copy email to clipboard: Ctrl+C, Enter', textToCopy);
      }
    });
  });
}

/**
 * Ensures a crisp fallback if the portrait image is ever missing.
 */
function initImageFallback() {
  const portraitImg = document.querySelector('.hero-portrait-img');
  const monogramFallback = document.querySelector('.hero-monogram');

  if (portraitImg && monogramFallback) {
    portraitImg.addEventListener('error', () => {
      portraitImg.style.display = 'none';
      monogramFallback.style.display = 'flex';
    });
  }
}
