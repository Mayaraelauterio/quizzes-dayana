/* ==========================================================================
   Página de vendas avulsa "Os 7 Códigos da Aprovação" (11/11/2026).
   Sem motor de quiz: só a página de vendas, com as informações já aprovadas
   do quiz 1 (data.js) — textos copiados à mão, sem personalização por lead.
   ========================================================================== */
(function () {
  'use strict';

  var C = window.CONFIG || {};
  var params = new URLSearchParams(location.search);

  var AULAS_DESC = [
    { tit: 'Aula 1 · PRÁTICA', txt: 'Como transformar conteúdo em treino, para a prova encontrar o que você estudou' },
    { tit: 'Aula 2 · POSICIONAMENTO', txt: 'Como parar de escolher o cargo pelo medo e se colocar onde o seu sonho pode acontecer' },
    { tit: 'Aula 3 · PERSEVERANÇA', txt: 'O que fazer no dia seguinte à reprovação, e por que a aprovação vem depois da provação' },
    { tit: 'Aula 4 · NÃO DUVIDAR', txt: 'Como escolher a rota e o material, e parar de voltar para a linha de partida' },
    { tit: 'Aula 5 · GESTAR', txt: 'Como atravessar o tempo em que o resultado ainda é invisível, sem que a ansiedade decida por você' },
    { tit: 'Aula 6 · CRIAR RAIZ', txt: 'Foco, renúncia e a solidão do concurso vista como raiz, não como abandono' },
    { tit: 'Aula 7 · SEMEAR', txt: 'A semente mínima: constância para quem trabalha, tem família e dias ruins' },
    { tit: 'Aula 8 · BÔNUS · Aprovado diante de Deus', txt: 'Aprovação além do cargo: dokimos, a palavra de Esdras sobre levantar juízes e como colocar a fé na sua preparação. Para quem quiser ir mais fundo: os 7 códigos funcionam com ou sem ela.' }
  ];

  /* ------------------------------ AULAS: toggle de descrição ------------------------------ */
  var $aulas = document.getElementById('aulas-circ');
  var $desc = document.getElementById('aula-desc');
  function mostrarAula(k) {
    var a = AULAS_DESC[k];
    if (!a || !$desc) return;
    $desc.innerHTML = '<div class="aula-desc-in"><div class="aula-desc-top"><b>' + a.tit + '</b></div><p>' + a.txt + '</p></div>';
  }
  if ($aulas) {
    $aulas.addEventListener('click', function (e) {
      var b = e.target.closest('.aula-circ');
      if (!b) return;
      $aulas.querySelectorAll('.aula-circ').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      mostrarAula(+b.dataset.aula);
    });
    mostrarAula(0);
  }

  /* ------------------------------ PREÇO ------------------------------ */
  var $preco = document.getElementById('preco-final');
  var $precoTopo = document.getElementById('preco-final-topo');
  var $parcelas = document.getElementById('parcelas-txt');
  if (C.PRECO) {
    if ($preco) $preco.textContent = C.PRECO;
    if ($precoTopo) $precoTopo.textContent = C.PRECO;
    if (C.PARCELAS_TEXTO && $parcelas) { $parcelas.textContent = C.PARCELAS_TEXTO; $parcelas.hidden = false; }
  }

  /* ------------------------------ CHECKOUT ------------------------------ */
  function urlCheckout(origem) {
    if (!C.CHECKOUT_URL) return '';
    try {
      var u = new URL(C.CHECKOUT_URL);
      params.forEach(function (v, k) {
        if (/^utm_/i.test(k) || ['fbclid', 'gclid', 'src', 'sck', 'xcod'].indexOf(k.toLowerCase()) >= 0) u.searchParams.set(k, v);
      });
      u.searchParams.set('src', 'pagina-vendas-aprovacao');
      if (window.fyads && typeof window.fyads.link === 'function') return window.fyads.link(u.toString());
      u.searchParams.set('sck', 'pagina-vendas-' + origem);
      return u.toString();
    } catch (e) { return C.CHECKOUT_URL; }
  }
  var $aviso = document.getElementById('aviso-checkout');
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-checkout]');
    if (!b) return;
    var u = urlCheckout(b.dataset.checkout);
    if (u) { window.location.href = u; return; }
    if ($aviso) { $aviso.hidden = false; clearTimeout(window.__avisoT); window.__avisoT = setTimeout(function () { $aviso.hidden = true; }, 4000); }
  });

  /* ------------------------------ CTA FIXO (some depois de rolar a capa) ------------------------------ */
  var $ctaFixo = document.getElementById('cta-fixo');
  var $capa = document.querySelector('.capa');
  if ($ctaFixo && $capa && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (ents) { $ctaFixo.hidden = ents[0].isIntersecting; }, { rootMargin: '-10% 0px 0px 0px' }).observe($capa);
  } else if ($ctaFixo) { $ctaFixo.hidden = false; }

  /* ------------------------------ 29 VAGAS / 17 POSSE ------------------------------ */
  var $assentos = document.getElementById('assentos');
  if ($assentos && typeof icone === 'function') {
    var h = '';
    for (var k = 0; k < 29; k++) h += '<i class="assento' + (k < 17 ? ' posse' : '') + '" style="--d:' + (k * 55) + 'ms">' + icone('pessoa') + '</i>';
    $assentos.innerHTML = h;
  }
  var $impacto = document.getElementById('impacto');
  if ($impacto && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (ents) { if (ents[0].isIntersecting) { $impacto.classList.add('ver'); io.disconnect(); } }, { threshold: .35 });
    io.observe($impacto);
  } else if ($impacto) { $impacto.classList.add('ver'); }
})();
