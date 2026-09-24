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


// Load published posts from Firestore; content is inserted as text, not HTML.
async function loadPublicJournal() {
  if (!journalFeed || !journalEmpty || typeof portfolioDb === 'undefined') return;
  try {
    const snap = await portfolioDb.collection('posts').where('published', '==', true).limit(50).get();
    const posts = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    posts.sort((a,b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
    const visible = activeFilter === 'all' ? posts : posts.filter(post => post.category === activeFilter);
    journalFeed.innerHTML = '';
    visible.forEach(post => {
      const card = document.createElement('article'); card.className = 'journal-card';
      const meta = document.createElement('div'); meta.className = 'journal-card-meta';
      const category = document.createElement('span'); category.textContent = String(post.category || 'journal').toUpperCase();
      const date = document.createElement('time'); date.textContent = post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : '';
      meta.append(category,date);
      const title = document.createElement('h3'); title.textContent = post.title || '';
      const body = document.createElement('p'); body.textContent = post.body || '';
      card.append(meta,title,body); journalFeed.append(card);
    });
    journalEmpty.hidden = visible.length > 0;
    journalEmpty.textContent = posts.length ? 'No posts in this category yet.' : 'No posts have been published yet. Please check back soon.';
  } catch (error) {
    journalFeed.innerHTML = '';
    journalEmpty.hidden = false;
    journalEmpty.textContent = 'Journal posts are temporarily unavailable.';
    console.error('Could not load journal posts:', error);
  }
}
document.querySelectorAll('.filter-btn').forEach(button => button.addEventListener('click', loadPublicJournal));
loadPublicJournal();
