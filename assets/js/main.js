/**
 * 25 Hours EdTech Platform - Global Core Script
 * Dynamic components, responsive overlay navigation, animations, and filter interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dual-Theme Persistence Engine
  const themeToggler = document.getElementById('themeToggler');
  const initialTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', initialTheme);
  
  if (themeToggler) {
    themeToggler.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', targetTheme);
      localStorage.setItem('theme', targetTheme);
    });
  }

  // 2. Sticky Blurry Navbar
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run initially
  }

  // 3. Mobile Hamburger Menu Toggle
  const hamburger = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isActive = mobileNav.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isActive);
      // Simple SVG toggle inside hamburger button
      if (isActive) {
        hamburger.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:24px;height:24px;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
      } else {
        hamburger.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:24px;height:24px;"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
      }
    });
  }

  // 4. Scroll Reveal Animations (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // 5. Dynamic Stats Counter Animation
  const statsElements = document.querySelectorAll('.trust-num, .stat-counter');
  if (statsElements.length > 0 && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const endVal = parseInt(target.textContent.replace(/[^0-9]/g, ''), 10);
          const hasPlus = target.textContent.includes('+');
          const hasComma = target.textContent.includes(',');
          
          if (isNaN(endVal)) return;

          let startVal = 0;
          const duration = 1500;
          const startTime = performance.now();

          const animateStep = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const currentVal = Math.floor(progress * endVal);
            
            let formattedVal = currentVal;
            if (hasComma) {
              formattedVal = currentVal.toLocaleString('en-IN');
            }
            
            target.textContent = formattedVal + (hasPlus ? '+' : '');

            if (progress < 1) {
              requestAnimationFrame(animateStep);
            } else {
              // Set final exact value to prevent roundoffs
              let finalFormatted = endVal;
              if (hasComma) {
                finalFormatted = endVal.toLocaleString('en-IN');
              }
              target.textContent = finalFormatted + (hasPlus ? '+' : '');
            }
          };

          requestAnimationFrame(animateStep);
          statsObserver.unobserve(target);
        }
      });
    }, { threshold: 0.5 });

    statsElements.forEach(el => statsObserver.observe(el));
  }

  // 6. FAQ Accordion Handler
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close all items
        faqItems.forEach(i => {
          i.classList.remove('active');
          i.querySelector('.faq-content').style.maxHeight = null;
        });
        
        // Open target item
        if (!isActive) {
          item.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    }
  });

  // 7. Curriculum Syllabus Accordion (Course Details Page)
  const curriculumItems = document.querySelectorAll('.curr-item');
  curriculumItems.forEach(item => {
    const trigger = item.querySelector('.curr-trigger');
    const content = item.querySelector('.curr-content');
    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        item.classList.toggle('active');
        if (!isActive) {
          content.style.maxHeight = content.scrollHeight + 'px';
        } else {
          content.style.maxHeight = null;
        }
      });
    }
  });

  // 8. 3D Perspective Rotation Mockup (Hero Widget)
  const mockupZone = document.getElementById('mockupZone');
  if (mockupZone) {
    const mockup = mockupZone.querySelector('.dashboard-mockup');
    if (mockup) {
      mockupZone.addEventListener('mousemove', (e) => {
        const rect = mockupZone.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const rotateX = -(y / (rect.height / 2)) * 12;
        const rotateY = (x / (rect.width / 2)) * 12;
        
        mockup.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
      
      mockupZone.addEventListener('mouseleave', () => {
        mockup.style.transform = 'rotateX(0deg) rotateY(0deg)';
      });
    }
  }

  // 9. Course Catalog Filter Engine (Courses page)
  const filterCheckboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');
  const searchInput = document.getElementById('catalogSearch');
  const courseCards = document.querySelectorAll('.catalog-main .c-card');
  
  const filterCatalog = () => {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    
    // Get checked categories and levels
    const checkedCats = Array.from(document.querySelectorAll('.filter-options[data-filter="category"] input:checked')).map(c => c.value);
    const checkedLevels = Array.from(document.querySelectorAll('.filter-options[data-filter="level"] input:checked')).map(l => l.value);
    const checkedPrices = Array.from(document.querySelectorAll('.filter-options[data-filter="price"] input:checked')).map(p => p.value);

    courseCards.forEach(card => {
      const name = card.querySelector('.c-name').textContent.toLowerCase();
      const by = card.querySelector('.c-by').textContent.toLowerCase();
      const cat = card.dataset.cat;
      const level = card.dataset.level;
      const priceType = card.dataset.price; // 'free' or 'paid'
      
      const matchesSearch = name.includes(query) || by.includes(query);
      const matchesCat = checkedCats.length === 0 || checkedCats.includes(cat);
      const matchesLevel = checkedLevels.length === 0 || checkedLevels.includes(level);
      const matchesPrice = checkedPrices.length === 0 || checkedPrices.includes(priceType);

      if (matchesSearch && matchesCat && matchesLevel && matchesPrice) {
        card.style.display = 'flex';
        setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 50);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => { card.style.display = 'none'; }, 200);
      }
    });
  };

  if (filterCheckboxes.length > 0 || searchInput) {
    filterCheckboxes.forEach(cb => cb.addEventListener('change', filterCatalog));
    if (searchInput) searchInput.addEventListener('input', filterCatalog);
  }

  // 10. Horizontal Category Slider click logic (Index.html course tab filter)
  window.filterHomeCat = (btn, cat) => {
    document.querySelectorAll('.cat-strip .cat').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const cards = document.querySelectorAll('#courseGrid .c-card');
    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'scale(0.96)';
      
      setTimeout(() => {
        if (cat === 'all' || card.dataset.cat === cat) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      }, 200);
    });
  };

  // 11. Subscription Pricing period toggle (Pricing Page)
  const priceToggle = document.getElementById('pricePeriodToggle');
  const priceGrid = document.getElementById('pricingGrid');
  if (priceToggle && priceGrid) {
    priceToggle.addEventListener('click', () => {
      const isYearly = priceToggle.classList.toggle('yearly');
      
      // Update values
      const prices = priceGrid.querySelectorAll('.pricing-card');
      prices.forEach(card => {
        const amountEl = card.querySelector('.pricing-price');
        const periodEl = card.querySelector('.pricing-period');
        
        if (!amountEl) return;

        const monthlyVal = amountEl.dataset.monthly;
        const yearlyVal = amountEl.dataset.yearly;

        if (isYearly) {
          amountEl.textContent = yearlyVal;
          periodEl.textContent = '/ year';
        } else {
          amountEl.textContent = monthlyVal;
          periodEl.textContent = '/ month';
        }
      });
    });
  }

  // 12. Video Preview Modal handler (Course Details and Home page)
  const modal = document.getElementById('previewModal');
  const previewTriggers = document.querySelectorAll('.video-trigger, .cd-widget-thumb');
  const modalClose = document.getElementById('modalClose');
  const modalIframe = document.getElementById('modalIframe');

  if (modal && previewTriggers.length > 0 && modalClose) {
    previewTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const videoSrc = trigger.dataset.video || 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1';
        if (modalIframe) modalIframe.src = videoSrc;
        modal.classList.add('active');
      });
    });

    const closeModal = () => {
      modal.classList.remove('active');
      if (modalIframe) modalIframe.src = '';
    };

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // 13. Unified Login/Signup switcher tabs (login.html)
  const authTabs = document.querySelectorAll('.auth-tab');
  const authForms = document.querySelectorAll('.auth-form');
  if (authTabs.length > 0 && authForms.length > 0) {
    authTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const formId = tab.dataset.form;
        
        authTabs.forEach(t => t.classList.remove('active'));
        authForms.forEach(f => f.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(formId).classList.add('active');
      });
    });
  }

  // 14. Contact Form Validation / Toast Trigger
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Basic mock toast indicator
      const toast = document.createElement('div');
      toast.style.position = 'fixed';
      toast.style.bottom = '24px';
      toast.style.right = '24px';
      toast.style.background = 'var(--accent-teal)';
      toast.style.color = '#ffffff';
      toast.style.padding = '16px 24px';
      toast.style.borderRadius = 'var(--radius-sm)';
      toast.style.boxShadow = 'var(--shadow-lg)';
      toast.style.zIndex = '9999';
      toast.style.fontWeight = '700';
      toast.style.fontFamily = 'Syne, sans-serif';
      toast.style.fontSize = '14px';
      toast.textContent = 'Message sent! We will contact you within 24 hours.';
      
      document.body.appendChild(toast);
      contactForm.reset();

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s ease';
        setTimeout(() => toast.remove(), 500);
      }, 3000);
    });
  }
});
