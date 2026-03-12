document.getElementById('fecha').min = new Date().toISOString().split('T')[0];

document.querySelectorAll('input[name="tipo"]').forEach(r => {
  r.addEventListener('change', () => {
    document.getElementById('otro-tema-wrap').style.display =
      (r.value === 'otros' && r.checked) ? 'block' : 'none';
  });
});

document.querySelectorAll('input[name="tipo"]').forEach(r => {
  r.addEventListener('change', () => {
    document.getElementById('otro-tipo-wrap').style.display =
      (r.value === 'otros' && r.checked) ? 'block' : 'none';
  });
});

document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.toggle('active');
});
