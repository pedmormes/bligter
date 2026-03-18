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
