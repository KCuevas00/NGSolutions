/**
 * N&G Solutions Services LLC - Main JS
 * Underground Utilities & Infrastructure
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle & Slide-out Drawer
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  const header = document.querySelector('.site-header');

  // Ensure backdrop element exists directly in document.body for true full-screen coverage
  let navBackdrop = document.querySelector('.nav-backdrop');
  if (!navBackdrop) {
    navBackdrop = document.createElement('div');
    navBackdrop.className = 'nav-backdrop';
    document.body.appendChild(navBackdrop);
  } else if (navBackdrop.parentElement !== document.body) {
    document.body.appendChild(navBackdrop);
  }

  function openMobileMenu() {
    if (!navLinks) return;
    navLinks.classList.add('active');
    if (navBackdrop) navBackdrop.classList.add('active');
    if (header) header.classList.add('menu-open');
    document.body.classList.add('nav-drawer-open');
    if (mobileToggle) {
      mobileToggle.setAttribute('aria-expanded', 'true');
    }
  }

  function closeMobileMenu() {
    if (!navLinks) return;
    navLinks.classList.remove('active');
    if (navBackdrop) navBackdrop.classList.remove('active');
    if (header) header.classList.remove('menu-open');
    document.body.classList.remove('nav-drawer-open');
    if (mobileToggle) {
      mobileToggle.setAttribute('aria-expanded', 'false');
    }
  }

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (navLinks.classList.contains('active')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Clicking blurry backdrop closes the drawer
    if (navBackdrop) {
      navBackdrop.addEventListener('click', (e) => {
        e.preventDefault();
        closeMobileMenu();
      });
      // Prevent background scrolling through the backdrop on touch devices
      navBackdrop.addEventListener('touchmove', (e) => {
        e.preventDefault();
      }, { passive: false });
    }

    // Close button inside drawer
    document.addEventListener('click', (e) => {
      if (e.target.closest('.mobile-drawer-close')) {
        e.preventDefault();
        closeMobileMenu();
      }
    });

    // Tapping anywhere outside the drawer (e.g. background or header margins) closes it
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('active')) {
        if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
          closeMobileMenu();
        }
      }
    });

    // Close menu when clicking on any nav link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMobileMenu();
      }
    });

    // Close menu automatically if viewport is resized to desktop width
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
        closeMobileMenu();
      }
    });
  }

  // 2. Transparent-to-Solid Navbar on Scroll
  let ticking = false;

  function updateNavbarScroll() {
    if (!header) return;
    if (header.classList.contains('menu-open')) return;
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (scrollPos > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateNavbarScroll);
      ticking = true;
    }
  }

  if (header) {
    // Initial evaluation immediately on DOM ready
    updateNavbarScroll();

    // High performance passive scroll listener
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    window.addEventListener('pageshow', updateNavbarScroll);
  }

  // 3. Gallery Category Filter (Before & After Cards & Legacy Grid)
  const filterBtns = document.querySelectorAll('.filter-btn, .gallery-filter-btn, .ba-filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card, .gallery-item, .gallery-tile, .ba-card');

  if (filterBtns.length > 0 && galleryCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const isBa = btn.classList.contains('ba-filter-btn');
        const siblingBtns = isBa 
          ? document.querySelectorAll('.ba-filter-btn') 
          : document.querySelectorAll('.filter-btn, .gallery-filter-btn');

        siblingBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        const targetCards = isBa 
          ? document.querySelectorAll('.ba-card') 
          : document.querySelectorAll('.gallery-card, .gallery-item, .gallery-tile');

        targetCards.forEach(item => {
          const category = item.getAttribute('data-category') || '';
          const itemType = item.getAttribute('data-type') || '';
          
          if (filter === 'all' || category.includes(filter) || itemType === filter) {
            item.style.display = '';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 30);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.96)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 200);
          }
        });
      });
    });
  }

  // 4. Lightbox Modal for Gallery (Photos & Strictly Muted Videos)
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxVideo = document.getElementById('lightboxVideo');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxClose = document.querySelector('.lightbox-close');

  if (lightbox) {
    // Open image/video helper
    function openLightbox(src, isVideo, title, desc) {
      if (isVideo) {
        if (lightboxVideo) {
          lightboxVideo.muted = true;
          lightboxVideo.volume = 0;
          lightboxVideo.playsInline = true;
          lightboxVideo.src = src;
          lightboxVideo.style.display = 'block';
          if (lightboxImg) lightboxImg.style.display = 'none';
          lightboxVideo.play().catch(() => {});
        }
      } else {
        if (lightboxImg) {
          lightboxImg.src = src;
          lightboxImg.style.display = 'block';
          if (lightboxVideo) {
            lightboxVideo.pause();
            lightboxVideo.src = '';
            lightboxVideo.style.display = 'none';
          }
        }
      }

      if (title && lightboxTitle) lightboxTitle.textContent = title;
      if (desc && lightboxDesc) lightboxDesc.textContent = desc;
      else if (lightboxDesc) lightboxDesc.textContent = '';

      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    // Attach listeners to gallery tiles, panes, cards, buttons, and Before/After video bars
    document.querySelectorAll('.gallery-tile, .photo-pane, .showcase-photo-pane, .gallery-item, .ba-pane, .project-photo-card, .ba-video-bar').forEach(pane => {
      pane.addEventListener('click', (e) => {
        const isVideo = pane.dataset.type === 'video' || pane.classList.contains('is-video') || !!pane.dataset.videoSrc;
        const title = pane.dataset.title || (pane.querySelector('h3') ? pane.querySelector('h3').textContent : 'Project Detail');
        const desc = pane.dataset.desc || (pane.querySelector('p') ? pane.querySelector('p').textContent : '');

        if (isVideo) {
          const videoSrc = pane.dataset.videoSrc || (pane.querySelector('video') ? pane.querySelector('video').src : '');
          if (videoSrc) openLightbox(videoSrc, true, title, desc);
        } else {
          const img = pane.querySelector('img');
          if (img) openLightbox(img.src, false, title, desc);
        }
      });
    });

    // Explicit Before & After view buttons
    document.querySelectorAll('.ba-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetSrc = btn.getAttribute('data-view-target');
        const title = btn.getAttribute('data-title') || 'Project Detail';
        if (targetSrc) {
          openLightbox(targetSrc, false, title, '');
        }
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      if (lightboxVideo) {
        lightboxVideo.pause();
        lightboxVideo.src = '';
        lightboxVideo.style.display = 'none';
      }
      if (lightboxImg) {
        lightboxImg.src = '';
        lightboxImg.style.display = 'none';
      }
    }
  }

  // 5. FAQ Accordion
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isActive = item.classList.contains('active');

      // Close all other open items
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        }
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      }
    });
  });

  // 6. Form Submission via Web3Forms (Project Estimates & Careers Intake)
  function setupWeb3Form(formId, statusBoxId, successMessage, loadingText) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const statusBox = document.getElementById(statusBoxId);
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : 'Submit';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${loadingText}`;
      }

      if (statusBox) {
        statusBox.style.display = 'none';
        statusBox.className = 'form-status';
      }

      const formData = new FormData(form);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();

        if (response.status === 200 && result.success) {
          if (statusBox) {
            statusBox.className = 'form-status success';
            statusBox.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${successMessage}`;
            statusBox.style.display = 'block';
            statusBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
          form.reset();
        } else {
          throw new Error(result.message || 'Form submission failed');
        }
      } catch (err) {
        if (statusBox) {
          statusBox.className = 'form-status error';
          statusBox.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> <strong>Note:</strong> We couldn\'t submit online at this moment. Please call our team directly at <a href="tel:2246338813" style="color: inherit; text-decoration: underline; font-weight: 700;">(224) 633-8813</a> or email <a href="mailto:ngsolutionsservicesllc@gmail.com" style="color: inherit; text-decoration: underline; font-weight: 700;">ngsolutionsservicesllc@gmail.com</a>.';
          statusBox.style.display = 'block';
          statusBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }
      }
    });
  }

  setupWeb3Form(
    'contactQuoteForm',
    'formStatus',
    '<strong>Thank you!</strong> Your project bid request has been submitted. An N&amp;G Solutions Services specialist will review your details and contact you shortly.',
    'Submitting Request...'
  );

  setupWeb3Form(
    'careersIntakeForm',
    'careersFormStatus',
    '<strong>Thank you!</strong> Your intake information has been received. An N&amp;G Solutions team member will review your qualifications or crew details and contact you shortly.',
    'Sending Information...'
  );

  // Set min date to today for date picker and open calendar on click
  const targetDateInput = document.getElementById('targetDate');
  if (targetDateInput && targetDateInput.type === 'date') {
    const today = new Date().toISOString().split('T')[0];
    targetDateInput.min = today;
    targetDateInput.addEventListener('click', () => {
      if (typeof targetDateInput.showPicker === 'function') {
        try {
          targetDateInput.showPicker();
        } catch (err) {
          // Handled by browser default
        }
      }
    });
  }

  // 7. Continuous Looping Video Hero Playlist with Safe Cross-Fade
  const videoA = document.getElementById('heroVideoA');
  const videoB = document.getElementById('heroVideoB');

  if (videoA) {
    const playlist = [
      'videos/townhouse-6unit-conduit-install.mp4',
      'videos/commercial-store-conduit-install.mp4',
      'videos/commercial-retail-trenching-lincolnwood.mp4',
      'videos/commercial-parkway-conduit-lincolnwood.mp4',
      'videos/apartment-parking-lot-bore-overview.mp4'
    ];
    let currentIndex = 0;
    let activePlayer = videoA;
    let idlePlayer = videoB;
    let isTransitioning = false;
    let cycleTimer = null;
    const clipDuration = 7000; // 7 seconds per clip

    // Guarantee default video plays and loops safely
    videoA.muted = true;
    videoA.playsInline = true;
    videoA.setAttribute('playsinline', '');
    videoA.setAttribute('webkit-playsinline', '');
    videoA.setAttribute('muted', '');
    videoA.loop = true;

    function playActive() {
      if (!activePlayer) return;
      activePlayer.muted = true;
      activePlayer.playsInline = true;
      const p = activePlayer.play();
      if (p !== undefined) {
        p.catch(() => {
          const unlock = () => {
            if (activePlayer) activePlayer.play().catch(() => {});
          };
          window.addEventListener('touchstart', unlock, { once: true, passive: true });
          window.addEventListener('click', unlock, { once: true, passive: true });
        });
      }
    }

    playActive();

    // Only run multi-clip playlist if secondary player exists
    if (idlePlayer) {
      idlePlayer.muted = true;
      idlePlayer.playsInline = true;
      idlePlayer.setAttribute('playsinline', '');
      idlePlayer.setAttribute('webkit-playsinline', '');
      idlePlayer.setAttribute('muted', '');
      idlePlayer.loop = true;

      function nextVideo() {
        if (isTransitioning) return;
        isTransitioning = true;

        currentIndex = (currentIndex + 1) % playlist.length;
        const nextSrc = playlist[currentIndex];

        idlePlayer.src = nextSrc;
        idlePlayer.currentTime = 0;
        idlePlayer.muted = true;
        idlePlayer.playsInline = true;
        idlePlayer.load();

        let transitionDone = false;

        const performCrossfade = () => {
          if (transitionDone) return;
          // Verify idlePlayer is actually playing before hiding activePlayer
          if (idlePlayer.paused || idlePlayer.readyState < 2) {
            isTransitioning = false;
            return;
          }
          transitionDone = true;
          idlePlayer.removeEventListener('playing', performCrossfade);

          idlePlayer.classList.add('active');
          activePlayer.classList.remove('active');

          setTimeout(() => {
            activePlayer.pause();
            const temp = activePlayer;
            activePlayer = idlePlayer;
            idlePlayer = temp;
            isTransitioning = false;
          }, 900);
        };

        idlePlayer.addEventListener('playing', performCrossfade, { once: true });

        const playPromise = idlePlayer.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Cannot play next video (e.g. Low Power Mode) - cancel transition and keep active playing
            isTransitioning = false;
          });
        }
      }

      cycleTimer = setInterval(nextVideo, clipDuration);
    }
  }

  // 8. Premium Parallax Subimages Effect (Continuous Full-Range Motion to Top of Main Image)
  const subimageCards = document.querySelectorAll('.service-subimage-card');

  if (subimageCards.length > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let parallaxTicking = false;

    // Track visible cards via IntersectionObserver for maximum 60/120fps performance
    const visibleCards = new Set();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          visibleCards.add(entry.target);
        } else {
          visibleCards.delete(entry.target);
        }
      });
      requestParallaxUpdate();
    }, {
      rootMargin: '120px 0px 120px 0px'
    });

    subimageCards.forEach(card => observer.observe(card));

    function updateParallax() {
      const windowHeight = window.innerHeight;

      visibleCards.forEach(card => {
        const thumbWrap = card.closest('.service-thumb-wrap');
        const cardRect = (thumbWrap || card).getBoundingClientRect();

        // Calculate scroll progress through the viewport (0 = entering at bottom, 1 = exiting at top)
        const totalDistance = windowHeight + cardRect.height;
        const currentDistance = windowHeight - cardRect.top;
        const progress = Math.max(0, Math.min(1, currentDistance / totalDistance));

        // Total distance from initial bottom position to top of main image
        const thumbHeight = thumbWrap ? thumbWrap.offsetHeight : 220;
        const subHeight = card.offsetHeight || 110;
        // Allows subimage to glide all the way up to ~12px from the top edge
        const maxTravel = Math.max(75, thumbHeight - subHeight + 20);

        // Individual speed multiplier from data-parallax-speed (e.g. 0.13 - 0.18)
        const speedMultiplier = (parseFloat(card.dataset.parallaxSpeed) || 0.15) / 0.15;
        const travel = maxTravel * speedMultiplier;

        // Continuous smooth upward motion: starts at 0 at bottom, glides up to -travel at top
        const translateY = -(progress * travel);

        card.style.setProperty('--subimage-y', `${translateY.toFixed(1)}px`);
      });

      parallaxTicking = false;
    }

    function requestParallaxUpdate() {
      if (!parallaxTicking) {
        requestAnimationFrame(updateParallax);
        parallaxTicking = true;
      }
    }

    window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
    window.addEventListener('resize', requestParallaxUpdate, { passive: true });
    requestParallaxUpdate();
  }

  // 9. Premium Scroll-Triggered Fade-In & Masked Heading Reveal Animations (100% Mobile & Desktop Compatible)
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealSelectors = [
      '.section-header',
      '.heading-reveal-mask',
      '.service-card',
      '.editorial-header',
      '.editorial-card',
      '.editorial-territory-showcase',
      '.page-banner h1',
      '.page-banner p',
      '.gallery-filters',
      '.gallery-card',
      '.gallery-item',
      '.form-card',
      '.contact-card',
      '.faq-item',
      '.territory-footer-notice'
    ];

    const elementsToReveal = document.querySelectorAll(revealSelectors.join(', '));

    if (elementsToReveal.length > 0) {
      // Prepare elements with reveal classes and stagger indices
      elementsToReveal.forEach((el) => {
        if (el.closest('.top-utility-bar') || el.closest('.site-header')) {
          return;
        }

        if (!el.classList.contains('heading-reveal-mask')) {
          el.classList.add('scroll-reveal');
        }

        const parentGrid = el.closest('.services-grid, .editorial-hours-grid, .gallery-grid, .faq-grid');
        if (parentGrid) {
          const siblings = Array.from(parentGrid.children);
          const index = siblings.indexOf(el);
          if (index >= 0) {
            el.classList.add(`stagger-${Math.min((index % 6) + 1, 6)}`);
          }
        }
      });

      // Rock-solid visibility checker for mobile Safari & all viewports
      function checkScrollVisibility() {
        const vh = window.innerHeight || document.documentElement.clientHeight;
        const triggerMargin = 120; // Triggers 120px before entering viewport bottom

        elementsToReveal.forEach((el) => {
          if (el.classList.contains('revealed')) return;
          const rect = el.getBoundingClientRect();
          if (rect.top <= vh + triggerMargin && rect.bottom >= -50) {
            el.classList.add('revealed');
          }
        });
      }

      // 1. Primary: IntersectionObserver (where supported)
      if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              observer.unobserve(entry.target);
            }
          });
        }, {
          rootMargin: '120px 0px 120px 0px',
          threshold: 0.01
        });

        elementsToReveal.forEach(el => revealObserver.observe(el));
      }

      // 2. High-performance backup scroll and touch event listener for mobile momentum scrolling
      let scrollTimer = false;
      function handleScrollCheck() {
        if (!scrollTimer) {
          requestAnimationFrame(() => {
            checkScrollVisibility();
            scrollTimer = false;
          });
          scrollTimer = true;
        }
      }

      window.addEventListener('scroll', handleScrollCheck, { passive: true });
      window.addEventListener('touchmove', handleScrollCheck, { passive: true });
      window.addEventListener('resize', handleScrollCheck, { passive: true });
      window.addEventListener('orientationchange', handleScrollCheck, { passive: true });

      // Immediate checks on initial paint and micro-intervals
      checkScrollVisibility();
      setTimeout(checkScrollVisibility, 60);
      setTimeout(checkScrollVisibility, 250);
      setTimeout(checkScrollVisibility, 600);
    }
  }

  // 10. Apple-Style 3D Tilt & Cursor Glow Spotlight on Cards (Animation Feature 2)
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const tiltCards = document.querySelectorAll('.service-card, .editorial-card');

    tiltCards.forEach(card => {
      let isHovered = false;
      let frameId = null;

      card.addEventListener('mouseenter', () => {
        isHovered = true;
      });

      card.addEventListener('mousemove', (e) => {
        if (!isHovered) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Subtle 3.5-degree maximum tilt for a refined luxury feel
        const rotateX = ((y - centerY) / centerY) * -3.2;
        const rotateY = ((x - centerX) / centerX) * 3.2;

        if (frameId) cancelAnimationFrame(frameId);
        frameId = requestAnimationFrame(() => {
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);
          card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
        });
      });

      card.addEventListener('mouseleave', () => {
        isHovered = false;
        if (frameId) cancelAnimationFrame(frameId);
        card.style.transform = '';
      });
    });
  }

  // 12. Careers Redirection & Backward Compatibility
  if (window.location.pathname.includes('contact.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    const typeParam = urlParams.get('type');
    const hash = window.location.hash;

    if (tabParam === 'careers' || typeParam === 'careers' || typeParam === 'employment' || typeParam === 'subcontractor' || typeParam === 'jobs' || hash === '#careers' || hash === '#careersTab') {
      window.location.replace('careers.html');
    }
  }

  // 13. Zero-Layout-Shift Typewriter Animation
  function initTypewriters() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.itg-type-cursor, .typed-cursor').forEach(el => el.remove());
      return;
    }

    const typeElements = document.querySelectorAll('.typed-accent, #heroTypedWord');
    if (!typeElements.length) return;

    // Remove any static cursors from HTML so cursor is dynamically placed at the active typing tip
    document.querySelectorAll('.itg-type-cursor, .typed-cursor').forEach(el => el.remove());

    typeElements.forEach(targetEl => {
      const isLooping = targetEl.id === 'heroTypedWord' || targetEl.getAttribute('data-loop') === 'true';

      let words = [];
      const dataWords = targetEl.getAttribute('data-words');
      const dataText = targetEl.getAttribute('data-text');

      if (isLooping) {
        if (dataWords) {
          if (dataWords.includes('|')) {
            words = dataWords.split('|').map(s => s.trim()).filter(Boolean);
          } else {
            try {
              words = JSON.parse(dataWords);
            } catch (e) {
              words = [dataWords.trim()];
            }
          }
        } else {
          words = ['Fiber Optic Placement.', 'Telecom Infrastructure.', 'Conduit Installation.', 'Trenchless Boring.'];
        }
      } else {
        const singleText = dataText || targetEl.textContent.trim();
        words = [singleText];
      }

      if (!words || !words.length) return;

      const cursorClass = isLooping ? 'itg-type-cursor' : 'typed-cursor';
      const cursorEl = document.createElement('span');
      cursorEl.className = cursorClass;
      cursorEl.setAttribute('aria-hidden', 'true');

      const typeSpeed = isLooping ? 65 : 35;
      const deleteSpeed = 30;
      const holdWordMs = 2600;

      let wordIndex = 0;
      let charIndex = isLooping ? words[0].length : 0;
      let isDeleting = false;
      let started = false;

      // Pure textNode rendering + cursor element:
      // Completely eliminates ghost text issues with -webkit-background-clip: text,
      // and guarantees cursor advances dynamically with each typed character.
      function renderText(currentWord, count) {
        targetEl.textContent = currentWord.substring(0, count);
        targetEl.appendChild(cursorEl);
      }

      function tick() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
          charIndex--;
          renderText(currentWord, charIndex);
        } else {
          charIndex++;
          renderText(currentWord, charIndex);
        }

        let nextDelay = isDeleting ? deleteSpeed : typeSpeed;
        if (!isDeleting) {
          nextDelay += Math.floor(Math.random() * 12 - 6);
        }

        // Finished typing word
        if (!isDeleting && charIndex === currentWord.length) {
          if (!isLooping) {
            // Section header: stay finished with cursor blinking at the end
            renderText(currentWord, currentWord.length);
            return;
          }
          isDeleting = true;
          setTimeout(tick, holdWordMs);
          return;
        } else if (isDeleting && charIndex === 0) {
          // Finished backspacing, switch to next phrase
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          renderText(words[wordIndex], 0);
          setTimeout(tick, 280);
          return;
        }

        setTimeout(tick, nextDelay);
      }

      function startTyping() {
        if (started) return;
        started = true;
        if (isLooping) {
          // Hero begins with first full phrase visible, pauses, then backspaces
          charIndex = words[0].length;
          renderText(words[0], charIndex);
          isDeleting = true;
          setTimeout(tick, 2400);
        } else {
          // Section header begins when scrolled into view
          charIndex = 0;
          renderText(words[0], 0);
          setTimeout(tick, 150);
        }
      }

      if (isLooping) {
        // Hero initially shows full first phrase, then backspaces
        renderText(words[0], words[0].length);
        setTimeout(startTyping, 800);
      } else {
        // Section headers: clear text so it types out live into empty space
        targetEl.textContent = '';

        if ('IntersectionObserver' in window) {
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                startTyping();
                observer.disconnect();
              }
            });
          }, {
            threshold: 0.15,
            rootMargin: '0px 0px 50px 0px'
          });
          observer.observe(targetEl);
        } else {
          setTimeout(startTyping, 500);
        }
      }
    });
  }

  initTypewriters();

  // 14. Digit Counting Up Animations for Hero Numbers
  function initHeroCounters() {
    const counterElements = document.querySelectorAll('.itg-stat-num[data-target]');
    if (!counterElements.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return; // Retain static rendered values
    }

    let hasRun = false;

    function runCounters() {
      if (hasRun) return;
      hasRun = true;

      const duration = 1800; // 1.8 seconds duration
      const startTime = performance.now();

      // Start all from 0
      counterElements.forEach(el => {
        const suffix = el.getAttribute('data-suffix') || '';
        if (suffix) {
          el.innerHTML = `0<small>${suffix}</small>`;
        } else {
          el.textContent = '0';
        }
      });

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic curve
        const ease = 1 - Math.pow(1 - progress, 3);

        counterElements.forEach(el => {
          const target = parseFloat(el.getAttribute('data-target'));
          if (isNaN(target)) return;

          const currentVal = Math.round(target * ease);
          const suffix = el.getAttribute('data-suffix') || '';

          if (suffix) {
            el.innerHTML = `${currentVal}<small>${suffix}</small>`;
          } else {
            el.textContent = currentVal;
          }
        });

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          // Final exact values
          counterElements.forEach(el => {
            const target = el.getAttribute('data-target');
            const suffix = el.getAttribute('data-suffix') || '';
            if (suffix) {
              el.innerHTML = `${target}<small>${suffix}</small>`;
            } else {
              el.textContent = target;
            }
          });
        }
      }

      requestAnimationFrame(update);
    }

    const heroStats = document.querySelector('.itg-hero-stats');
    if (heroStats && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            runCounters();
            observer.disconnect();
          }
        });
      }, {
        threshold: 0.15
      });
      observer.observe(heroStats);
    } else {
      setTimeout(runCounters, 400);
    }
  }

  initHeroCounters();
});




