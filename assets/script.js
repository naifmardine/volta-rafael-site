const toast = new bootstrap.Toast(document.getElementById('divToast'));
document.getElementById('anoAtual').innerText = new Date().getFullYear();

document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    const navbarCollapse = document.querySelector('#navbarNav');
    const bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: false });
    bsCollapse.hide();

    const href = link.getAttribute('href');
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault(); // Impede o comportamento padrão do link
      //target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Ajuste manual do deslocamento (opcional, se scroll-margin-top não funcionar em todos os casos)
      const offsetTop = target.getBoundingClientRect().top + window.scrollY - 132; // Subtrai a altura do navbar
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  });
});

async function copyPixKey() {
  try {
    const pixKey = '43071635320';
    await navigator.clipboard.writeText(pixKey);
    document.getElementById('successMessage').innerText = 'Chave Pix copiada com sucesso!';
    toast.show();
  } catch (error) {
    console.error('Erro ao copiar chave Pix: ', error);
  }
}

async function copyPixCode() {
  try {
    const pixCode = '00020126400014br.gov.bcb.pix0111430716353200203Pix5204000053039865802BR5923RAFAEL BRITO DOS SANTOS6009FORTALEZA62150511VoltaRafael6304297F';
    await navigator.clipboard.writeText(pixCode);
    document.getElementById('successMessage').innerText = 'Código Pix copiado com sucesso!';
    toast.show();
  } catch (error) {
    console.error('Erro ao copiar código Pix: ', error);
  }
}