/* ==========================================================================
   AS 7 COLUNAS — motor do quiz (base: motor do Quiz 1, adaptado)
   Conteúdo em data.js · Configuração em config.js
   QA: ?qa=1 mostra painel com pontuação · ?reset=1 limpa a sessão · ?tela=P20 pula para uma tela
   ========================================================================== */
(function () {
  'use strict';

  var C = window.CONFIG || {};
  var KEY = 'dm_7colunas_v1';
  var REGRA_VERSAO = 'v1-hipotese';
  var params = new URLSearchParams(location.search);
  var QA = params.get('qa') === '1';
  var PH = !!C.MOSTRAR_ESPACOS_RESERVADOS;

  if (params.get('reset') === '1') { try { sessionStorage.removeItem(KEY); } catch (e) {} }

  var $app = document.getElementById('app');
  var $bar = document.getElementById('progresso');
  var $voltar = document.getElementById('voltar');
  var $ctaFixo = document.getElementById('cta-fixo');

  /* ------------------------------ ESTADO ------------------------------ */
  function novaSessao() {
    var utms = {};
    params.forEach(function (v, k) {
      if (/^utm_/i.test(k) || ['fbclid', 'gclid', 'src', 'sck', 'xcod'].indexOf(k.toLowerCase()) >= 0) utms[k] = v;
    });
    return {
      sid: 'q_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8),
      inicio: new Date().toISOString(),
      url: location.href, ref: document.referrer || '',
      utms: utms, pos: 0, pilha: [], A: {}, lead: null,
      leadEnviado: false, leadPendente: false, vistas: {}, diagVisto: false, comecou: false
    };
  }
  function carregar() { try { var r = sessionStorage.getItem(KEY); return r ? JSON.parse(r) : null; } catch (e) { return null; } }
  function salvar() { try { sessionStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  var S = carregar() || novaSessao();
  var A = S.A;

  /* ------------------------------ UTIL ------------------------------ */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function ehMulher() { return true; } /* quiz só para mulheres */
  function idxDe(id) { for (var i = 0; i < TELAS.length; i++) if (TELAS[i].id === id) return i; return -1; }
  function visivel(t) { return !t.show || !!t.show(A); }
  function unir(lista) {
    if (lista.length <= 1) return lista.join('');
    return lista.slice(0, -1).join(', ') + ' e ' + lista[lista.length - 1];
  }

  var R = null; /* resultado calculado (cache) */

  function ctx() {
    var v = VALORES, x = {}, i;
    i = sel(A, 'P1')[0]; x.idade = i != null ? v.idade[i] : '';
    i = sel(A, 'P3')[0];
    x.filhos = !mae(A) ? 'quem você ama' : (i == null || i === 0 ? 'o seu filho' : 'os seus filhos');
    x.mesa_com = casada(A) ? (mae(A) ? 'o seu marido e ' + x.filhos : 'o seu marido ou quem você ama')
                           : (mae(A) ? x.filhos + ' ou quem você ama' : 'quem você ama');
    i = sel(A, 'P7')[0]; x.palavra = i != null ? v.palavra[i] : '';
    i = sel(A, 'P20')[0]; x.folga = i != null ? v.folga[i] : '';
    i = sel(A, 'P25')[0]; x.desejo_familia = i != null ? v.desejo_familia[i] : '';
    i = sel(A, 'P28')[0]; x.falta = i != null ? v.falta[i] : '';
    i = sel(A, 'P6')[0]; x.biblia_frase = i != null ? v.biblia_frase[i] : '';
    x.nome = S.lead && S.lead.nome ? esc(S.lead.nome) : '';
    x.como_recebe = esc(C.COMO_RECEBE || '');
    if (R) {
      x.FORTE = COLUNAS[R.forte].nome;
      x.FRAGIL = COLUNAS[R.fragil].nome;
      x.n_aula_fragil = COLUNAS[R.fragil].aula;
    }
    return x;
  }

  function fill(str) {
    if (str == null) return '';
    var g = ehMulher();
    var s = String(str).replace(/\{([^{}|]*)\|([^{}|]*)\}/g, function (_, m, f) { return g ? f : m; });
    var c = ctx();
    return s.replace(/\{([a-zA-Z_]+)\}/g, function (m, k) { return c[k] != null ? c[k] : m; });
  }
  function textoOpcao(t, i) { return t.t === 'r' ? String(i) : fill(t.o[i].txt); }

  /* ------------------------------ TRACKING ------------------------------ */
  window.dataLayer = window.dataLayer || [];
  function track(ev, dados) {
    var d = Object.assign({ event: ev, session_id: S.sid }, dados || {});
    window.dataLayer.push(d);
    if (QA) console.log('[track]', ev, dados || '');
  }
  function fbq() { if (typeof window.fbq === 'function') window.fbq.apply(null, arguments); }
  if (C.META_PIXEL_ID) {
    /* Meta Pixel */
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0;
      t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', C.META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  /* ------------------------------ PONTUAÇÃO ------------------------------ */
  function pontos(t, a) {
    if (!a || !a.idx || !a.idx.length) return null;
    if (t.t === 'r') {
      var n = a.idx[0], pts = null;
      t.faixas.forEach(function (f) { if (n >= f[0] && n <= f[1]) pts = f[2]; });
      return pts;
    }
    if (t.score === 'contagem') {
      var ex = -1;
      t.o.forEach(function (o, i) { if (o.excl) ex = i; });
      if (a.idx.indexOf(ex) >= 0) return 3;
      var k = a.idx.length;
      return k === 1 ? 2 : k === 2 ? 1 : 0;
    }
    var p = t.o[a.idx[0]].p;
    return (p === null || p === undefined) ? null : p;
  }

  function calcular() {
    var tot = {}, max = {}, sc = {};
    ORDEM_CANONICA.forEach(function (c) { tot[c] = 0; max[c] = 0; });
    TELAS.forEach(function (t) {
      if (!t.cod || !visivel(t)) return;
      var p = pontos(t, A[t.id]);
      if (p === null) return;
      tot[t.cod] += p; max[t.cod] += 3;
    });
    ORDEM_CANONICA.forEach(function (c) { sc[c] = max[c] ? Math.round(tot[c] / max[c] * 100) : 50; });

    var todasDePe = ORDEM_CANONICA.every(function (c) { return sc[c] >= 70; });
    var todasAbaixo = ORDEM_CANONICA.every(function (c) { return sc[c] < 40; });
    var min = Math.min.apply(null, ORDEM_CANONICA.map(function (c) { return sc[c]; }));
    /* Todas de pé: o ponto de atenção é TRANSBORDO ("é tempo de transbordar") */
    var fragil = todasDePe ? 'transbordo' : DESEMPATE_FRAGIL.filter(function (c) { return sc[c] === min; })[0];
    /* A mais forte nunca é a mesma que a mais frágil */
    var restantes = DESEMPATE_FORTE.filter(function (c) { return c !== fragil; });
    var mx = Math.max.apply(null, restantes.map(function (c) { return sc[c]; }));
    var forte = restantes.filter(function (c) { return sc[c] === mx; })[0];

    R = { scores: sc, fragil: fragil, forte: forte, todasDePe: todasDePe, todasAbaixo: todasAbaixo };
    return R;
  }

  /* Respostas citadas literalmente. melhores = true pega as que mais pontuaram (coluna forte). */
  function evidencias(cod, limite, melhores) {
    var lista = [];
    TELAS.forEach(function (t, ordem) {
      if (t.cod !== cod || !visivel(t)) return;
      var a = A[t.id], p = pontos(t, a);
      if (p === null) return;
      if (!melhores && p >= 3) return;
      lista.push({ t: t, a: a, p: p, ordem: ordem });
    });
    lista.sort(function (x, y) { return (melhores ? y.p - x.p : x.p - y.p) || x.ordem - y.ordem; });
    return lista.slice(0, limite || 3).map(function (e) { return citar(e.t, e.a); });
  }
  function citar(t, a) {
    if (t.t === 'r') return 'Você deu nota ' + a.idx[0] + ' de 10 para o quanto vive o seu propósito';
    if (t.t === 'e') return 'Você respondeu “' + textoOpcao(t, a.idx[0]) + '” para: “' + fill(t.frase) + '”';
    if (t.t === 'm') return fill(t.rotulo) + ': ' + unir(a.idx.map(function (i) { return textoOpcao(t, i); }));
    return fill(t.rotulo) + ': “' + textoOpcao(t, a.idx[0]) + '”';
  }

  /* Lead score v1 (hipótese, para calibrar com dados): decisão (P30), idade (P1), dor no propósito (P21)
     e a trava "alguém que já passou" (P28). P6 (Bíblia) nunca entra: é dado sensível. */
  function leadScore() {
    var s = 0, sinais = [];
    function soma(id, pts, resp) { s += pts; sinais.push({ id: id, resposta: resp, pontos: pts }); }
    var i = sel(A, 'P30')[0]; if (i != null) soma('P30', [40, 30, 15, 0][i], textoOpcao(TELAS[idxDe('P30')], i));
    i = sel(A, 'P1')[0]; if (i != null) soma('P1', [5, 15, 25, 25][i], textoOpcao(TELAS[idxDe('P1')], i));
    i = sel(A, 'P21')[0]; if (i != null) soma('P21', i <= 5 ? 15 : i <= 8 ? 10 : 5, 'nota ' + i + ' de 10');
    if (is(A, 'P28', 2)) soma('P28', 10, 'Falta alguém que já passou por isso');
    sinais.sort(function (a, b) { return b.pontos - a.pontos; });
    var grade = s >= 70 ? 'A' : s >= 40 ? 'B' : 'C';
    if (is(A, 'P30', 3)) grade = 'C'; /* "Por enquanto, é só curiosidade" */
    var acoes = { A: 'Contato humano no WhatsApp e próxima oferta da Dayana', B: 'Automação de nutrição e remarketing', C: 'Só e-mail de nutrição, sem remarketing pago' };
    return { score: s, raw: s, max: 90, grade: grade,
             label: grade === 'A' ? 'Prioridade' : grade === 'B' ? 'Nutrir' : 'Frio',
             acao: acoes[grade], signals: sinais.slice(0, 3), version: REGRA_VERSAO };
  }

  /* ------------------------------ ENVIO DO LEAD ------------------------------ */
  function payload() {
    var r = R || calcular();
    var respostas = {};
    TELAS.forEach(function (t) {
      if (!A[t.id] || t.id === 'P6') return; /* P6 (relação com a Bíblia) nunca sai do navegador */
      if (!visivel(t)) return;
      respostas[t.id] = A[t.id].idx.map(function (i) { return textoOpcao(t, i); }).join(' | ');
    });
    return {
      session_id: S.sid, quiz: 'as-7-colunas', regra: REGRA_VERSAO,
      inicio: S.inicio, enviado_em: new Date().toISOString(),
      url: S.url, referrer: S.ref, utms: S.utms,
      lead: S.lead, respostas: respostas,
      colunas: r.scores, coluna_fragil: r.fragil, coluna_forte: r.forte,
      lead_score: leadScore()
    };
  }

  function enviarLead() {
    if (!C.WEBHOOK_URL || S.leadEnviado) return;
    var corpo = JSON.stringify(payload());
    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 8000);
    fetch(C.WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: corpo, keepalive: true, signal: ctrl ? ctrl.signal : undefined })
      .then(function (r) { clearTimeout(timer); if (!r.ok) throw new Error(r.status); S.leadEnviado = true; S.leadPendente = false; salvar(); })
      .catch(function () { clearTimeout(timer); S.leadPendente = true; salvar(); });
  }
  window.addEventListener('pagehide', function () {
    if (C.WEBHOOK_URL && S.lead && !S.leadEnviado && navigator.sendBeacon) {
      try { navigator.sendBeacon(C.WEBHOOK_URL, new Blob([JSON.stringify(payload())], { type: 'application/json' })); } catch (e) {}
    }
  });

  /* ------------------------------ IMAGENS ------------------------------ */
  function foto(img, cls) {
    if (!img) return '';
    return '<figure class="foto ' + (cls || '') + '"><img src="assets/img/' + esc(img.src) + '" alt="' + esc(img.alt) +
      '" data-ph="' + esc(img.ph) + '" data-arq="' + esc(img.src) + '" loading="lazy"></figure>';
  }
  document.addEventListener('error', function (e) {
    var el = e.target;
    if (!el || el.tagName !== 'IMG') return;
    if (el.closest('.cena-bg')) { document.body.classList.remove('cena-com-foto'); el.remove(); return; }
    if (el.dataset.card) { el.remove(); return; }
    var fig = el.closest('figure');
    if (!fig) return;
    if (PH && el.dataset.ph) {
      fig.classList.add('ph');
      fig.innerHTML = '<div class="ph-in"><span>FOTO</span><b>' + esc(el.dataset.ph) + '</b><small>assets/img/' + esc(el.dataset.arq) + '</small></div>';
    } else { fig.remove(); }
  }, true);

  /* ------------------------------ NAVEGAÇÃO ------------------------------ */
  function proximaVisivel(de) {
    for (var i = de + 1; i < TELAS.length; i++) if (visivel(TELAS[i])) return i;
    return TELAS.length - 1;
  }
  function avancar() {
    if (!S.comecou) { S.comecou = true; track('iniciou_quiz'); }
    S.pilha.push(S.pos);
    S.pos = proximaVisivel(S.pos);
    salvar();
    desenhar();
  }
  function voltar() {
    if (S.pilha.length) S.pos = S.pilha.pop();
    else {
      /* Sem histórico (ex.: aberto direto numa tela pelo ?tela=): volta para a tela visível anterior */
      var i = S.pos - 1;
      while (i > 0 && !visivel(TELAS[i])) i--;
      if (i < 0 || i === S.pos) return;
      S.pos = i;
    }
    salvar();
    desenhar();
  }
  $voltar.addEventListener('click', voltar);

  function progresso() {
    var vis = TELAS.filter(visivel);
    var t = TELAS[S.pos];
    var i = vis.indexOf(t);
    var pct = Math.max(2, Math.round((i + 1) / vis.length * 100));
    $bar.style.width = pct + '%';
    $bar.parentNode.setAttribute('aria-valuenow', pct);
  }

  var limpeza = null; /* função para cancelar timers da tela atual */

  /* Inserções fixas: o texto cabe inteiro na tela, sem rolar.
     A tela ocupa a altura visível; se o texto não couber, a letra e os espaços diminuem em até 4 passos.
     Só em telas muito baixas (abaixo de ~560 px) ainda pode sobrar rolagem, para nada ficar cortado. */
  var PASSOS_INS = ['ins-c1', 'ins-c2', 'ins-c3', 'ins-c4', 'ins-c5'];
  function ajustarInsercao() {
    PASSOS_INS.concat('ins-rola').forEach(function (c) { document.body.classList.remove(c); });
    var tela = $app.querySelector('.tela');
    if (!tela || !document.body.classList.contains('modo-cena')) return;
    var topo = document.querySelector('.topo');
    var livre = window.innerHeight - (topo ? topo.offsetHeight : 0) - parseFloat(getComputedStyle($app).paddingTop || 0);
    document.documentElement.style.setProperty('--ins-h', Math.floor(livre) + 'px');
    for (var i = 0; i < PASSOS_INS.length && tela.scrollHeight > livre + 1; i++) document.body.classList.add(PASSOS_INS[i]);
    document.body.classList.toggle('ins-rola', tela.scrollHeight > livre + 1);
  }
  /* Números que contam de 0 até o valor quando aparecem na tela (ex.: 29 vagas, 17 posses) */
  function contar(raiz) {
    var els = raiz.querySelectorAll('[data-conta]');
    if (!els.length || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
    function anima(el) {
      var alvo = +el.dataset.conta, t0 = null, dur = 1400;
      function passo(ts) {
        if (!t0) t0 = ts;
        var p = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(alvo * e);
        if (p < 1) requestAnimationFrame(passo);
      }
      el.textContent = '0';
      requestAnimationFrame(passo);
    }
    if (!('IntersectionObserver' in window)) { els.forEach(anima); return; }
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) { io.unobserve(en.target); anima(en.target); } });
    }, { threshold: .6 });
    els.forEach(function (el) { io.observe(el); });
  }
  var ajusteTimer = null;
  window.addEventListener('resize', function () { clearTimeout(ajusteTimer); ajusteTimer = setTimeout(ajustarInsercao, 120); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(ajustarInsercao);

  function desenhar() {
    if (limpeza) { limpeza(); limpeza = null; }
    var t = TELAS[S.pos];
    var h = '';
    switch (t.t) {
      case 'capa': h = telaCapa(t); break;
      case 'r': h = telaRegua(t); break;
      case 'q': case 'e': h = telaPergunta(t, false); break;
      case 'm': h = telaPergunta(t, true); break;
      case 'ins': h = telaInsercao(t); break;
      case 'antesdepois': h = telaAntesDepois(t); break;
      case 'prova': h = telaProva(t); break;
      case 'diag': h = telaDiag(t); break;
      case 'captura': h = telaCaptura(t); break;
      case 'resultado': h = telaResultado(); break;
    }
    $app.className = 'app tela-' + t.t;
    var cena = t.t === 'ins';
    var fundo = '';
    if (cena) {
      /* Foto em tela cheia com máscara escura. Sem a foto, fica o fundo escuro com o ícone do código. */
      fundo = '<div class="cena-bg' + (t.foco ? ' cena-foco' : '') + (t.retrato ? ' cena-retrato' : '') + '" aria-hidden="true"' + (t.foco ? ' style="--foco:' + esc(t.foco) + '"' : '') + '>' +
        '<span class="cena-marca">' + icone(t.icone || 'estrela') + '</span>' +
        (t.fundo ? '<img src="assets/img/' + esc(t.fundo) + '" alt="" data-card="1">' : '') + '<i class="cena-mascara"></i></div>';
    }
    $app.innerHTML = fundo + '<div class="tela">' + h + '</div>';
    document.body.classList.toggle('modo-resultado', t.t === 'resultado');
    document.body.classList.toggle('modo-cena', cena);
    document.body.classList.toggle('cena-com-foto', cena && !!t.fundo);
    document.body.classList.toggle('ins-retrato', cena && !!t.retrato);
    $voltar.hidden = S.pos === 0 || t.t === 'resultado';
    $ctaFixo.hidden = true;
    progresso();
    window.scrollTo(0, 0);
    ajustarInsercao();
    contar($app);
    ligar(t);
    var foco = $app.querySelector('[data-foco]');
    if (foco) { try { foco.focus({ preventScroll: true }); } catch (e) { foco.focus(); } }
    var n = TELAS.filter(visivel).indexOf(t) + 1;
    if (!S.vistas[t.id]) {
      S.vistas[t.id] = 1; salvar();
      track('s' + (n < 10 ? '0' : '') + n + '_' + t.id.toLowerCase(), { tela: t.id, tipo: t.t });
    }
    if (QA) painelQA();
  }

  /* ------------------------------ TELAS ------------------------------ */
  function numeroPergunta(t) {
    var n = 0;
    for (var i = 0; i < TELAS.length; i++) {
      var x = TELAS[i];
      if (!visivel(x) || ['capa', 'q', 'm', 'e', 'r'].indexOf(x.t) < 0) continue;
      n++;
      if (x === t) return n;
    }
    return 0;
  }
  function incentivo(t) {
    var n = numeroPergunta(t);
    if (n < 4 || n % 4 !== 0) return '';
    var m = MOTIVACAO[Math.min(n / 4 - 1, MOTIVACAO.length - 1)];
    return '<p class="incentivo inc-' + m.cor + '"><span class="inc-e" aria-hidden="true">' + m.e + '</span><span>' + fill(m.txt) + '</span></p>';
  }
  function cabecalhoPergunta(t) {
    var h = incentivo(t);
    h += '<h1 class="pergunta" tabindex="-1" data-foco>' + fill(t.q) + '</h1>';
    if (t.frase) h += '<blockquote class="frase">“' + fill(t.frase) + '”</blockquote>';
    if (t.sub) h += '<p class="sub">' + fill(t.sub) + '</p>';
    return h;
  }

  function telaCapa(t) {
    var h = '<section class="capa">';
    h += '<div class="autora"><img src="assets/img/dayana-avatar.jpg" alt="Dayana Martins" class="avatar" data-card="1">' +
      '<div><b>Dayana Martins</b><span>' + fill(t.selo) + '</span></div></div>';
    h += '<h1 class="hero" tabindex="-1" data-foco>' + fill(t.tit) + '</h1>';
    h += '<p class="hero-sub">' + fill(t.sub) + '</p>';
    h += '<p class="tempo">' + icone('relogio') + fill(t.tempo) + '</p>';
    h += '<h2 class="pergunta pergunta-capa">' + fill(t.q) + '</h2>';
    h += '<div class="cards cards-4">';
    t.o.forEach(function (o, i) {
      var on = is(A, t.id, i) ? ' on' : '';
      h += '<button type="button" class="card card-sm' + on + '" data-i="' + i + '" aria-pressed="' + (on ? 'true' : 'false') + '">' +
        '<span class="card-img"><span class="card-e" aria-hidden="true">' + o.e + '</span>' +
        '<img src="assets/img/' + o.img + '" alt="" data-card="1"></span>' +
        '<span class="card-t">' + o.txt + '</span></button>';
    });
    h += '</div></section>';
    return h;
  }

  /* Régua de 0 a 10 (P21) */
  function telaRegua(t) {
    var v = sel(A, t.id).length ? sel(A, t.id)[0] : t.inicial;
    var h = cabecalhoPergunta(t);
    h += '<div class="regua"><output class="regua-n" id="regua-n" for="regua">' + v + '</output>' +
      '<input type="range" id="regua" min="' + t.min + '" max="' + t.max + '" step="1" value="' + v + '" aria-label="' + esc(t.q) + '">' +
      '<div class="regua-esc" aria-hidden="true"><span>0</span><span>5</span><span>10</span></div></div>';
    return h + botaoFixo('Continuar');
  }

  function telaPergunta(t, multi) {
    var h = cabecalhoPergunta(t);
    if (multi) h += '<p class="sub sub-multi">Pode marcar mais de uma.</p>';
    if (t.layout === 'cards') {
      var g = ehMulher() ? 'm' : 'h';
      h += '<div class="cards cards-2">';
      t.o.forEach(function (o, i) {
        var on = is(A, t.id, i) ? ' on' : '';
        h += '<button type="button" class="card card-sm' + on + '" data-i="' + i + '" aria-pressed="' + (on ? 'true' : 'false') + '">' +
          '<span class="card-img"><span class="card-e" aria-hidden="true">' + o.e + '</span>' +
          '<img src="assets/img/' + o.img.replace('{g}', g) + '" alt="" data-card="1"></span>' +
          '<span class="card-t">' + fill(o.txt) + '</span></button>';
      });
      return h + '</div>';
    }
    h += '<div class="opcoes' + (multi ? ' multi' : '') + '" role="' + (multi ? 'group' : 'radiogroup') + '">';
    t.o.forEach(function (o, i) {
      if (o.show && !o.show(A)) return; /* alternativa condicional (ex.: "Meu casamento" só para casadas) */
      var on = is(A, t.id, i);
      h += '<button type="button" class="opt' + (on ? ' on' : '') + '" data-i="' + i + '" ' +
        (multi ? 'aria-pressed="' + on + '"' : 'role="radio" aria-checked="' + on + '"') + '>' +
        '<span class="e" aria-hidden="true">' + o.e + '</span><span class="t">' + fill(o.txt) + '</span>' +
        (multi ? '<span class="check" aria-hidden="true"></span>' : '') + '</button>';
    });
    h += '</div>';
    if (multi) h += botaoFixo('Continuar', !sel(A, t.id).length);
    return h;
  }

  function botaoFixo(txt, desab) {
    return '<div class="rodape-fixo"><button type="button" class="btn" id="segue"' + (desab ? ' disabled' : '') + '>' + fill(txt) + '</button></div>';
  }

  function fe_tecnica() { return false; } /* neste quiz os versículos aparecem sempre */

  function blocoVerso(v) {
    if (!v) return '';
    return '<blockquote class="verso"><span class="verso-aspas" aria-hidden="true">“</span><p>' + v.txt + '</p><cite>' + v.ref + '</cite></blockquote>';
  }

  function telaInsercao(t) {
    var h = '<div class="ins-topo">';
    if (t.icone) h += '<span class="ins-ic">' + icone(t.icone) + '</span>';
    if (t.selo) h += '<p class="selo">' + t.selo + '</p>';
    h += '</div>';
    if (t.img) h += foto(t.img, 'foto-ins');
    var tit = typeof t.tit === 'function' ? t.tit(A) : t.tit;
    h += '<h1 class="tit-ins" tabindex="-1" data-foco>' + fill(tit) + '</h1>';
    if (t.verso && !fe_tecnica()) h += blocoVerso(t.verso);
    if (t.passos) {
      h += '<ol class="passos">' + t.passos.map(function (p, i) {
        return '<li' + (i === t.passos.length - 1 ? ' class="fim"' : '') + '>' + (i === t.passos.length - 1 ? icone('coroa') : '') + p + '</li>';
      }).join('') + '</ol>';
    }
    h += '<ul class="pontos">';
    (t.pontos || []).forEach(function (p) {
      var v = typeof p === 'function' ? p(A) : p;
      if (!v) return;
      if (v.stat) {
        h += '<li class="stat"><div><b data-conta="' + v.stat.a + '">' + v.stat.a + '</b><span>' + v.stat.al + '</span></div><div><b data-conta="' + v.stat.b + '">' + v.stat.b + '</b><span>' + v.stat.bl + '</span></div></li>';
        return;
      }
      h += '<li class="ponto' + (v.destaque ? ' destaque' : '') + '"><span class="ponto-ic">' + icone(v.i) + '</span><p>' + fill(v.t) + '</p></li>';
    });
    h += '</ul>';
    /* Uma frase personalizada por inserção, no máximo: vale a primeira da lista que bater com as respostas */
    (t.extras || []).some(function (x) {
      if (!x.when(A)) return false;
      h += '<div class="pessoal"><span class="pessoal-tag">' + icone('pessoa') + 'Com base na sua resposta</span><p>' + fill(x.html) + '</p></div>';
      return true;
    });
    if (t.citacao) h += '<figure class="citacao"><blockquote>“' + t.citacao.txt + '”</blockquote><figcaption>' + t.citacao.autor + '</figcaption></figure>';
    if (t.caixa) h += '<div class="caixa caixa-ic">' + icone(t.caixa.i) + '<p>' + fill(t.caixa.t) + '</p></div>';
    var dep = depoDaInsercao(t);
    if (dep) h += dep;
    if (t.codigo) h += '<div class="codigo">' + icone('chave') + '<div><span>' + (t.codigoTit || 'A coluna') + '</span><p>' + t.codigo + '</p></div></div>';
    if (t.fecho) h += '<p class="fecho">' + fill(t.fecho) + '</p>';
    if (t.verso && fe_tecnica()) h += '<p class="verso-nota">“' + t.verso.txt + '” (' + t.verso.ref + ')</p>';
    h += botaoFixo(t.btn || 'Continuar');
    return h;
  }

  function telaAntesDepois(t) {
    var r = R || calcular();
    var h = '<h1 class="tit-ins" tabindex="-1" data-foco>' + t.tit + '</h1><p class="sub">' + t.sub + '</p><div class="ad">';
    ANTES_DEPOIS.forEach(function (l) {
      var meu = l.cod === r.fragil;
      h += '<div class="ad-linha' + (meu ? ' meu' : '') + '">' +
        '<div class="ad-top"><b>' + icone(ICONE_COLUNA[l.cod]) + COLUNAS[l.cod].nome + '</b>' + (meu ? '<span class="tag">A sua coluna</span>' : '') + '</div>' +
        '<p class="ad-quando">Quando ' + l.quando + '…</p>' +
        '<div class="ad-cols"><div class="ad-a"><small>Rachada</small>' + l.a + '</div><div class="ad-d"><small>De pé</small>' + l.d + '</div></div></div>';
    });
    h += '</div><div class="caixa">' + t.caixa + '</div>' + botaoFixo(t.btn);
    return h;
  }

  function depoimentosHTML(lista, n) {
    var h = '';
    if (lista.length) {
      lista.slice(0, n).forEach(function (d) {
        h += '<figure class="depo">' + (d.img ? '<img src="assets/img/' + esc(d.img) + '" alt="Depoimento de ' + esc(d.nome) + '" loading="lazy" data-ph="Print do depoimento" data-arq="' + esc(d.img) + '">' : '') +
          (d.txt ? '<blockquote>“' + esc(d.txt) + '”</blockquote>' : '') +
          '<figcaption>' + esc(d.nome) + (d.cargo ? ' · ' + esc(d.cargo) : '') + (d.ano ? ' · ' + esc(d.ano) : '') + '</figcaption></figure>';
      });
    } else if (PH) {
      for (var i = 1; i <= n; i++) h += '<div class="depo depo-ph"><span>DEPOIMENTO ' + i + '</span><b>Aguardando print autorizado</b><small>Adicionar em data.js → DEPOIMENTOS</small></div>';
    }
    return h;
  }
  /* Um depoimento por inserção, no contexto da resposta: pelo código da tela (depoCod) ou pela trava da P29 (depoTrava) */
  function depoDaInsercao(t) {
    if (!t.depoCod && t.depoTrava == null) return '';
    var d = null;
    DEPOIMENTOS.forEach(function (x) {
      if (d) return;
      if ((t.depoCod && x.codigo === t.depoCod) || (t.depoTrava != null && x.trava === t.depoTrava)) d = x;
    });
    if (!d) return '';
    return '<figure class="depo-ins">' + (d.txt ? '<blockquote>“' + esc(d.txt) + '”</blockquote>' : (d.img ? '<img src="assets/img/' + esc(d.img) + '" alt="Depoimento de ' + esc(d.nome) + '" loading="lazy">' : '')) +
      '<figcaption>' + esc(d.nome) + (d.cargo ? ' · ' + esc(d.cargo) : '') + (d.ano ? ' · ' + esc(d.ano) : '') + '</figcaption></figure>';
  }
  function depoimentosOrdenados() {
    var r = R || calcular();
    return DEPOIMENTOS.slice().sort(function (a, b) { return (b.codigo === r.fragil) - (a.codigo === r.fragil); });
  }

  function telaProva(t) {
    var h = '<h1 class="tit-ins" tabindex="-1" data-foco>' + t.tit + '</h1><p class="sub">' + t.sub + '</p>';
    h += '<div class="depos">' + depoimentosHTML(depoimentosOrdenados(), 3) + '</div>';
    return h + botaoFixo(t.btn);
  }

  function telaDiag() {
    /* Diagnóstico grátis antes da captura: a coluna forte, a que encobre e "de acordo com o que você respondeu".
       Ficam para depois do formulário: o mapa das 7 colunas e a primeira prática (o "plano"). */
    var r = calcular(), fr = COLUNAS[r.fragil], fo = COLUNAS[r.forte];
    var h = '<div class="diag-load" id="diag-load"' + (S.diagVisto ? ' hidden' : '') + '><div class="anel"></div><p>Olhando <b id="diag-cod">TEMPLO</b>…</p></div>';
    h += '<section class="diag" id="diag"' + (S.diagVisto ? '' : ' hidden') + '>';
    h += '<p class="selo">Seu diagnóstico</p>';
    if (r.todasDePe) {
      h += '<h1 class="tit-ins" tabindex="-1" data-foco>As suas 7 colunas estão de pé.</h1>';
      h += '<p class="diag-t2">Agora é tempo de transbordar. O seu ponto de atenção é <b>TRANSBORDO</b>.</p>';
    } else if (r.scores[r.forte] < 40) {
      h += '<h1 class="tit-ins" tabindex="-1" data-foco>A coluna mais perto de ficar de pé é <span class="ouro">' + fo.nome + '</span>.</h1>';
      h += '<p class="diag-t2">O que está encobrindo o seu propósito é a coluna <b>' + fr.nome + '</b>.</p>';
    } else if (r.forte === 'proposito') {
      h += '<h1 class="tit-ins" tabindex="-1" data-foco>O seu propósito já está claro para você.</h1>';
      h += '<p class="diag-t2">O que impede você de vivê-lo por inteiro é a coluna <b>' + fr.nome + '</b>.</p>';
    } else {
      h += '<h1 class="tit-ins" tabindex="-1" data-foco>O seu propósito já aparece na coluna <span class="ouro">' + fo.nome + '</span>.</h1>';
      h += '<p class="diag-t2">O que está encobrindo é a coluna <b>' + fr.nome + '</b>.</p>';
    }
    if (r.todasAbaixo) h += '<p class="diag-sub">Toda casa se edifica uma coluna de cada vez. Vamos começar por ' + fr.nome + '.</p>';
    var evF = evidencias(r.forte, 1, true), evR = evidencias(r.fragil, 2);
    var fraca = r.scores[r.forte] < 40;
    h += '<article class="dcard" style="--cor:' + COR_COLUNA[r.forte] + '"><span class="dcard-tag">' + icone(ICONE_COLUNA[r.forte]) + (fraca ? 'A mais perto de ficar de pé · ' : 'Onde o seu propósito já está · ') + fo.nome + '</span>' +
      '<p>' + (fraca ? 'Hoje, nenhuma das 7 colunas está de pé, e tudo bem: é por isso que você fez este teste. Entre elas, ' + fo.nome + ' é a que está mais perto.' : fo.forte) + '</p>' + (evF.length ? '<p class="dcard-cita">' + icone('check') + '<span>' + evF[0] + '</span></p>' : '') + '</article>';
    h += '<article class="dcard dcard-fragil" style="--cor:' + COR_COLUNA[r.fragil] + '"><span class="dcard-tag">' + icone(ICONE_COLUNA[r.fragil]) + 'O que está encobrindo · ' + fr.nome + '</span>' +
      '<p>' + fr.fragil(A) + '</p>' +
      (evR.length ? '<div class="recap"><p class="recap-tit">De acordo com o que você respondeu:</p><ul>' +
        evR.map(function (e) { return '<li>' + icone('check') + '<span>' + e + '</span></li>'; }).join('') + '</ul></div>' : '') + '</article>';
    h += '<p class="intersecao"><b>Como uma afeta a outra:</b> a sua força em ' + fo.nome + ' mostra que você já sabe ' + fo.saber + '. É isso que vai te ajudar a levantar ' + fr.nome + '.</p>';
    h += '<p class="diag-sub">Ainda falta desenhar o seu mapa completo: as 7 colunas e a sua primeira prática para os próximos 7 dias.</p>';
    h += '<ul class="cadeados">' + ORDEM_CANONICA.filter(function (c) { return c !== r.fragil && c !== r.forte; }).map(function (c) {
      return '<li>' + icone(ICONE_COLUNA[c]) + '<span>' + COLUNAS[c].nome + '</span><i class="cadeado" aria-label="bloqueado">🔒</i></li>';
    }).join('') + '</ul>';
    h += '<div class="caixa">A boa notícia: coluna não se compra pronta. Edifica-se, um dia de cada vez.</div>';
    h += '<p class="fecho">Para desenhar o seu mapa, só mais 3 perguntas.</p>';
    h += botaoFixo('Responder às últimas 3');
    h += '</section>';
    return h;
  }

  function telaCaptura(t) {
    var L = S.lead || {};
    var h = '<h1 class="tit-ins" tabindex="-1" data-foco>' + t.tit + '</h1><p class="sub">' + t.sub + '</p>';
    h += '<div class="proc" role="status" aria-live="polite"><div class="proc-top"><span id="proc-txt">' + t.passos[0][1] + '</span><b id="proc-pct">0%</b></div>' +
      '<div class="proc-bar"><i id="proc-bar"></i></div></div>';
    h += '<form class="form" id="form" novalidate>' +
      campo('nome', 'Seu primeiro nome', 'text', 'given-name', L.nome) +
      campo('email', 'Seu melhor e-mail', 'email', 'email', L.email) +
      campo('whatsapp', 'Seu WhatsApp (com DDD)', 'tel', 'tel', L.whatsapp) +
      '<p class="consent">Ao continuar, você concorda em receber conteúdos e ofertas da Dayana Martins por e-mail e WhatsApp. Você pode sair quando quiser.' +
      (C.POLITICA_URL ? ' <a href="' + esc(C.POLITICA_URL) + '" target="_blank" rel="noopener">Política de privacidade</a>' : (PH ? ' <span class="falta">[Política de privacidade: configurar]</span>' : '')) + '</p>' +
      '<button type="submit" class="btn" id="enviar" disabled>' + t.btn + '</button></form>';
    return h;
  }
  function campo(nome, rotulo, tipo, auto, val) {
    var extra = '';
    if (tipo === 'tel') { extra = ' inputmode="tel" placeholder="(62) 99999-9999" maxlength="16"'; val = VALIDA.mascara(val); }
    if (tipo === 'email') extra = ' inputmode="email" autocapitalize="none" spellcheck="false" placeholder="seuemail@gmail.com"';
    return '<label class="campo"><span>' + rotulo + '</span><input name="' + nome + '" type="' + tipo + '" autocomplete="' + auto + '"' +
      extra + ' value="' + esc(val || '') + '"><em class="erro" id="erro-' + nome + '"></em>' +
      (nome === 'email' ? '<button type="button" class="sugestao" id="sugestao-email" hidden></button>' : '') + '</label>';
  }

  /* ------------------------------ RESULTADO + PITCH ------------------------------ */
  function faixa(v) { return v < 40 ? ['Pedindo atenção', 'f-trav'] : v < 70 ? ['Em construção', 'f-inst'] : ['De pé', 'f-pe']; }

  /* O mapa: a fachada de uma casa com 7 colunas; cada coluna se enche de dourado até a pontuação */
  function templo(r) {
    return '<div class="templo" id="templo" role="img" aria-label="As 7 colunas da sua casa">' +
      '<div class="tp-frontao"><span>' + icone('casa') + '</span></div><div class="tp-viga"></div><div class="tp-colunas">' +
      ORDEM_CANONICA.map(function (c, k) {
        return '<div class="tp-col' + (c === r.fragil ? ' fragil' : '') + (c === r.forte ? ' forte' : '') + '" style="--cor:' + COR_COLUNA[c] + ';--d:' + (k * 160) + 'ms">' +
          '<span class="tp-cap"></span><span class="tp-fuste"><i data-h="' + r.scores[c] + '"></i></span><span class="tp-base"></span>' +
          '<b>' + icone(ICONE_COLUNA[c]) + '</b><small class="tp-num" data-n="' + r.scores[c] + '">0</small></div>';
      }).join('') + '</div><div class="tp-degraus"></div></div>';
  }

  function telaResultado() {
    var r = calcular();
    var fr = COLUNAS[r.fragil], fo = COLUNAS[r.forte];
    var fraca = r.scores[r.forte] < 40;
    var h = '';

    /* H1 — o mapa (colunas animadas) */
    h += '<section class="res-mapa">';
    h += '<p class="selo">Seu mapa está pronto</p>';
    h += '<h1 class="tit-res" tabindex="-1" data-foco>' + fill('{nome}, estas são as 7 colunas da sua casa') + '</h1>';
    h += templo(r);
    h += '<div class="barras">';
    ORDEM_CANONICA.forEach(function (c, k) {
      var v = r.scores[c], f = faixa(v), meu = c === r.fragil;
      h += '<div class="cb' + (meu ? ' meu' : '') + '" style="--cor:' + COR_COLUNA[c] + ';--d:' + (k * 160) + 'ms"><div class="cb-top"><b>' + icone(ICONE_COLUNA[c]) + COLUNAS[c].nome + '</b><span class="faixa ' + f[1] + '">' + f[0] + '</span><span class="num" data-n="' + v + '">0</span></div>' +
        '<div class="trilho"><i data-w="' + v + '"></i></div></div>';
    });
    h += '</div><p class="nota">Leitura do momento. Coluna não é rótulo: coluna se edifica.</p>';

    var evF = evidencias(r.forte, 1, true);
    h += '<div class="res-duo">';
    h += '<article class="card-res card-forte" style="--cor:' + COR_COLUNA[r.forte] + '"><span class="card-ic">' + icone(ICONE_COLUNA[r.forte]) + '</span><span class="tag tag-sutil">' + (fraca ? 'A mais perto de ficar de pé' : 'O seu propósito já está aqui') + '</span><h2>' + fo.nome + '</h2>' +
      '<p>' + (fraca ? 'Nenhuma coluna está de pé hoje, e tudo bem. ' + fo.nome + ' é a que está mais perto.' : fo.forte) + '</p>' +
      (evF.length ? '<p class="evid-linha">' + icone('check') + evF[0] + '</p>' : '') + '</article>';
    h += '<article class="card-res card-trav" style="--cor:' + COR_COLUNA[r.fragil] + '"><span class="card-ic">' + icone(ICONE_COLUNA[r.fragil]) + '</span><span class="tag">Comece por aqui</span>';
    h += '<h2>' + fr.nome + '</h2><p class="frase-cod">' + fr.frase + '</p><p>' + fr.fragil(A) + '</p>';
    h += '<div class="acao"><b>' + icone('calendario') + 'Sua prática dos próximos 7 dias</b><p>' + fr.pratica(A) + '</p></div></article>';
    h += '</div>';
    h += '<p class="ponte">' + icone('maos') + '<span>A sua força em <b>' + fo.nome + '</b> vai te ajudar a levantar <b>' + fr.nome + '</b>. E eu posso caminhar com você coluna por coluna.</span></p>';
    h += '</section>';

    /* Hoje × de pé */
    var adl = null;
    ANTES_DEPOIS.forEach(function (l) { if (l.cod === r.fragil) adl = l; });
    if (adl) {
      h += '<section class="sec ad-pitch"><p class="selo">Hoje × de pé</p><h2 class="tit-sec">Quando ' + adl.quando + '…</h2>' +
        '<div class="adp"><div class="adp-a"><small>Hoje</small><p>' + adl.a + '</p></div><span class="adp-seta" aria-hidden="true">→</span>' +
        '<div class="adp-d"><small>Com ' + fr.nome + ' de pé</small><p>' + adl.d + '</p></div></div>' +
        '<p class="rolar">↓ Veja o seu caminho completo ↓</p></section>';
    }

    /* H2 — carta curta + "conforme você respondeu" */
    h += '<section class="sec carta">';
    h += '<div class="carta-topo">' + foto({ src: 'dayana-retrato.jpg', alt: 'Dayana Martins', ph: 'Retrato da Dayana' }, 'foto-carta') +
      '<h2 class="tit-sec">' + fill('{nome}, o seu propósito não está perdido.') + '</h2></div>';
    h += '<p class="carta-linha">A minha Bíblia ficou 13 anos fechada. Quando eu abri, comecei a enxergar o que sempre esteve na minha frente.</p>';
    var conf = [];
    if (sel(A, 'P7').length) conf.push('Você descreveu este momento como <b>“{palavra}”</b>');
    if (sel(A, 'P20').length) conf.push('Na folga, você sente <b>{folga}</b>');
    if (sel(A, 'P25').length) conf.push('Daqui a um ano, você quer ouvir: <b>{desejo_familia}</b>');
    if (sel(A, 'P28').length) conf.push('O que mais te trava hoje: <b>{falta}</b>');
    h += '<div class="conforme"><p class="conf-tit">Conforme você respondeu no quiz:</p><ul>' +
      conf.map(function (c) { return '<li>' + icone('check') + '<span>' + fill(c) + '</span></li>'; }).join('') + '</ul>' +
      '<p class="conf-verde">' + icone('check') + '<span>' + fill('O seu caminho começa pela coluna <b>{FRAGIL}</b>.') + '</span></p></div>';
    if (is(A, 'P30', 2)) h += '<p class="carta-linha">E você não precisa dar conta de tudo de uma vez: a gente levanta uma coluna de cada vez.</p>';
    h += '</section>';

    /* H3 — o mecanismo */
    h += '<section class="sec mecanismo"><p class="mec-intro">O meu jeito de viver o propósito</p>' +
      '<h2 class="mec-tit">Propósito não se encontra, se enxerga.</h2><div class="mec2">' +
      '<div><span class="mec-ic">' + icone('lampada') + '</span><b>1. Enxergar com a Palavra</b>' +
      '<p class="mec-v">“Lâmpada para os meus pés é a tua palavra.” <cite>Salmo 119:105</cite></p></div>' +
      '<div><span class="mec-ic">' + icone('coracao') + '</span><b>2. Viver com presença</b>' +
      '<p>Produtividade não é presença. Enxergar e continuar no automático não muda a casa.</p></div></div></section>';

    /* Requisitos em 3 ilustrações */
    h += '<section class="sec requisitos"><h2 class="tit-sec">Para viver o seu propósito por inteiro, você precisa de 3 coisas</h2><div class="req-tiles">' +
      '<div style="--cor:' + COR_COLUNA[r.forte] + '"><span>' + icone(ICONE_COLUNA[r.forte]) + '</span><b>' + (fraca ? 'Por onde começar' : 'Onde ele já está') + '</b><small>' + fo.nome + '</small></div>' +
      '<div style="--cor:' + COR_COLUNA[r.fragil] + '"><span>' + icone(ICONE_COLUNA[r.fragil]) + '</span><b>O que está encobrindo</b><small>' + fr.nome + '</small></div>' +
      '<div style="--cor:#6a5a9e"><span>' + icone('livro') + '</span><b>Uma lente para todo dia</b><small>A Palavra</small></div></div>' +
      '<p class="req-fim">Os três estão no caminho abaixo.</p></section>';

    var produto = secProduto(r) + '<div class="cta-meio">' + botaoCheckout('cta-plano') + '</div>', bonus = secBonus();
    h += is(A, 'P29', 1) ? bonus + produto : produto + bonus;

    /* H6 — autoridade */
    h += '<section class="sec autoridade"><h2 class="tit-sec">Quem está falando com você</h2>';
    h += foto({ src: 'dayana-biblia.jpg', alt: 'Dayana Martins com a Bíblia', ph: 'Foto da Dayana' }, 'foto-aut');
    h += '<div class="aut-grade">' + AUTORIDADE.map(function (a) {
      return '<div style="--cor:' + a.cor + '"><span class="aut-ic">' + icone(a.i) + '</span><span>' + a.t + '</span></div>';
    }).join('') + '</div></section>';

    /* Depoimentos: 3 lugares. Só aparecem com depoimentos reais (ou como espaço reservado no modo de teste). */
    if (DEPOIMENTOS.length || PH) {
      h += '<section class="sec depos-sec"><p class="selo">Depoimentos</p><h2 class="tit-sec">O que dizem as mulheres que caminham comigo</h2>' +
        '<div class="depos depos-3">' + depoimentosHTML(depoimentosOrdenados(), 3) + '</div>' + botaoCheckout('cta-depos') + '</section>';
    }

    /* H7 — para quem é */
    h += '<section class="sec quem"><h2 class="tit-sec">Para quem é</h2><div class="quem-cols">' +
      '<div class="quem-sim"><b>' + icone('check') + 'É para você</b><ul>' + PARA_QUEM_E.map(function (x) { return '<li>' + icone('check') + '<span>' + x + '</span></li>'; }).join('') + '</ul></div>' +
      '<div class="quem-nao"><b>' + icone('proibido') + 'Não é para você</b><ul>' + PARA_QUEM_NAO_E.map(function (x) { return '<li>' + icone('proibido') + '<span>' + x + '</span></li>'; }).join('') + '</ul></div></div></section>';

    /* H8 — oferta */
    var comValor = BONUS.every(function (b) { return b.valor; });
    h += '<section class="sec oferta" id="oferta"><div class="oferta-box"><p class="oferta-selo">Oferta do mapa</p><h2 class="tit-sec">Tudo o que você recebe hoje</h2><ul class="check">' +
      OFERTA_ITENS.map(function (x) {
        var b = x.b ? bonusPorId(x.b) : null;
        return '<li><span>' + x.t + '</span>' + (comValor && b ? '<s>' + reais(b.valor) + '</s>' : '') + '</li>';
      }).join('') + '</ul>' +
      (comValor ? '<p class="de">de <s>' + reais(totalBonus()) + '</s></p><p class="preco"><small>por</small> ' + esc(C.PRECO || 'R$ 47,00') + ' <small>à vista</small></p>'
                : '<p class="ancora">Só o livro, vendido separadamente, custa R$ 39,90. Aqui ele vem como bônus, junto com as 10 aulas e mais 4 materiais.</p>' +
                  '<p class="preco">' + esc(C.PRECO || 'R$ 47,00') + ' <small>à vista</small></p>') +
      (C.PARCELAS_TEXTO ? '<p class="parcelas">' + esc(C.PARCELAS_TEXTO) + '</p>' : '') +
      botaoCheckout('cta-oferta') +
      '<p class="seguro">' + icone('escudo') + 'Pagamento seguro · Garantia de 7 dias' + (C.ACESSO_TEXTO ? ' · ' + esc(C.ACESSO_TEXTO) : '') + '</p>' +
      (C.COMO_RECEBE ? '<p class="seguro">' + esc(C.COMO_RECEBE) + '</p>' : '') + '</div></section>';

    /* H9 — garantia */
    h += '<section class="sec garantia">' + brasaoSVG() + '<p class="gar-frase">Assista, conheça os bônus e decida. Se não for para você, peça o reembolso em até 7 dias e receba 100% do valor.</p></section>';

    /* H11 — fechamento */
    h += '<section class="sec fechamento"><div class="impacto impacto-casa" id="impacto">' + casaSVG() +
      '<p class="imp-pergunta">Três dias depois que eu deixei a magistratura, o meu filho me disse:</p>' +
      '<p class="imp-frase">Mamãe, até que enfim você chegou!</p>' +
      '<p class="imp-sub">Ele não disse “voltou”. Disse “chegou”.</p>' +
      '<p class="imp-ps">' + (mae(A) ? 'Eu quero que alguém na sua casa sinta isso também.' : 'Eu quero que você também chegue: na sua casa, na sua história, em você.') + '</p>' +
      '<p class="imp-assina">Dayana Martins</p></div>' + botaoCheckout('cta-final') + '</section>';

    h += rodape();
    return h;
  }

  function reais(v) { return 'R$ ' + v.toFixed(2).replace('.', ','); }
  function bonusPorId(id) { for (var i = 0; i < BONUS.length; i++) if (BONUS[i].id === id) return BONUS[i]; return null; }
  function totalBonus() { return BONUS.reduce(function (t, b) { return t + (b.valor || 0); }, 0); }

  /* Ilustração da frase final: a casa de 7 colunas, que se levantam quando o bloco aparece na tela */
  function casaSVG() {
    var cols = '';
    for (var i = 0; i < 7; i++) {
      var x = 28 + i * 22;
      cols += '<g class="cs-col" fill="' + COR_COLUNA[ORDEM_CANONICA[i]] + '" style="--d:' + (i * 120) + 'ms"><rect x="' + x + '" y="66" width="12" height="58" rx="1.5"/>' +
        '<rect x="' + (x - 2) + '" y="62" width="16" height="5" rx="1"/><rect x="' + (x - 2) + '" y="123" width="16" height="4" rx="1"/></g>';
    }
    return '<svg class="casa-svg" viewBox="0 0 200 150" aria-hidden="true">' +
      '<defs><linearGradient id="cOuro" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6f1fb"/><stop offset="1" stop-color="#b9add6"/></linearGradient>' +
      '<radialGradient id="cLuz" cx=".5" cy=".6" r=".5"><stop offset="0" stop-color="#e9e2f6" stop-opacity=".45"/><stop offset="1" stop-color="#e9e2f6" stop-opacity="0"/></radialGradient></defs>' +
      '<ellipse cx="100" cy="92" rx="96" ry="62" fill="url(#cLuz)"/>' +
      '<g fill="url(#cOuro)"><path d="M24 54 L100 18 L176 54 Z"/><rect x="22" y="54" width="156" height="7" rx="1.5"/>' + cols +
      '<rect x="18" y="128" width="164" height="6" rx="1.5"/><rect x="12" y="134" width="176" height="6" rx="1.5"/></g></svg>';
  }

  /* Brasão da garantia: roseta dourada, louros, "7 DIAS" e faixa "GARANTIA" (SVG gerado aqui) */
  function brasaoSVG() {
    var cx = 100, cy = 98, i, a, pts = [], folhas = '';
    for (i = 0; i < 72; i++) { a = Math.PI * 2 * i / 72; var rr = i % 2 ? 88 : 95; pts.push((cx + rr * Math.cos(a)).toFixed(1) + ',' + (cy + rr * Math.sin(a)).toFixed(1)); }
    [1, -1].forEach(function (lado) {
      for (i = 0; i < 9; i++) {
        var th = (122 + i * 13) * Math.PI / 180, deg = th * 180 / Math.PI + 90;
        [[64, -32], [56, 32]].forEach(function (f) {
          var x = cx + f[0] * Math.cos(th), y = cy + f[0] * Math.sin(th), rot = deg + f[1];
          if (lado < 0) { x = 2 * cx - x; rot = 180 - rot; }
          folhas += '<ellipse cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" rx="7" ry="2.8" transform="rotate(' + rot.toFixed(1) + ' ' + x.toFixed(1) + ' ' + y.toFixed(1) + ')"/>';
        });
      }
    });
    function estrela(x, y, r) {
      var p = [];
      for (var k = 0; k < 10; k++) { var an = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? r * .45 : r; p.push((x + rr * Math.cos(an)).toFixed(1) + ',' + (y + rr * Math.sin(an)).toFixed(1)); }
      return '<polygon points="' + p.join(' ') + '"/>';
    }
    return '<svg class="brasao" viewBox="0 0 200 200" role="img" aria-label="Garantia de 7 dias">' +
      '<defs><linearGradient id="bOuro" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6dde5"/><stop offset=".5" stop-color="#c98196"/><stop offset="1" stop-color="#86506a"/></linearGradient>' +
      '<radialGradient id="bFundo" cx=".5" cy=".4" r=".7"><stop offset="0" stop-color="#4a2e50"/><stop offset="1" stop-color="#2b1a30"/></radialGradient></defs>' +
      '<polygon points="' + pts.join(' ') + '" fill="url(#bOuro)"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="82" fill="url(#bFundo)" stroke="#f6dde5" stroke-width="2"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="75" fill="none" stroke="url(#bOuro)" stroke-width="1" stroke-dasharray="2 3"/>' +
      '<g fill="url(#bOuro)">' + folhas + estrela(84, 52, 5) + estrela(100, 47, 6.5) + estrela(116, 52, 5) + '</g>' +
      '<text x="100" y="122" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-weight="700" font-size="76" fill="url(#bOuro)">7</text>' +
      '<text x="100" y="140" text-anchor="middle" font-family="Montserrat, sans-serif" font-weight="700" font-size="12" letter-spacing="5" fill="#f6dde5">DIAS</text>' +
      '<path d="M8 150 L30 150 L30 182 L8 182 L18 166 Z M192 150 L170 150 L170 182 L192 182 L182 166 Z" fill="#86506a"/>' +
      '<path d="M24 146 H176 V176 H24 Z" fill="url(#bOuro)"/>' +
      '<text x="100" y="166" text-anchor="middle" font-family="Montserrat, sans-serif" font-weight="800" font-size="13" letter-spacing="4" fill="#2b1a30">GARANTIA</text>' +
      '</svg>';
  }

  function secProduto(r) {
    var ini = 0;
    AULAS.forEach(function (a, k) { if (a.cod === r.fragil) ini = k; });
    var h = '<section class="sec produto"><p class="selo">As aulas</p><h2 class="tit-sec">As 7 Colunas</h2>';
    h += '<p class="lead"><b>10 aulas comigo</b> para enxergar e viver o propósito que já está na sua casa.</p>';
    h += '<div class="aulas-circ cinco">';
    AULAS.forEach(function (a, k) {
      var meu = a.cod === r.fragil;
      h += '<button type="button" class="aula-circ' + (meu ? ' meu' : '') + '" data-aula="' + k + '" aria-pressed="' + (k === ini) + '" style="--cor:' + (a.cod ? COR_COLUNA[a.cod] : '#3b2441') + '">' +
        '<span class="circ"><img src="assets/img/' + esc(a.img) + '" alt="" loading="lazy" data-card="1"><i class="circ-ic">' + icone(a.cod ? ICONE_COLUNA[a.cod] : a.ic) + '</i></span>' +
        '<b>Aula ' + a.n + '</b><small>' + (a.cod ? COLUNAS[a.cod].nome : a.curto) + '</small>' +
        (meu ? '<em class="circ-tag">Comece aqui</em>' : '') + '</button>';
    });
    h += '</div><p class="aulas-dica">Toque em uma aula para ver o que ela ensina.</p>';
    h += '<div class="aula-desc" id="aula-desc" aria-live="polite">' + descAula(ini) + '</div>';
    h += '</section>';
    /* O pitch é o plano: 3 etapas numeradas, a última é a da vitória */
    h += '<section class="sec plano"><p class="selo">O seu caminho</p><h2 class="tit-sec">O seu caminho em 3 etapas</h2><ol class="etapas">' +
      '<li style="--cor:' + COR_COLUNA[r.fragil] + '"><span class="et-n">1</span><div><b>' + fill('Levantar a coluna {FRAGIL}') + '</b><p>' + fill('Comece pelo <em>Mapa da Minha Nova Estação</em>, pela Aula {n_aula_fragil} e pela sua prática dos próximos 7 dias.') + '</p></div></li>' +
      '<li style="--cor:#6a5a9e"><span class="et-n">2</span><div><b>Enxergar com a Palavra todos os dias</b><p>A Aula 10 e o plano de leitura <em>A Palavra que Sustenta</em>: o fundamento de todas as colunas.</p></div></li>' +
      '<li class="fim" style="--cor:#4f7a64"><span class="et-n">' + icone('coroa') + '</span><div><b>Viver com presença, e transbordar</b><p>A Aula 9, o desafio <em>A Arte de Estar Presente</em> e a <em>Agenda da Mulher que Transborda</em>.</p></div></li></ol></section>';
    return h;
  }

  function descAula(k) {
    var a = AULAS[k], r = R || calcular(), meu = a.cod === r.fragil;
    return '<div class="aula-desc-in" style="--cor:' + (a.cod ? COR_COLUNA[a.cod] : '#3b2441') + '"><div class="aula-desc-top"><b>' + icone(a.cod ? ICONE_COLUNA[a.cod] : a.ic) + a.tit + '</b>' +
      (meu ? '<span class="tag">Comece por aqui</span>' : '') + '</div><p>' + a.txt + '</p></div>';
  }

  /* Bônus em cartões ilustrados, um por linha. Quem tem dificuldade com a Bíblia (P6) ou trava na Palavra (P28) vê o plano de leitura primeiro. */
  function secBonus() {
    var ordem = BONUS.slice();
    if (is(A, 'P6', 2) || is(A, 'P6', 3) || is(A, 'P28', 0)) { var b5 = ordem.pop(); ordem.unshift(b5); }
    var h = '<section class="sec bonus"><p class="selo">Presentes para você</p><h2 class="tit-sec">E você ainda recebe 5 bônus</h2><div class="bonus-grade">';
    ordem.forEach(function (b) {
      h += '<article class="bonus-tile" style="--cor:' + b.cor + '"><div class="bt-arte"><span class="bt-ic">' + icone(b.ic) + '</span></div>' +
        '<div class="bt-txt"><small class="bt-n">Bônus ' + b.id.slice(1) + (b.tag ? ' · ' + b.tag : '') + '</small><h3>' + (b.nome || b.tit) + '</h3><p>' + fill(b.txt) + '</p>' +
        (b.extra && b.extra.when(A) ? '<p class="pessoal-mini">' + fill(b.extra.html) + '</p>' : '') +
        '<p class="bt-preco">' + (b.valor ? '<s>' + reais(b.valor) + '</s>' : '') + '<b>incluso</b></p></div>' +
        (b.dias ? '<ol class="bt-dias">' + b.dias.map(function (d, k) { return '<li><b>Dia ' + (k + 1) + '</b><span>' + (typeof d === 'function' ? d(A) : d) + '</span></li>'; }).join('') + '</ol>' : '') +
        '</article>';
    });
    return h + '</div></section>';
  }

  function botaoCheckout(id, txt) {
    return '<button type="button" class="btn btn-cta" data-checkout="' + id + '">' + fill(txt || 'Quero levantar a minha coluna {FRAGIL}') + '</button>';
  }

  function rodape() {
    var partes = [];
    if (C.EMPRESA_RAZAO) partes.push(esc(C.EMPRESA_RAZAO));
    if (C.EMPRESA_CNPJ) partes.push('CNPJ ' + esc(C.EMPRESA_CNPJ));
    if (C.POLITICA_URL) partes.push('<a href="' + esc(C.POLITICA_URL) + '" target="_blank" rel="noopener">Política de privacidade</a>');
    if (C.TERMOS_URL) partes.push('<a href="' + esc(C.TERMOS_URL) + '" target="_blank" rel="noopener">Termos de uso</a>');
    if (!partes.length && PH) partes.push('<span class="falta">[Rodapé: razão social, CNPJ, política e termos → config.js]</span>');
    return '<footer class="rodape"><p class="aviso-legal">Este conteúdo é de formação e fé. Ele não substitui acompanhamento psicológico, médico ou pastoral.</p>' +
      partes.join(' · ') + '<p>© ' + new Date().getFullYear() + ' Dayana Martins</p></footer>';
  }

  function urlCheckout(origem) {
    if (!C.CHECKOUT_URL) return '';
    try {
      var u = new URL(C.CHECKOUT_URL);
      Object.keys(S.utms || {}).forEach(function (k) { if (!u.searchParams.has(k)) u.searchParams.set(k, S.utms[k]); });
      u.searchParams.set('src', 'quiz-7-colunas');
      if (R) u.searchParams.set('sck', 'coluna-' + R.fragil + '-' + origem);
      return u.toString();
    } catch (e) { return C.CHECKOUT_URL; }
  }

  /* ------------------------------ EVENTOS DAS TELAS ------------------------------ */
  function ligar(t) {
    var seg = document.getElementById('segue');

    if (t.t === 'capa' || t.t === 'q' || t.t === 'e') {
      $app.querySelectorAll('[data-i]').forEach(function (b) {
        b.addEventListener('click', function () {
          var i = +b.dataset.i;
          A[t.id] = { idx: [i] };
          $app.querySelectorAll('[data-i]').forEach(function (x) {
            var on = x === b;
            x.classList.toggle('on', on);
            if (x.hasAttribute('aria-checked')) x.setAttribute('aria-checked', on);
            if (x.hasAttribute('aria-pressed')) x.setAttribute('aria-pressed', on);
          });
          salvar();
          track('resposta', { tela: t.id, opcao: i });
          setTimeout(avancar, 300);
        });
      });
    }

    if (t.t === 'm') {
      var ex = -1;
      t.o.forEach(function (o, i) { if (o.excl) ex = i; });
      $app.querySelectorAll('[data-i]').forEach(function (b) {
        b.addEventListener('click', function () {
          var i = +b.dataset.i, atual = sel(A, t.id).slice();
          if (i === ex) atual = atual.indexOf(i) >= 0 ? [] : [i];
          else {
            atual = atual.filter(function (k) { return k !== ex; });
            var p = atual.indexOf(i);
            if (p >= 0) atual.splice(p, 1); else atual.push(i);
          }
          atual.sort(function (a, b) { return a - b; });
          A[t.id] = { idx: atual };
          if (!atual.length) delete A[t.id];
          $app.querySelectorAll('[data-i]').forEach(function (x) {
            var on = atual.indexOf(+x.dataset.i) >= 0;
            x.classList.toggle('on', on); x.setAttribute('aria-pressed', on);
          });
          seg.disabled = !atual.length;
          salvar();
        });
      });
      seg.addEventListener('click', function () { if (sel(A, t.id).length) { track('resposta', { tela: t.id, opcao: sel(A, t.id).join(',') }); avancar(); } });
    }

    if (t.t === 'r') {
      var $r = document.getElementById('regua'), $n = document.getElementById('regua-n');
      function pinta() { $n.textContent = $r.value; $r.style.setProperty('--p', ($r.value - t.min) / (t.max - t.min) * 100 + '%'); }
      $r.addEventListener('input', pinta); pinta();
      seg.addEventListener('click', function () {
        A[t.id] = { idx: [+$r.value] }; salvar();
        track('resposta', { tela: t.id, opcao: +$r.value });
        avancar();
      });
    }

    if (t.t === 'ins' || t.t === 'antesdepois' || t.t === 'prova') {
      if (seg) seg.addEventListener('click', avancar);
    }

    if (t.t === 'diag') {
      track('diagnostico_visto', { coluna: calcular().fragil });
      document.getElementById('segue').addEventListener('click', avancar);
      if (!S.diagVisto) {
        var nomes = ['TEMPLO', 'PROSPERIDADE', 'ALIANÇA', 'HERANÇA', 'IDENTIDADE', 'PROPÓSITO', 'TRANSBORDO'], k = 0;
        var $c = document.getElementById('diag-cod');
        var iv = setInterval(function () { k = (k + 1) % nomes.length; $c.textContent = nomes[k]; }, 400);
        var to = setTimeout(function () {
          clearInterval(iv);
          S.diagVisto = true; salvar();
          document.getElementById('diag-load').hidden = true;
          var d = document.getElementById('diag'); d.hidden = false;
          var f = d.querySelector('[data-foco]'); if (f) f.focus({ preventScroll: true });
        }, 3000);
        limpeza = function () { clearInterval(iv); clearTimeout(to); };
      }
    }

    if (t.t === 'captura') ligarCaptura(t);

    if (t.t === 'resultado') ligarResultado();
  }

  /* Captura: 13 s fixos, não lineares, com o formulário liberado o tempo todo */
  function ligarCaptura(t) {
    var KF = [[0, 0], [1200, 14], [2000, 14], [4400, 36], [5200, 36], [8400, 66], [9200, 66], [11600, 88], [12300, 88], [13000, 100]];
    var t0 = performance.now(), pronto = false, raf;
    var $txt = document.getElementById('proc-txt'), $pct = document.getElementById('proc-pct'), $b = document.getElementById('proc-bar');
    var $form = document.getElementById('form'), $env = document.getElementById('enviar');
    function ease(x) { return x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; }
    function pct(ms) {
      for (var i = 0; i < KF.length - 1; i++) {
        if (ms <= KF[i + 1][0]) { var a = KF[i], b = KF[i + 1]; return a[1] + (b[1] - a[1]) * ease((ms - a[0]) / (b[0] - a[0])); }
      }
      return 100;
    }
    function passo(p) { var l = t.passos[0][1]; t.passos.forEach(function (s) { if (p >= s[0]) l = s[1]; }); return l; }
    function quadro(now) {
      var p = Math.floor(pct(now - t0));
      $b.style.width = p + '%'; $pct.textContent = p + '%'; $txt.textContent = passo(p);
      if (p >= 100) { pronto = true; document.querySelector('.proc').classList.add('ok'); atualizar(); return; }
      raf = requestAnimationFrame(quadro);
    }
    raf = requestAnimationFrame(quadro);
    limpeza = function () { cancelAnimationFrame(raf); };

    var $email = $form.querySelector('[name=email]'), $tel = $form.querySelector('[name=whatsapp]'), $sug = document.getElementById('sugestao-email');
    function valores() {
      var f = new FormData($form);
      return { nome: (f.get('nome') || '').trim(), email: (f.get('email') || '').trim(), whatsapp: f.get('whatsapp') || '' };
    }
    function erros(v) {
      var e = {};
      if (v.nome.replace(/[^A-Za-zÀ-ÿ]/g, '').length < 2) e.nome = 'Diga-me como posso te chamar.';
      var em = VALIDA.email(v.email);
      if (em.erro) e.email = em.erro;
      var wa = VALIDA.whatsapp(v.whatsapp);
      if (wa.erro) e.whatsapp = wa.erro;
      /* sugestão de correção do domínio (ex.: gmial.com → gmail.com) */
      if (em.sugestao) { $sug.hidden = false; $sug.textContent = 'Você quis dizer ' + em.sugestao + '? Toque para corrigir'; $sug.dataset.valor = em.sugestao; }
      else { $sug.hidden = true; }
      return e;
    }
    $sug.addEventListener('click', function () {
      $email.value = $sug.dataset.valor; tocados.email = true;
      $email.dispatchEvent(new Event('input', { bubbles: true }));
    });
    $tel.addEventListener('input', function () { $tel.value = VALIDA.mascara($tel.value); });
    function atualizar() { $env.disabled = !(pronto && !Object.keys(erros(valores())).length); }
    var tocados = {};
    $form.addEventListener('input', function (ev) {
      if (ev.target.name) tocados[ev.target.name] = true;
      var e = erros(valores());
      ['nome', 'email', 'whatsapp'].forEach(function (k) { document.getElementById('erro-' + k).textContent = tocados[k] && e[k] ? e[k] : ''; });
      atualizar();
    });
    $form.addEventListener('focusout', function (ev) {
      if (!ev.target.name) return;
      tocados[ev.target.name] = true;
      var e = erros(valores());
      document.getElementById('erro-' + ev.target.name).textContent = e[ev.target.name] || '';
    });
    var primeiro = true;
    $form.addEventListener('focusin', function () { if (primeiro) { primeiro = false; track('form_inicio'); } });
    $form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var v = valores(), e = erros(v);
      ['nome', 'email', 'whatsapp'].forEach(function (k) { document.getElementById('erro-' + k).textContent = e[k] || ''; });
      if (Object.keys(e).length || !pronto) return;
      var nome = v.nome.split(/\s+/)[0];
      S.lead = { nome: nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase(), email: VALIDA.email(v.email).ok, whatsapp: VALIDA.whatsapp(v.whatsapp).ok, capturado_em: new Date().toISOString() };
      salvar();
      calcular();
      track('lead', { coluna: R.fragil });
      fbq('track', 'Lead', { content_name: 'Quiz As 7 Colunas' });
      enviarLead();
      avancar();
    });
    atualizar();
  }

  function ligarResultado() {
    track('resultado_visto', { coluna: R.fragil });
    if (S.leadPendente) enviarLead();
    $app.querySelectorAll('[data-checkout]').forEach(function (b) {
      b.addEventListener('click', function () { irCheckout(b.dataset.checkout); });
    });
    /* CTA fixo: sempre visível na página de vendas */
    $ctaFixo.innerHTML = '<div class="cta-in">' + botaoCheckout('cta-fixo', 'Quero levantar a minha coluna') + '</div>';
    $ctaFixo.querySelector('[data-checkout]').addEventListener('click', function () { irCheckout('cta-fixo'); });
    $ctaFixo.hidden = false;
    $app.querySelectorAll('[data-aula]').forEach(function (b) {
      b.addEventListener('click', function () {
        $app.querySelectorAll('[data-aula]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
        document.getElementById('aula-desc').innerHTML = descAula(+b.dataset.aula);
        track('aula_vista', { aula: +b.dataset.aula + 1 });
      });
    });
    var mapa = $app.querySelector('.res-mapa'), ioMapa = null, geracao = 0;
    function contaAte(el, alvo, atraso) {
      var g = geracao;
      setTimeout(function () {
        var t0 = null;
        function passo(ts) { if (g !== geracao) return; if (!t0) t0 = ts; var p = Math.min(1, (ts - t0) / 1300); el.textContent = Math.round(alvo * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(passo); }
        requestAnimationFrame(passo);
      }, atraso);
    }
    function sobe(on) {
      geracao++;
      $app.querySelectorAll('.tp-fuste i').forEach(function (i) { i.style.height = on ? Math.max(6, i.dataset.h) + '%' : '0%'; });
      $app.querySelectorAll('.trilho i').forEach(function (i) { i.style.width = on ? i.dataset.w + '%' : '0%'; });
      $app.querySelectorAll('.tp-num, .cb .num').forEach(function (el, k) {
        if (!on) { el.textContent = '0'; return; }
        contaAte(el, +el.dataset.n, (k % 7) * 160);
      });
    }
    if (mapa && 'IntersectionObserver' in window && !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) {
      ioMapa = new IntersectionObserver(function (ents) { sobe(ents[0].isIntersecting); }, { threshold: .25 });
      ioMapa.observe(mapa);
    } else sobe(true);
    var imp = document.getElementById('impacto'), io = null;
    if (imp && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(function (ents) { if (ents[0].isIntersecting) { imp.classList.add('ver'); io.disconnect(); } }, { threshold: .35 });
      io.observe(imp);
    } else if (imp) imp.classList.add('ver');
    limpeza = function () { if (io) io.disconnect(); if (ioMapa) ioMapa.disconnect(); $ctaFixo.hidden = true; };
  }

  function irCheckout(origem) {
    track('checkout_click', { origem: origem, coluna: R && R.fragil });
    fbq('track', 'InitiateCheckout', { value: 47, currency: 'BRL', content_name: 'As 7 Colunas' });
    var u = urlCheckout(origem);
    if (u) { window.location.href = u; return; }
    aviso('Checkout ainda não configurado (config.js → CHECKOUT_URL).');
  }

  function aviso(msg) {
    var d = document.createElement('div');
    d.className = 'aviso'; d.setAttribute('role', 'alert'); d.textContent = msg;
    document.body.appendChild(d);
    setTimeout(function () { d.remove(); }, 3500);
  }

  /* ------------------------------ QA ------------------------------ */
  function painelQA() {
    var r = calcular();
    var p = document.getElementById('qa') || document.body.appendChild(Object.assign(document.createElement('pre'), { id: 'qa' }));
    p.textContent = 'tela: ' + TELAS[S.pos].id + '\n' + ORDEM_CANONICA.map(function (c) { return COLUNAS[c].nome + ': ' + r.scores[c]; }).join('\n') +
      '\nfrágil: ' + r.fragil + ' · forte: ' + r.forte + '\nlead: ' + leadScore().score + ' (' + leadScore().grade + ')';
  }
  window.__quiz = { estado: function () { return S; }, calcular: calcular, payload: payload, ir: function (id) { var i = idxDe(id); if (i >= 0) { S.pos = i; desenhar(); } } };

  /* ------------------------------ INÍCIO ------------------------------ */
  var pular = params.get('tela');
  if (pular && idxDe(pular) >= 0) S.pos = idxDe(pular);
  if (TELAS[S.pos] && TELAS[S.pos].t === 'resultado' && !S.lead) S.pos = idxDe('CAPTURA');
  if (!TELAS[S.pos] || !visivel(TELAS[S.pos])) S.pos = 0;
  desenhar();
})();
