const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() { menu.setAttribute('aria-expanded', 'false'); navigation.classList.remove('is-open'); }
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});
navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.querySelectorAll('[data-dialog]').forEach(button => {
  button.addEventListener('click', () => document.getElementById(button.dataset.dialog).showModal());
});
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.querySelectorAll('a').forEach(link => link.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', event => { if (event.target === dialog) {
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  }});
});
document.querySelector('#contact-form').addEventListener('submit', async event => {
  event.preventDefault();
  const brief = document.querySelector('#project-brief');
  const status = document.querySelector('#form-status');
  try {
    await navigator.clipboard.writeText(brief.value);
    status.textContent = 'คัดลอกบรีฟแล้ว พร้อมนำไปส่งให้เอเจนซี (ยังไม่มีการส่งข้อมูลจากเว็บไซต์)';
  } catch {
    brief.focus(); brief.select();
    status.textContent = 'เลือกข้อความไว้แล้ว กด Ctrl+C หรือคัดลอกเพื่อนำบรีฟไปส่ง';
  }
});
