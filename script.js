document.addEventListener('DOMContentLoaded', () => {

  // ── ENVÍO POR PHP ──────────────────────────────────────
  const PHP_URL = 'send.php';

  async function enviarFormulario(datos) {
    const response = await fetch(PHP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    return await response.json();
  }

  // ── TOAST ─────────────────────────────────────────────
  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.style.display = 'block';
    setTimeout(() => t.style.display = 'none', 3200);
  }

  // ── VALIDAR EMAIL ──────────────────────────────────────
  function validEmail(e) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }

  // ── COOKIES ────────────────────────────────────────────

  function ocultarBanner() {
    document.getElementById('cookie-banner').classList.remove('visible');
    document.getElementById('cookie-modal').classList.remove('visible');
    document.body.style.paddingBottom = '';
  }

  function mostrarBanner() {
    document.getElementById('cookie-banner').classList.add('visible');
    setTimeout(() => {
      const h = document.getElementById('cookie-banner').offsetHeight;
      document.body.style.paddingBottom = h + 'px';
    }, 100);
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

  // Mostrar banner siempre al entrar
  mostrarBanner();

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

  // Enlace "Restablecer cookies" → borra preferencias y muestra banner de nuevo
  const resetBtn = document.getElementById('resetCookies');
  if (resetBtn) {
    resetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('cookies_configuradas');
      localStorage.removeItem('cookies_analiticas');
      localStorage.removeItem('cookies_marketing');
      mostrarBanner();
    });
  }

  // ── BOTÓN VOLVER ARRIBA ────────────────────────────────
  const btnTop = document.getElementById('btnTop');
  window.addEventListener('scroll', () => {
    btnTop.classList.toggle('visible', window.scrollY > 400);
  });
  btnTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ── FECHA MÍNIMA HOY ───────────────────────────────────
  document.getElementById('fecha').min = new Date().toISOString().split('T')[0];

  // ── MOSTRAR/OCULTAR "OTRA TEMÁTICA" ───────────────────
  document.querySelectorAll('input[name="tipo"]').forEach(r => {
    r.addEventListener('change', () => {
      clearError('tipo');
    });
  });
  document.querySelectorAll('input[name="longitud"]').forEach(r => {
    r.addEventListener('change', () => {
      clearError('longitud');
    });
  });

  // ── HAMBURGER MENÚ ─────────────────────────────────────
  document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('mobileMenu').classList.toggle('open');
  });

  // ── HELPERS DE ERRORES INLINE ──────────────────────────
  function showError(fieldId, msg) {
    clearError(fieldId);
    const field = document.getElementById(fieldId);
    if (!field) return;

    const err = document.createElement('p');
    err.className = 'field-error';
    err.setAttribute('data-for', fieldId);
    err.textContent = msg;

    // Insertar justo después del campo
    field.insertAdjacentElement('afterend', err);

    if (field.tagName === 'INPUT' || field.tagName === 'TEXTAREA') {
      field.classList.add('input-error');
    }
  }

  function clearError(fieldId) {
    document.querySelectorAll('.field-error[data-for="' + fieldId + '"]')
      .forEach(e => e.remove());
    const field = document.getElementById(fieldId);
    if (field) field.classList.remove('input-error');
  }

  function clearAllErrors() {
    document.querySelectorAll('.field-error').forEach(e => e.remove());
    document.querySelectorAll('.input-error').forEach(e => e.classList.remove('input-error'));
  }

  // Limpiar error al escribir en el campo
  ['nombre', 'email', 'fecha', 'medio'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => clearError(id));
  });

  // ── FORMULARIO: SOLICITAR ARTÍCULO ─────────────────────
  document.getElementById('btnSolicitar').addEventListener('click', () => {
    clearAllErrors();
    const nombre   = document.getElementById('nombre').value.trim();
    const email    = document.getElementById('email').value.trim();
    const tipo     = document.querySelector('input[name="tipo"]:checked');
    const longitud = document.querySelector('input[name="longitud"]:checked');
    const medio    = document.getElementById('medio').value.trim();
    const fecha    = document.getElementById('fecha').value;
    const tematica = document.getElementById('otro-tema').value.trim();
    let valid = true;

    if (!tipo) {
      showError('tipo', '⚠ Por favor selecciona el tipo de contenido.');
      valid = false;
    }
    if (!longitud) {
      showError('longitud', '⚠ Por favor selecciona la longitud del artículo.');
      valid = false;
    }
    if (!nombre || nombre.length < 2) {
      showError('nombre', '⚠ Introduce tu nombre (mínimo 2 caracteres).');
      valid = false;
    }
    if (!email || !validEmail(email)) {
      showError('email', '⚠ Introduce un correo electrónico válido.');
      valid = false;
    }
    if (!valid) return;

    const btn = document.getElementById('btnSolicitar');
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    const datos = new FormData();
    datos.append('tipo',      tipo.value);
    datos.append('longitud',  longitud.value);
    datos.append('medio',     medio);
    datos.append('nombre',    nombre);
    datos.append('email',     email);
    datos.append('fecha',     fecha);
    datos.append('tematica',  tematica);

    fetch('send.php', { method: 'POST', body: datos })
    .then(res => res.json())
    .then(data => {
      if (data.ok) {
        showToast('✅ ¡Solicitud enviada correctamente!');
        clearAllErrors();
        document.getElementById('nombre').value     = '';
        document.getElementById('email').value      = '';
        document.getElementById('medio').value      = '';
        document.getElementById('fecha').value      = '';
        document.getElementById('otro-tema').value  = '';
        document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
      } else {
        showToast('❌ Error al enviar. Inténtalo de nuevo.');
      }
    })
    .catch(() => showToast('❌ Error al enviar. Inténtalo de nuevo.'))
    .finally(() => {
      btn.textContent = 'Solicitar';
      btn.disabled = false;
    });
  });

  // ── FORMULARIO: CONTACTO ───────────────────────────────
  document.getElementById('btnEnviar').addEventListener('click', () => {
    clearError('cemail');
    const email = document.getElementById('cemail').value.trim();
    const msg   = document.getElementById('msg').value.trim();
    if (!email || !validEmail(email)) {
      showError('cemail', '⚠ Introduce un correo electrónico válido.');
      return;
    }

    const btn = document.getElementById('btnEnviar');
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    const datos = new FormData();
    datos.append('tipo',     'Contacto');
    datos.append('nombre',   'Visitante');
    datos.append('email',    email);
    datos.append('tematica', msg);

    fetch('send.php', { method: 'POST', body: datos })
    .then(res => res.json())
    .then(data => {
      if (data.ok) {
        showToast('📩 ¡Mensaje enviado!');
        document.getElementById('msg').value    = '';
        document.getElementById('cemail').value = '';
      } else {
        showToast('❌ Error al enviar. Inténtalo de nuevo.');
      }
    })
    .catch(() => showToast('❌ Error al enviar. Inténtalo de nuevo.'))
    .finally(() => {
      btn.textContent = 'Enviar';
      btn.disabled = false;
    });
  });
  document.getElementById('cemail').addEventListener('input', () => clearError('cemail'));

  // ── CARRUSEL DE TESTIMONIOS ────────────────────────────
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

  // Exponer al ámbito global para los onclick del HTML
  window.showT = function(i) {
    const card = document.getElementById('testimonialCard');
    card.style.opacity = '0';
    setTimeout(() => {
      document.getElementById('tQuote').textContent = testimonials[i].quote;
      document.getElementById('tName').textContent  = testimonials[i].name;
      card.style.opacity = '1';
    }, 180);
  };

  window.nextT = function() { tIdx = (tIdx + 1) % testimonials.length; window.showT(tIdx); };
  window.prevT = function() { tIdx = (tIdx - 1 + testimonials.length) % testimonials.length; window.showT(tIdx); };

});