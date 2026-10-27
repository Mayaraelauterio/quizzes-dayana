/* ==========================================================================
   PÁGINA DE OBRIGADO — motor simples (lê a configuração de assets/js/config.js)
   ========================================================================== */
(function () {
  'use strict';
  var C = window.CONFIG || {};
  var PH = !!C.MOSTRAR_ESPACOS_RESERVADOS;

  /* Vídeo de boas-vindas: YouTube/Vimeo (publicado) > arquivo local (pré-visualização) > aviso */
  var $ph = document.getElementById('video-ph');
  var $iframe = document.getElementById('video-iframe');
  var $local = document.getElementById('video-local');
  if (C.VIDEO_EMBED_URL) {
    $iframe.src = C.VIDEO_EMBED_URL;
    $iframe.hidden = false;
    $ph.hidden = true;
  } else if (C.VIDEO_LOCAL_SRC) {
    $local.src = C.VIDEO_LOCAL_SRC;
    $local.hidden = false;
    $ph.hidden = true;
  } else if (!PH) {
    document.getElementById('video-wrap').hidden = true;
  }

  /* Como você recebe: texto configurado, ou uma frase neutra (sem prometer prazo) */
  document.getElementById('como-recebe-txt').textContent = C.COMO_RECEBE ||
    'Em instantes você recebe um e-mail com as instruções de acesso. Se não encontrar, confira também a caixa de spam ou promoções.';

  /* Botão de acesso: só aparece se houver um link configurado */
  if (C.ACESSO_URL) {
    var $wrap = document.getElementById('acesso-btn-wrap');
    var $btn = document.getElementById('acesso-btn');
    $btn.href = C.ACESSO_URL;
    $btn.textContent = C.ACESSO_BOTAO_TEXTO || 'Acessar agora';
    $wrap.hidden = false;
  }
})();
