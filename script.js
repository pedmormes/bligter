document.getElementById('fecha').min = new Date().toISOString().split('T')[0];
 
// ── Mostrar/ocultar campo "otra temática" ─────────────
document.querySelectorAll('input[name="tipo"]').forEach(r => {
  r.addEventListener('change', () => {
    document.getElementById('otro-tema-wrap').style.display =
      (r.value === 'otros' && r.checked) ? 'block' : 'none';
  });
});
 
// ── Hamburger menú ────────────────────────────────────
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.toggle('open');
});
 
// ── Toast helper ──────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.display = 'block';
  setTimeout(() => t.style.display = 'none', 3200);
}
 
// ── Validar email ─────────────────────────────────────
function validEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}
 
// ── Formulario: Solicitar artículo ────────────────────
document.getElementById('btnSolicitar').addEventListener('click', () => {
  const nombre   = document.getElementById('nombre').value.trim();
  const email    = document.getElementById('email').value.trim();
  const tipo     = document.querySelector('input[name="tipo"]:checked');
  const longitud = document.querySelector('input[name="longitud"]:checked');
 
  if (!nombre || nombre.length < 2) { alert('Por favor introduce tu nombre (mínimo 2 caracteres).'); return; }
  if (!email || !validEmail(email))  { alert('Por favor introduce un correo electrónico válido.'); return; }
  if (!tipo)                         { alert('Por favor selecciona el tipo de contenido.'); return; }
  if (!longitud)                     { alert('Por favor selecciona la longitud del artículo.'); return; }
 
  showToast('✅ ¡Solicitud enviada correctamente!');
 
  // Reset campos
  document.getElementById('nombre').value = '';
  document.getElementById('email').value  = '';
  document.getElementById('medio').value  = '';
  document.getElementById('fecha').value  = '';
  document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
  document.getElementById('otro-tema-wrap').style.display = 'none';
});
 
// ── Formulario: Contacto ──────────────────────────────
document.getElementById('btnEnviar').addEventListener('click', () => {
  const email = document.getElementById('cemail').value.trim();
  if (!email || !validEmail(email)) { alert('Por favor introduce un correo electrónico válido.'); return; }
 
  showToast('📩 ¡Mensaje enviado!');
  document.getElementById('msg').value   = '';
  document.getElementById('cemail').value = '';
});

const testimonials = [
  {
    quote: '"No teníamos una sección de empleo y ahora es una de las más leídas y compartidas. Desde que usamos Bligter, cada semana recibimos un artículo con las ofertas de empleo más interesantes en nuestra localidad que los lectores agradecen."',
    name: 'Julia Sancristobal'
  },
  {
    quote: '"Gracias a Bligter hemos podido ofrecer contenido de vivienda actualizado sin necesidad de contratar redactores. Totalmente recomendable para cualquier medio digital."',
    name: 'Carlos Mediavilla'
  },
  {
    quote: '"La sección de motor que nos envían cada semana es siempre relevante y bien escrita. Nuestros lectores la valoran mucho y la comparten habitualmente."',
    name: 'Ana Torregrosa'
  }
];
 
let tIdx = 0;
 
function showT(i) {
  const card = document.getElementById('testimonialCard');
  card.style.opacity = '0';
  setTimeout(() => {
    document.getElementById('tQuote').textContent = testimonials[i].quote;
    document.getElementById('tName').textContent  = testimonials[i].name;
    card.style.opacity = '1';
  }, 180);
}
 
function nextT() { tIdx = (tIdx + 1) % testimonials.length; showT(tIdx); }
function prevT() { tIdx = (tIdx - 1 + testimonials.length) % testimonials.length; showT(tIdx); }

function ocultarBanner() {
    document.getElementById('cookie-banner').classList.remove('visible');
    document.getElementById('cookie-modal').classList.remove('visible');
  }
 
  function aplicarCookies(analiticas, marketing) {
    if (analiticas) {
      console.log('✅ Cookies analíticas activadas');
      // const s = document.createElement('script');
      // s.src = 'https://www.googletagmanager.com/gtag/js?id=TU_ID';
      // document.head.appendChild(s);
    }
    if (marketing) {
      console.log('✅ Cookies de marketing activadas');
    }
  }
 
  function guardarConsentimiento(analiticas, marketing) {
    localStorage.setItem('cookies_configuradas', 'true');
    localStorage.setItem('cookies_analiticas', analiticas);
    localStorage.setItem('cookies_marketing', marketing);
    ocultarBanner();
    aplicarCookies(analiticas, marketing);
    showToast('✅ Preferencias de cookies guardadas');
  }
 
  // Mostrar banner si el usuario no ha elegido aún
  if (!localStorage.getItem('cookies_configuradas')) {
    document.getElementById('cookie-banner').classList.add('visible');
  } else {
    const analiticas = localStorage.getItem('cookies_analiticas') === 'true';
    const marketing  = localStorage.getItem('cookies_marketing')  === 'true';
    aplicarCookies(analiticas, marketing);
  }
 
  // Botón: Solo necesarias
  document.getElementById('btn-rechazar').addEventListener('click', () => {
    guardarConsentimiento(false, false);
  });
 
  // Botón: Aceptar todas
  document.getElementById('btn-aceptar').addEventListener('click', () => {
    guardarConsentimiento(true, true);
  });
 
  // Botón: Abrir modal de configuración
  document.getElementById('btn-configurar').addEventListener('click', () => {
    const analiticas = localStorage.getItem('cookies_analiticas') === 'true';
    const marketing  = localStorage.getItem('cookies_marketing')  === 'true';
    document.getElementById('ck-analiticas').checked = analiticas;
    document.getElementById('ck-marketing').checked  = marketing;
    document.getElementById('cookie-modal').classList.add('visible');
  });
 
  // Botón: Cancelar modal
  document.getElementById('btn-cancelar').addEventListener('click', () => {
    document.getElementById('cookie-modal').classList.remove('visible');
  });
 
  // Botón: Guardar preferencias del modal
  document.getElementById('btn-guardar').addEventListener('click', () => {
    const analiticas = document.getElementById('ck-analiticas').checked;
    const marketing  = document.getElementById('ck-marketing').checked;
    guardarConsentimiento(analiticas, marketing);
  });
 
  // Cerrar modal al hacer clic fuera del cuadro
  document.getElementById('cookie-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('cookie-modal')) {
      document.getElementById('cookie-modal').classList.remove('visible');
    }
  });
 
  // Enlace "Política de Cookies" reabre el modal
  document.querySelectorAll('a').forEach(a => {
    if (a.textContent.trim() === 'Política de Cookies') {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const analiticas = localStorage.getItem('cookies_analiticas') === 'true';
        const marketing  = localStorage.getItem('cookies_marketing')  === 'true';
        document.getElementById('ck-analiticas').checked = analiticas;
        document.getElementById('ck-marketing').checked  = marketing;
        document.getElementById('cookie-modal').classList.add('visible');
      });
    }
  });