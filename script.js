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

// Public journal is read-only. Publishing and deletion are not exposed on this page.
const journalFeed = document.getElementById('journal-feed');
const journalEmpty = document.getElementById('journal-empty');
const STORAGE_KEY = 'sourav-portfolio-journal-v1';
let activeFilter = 'all';
function safeText(value) {
  return String(value || '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
function renderJournal() {
  let posts = [];
  try { posts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { posts = []; }
  posts = posts.filter(post => activeFilter === 'all' || post.category === activeFilter);
  journalFeed.innerHTML = posts.map(post => {
    const media = (post.media || []).map(file => {
      const src = safeText(file.data);
      if ((file.type || '').startsWith('image/')) return '<img class="post-media-image" src="'+src+'" alt="'+safeText(file.name)+'" loading="lazy">';
      if ((file.type || '').startsWith('video/')) return '<video class="post-media-video" src="'+src+'" controls preload="metadata"></video>';
      return '<a class="post-file-link" href="'+src+'" download="'+safeText(file.name)+'">↳ '+safeText(file.name)+' <span>Download file</span></a>';
    }).join('');
    const category = ({vlog:'PERSONAL VLOG',work:'MY WORK',learning:'LEARNING',life:'LIFE UPDATE'})[post.category] || 'JOURNAL';
    return '<article class="journal-card"><div class="journal-card-meta"><span>'+category+'</span><time>'+safeText(post.date)+'</time></div><h3>'+safeText(post.title)+'</h3><p>'+safeText(post.caption).replace(/\\n/g,'<br>')+'</p>'+(media?'<div class="post-media-list">'+media+'</div>':'')+'</article>';
  }).join('');
  if (journalEmpty) journalEmpty.hidden = posts.length > 0;
}
document.querySelectorAll('.filter-btn').forEach(button => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.toggle('active', btn === button));
  renderJournal();
}));
if (journalFeed && journalEmpty) renderJournal();
