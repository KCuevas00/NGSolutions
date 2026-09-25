/**
 * N&G Solutions Services LLC - Main JS
 * Underground Utilities & Infrastructure
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  const header = document.querySelector('.site-header');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      navLinks.classList.toggle('active');
      
      if (header) {
        header.classList.toggle('menu-open', navLinks.classList.contains('active'));
      }
      
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (navLinks.classList.contains('active')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-xmark');
        } else {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });

    // Close menu when clicking outside or on a nav link
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
        closeMobileMenu();
      }
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMobileMenu();
      }
    });

    function closeMobileMenu() {
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        if (header) {
          header.classList.remove('menu-open');
        }
        mobileToggle.setAttribute('aria-expanded', 'false');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    }
  }

  // 2. Transparent-to-Solid Navbar on Scroll
  let ticking = false;

  function updateNavbarScroll() {
    if (!header) return;
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

  // 3. Gallery Category Filter & Modern Grid Filter
  const filterBtns = document.querySelectorAll('.filter-btn, .gallery-filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card, .gallery-item, .gallery-tile');

  if (filterBtns.length > 0 && galleryCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        galleryCards.forEach(item => {
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

  // 4. Lightbox Modal for Gallery (Photos & Videos)
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxVideo = document.getElementById('lightboxVideo');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxClose = document.querySelector('.lightbox-close');

  if (lightbox) {
    document.querySelectorAll('.gallery-tile, .photo-pane, .showcase-photo-pane, .gallery-item').forEach(pane => {
      pane.addEventListener('click', () => {
        const isVideo = pane.dataset.type === 'video' || pane.classList.contains('is-video');
        const title = pane.dataset.title || (pane.querySelector('h3') ? pane.querySelector('h3').textContent : 'Project Detail');
        const desc = pane.dataset.desc || (pane.querySelector('p') ? pane.querySelector('p').textContent : '');

        if (isVideo) {
          const videoSrc = pane.dataset.videoSrc || (pane.querySelector('video') ? pane.querySelector('video').src : '');
          if (videoSrc && lightboxVideo) {
            lightboxVideo.src = videoSrc;
            lightboxVideo.style.display = 'block';
            if (lightboxImg) lightboxImg.style.display = 'none';
            lightboxVideo.play().catch(() => {});
          }
        } else {
          const img = pane.querySelector('img');
          if (img && lightboxImg) {
            lightboxImg.src = img.src;
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

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });

      // Desktop Video Tile Preview on Hover
      if (pane.classList.contains('is-video')) {
        const tileVideo = pane.querySelector('video');
        if (tileVideo) {
          pane.addEventListener('mouseenter', () => {
            tileVideo.play().catch(() => {});
          });
          pane.addEventListener('mouseleave', () => {
            tileVideo.pause();
            tileVideo.currentTime = 0;
          });
        }
      }
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

  // 6. Contact & Estimate Form Submission via FormSubmit.co
  const quoteForm = document.getElementById('contactQuoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = quoteForm.querySelector('button[type="submit"]');
      const statusBox = document.getElementById('formStatus');
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '<i class="fa-solid fa-paper-plane"></i> Submit Request for Project Bid';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting Request...';
      }

      if (statusBox) {
        statusBox.style.display = 'none';
        statusBox.className = 'form-status';
      }

      const formData = new FormData(quoteForm);

      try {
        const response = await fetch('https://formsubmit.co/ajax/ngsolutionsservicesllc@gmail.com', {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        });

        const result = await response.json();

        if (response.ok || result.success === 'true' || result.success === true) {
          if (statusBox) {
            statusBox.className = 'form-status success';
            statusBox.innerHTML = '<i class="fa-solid fa-circle-check"></i> <strong>Thank you!</strong> Your project bid request has been submitted. An N&amp;G Solutions Services specialist will review your details and contact you shortly.';
            statusBox.style.display = 'block';
            statusBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
          quoteForm.reset();
        } else {
          throw new Error(result.message || 'Form submission failed');
        }
      } catch (err) {
        if (statusBox) {
          statusBox.className = 'form-status error';
          statusBox.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> <strong>Note:</strong> We couldn\'t submit online at this moment. Please call our office directly at <a href="tel:2246338813" style="color: inherit; text-decoration: underline; font-weight: 700;">(224) 633-8813</a> or email <a href="mailto:ngsolutionsservicesllc@gmail.com" style="color: inherit; text-decoration: underline; font-weight: 700;">ngsolutionsservicesllc@gmail.com</a>.';
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

  // 7. Continuous Looping Video Hero Playlist with Smooth Cross-Fade
  const videoA = document.getElementById('heroVideoA');
  const videoB = document.getElementById('heroVideoB');

  if (videoA && videoB) {
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
    let videoErrorCount = 0;
    const clipDuration = 5500; // 5.5 seconds per clip before cross-fading

    videoA.muted = true;
    videoA.playsInline = true;
    videoB.muted = true;
    videoB.playsInline = true;

    function playVideo(video) {
      if (!video) return;
      video.muted = true;
      video.playsInline = true;
      const p = video.play();
      if (p !== undefined) {
        p.catch(() => {
          // Autoplay unlock on first user click or touch
          const unlockAutoplay = () => {
            activePlayer.play().catch(() => {});
          };
          document.addEventListener('touchstart', unlockAutoplay, { once: true, passive: true });
          document.addEventListener('click', unlockAutoplay, { once: true, passive: true });
        });
      }
    }

    videoA.addEventListener('error', () => {
      videoErrorCount++;
      if (videoErrorCount > 2 && cycleTimer) {
        clearInterval(cycleTimer);
      }
    });

    videoB.addEventListener('error', () => {
      videoErrorCount++;
      if (videoErrorCount > 2 && cycleTimer) {
        clearInterval(cycleTimer);
      }
    });

    // Start playing video A if supported
    playVideo(videoA);

    function nextVideo() {
      if (isTransitioning || videoErrorCount > 2) return;
      isTransitioning = true;

      currentIndex = (currentIndex + 1) % playlist.length;
      const nextSrc = playlist[currentIndex];

      idlePlayer.src = nextSrc;
      idlePlayer.currentTime = 0;
      idlePlayer.muted = true;
      idlePlayer.playsInline = true;
      idlePlayer.load();

      let transitionDone = false;
      let safetyTimer = null;

      const performCrossfade = () => {
        if (transitionDone) return;
        transitionDone = true;
        if (safetyTimer) clearTimeout(safetyTimer);

        idlePlayer.removeEventListener('playing', performCrossfade);

        // Idle player is actively rendering frames - trigger smooth 1.2s cross-dissolve
        idlePlayer.classList.add('active');
        activePlayer.classList.remove('active');

        setTimeout(() => {
          activePlayer.pause();
          const temp = activePlayer;
          activePlayer = idlePlayer;
          idlePlayer = temp;
          isTransitioning = false;
        }, 1250);
      };

      idlePlayer.addEventListener('playing', performCrossfade, { once: true });

      // Safety timeout for mobile browsers (e.g. iOS) in case 'playing' event is throttled
      safetyTimer = setTimeout(() => {
        if (!transitionDone) {
          performCrossfade();
        }
      }, 1500);

      const p = idlePlayer.play();
      if (p !== undefined) {
        p.catch(() => {
          isTransitioning = false;
          if (safetyTimer) clearTimeout(safetyTimer);
        });
      }
    }

    // Advance when clip naturally ends OR after clipDuration
    videoA.addEventListener('ended', nextVideo);
    videoB.addEventListener('ended', nextVideo);

    // Continuous looping timer
    cycleTimer = setInterval(nextVideo, clipDuration);
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
});




