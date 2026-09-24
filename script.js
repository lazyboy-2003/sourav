const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuButton.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

document.getElementById('year').textContent = new Date().getFullYear();

// Subtle scroll reveals, with a graceful fallback for reduced-motion users.
const revealTargets = document.querySelectorAll('.section-label, .about-grid, .skill-card, .section-heading, .project-card, .project-note, .contact-content');
revealTargets.forEach((element) => element.classList.add('reveal'));

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach((element) => observer.observe(element));
} else {
  revealTargets.forEach((element) => element.classList.add('visible'));
}

// TODO: Replace this placeholder with your real email address.
const contactEmail = 'hello@example.com';
document.getElementById('email-link').href = 'mailto:' + contactEmail;


// Personal journal prototype. Posts and media are stored locally in this browser.
const postForm = document.getElementById('post-form');
const toggleComposer = document.getElementById('toggle-composer');
const closeComposer = document.getElementById('close-composer');
const mediaInput = document.getElementById('post-media');
const selectedFiles = document.getElementById('selected-files');
const journalFeed = document.getElementById('journal-feed');
const journalEmpty = document.getElementById('journal-empty');
const STORAGE_KEY = 'sourav-portfolio-journal-v1';
let selectedMedia = [];
let activeFilter = 'all';

function loadPosts() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}
function safeText(value) {
  return String(value || '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
function renderJournal() {
  const posts = loadPosts().filter(post => activeFilter === 'all' || post.category === activeFilter);
  journalFeed.innerHTML = posts.map(post => {
    const media = (post.media || []).map(file => {
      if (file.type.startsWith('image/')) return '<img class="post-media-image" src="'+file.data+'" alt="'+safeText(file.name)+'" loading="lazy">';
      if (file.type.startsWith('video/')) return '<video class="post-media-video" src="'+file.data+'" controls preload="metadata"></video>';
      return '<a class="post-file-link" href="'+file.data+'" download="'+safeText(file.name)+'">↳ '+safeText(file.name)+' <span>Download file</span></a>';
    }).join('');
    const category = ({vlog:'PERSONAL VLOG',work:'MY WORK',learning:'LEARNING',life:'LIFE UPDATE'})[post.category] || 'JOURNAL';
    return '<article class="journal-card"><div class="journal-card-meta"><span>'+category+'</span><time>'+safeText(post.date)+'</time></div><h3>'+safeText(post.title)+'</h3><p>'+safeText(post.caption).replace(/\n/g,'<br>')+'</p>'+ (media ? '<div class="post-media-list">'+media+'</div>' : '') +'<button class="delete-post" data-delete="'+post.id+'" type="button">Delete this local post ×</button></article>';
  }).join('');
  journalEmpty.hidden = posts.length > 0;
}
toggleComposer.addEventListener('click', () => { postForm.hidden = !postForm.hidden; if (!postForm.hidden) postForm.scrollIntoView({behavior:'smooth',block:'start'}); });
closeComposer.addEventListener('click', () => { postForm.hidden = true; });
mediaInput.addEventListener('change', async () => {
  selectedMedia = [];
  selectedFiles.textContent = '';
  const files = Array.from(mediaInput.files || []);
  if (files.some(file => file.size > 2 * 1024 * 1024)) {
    alert('Please choose files smaller than 2 MB each in this prototype.');
    mediaInput.value = '';
    return;
  }
  for (const file of files) {
    const data = await new Promise((resolve,reject) => { const reader = new FileReader(); reader.onload=()=>resolve(reader.result); reader.onerror=reject; reader.readAsDataURL(file); });
    selectedMedia.push({name:file.name,type:file.type || 'application/octet-stream',data});
  }
  selectedFiles.textContent = selectedMedia.length ? selectedMedia.length+' file(s) ready: '+selectedMedia.map(f=>f.name).join(', ') : '';
});
postForm.addEventListener('submit', event => {
  event.preventDefault();
  const posts = loadPosts();
  const post = {id:Date.now().toString(),title:document.getElementById('post-title').value.trim(),category:document.getElementById('post-category').value,caption:document.getElementById('post-caption').value.trim(),date:new Date().toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'}),media:selectedMedia};
  try {
    localStorage.setItem(STORAGE_KEY,JSON.stringify([post,...posts]));
  } catch(error) {
    alert('Browser storage is full. Try removing a large file or deleting old local posts.');
    return;
  }
  postForm.reset(); selectedMedia=[]; selectedFiles.textContent=''; postForm.hidden=true; activeFilter='all';
  document.querySelectorAll('.filter-btn').forEach(btn=>btn.classList.toggle('active',btn.dataset.filter==='all'));
  renderJournal(); journalFeed.scrollIntoView({behavior:'smooth',block:'start'});
});
journalFeed.addEventListener('click', event => {
  const button=event.target.closest('[data-delete]');
  if (!button) return;
  if (confirm('Delete this post from this browser?')) {
    localStorage.setItem(STORAGE_KEY,JSON.stringify(loadPosts().filter(post=>post.id!==button.dataset.delete)));
    renderJournal();
  }
});
document.querySelectorAll('.filter-btn').forEach(button => button.addEventListener('click', () => {
  activeFilter=button.dataset.filter;
  document.querySelectorAll('.filter-btn').forEach(btn=>btn.classList.toggle('active',btn===button));
  renderJournal();
}));
renderJournal();
