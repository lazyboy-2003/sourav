const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
if (menuButton && navLinks) {
  menuButton.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });
  document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }));
}
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
const revealTargets = document.querySelectorAll('.section-label, .about-grid, .skill-card, .section-heading, .project-card, .project-note, .contact-content');
revealTargets.forEach(element => element.classList.add('reveal'));
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries, currentObserver) => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); currentObserver.unobserve(entry.target); }
  }), { threshold: 0.12 });
  revealTargets.forEach(element => observer.observe(element));
} else revealTargets.forEach(element => element.classList.add('visible'));
const contactEmail = 'hello@example.com';
const emailLink = document.getElementById('email-link');
if (emailLink) emailLink.href = 'mailto:' + contactEmail;

// Public journal is read-only. Posts will appear here only after secure publishing is configured.
const journalFeed = document.getElementById('journal-feed');
const journalEmpty = document.getElementById('journal-empty');
let activeFilter = 'all';
function renderJournal() {
  if (journalFeed) journalFeed.innerHTML = '';
  if (journalEmpty) {
    journalEmpty.hidden = false;
    journalEmpty.textContent = 'No posts have been published yet. Please check back soon.';
  }
}
document.querySelectorAll('.filter-btn').forEach(button => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.toggle('active', btn === button));
  renderJournal();
}));
renderJournal();
