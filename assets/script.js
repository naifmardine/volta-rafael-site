// --- Constantes da campanha (atualizar manualmente no deploy) ---
// Valores conforme Análise Estratégica — extrato 15/03/2026
const CAMPANHA = {
  arrecadadoBRL: 78252,          // PIX (R$ 74.349,77) + Vakinha (R$ 3.902,91)
  metaMinimaBRL: 1920000,         // Menor cotação UTI aérea (Central Ambulância Aérea, Portugal)
  dataAtualizacao: '2026-03-15',  // ISO; mostrado em data brasileira na legenda
  dataAVC: '2025-07-01',          // Data aproximada do AVC — base pro contador de tempo
};

const toast = new bootstrap.Toast(document.getElementById('divToast'));
document.getElementById('anoAtual').innerText = new Date().getFullYear();

// --- Helper: meses entre dataISO e hoje ---
function mesesDesde(dataISO) {
  const inicio = new Date(dataISO + 'T00:00:00');
  const agora = new Date();
  let m = (agora.getFullYear() - inicio.getFullYear()) * 12 + (agora.getMonth() - inicio.getMonth());
  if (agora.getDate() < inicio.getDate()) m--;
  return Math.max(0, m);
}

function tempoTexto(meses) {
  if (meses >= 12) {
    const anos = Math.floor(meses / 12);
    const restoMeses = meses % 12;
    const anosTxt = `${anos} ano${anos > 1 ? 's' : ''}`;
    return restoMeses > 0
      ? `há mais de ${anosTxt} e ${restoMeses} ${restoMeses === 1 ? 'mês' : 'meses'}`
      : `há mais de ${anosTxt}`;
  }
  return `há mais de ${meses} ${meses === 1 ? 'mês' : 'meses'}`;
}

// --- Atualização dinâmica do progresso e do tempo desde o AVC (só no index) ---
(function atualizarProgresso() {
  const fill = document.getElementById('progressoFill');
  const bar = fill ? fill.parentElement : null;
  const valArr = document.getElementById('valorArrecadado');
  const valMeta = document.getElementById('valorMeta');
  const tempo = document.getElementById('tempoFilipinas');

  if (fill && bar) {
    const pct = Math.min(100, (CAMPANHA.arrecadadoBRL / CAMPANHA.metaMinimaBRL) * 100);
    fill.style.width = pct.toFixed(1) + '%';
    bar.setAttribute('aria-valuenow', String(CAMPANHA.arrecadadoBRL));
    bar.setAttribute('aria-valuemax', String(CAMPANHA.metaMinimaBRL));
  }

  const fmt = (n) => 'R$ ' + n.toLocaleString('pt-BR');
  if (valArr) valArr.innerText = fmt(CAMPANHA.arrecadadoBRL);
  if (valMeta) valMeta.innerText = fmt(CAMPANHA.metaMinimaBRL);

  if (tempo) {
    const meses = mesesDesde(CAMPANHA.dataAVC);
    tempo.innerText = tempoTexto(meses);
  }
})();

// --- Mensagem de compartilhamento (montada dinamicamente em todas as páginas) ---
(function configurarShare() {
  const SITE_URL = 'https://www.voltarafael.com.br/';
  const meses = mesesDesde(CAMPANHA.dataAVC);
  const periodo = tempoTexto(meses);

  const mensagem = `🇧🇷 Volta, Rafael! — Missão humanitária de repatriação

Rafael Felix dos Santos, 32 anos, cearense, sofreu um AVC hemorrágico grave em Cebu City (Filipinas) em julho de 2025. Está ${periodo} longe do Brasil e precisa de uma UTI aérea fretada — única forma viável de retorno — pra voltar pra casa e continuar o tratamento perto da família.

Cada compartilhamento aproxima Rafael do Brasil. Conheça e ajude:
👉 ${SITE_URL}

#VoltaRafael`;

  const enc = encodeURIComponent(mensagem);
  const encUrl = encodeURIComponent(SITE_URL);

  // Card "Compartilhe a missão" no index — textarea + 4 botões
  const textarea = document.getElementById('shareTexto');
  const wa = document.getElementById('shareWhatsApp');
  const tw = document.getElementById('shareTwitter');
  const fb = document.getElementById('shareFacebook');
  const cp = document.getElementById('shareCopiar');

  if (textarea) textarea.value = mensagem;
  if (wa) wa.href = `https://api.whatsapp.com/send?text=${enc}`;
  if (tw) tw.href = `https://twitter.com/intent/tweet?text=${enc}`;
  if (fb) fb.href = `https://www.facebook.com/sharer/sharer.php?u=${encUrl}&quote=${enc}`;

  if (cp) {
    cp.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(mensagem);
        document.getElementById('successMessage').innerText = 'Mensagem copiada com sucesso!';
        toast.show();
      } catch (e) {
        console.error('Erro ao copiar:', e);
      }
    });
  }

  // Sticky CTA mobile — atualiza qualquer .btn-share das 3 páginas pra usar a mensagem nova
  document.querySelectorAll('a.btn-share').forEach(a => {
    a.href = `https://api.whatsapp.com/send?text=${enc}`;
  });
})();

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

const PIX_BR_CODE = '00020126400014br.gov.bcb.pix0111430716353200203Pix5204000053039865802BR5923RAFAEL BRITO DOS SANTOS6009FORTALEZA62150511VoltaRafael6304297F';

async function copyPixCode() {
  try {
    await navigator.clipboard.writeText(PIX_BR_CODE);
    document.getElementById('successMessage').innerText = 'Código Pix copiado com sucesso!';
    toast.show();
  } catch (error) {
    console.error('Erro ao copiar código Pix: ', error);
  }
}

// CTA principal: copia o BR Code e mostra instrução clara — não redireciona
async function doarAgora() {
  try {
    await navigator.clipboard.writeText(PIX_BR_CODE);
    document.getElementById('successMessage').innerText = 'Código PIX copiado! Cole no app do seu banco';
    toast.show();
  } catch (err) {
    console.error('Erro ao copiar (doarAgora):', err);
    window.location.href = 'pix.html#ajuda';
  }
}