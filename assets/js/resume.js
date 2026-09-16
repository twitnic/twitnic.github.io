(() => {
  const printButton = document.querySelector('[data-print]');
  if (printButton) {
    printButton.hidden = false;
    printButton.addEventListener('click', () => window.print());
  }

  // Include collapsed experience entries in the printed resume.
  let collapsedDetails = [];
  window.addEventListener('beforeprint', () => {
    collapsedDetails = Array.from(document.querySelectorAll('details:not([open])'));
    collapsedDetails.forEach((details) => { details.open = true; });
  });
  window.addEventListener('afterprint', () => {
    collapsedDetails.forEach((details) => { details.open = false; });
    collapsedDetails = [];
  });

  const links = Array.from(document.querySelectorAll('.navigation-links a[href^="#"]'));
  const sections = links.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const visibleSections = new Set();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibleSections.add(entry.target);
        else visibleSections.delete(entry.target);
      });
      const activeSection = sections.find((section) => visibleSections.has(section));
      links.forEach((link) => {
        if (activeSection && link.hash === `#${activeSection.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-100px 0px -45% 0px' });
    sections.forEach((section) => observer.observe(section));
  }
})();
