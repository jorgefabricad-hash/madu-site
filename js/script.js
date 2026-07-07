// Nav scroll state
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Mobile menu toggle
const burger = document.getElementById('burger');
const navLinks = document.querySelector('.nav__links');
burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('nav__links--open');
  burger.classList.toggle('is-active', open);
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('nav__links--open'));
});

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('is-visible'), i * 60);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('is-visible'));
}

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// ============ PREMIUM INTERACTIONS ============
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

if (!prefersReducedMotion && !isTouch) {

  // Magnetic buttons
  document.querySelectorAll('.btn, .nav__cta').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35 - 3}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  // Hero portrait parallax tilt
  const portrait = document.querySelector('.hero__portrait');
  const hero = document.querySelector('.hero');
  if (portrait && hero) {
    hero.addEventListener('mousemove', (e) => {
      const r = hero.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      portrait.style.transform = `rotateY(${px * 8}deg) rotateX(${-py * 8}deg)`;
    });
    hero.addEventListener('mouseleave', () => { portrait.style.transform = ''; });
  }
}

// ============ AGENDAMENTO: calendário + WhatsApp ============
(function () {
  const grid = document.getElementById('cal-grid');
  if (!grid) return;

  // Ajuste aqui os horários oferecidos e o número de WhatsApp
  const WHATSAPP_NUMBER = '5500000000000';
  const HORARIOS = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  const monthYearEl = document.getElementById('cal-month-year');
  const prevBtn = document.getElementById('cal-prev');
  const nextBtn = document.getElementById('cal-next');
  const dataInput = document.getElementById('agendar-data');
  const horarioSelect = document.getElementById('agendar-horario');
  const form = document.getElementById('agendar-form');

  const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  let viewDate = new Date();
  let selectedDate = null;

  function isSameDay(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  function renderCalendar() {
    grid.innerHTML = '';
    monthYearEl.textContent = `${MESES[viewDate.getMonth()]} ${viewDate.getFullYear()}`;

    DIAS.forEach(d => {
      const h = document.createElement('div');
      h.className = 'calendar__day-header';
      h.textContent = d;
      grid.appendChild(h);
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstWeekday = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
    const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();

    for (let i = 0; i < firstWeekday; i++) {
      const empty = document.createElement('div');
      empty.className = 'calendar__day is-empty';
      grid.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const thisDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'calendar__day';
      btn.textContent = day;

      if (thisDate < today) {
        btn.disabled = true;
      } else {
        btn.addEventListener('click', () => selectDate(thisDate));
      }
      if (isSameDay(thisDate, today)) btn.classList.add('is-today');
      if (selectedDate && isSameDay(thisDate, selectedDate)) btn.classList.add('is-selected');

      grid.appendChild(btn);
    }

    const hoje = new Date();
    prevBtn.disabled = viewDate.getFullYear() === hoje.getFullYear() && viewDate.getMonth() <= hoje.getMonth();
  }

  function selectDate(date) {
    selectedDate = date;
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    dataInput.value = `${d}/${m}/${y}`;

    horarioSelect.innerHTML = '<option value="" disabled selected>Escolha um horário</option>';
    HORARIOS.forEach(h => {
      const opt = document.createElement('option');
      opt.value = h;
      opt.textContent = h;
      horarioSelect.appendChild(opt);
    });

    renderCalendar();
  }

  prevBtn.addEventListener('click', () => {
    viewDate.setMonth(viewDate.getMonth() - 1);
    renderCalendar();
  });
  nextBtn.addEventListener('click', () => {
    viewDate.setMonth(viewDate.getMonth() + 1);
    renderCalendar();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('agendar-nome').value.trim();
    const servico = document.getElementById('agendar-servico').value;
    const data = dataInput.value;
    const horario = horarioSelect.value;

    if (!nome || !servico || !data || !horario) {
      alert('Preencha todos os campos pra continuar.');
      return;
    }

    const mensagem = `Olá Madu! Meu nome é ${nome} e gostaria de agendar ${servico} para o dia ${data} às ${horario}. Essa data está disponível?`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`, '_blank');
  });

  renderCalendar();
})();

// ============ POPUP (aparece após 20s) ============
(function () {
  const popup = document.getElementById('popup');
  if (!popup || sessionStorage.getItem('popupDismissed')) return;

  function openPopup() {
    popup.classList.add('is-visible');
    popup.setAttribute('aria-hidden', 'false');
  }
  function closePopup() {
    popup.classList.remove('is-visible');
    popup.setAttribute('aria-hidden', 'true');
    sessionStorage.setItem('popupDismissed', '1');
  }

  const timer = setTimeout(openPopup, 20000);

  popup.querySelectorAll('[data-popup-close]').forEach(el => {
    el.addEventListener('click', closePopup);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popup.classList.contains('is-visible')) closePopup();
  });
})();

// ============ INSTAGRAM: cobrir selo do plano grátis ============
(function () {
  const feed = document.querySelector('.instagram__feed');
  const cover = document.querySelector('.instagram__cover');
  if (!feed || !cover) return;

  function updateCover() {
    const badge = feed.querySelector('a[href*="elfsight"]');
    if (!badge) return;
    const feedRect = feed.getBoundingClientRect();
    const badgeRect = badge.getBoundingClientRect();
    const height = Math.ceil(feedRect.bottom - badgeRect.top) + 6;
    cover.style.height = Math.max(height, 0) + 'px';
  }

  const poll = setInterval(() => {
    if (feed.querySelector('a[href*="elfsight"]')) {
      updateCover();
      clearInterval(poll);
    }
  }, 400);
  setTimeout(() => clearInterval(poll), 20000);

  if ('ResizeObserver' in window) {
    new ResizeObserver(updateCover).observe(feed);
  } else {
    window.addEventListener('resize', updateCover);
  }
})();
