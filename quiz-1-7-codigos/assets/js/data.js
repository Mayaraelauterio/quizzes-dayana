/* ==========================================================================
   OS 7 CÓDIGOS DA APROVAÇÃO — conteúdo do quiz (Dayana Martins)
   Fonte dos textos: entregas/03-quiz-completo-copy.md (v1.1, 07/10/2026).
   Lógica e pontuação: entregas/03-quiz-completo.md.

   Convenções
   - {o|a}: concordância de gênero (G1). Homem → 1ª forma, Mulher → 2ª.
   - {variavel}: preenchida pelo app (ver ctx() em app.js).
   - p: pontos da alternativa no código da pergunta (0 a 3). p: null = neutra.
   - Nenhum número, depoimento ou valor sem fonte. Ver "Regras" no copy.
   ========================================================================== */

/* Ordem canônica (resultado e aulas) */
const ORDEM_CANONICA = ['pratica', 'seposiciona', 'persevera', 'naoduvida', 'gesta', 'criaraiz', 'semeia'];

/* Desempates [hipótese do blueprint] */
const DESEMPATE_TRAVADO = ['persevera', 'naoduvida', 'semeia', 'pratica', 'seposiciona', 'gesta', 'criaraiz'];
const DESEMPATE_FORTE = ORDEM_CANONICA;

const CODIGOS = {
  pratica: {
    nome: 'PRÁTICA', aula: 1,
    frase: 'Não basta saber. É preciso saber fazer.',
    travado: 'Você estuda, mas o estudo não vira treino. Muita aula, pouca questão; muito conteúdo novo, pouca revisão. A sensação é de progresso, mas na hora da prova o conteúdo não está lá.',
    forte: 'Você transforma conteúdo em treino. Questões e revisão já fazem parte da sua rotina.',
    acao: 'Ao terminar cada assunto, faça questões dele no mesmo dia e marque na agenda as próximas revisões.'
  },
  seposiciona: {
    nome: 'POSICIONAMENTO', aula: 2,
    frase: 'Coloque-se na posição em que aquilo que você deseja pode acontecer.',
    travado: 'Você ainda não se vê no lugar que deseja. Às vezes escolhe um cargo “possível”, às vezes deixa uma prova passar por achar que ainda não é a hora. A limitação não está na sua capacidade. Está em onde você se coloca.',
    forte: 'Você se coloca na posição: se inscreve, faz a prova, enfrenta a banca.',
    acao: 'Escreva o cargo que você realmente quer, sem diminuir. E se inscreva na próxima prova compatível, nem que seja como treino.'
  },
  persevera: {
    nome: 'PERSEVERANÇA', aula: 3,
    frase: 'Não pare durante a provação. A aprovação pode estar depois dela.',
    travado: 'A provação está pesando mais do que o propósito. Cada reprovação ou semana ruim abre a porta para a pergunta “será que é pra mim?”. E quem para no meio da provação não chega na aprovação.',
    forte: 'Você permanece. Já caiu e voltou.',
    acao: 'Decida hoje o que você faz no dia seguinte a uma prova ruim ou a uma semana perdida: qual assunto e qual hora. Decisão tomada antes da crise não depende do humor da crise.'
  },
  naoduvida: {
    nome: 'NÃO DUVIDAR', aula: 4,
    frase: 'Quem decidiu o destino não muda a rota a cada vento.',
    travado: 'Você está estudando com a mente dividida. Cada troca de curso, de material ou de concurso te devolve para o começo do edital e rouba a sua energia.',
    forte: 'Você decidiu a rota e mantém, mesmo quando aparece outra oportunidade.',
    acao: 'Escolha agora um concurso-alvo e um material-base. Escreva: “vou com eles até a prova oral”. Por 30 dias, nenhuma troca.'
  },
  gesta: {
    nome: 'GESTAR', aula: 5,
    frase: 'Não aborte o que ainda está sendo formado.',
    travado: 'A espera está te consumindo. Como o resultado ainda não aparece, a ansiedade diz que nada está acontecendo, e isso te faz duvidar do processo inteiro.',
    forte: 'Você entende que existe um tempo invisível e confia no processo.',
    acao: 'Troque a pergunta “quanto falta?” por “o que eu marquei hoje?”. Risque no edital cada assunto estudado e revisado. Ver o edital sendo riscado é ver a gestação acontecer.'
  },
  criaraiz: {
    nome: 'CRIAR RAIZ', aula: 6,
    frase: 'A profundidade que ninguém vê sustenta a altura que todos verão.',
    travado: 'O seu estudo está crescendo para cima sem criar raiz: muita interrupção, pouca profundidade, dificuldade de dizer não. O que cresce sem raiz não se sustenta até a prova.',
    forte: 'Você aceita a fase de profundidade e sabe dizer não.',
    acao: 'Nos próximos 7 dias, deixe o celular em outro cômodo durante a primeira hora de cada sessão de estudo.'
  },
  semeia: {
    nome: 'SEMEAR', aula: 7,
    frase: 'Você não controla o dia da colheita, mas controla o que planta todos os dias.',
    travado: 'A constância está falhando: alguns dias de muito estudo, outros de nada. E um dia perdido vira uma semana perdida.',
    forte: 'Você planta todos os dias, mesmo nos dias ruins.',
    acao: 'Defina a sua semente mínima: o mínimo que você estuda até no pior dia. Nos próximos 7 dias, não deixe que ela falhe.'
  }
};

/* Antes × depois (S44), na ordem do quiz */
const ANTES_DEPOIS = [
  { cod: 'pratica',     quando: 'você termina um assunto', a: 'Segue em frente e esquece', d: 'Faz questões e marca as revisões' },
  { cod: 'semeia',      quando: 'você perde um dia', a: 'Um dia vira uma semana', d: 'Retoma no dia seguinte' },
  { cod: 'criaraiz',    quando: 'você senta para estudar', a: 'O celular interrompe a cada 15 minutos', d: 'A primeira hora é só do edital' },
  { cod: 'naoduvida',   quando: 'sai outro edital', a: 'Troca o foco e recomeça', d: 'Segue na rota; no máximo, faz a prova como treino' },
  { cod: 'seposiciona', quando: 'abrem as inscrições', a: '“Ainda não é a hora”', d: 'Se inscreve e vai' },
  { cod: 'gesta',       quando: 'o resultado demora', a: '“Não estou saindo do lugar”', d: 'Olha o edital riscado e confia no processo' },
  { cod: 'persevera',   quando: 'uma prova dá errado', a: '“Será que é pra mim?”', d: 'Volta a estudar em poucos dias' }
];

/* Depoimentos de ex-alunos — AGUARDANDO prints autorizados.
   Formato: { img: 'depo-nome.webp', nome: 'Iniciais', cargo: 'Juiz(a) de Direito', ano: '2016', codigo: 'persevera', txt: 'texto literal do print' }
   Regra: texto literal, sem edição; não citar total de aprovados. */
const DEPOIMENTOS = [];

/* Frases de incentivo: aparecem acima da 4ª, 8ª, 12ª… pergunta (contando só as perguntas que a pessoa vê) */
const MOTIVACAO = [
  { e: '🌟', cor: 'ouro',    txt: 'Ótimo começo! Cada resposta deixa o seu mapa mais preciso.' },
  { e: '🚀', cor: 'verde',   txt: 'Continue assim. Agora vamos entrar nos 7 códigos da aprovação.' },
  { e: '🧭', cor: 'azul',    txt: 'Você já passou de um terço do teste. O seu mapa está tomando forma.' },
  { e: '🔥', cor: 'vinho',   txt: 'Você está quase na metade. Falta pouco para descobrir o que está travando a sua aprovação.' },
  { e: '💪', cor: 'preto',   txt: 'Você está indo muito bem. Já passou da metade do teste.' },
  { e: '🔓', cor: 'roxo',    txt: 'Você está quase descobrindo o que está te impedindo de viver a aprovação.' },
  { e: '🏁', cor: 'laranja', txt: 'Reta final: falta pouco para o seu resultado.' },
  { e: '🏆', cor: 'petroleo', txt: 'Quase lá: o seu mapa está praticamente pronto.' }
];

/* Helpers de condição (A = respostas) */
const sel = (A, id) => (A[id] ? A[id].idx : []);
const is = (A, id, i) => sel(A, id).includes(i);

/* --------------------------------------------------------------------------
   TELAS (ordem exata do fluxo)
   t: gender | q (única) | m (múltipla) | e (escala) | ins | antesdepois | prova | diag | captura | resultado
   -------------------------------------------------------------------------- */
const TELAS = [

  /* ---------- B. Abertura e genéricas ---------- */
  { id: 'G1', t: 'gender', hero: true,
    selo: 'Aprovada juíza aos 23 anos',
    tit: 'Descubra qual código da aprovação está travando você.',
    sub: 'Responda ao teste e receba o mapa dos seus 7 códigos, e veja qual código está travando sua aprovação.',
    tempo: 'Leva poucos minutos.',
    q: 'Você é homem ou mulher?',
    o: [ { txt: 'Homem',  e: '👨', img: 'genero-homem.jpg' },
         { txt: 'Mulher', e: '👩', img: 'genero-mulher.jpg' } ] },

  { id: 'G2', t: 'q', layout: 'cards', q: 'Qual a sua idade?',
    o: [ { txt: 'Até 24 anos',     e: '🌱', img: 'idade-{g}-1.jpg' },
         { txt: 'De 25 a 34 anos', e: '🔥', img: 'idade-{g}-2.jpg' },
         { txt: 'De 35 a 44 anos', e: '💪', img: 'idade-{g}-3.jpg' },
         { txt: '45 anos ou mais', e: '👑', img: 'idade-{g}-4.jpg' } ] },

  { id: 'P1', t: 'q', q: 'Para qual carreira você está se preparando?',
    o: [ { txt: 'Magistratura', e: '⚖️' }, { txt: 'Ministério Público', e: '🏛️' },
         { txt: 'Delegado de Polícia', e: '🛡️' }, { txt: 'Tribunais (analista ou técnico)', e: '📂' },
         { txt: 'OAB', e: '📜' }, { txt: 'Outra área', e: '🎯' } ] },

  { id: 'P2', t: 'q', q: 'Há quanto tempo você estuda para concurso?',
    o: [ { txt: 'Menos de 6 meses', e: '🌱' }, { txt: 'De 6 meses a 1 ano', e: '📘' },
         { txt: 'De 1 a 3 anos', e: '📚' }, { txt: 'De 3 a 5 anos', e: '⏳' },
         { txt: 'Mais de 5 anos', e: '🏔️' } ] },

  { id: 'P3', t: 'q', q: 'Hoje você trabalha e estuda ao mesmo tempo?',
    o: [ { txt: 'Sim, trabalho em tempo integral', e: '💼' },
         { txt: 'Sim, trabalho meio período', e: '🕐' },
         { txt: 'Não, hoje eu só estudo', e: '📖' } ] },

  { id: 'P4', t: 'q', q: 'Quantas provas para esse cargo você já fez?',
    o: [ { txt: 'Nenhuma ainda', e: '🚪' }, { txt: '1 ou 2', e: '✏️' },
         { txt: 'De 3 a 5', e: '📝' }, { txt: 'Mais de 5', e: '🗂️' } ] },

  { id: 'P5', t: 'q', q: 'Sendo realista: quantas horas por dia você consegue estudar?',
    o: [ { txt: 'Menos de 2 horas', e: '⏱️' }, { txt: 'De 2 a 4 horas', e: '🕑' },
         { txt: 'De 4 a 6 horas', e: '🕓' }, { txt: 'Mais de 6 horas', e: '🕕' } ] },


  /* 8ª pergunta: fé (última genérica; a skill pede nada sensível no começo). idx 2 = não cristão → versículos viram nota de rodapé (fe_tecnica em app.js). Nunca vai para o CRM. */
  { id: 'P6', t: 'q', q: 'Você é crist{ão|ã}?',
    sub: 'Não existe resposta certa. Isso só muda a forma como eu te mostro o resultado.',
    o: [ { txt: 'Sim, sou crist{ão|ã}', e: '🙏' },
         { txt: 'Não, mas tenho fé em Deus', e: '🕊️' },
         { txt: 'Não sou crist{ão|ã}', e: '🤝' } ] },

  { id: 'I1', t: 'ins', icone: 'balanca', fundo: 'dayana-toga.jpg', retrato: true, foco: '62% 6%',
    tit: A => is(A, 'P2', 4) ? 'Mais de 5 anos. Eu sei o peso disso. E quero te mostrar uma coisa.'
            : (is(A, 'P2', 0) || is(A, 'P2', 1)) ? 'Você está começando. Ótimo: dá para construir certo desde o início.'
            : 'Você estuda há {tempo}. Então você já sabe: não é falta de esforço.',
    pontos: [
      { i: 'balanca', t: 'Foram 20 anos dentro do Judiciário, de escrevente a juíza.' },
      { stat: { a: '29', al: 'vagas no edital do meu concurso', b: '17', bl: 'pessoas tomaram posse' } },
      { i: 'bandeira', t: 'Sobraram vagas. Quem ficou pelo caminho não sabia menos. <b>Parou antes.</b>' }
    ],
    caixa: { i: 'alvo', t: 'É isso que este teste mede: os 7 códigos de quem chega até o fim.' },
    btn: 'Quero descobrir os meus códigos' },

  /* ---------- C. Os 7 códigos ---------- */
  /* PRÁTICA */
  { id: 'P7', t: 'q', cod: 'pratica', rotulo: 'Na sua rotina',
    q: 'Na sua rotina de estudo, o que mais ocupa o seu tempo?',
    o: [ { txt: 'Assistir aulas', e: '🎥', p: 0 }, { txt: 'Ler material e lei seca', e: '📖', p: 1 },
         { txt: 'Resolver questões', e: '✍️', p: 3 }, { txt: 'Revisar o que já estudei', e: '🔁', p: 3 } ] },

  { id: 'P8', t: 'q', cod: 'pratica', rotulo: 'Quando termina um assunto',
    q: 'Quando você termina um assunto, o que acontece com ele?',
    o: [ { txt: 'Sigo para o próximo e não volto mais', e: '➡️', p: 0 },
         { txt: 'Volto nele quando lembro', e: '🤔', p: 1 },
         { txt: 'Faço questões dele no mesmo dia', e: '✍️', p: 2 },
         { txt: 'Reviso em datas que já deixei marcadas', e: '📅', p: 3 } ] },

  { id: 'P9', t: 'q', cod: 'pratica', rotulo: 'Sobre passar pelo edital',
    q: 'Quantas vezes você já passou pelo edital inteiro, estudando e revisando tudo?',
    sub: 'Se está começando agora, responda onde você está hoje.',
    o: [ { txt: 'Ainda não cheguei ao fim', e: '🚧', p: 0 }, { txt: 'Uma vez', e: '1️⃣', p: 1 },
         { txt: 'Duas ou três vezes', e: '🔂', p: 2 }, { txt: 'Mais de três vezes', e: '🏆', p: 3 } ] },

  { id: 'I2', t: 'ins', icone: 'lapis', fundo: 'cena-pratica.jpg', foco: '50% 32%', selo: '1º CÓDIGO · PRÁTICA',
    tit: 'O aprovado não apenas estuda. Ele pratica.',
    verso: { txt: 'Sejam praticantes da palavra, e não apenas ouvintes.', ref: 'Tiago 1:22' },
    pontos: [
      { i: 'play', t: 'Assistir aula dá sensação de progresso. Mas a prova cobra o que você <b>sabe fazer</b>.' },
      { i: 'repetir', t: 'Em uns 7 meses de estudo, eu revisei o edital <b>pelo menos 6 vezes</b>.' },
      { i: 'relogio', t: 'O segredo foi revisar no tempo certo, antes de esquecer. Isso tem nome: <b>Método 48, 7 e 30</b>.' }
    ],
    extras: [ { when: A => is(A, 'P8', 0), html: 'Você me disse que termina um assunto e não volta mais nele. É exatamente aí que o estudo escapa.' },
              { when: A => is(A, 'P9', 0), html: 'Você ainda não chegou ao fim do edital. Começar a revisar desde já é o que faz a primeira volta valer.' },
              { when: A => is(A, 'P9', 1), html: 'Você já passou uma vez pelo edital. Agora o que conta são as próximas voltas: eu cheguei a pelo menos 6.' },
              { when: A => is(A, 'P9', 2), html: 'Você já passou duas ou três vezes pelo edital. Você está no caminho: eu cheguei a pelo menos 6.' },
              { when: A => is(A, 'P9', 3), html: 'Você já passou mais de três vezes pelo edital. Isso é PRÁTICA de pé: agora é manter o ritmo até a prova.' } ],
    depoCod: 'pratica',
    codigo: 'Não basta saber. É preciso saber fazer.',
    btn: 'Próximo código' },

  /* SEMEAR */
  { id: 'P10', t: 'q', cod: 'semeia', rotulo: 'Nos últimos 30 dias',
    q: 'Nos últimos 30 dias, em quantos dias você estudou de verdade?',
    o: [ { txt: 'Menos de 10', e: '😔', p: 0 }, { txt: 'De 10 a 20', e: '😐', p: 1 },
         { txt: 'De 20 a 25', e: '🙂', p: 2 }, { txt: 'Quase todos', e: '🔥', p: 3 } ] },

  { id: 'P11', t: 'q', cod: 'semeia', rotulo: 'Quando perde um dia',
    q: 'O que acontece quando você perde um dia de estudo?',
    o: [ { txt: 'Retomo normalmente no dia seguinte', e: '💪', p: 3 },
         { txt: 'Tento compensar e acabo me sobrecarregando', e: '🏋️', p: 2 },
         { txt: 'Bate a culpa e eu acabo perdendo mais dias', e: '😞', p: 1 },
         { txt: 'Desanimo e a semana inteira vai embora', e: '😩', p: 0 } ] },

  { id: 'I3', t: 'ins', icone: 'broto', fundo: 'cena-semeia.jpg', foco: '50% 20%', selo: '2º CÓDIGO · SEMEAR',
    tit: 'O aprovado entende a lei da semeadura.',
    verso: { txt: 'O que o homem semear, isso também colherá.', ref: 'Gálatas 6:7' },
    pontos: [
      { i: 'pessoa', t: 'Meu pai ficou órfão de mãe aos 7 anos. Vendeu o carro velho, estudou com fome, à luz de vela, e passou para fiscal de rendas.' },
      { i: 'broto', t: 'Cada hora, cada questão, cada revisão é uma <b>semente</b>.' }
    ],
    extras: [ { when: A => is(A, 'P11', 2) || is(A, 'P11', 3), html: 'Perder um dia não destrói a colheita. O que destrói é deixar um dia virar uma semana.' },
              { when: A => is(A, 'P11', 1), html: 'Você tenta compensar e acaba se sobrecarregando. Retomar no ritmo normal já é semear.' },
              { when: A => is(A, 'P11', 0), html: 'Você retoma no dia seguinte. Isso é semear: a colheita vem da constância.' } ],
    depoCod: 'semeia',
    codigo: 'Você não controla o dia da colheita. Mas controla o que planta todos os dias.',
    btn: 'Próximo código' },

  /* CRIAR RAIZ */
  { id: 'P12', t: 'q', cod: 'criaraiz', rotulo: 'Até pegar o celular',
    q: 'Quando você senta para estudar, quanto tempo leva até pegar o celular?',
    o: [ { txt: 'Menos de 15 minutos', e: '📱', p: 0 }, { txt: 'Entre 15 e 30 minutos', e: '⏰', p: 1 },
         { txt: 'Uma hora ou mais', e: '⌛', p: 2 }, { txt: 'Deixo o celular longe de mim', e: '🔕', p: 3 } ] },

  { id: 'P13', t: 'q', cod: 'criaraiz', rotulo: 'Sobre os “nãos”',
    q: 'Como você lida com os “nãos” que a preparação exige?',
    sub: 'Festas, encontros, redes sociais…',
    o: [ { txt: 'Digo não em paz: sei por que estou fazendo isso', e: '🕊️', p: 3 },
         { txt: 'Digo não, mas me sinto só e de fora', e: '😶', p: 2 },
         { txt: 'Às vezes digo não, mas acabo cedendo', e: '🎉', p: 1 },
         { txt: 'Não consigo abrir mão', e: '🙈', p: 0 } ] },

  { id: 'P14', t: 'q', cod: 'criaraiz', rotulo: 'Quando o assunto fica difícil',
    q: 'Quando um assunto fica difícil, o que você faz?',
    o: [ { txt: 'Fico nele até entender', e: '🧐', p: 3 }, { txt: 'Leio rápido para não travar', e: '💨', p: 1 },
         { txt: 'Pulo e digo que volto depois', e: '⏭️', p: 1 }, { txt: 'Troco para uma matéria mais fácil', e: '🔀', p: 0 } ] },

  { id: 'I4', t: 'ins', icone: 'arvore', fundo: 'cena-raiz.jpg', foco: '50% 40%', selo: '3º CÓDIGO · CRIAR RAIZ',
    tit: 'Antes de crescer para cima, a semente cresce para baixo.',
    pontos: [
      { i: 'proibido', t: 'Menos festa, menos distração, menos disponibilidade. <b>Mais profundidade.</b>' },
      { i: 'casa', t: 'Herdei o quarto do meu irmão e fiz dele o meu quartel de guerra. Foi de lá que eu saí aprovada.' },
      A => ({ i: 'coracao', t: '<b>Se você se sente só agora, isso não é abandono. É raiz.</b>', destaque: is(A, 'P13', 1) })
    ],
    extras: [ { when: A => is(A, 'P12', 0), html: 'Você me disse que pega o celular em menos de 15 minutos. Raiz não cresce em um solo revirado a cada 15 minutos.' },
              { when: A => is(A, 'P12', 1), html: 'Você pega o celular entre 15 e 30 minutos depois de sentar. Proteger só a primeira hora já muda a profundidade do seu estudo.' },
              { when: A => is(A, 'P12', 2), html: 'Você aguenta uma hora ou mais sem o celular. É essa profundidade que sustenta a aprovação.' },
              { when: A => is(A, 'P12', 3), html: 'Você deixa o celular longe. Isso é raiz: a profundidade que ninguém vê.' } ],
    depoCod: 'criaraiz',
    codigo: 'A profundidade que ninguém vê sustenta a altura que todos verão.',
    btn: 'Próximo código' },

  /* NÃO DUVIDAR */
  { id: 'P15', t: 'm', cod: 'naoduvida', score: 'contagem', rotulo: 'Nos últimos 12 meses, você trocou de',
    q: 'Nos últimos 12 meses, você trocou de:',
    o: [ { txt: 'Cursinho', e: '🏫' }, { txt: 'Material', e: '📚' }, { txt: 'Cronograma', e: '🗓️' },
         { txt: 'Concurso que quero prestar', e: '🎯' }, { txt: 'Não troquei nada', e: '✅', excl: true } ] },

  { id: 'P16', t: 'q', cod: 'naoduvida', rotulo: 'Quando abre outro edital',
    q: 'Quando sai um edital diferente do seu, o que você faz?',
    o: [ { txt: 'Sigo no meu. No máximo, faço a prova como treino', e: '🧭', p: 3 },
         { txt: 'Fico tentad{o|a}, mas mantenho o foco', e: '😌', p: 2 },
         { txt: 'Mudo o foco por um tempo', e: '🔄', p: 1 },
         { txt: 'Começo a estudar para ele também', e: '🤹', p: 0 } ] },

  { id: 'I5', t: 'ins', icone: 'bussola', fundo: 'cena-rota.jpg', foco: '50% 40%', selo: '4º CÓDIGO · NÃO DUVIDAR',
    tit: 'Quem decidiu o destino não muda a rota a cada vento.',
    verso: { txt: 'Aquele que duvida é semelhante à onda do mar, levada e agitada pelo vento.', ref: 'Tiago 1:6' },
    pontos: [
      { i: 'embaralhar', t: 'Cada troca de curso, de material ou de concurso te devolve para o <b>começo do edital</b>.' },
      { i: 'livro', t: 'Para a aluna que vive querendo trocar de material, eu repito: o material que você começa agora vai com você até a prova oral.' },
      { i: 'ancora', t: 'Não é nunca sentir medo. É não deixar cada insegurança <b>mudar a sua direção</b>.' }
    ],
    extras: [ { when: A => trocasCount(A) >= 2, html: 'Você trocou de {lista_trocas} nos últimos 12 meses. Cada troca dessas te devolveu para a linha de partida.' },
              { when: A => is(A, 'P16', 0), html: 'Quando sai outro edital, você segue no seu. Isso é NÃO DUVIDAR: a rota decidida não muda com o vento.' },
              { when: A => is(A, 'P16', 1), html: 'Você fica tentad{o|a} com outro edital, mas mantém o foco. Sentir a tentação é normal: o que conta é não mudar a direção.' },
              { when: A => is(A, 'P16', 2), html: 'Quando sai outro edital, você muda o foco por um tempo. Cada desvio desses te devolve para o começo do seu edital.' },
              { when: A => is(A, 'P16', 3), html: 'Quando sai outro edital, você começa a estudar para ele também. Dividir a rota é o jeito mais rápido de não chegar a nenhuma.' } ],
    depoCod: 'naoduvida',
    btn: 'Próximo código' },

  /* POSICIONAMENTO */
  { id: 'P17', t: 'q', cod: 'seposiciona', rotulo: 'Sobre o cargo',
    q: 'Com toda a sinceridade: o cargo que você estuda é o que você realmente quer?',
    o: [ { txt: 'Sim, é o meu sonho', e: '⭐', p: 3 }, { txt: 'Ainda não decidi', e: '🤷', p: 1 },
         { txt: 'Escolhi um mais “possível” para mim', e: '🪜', p: 0 },
         { txt: 'Quero um maior, mas tenho vergonha de dizer', e: '🙊', p: 0 } ] },

  { id: 'P18', t: 'q', cod: 'seposiciona', rotulo: 'Sobre se inscrever',
    q: 'Você já deixou de fazer uma prova por achar que ainda não era a hora?',
    o: [ { txt: 'Nunca: eu me inscrevo e vou', e: '🙋', p: 3 }, { txt: 'Uma ou duas vezes', e: '😬', p: 2 },
         { txt: 'Várias vezes', e: '😓', p: 1 }, { txt: 'Ainda não saiu edital para o meu cargo', e: '📭', p: null } ] },

  { id: 'P19', t: 'e', cod: 'seposiciona',
    q: 'O quanto você concorda com esta frase?',
    frase: 'Concurso de alto nível é para quem é muito inteligente.',
    o: [ { txt: 'Concordo totalmente', e: '✅', p: 0 }, { txt: 'Concordo em parte', e: '🤏', p: 1 },
         { txt: 'Não tenho certeza', e: '🤔', p: 2 }, { txt: 'Discordo', e: '❌', p: 3 } ] },

  { id: 'P20', t: 'm', cod: 'seposiciona', score: 'contagem', rotulo: 'Frases que você já ouviu',
    q: 'Quais dessas frases você já ouviu, ou já disse para si mesm{o|a}?',
    o: [ { txt: '“Isso não é para gente como a gente”', e: '🚫' }, { txt: '“Concurso é loteria”', e: '🎲' },
         { txt: '“Arruma um emprego de verdade”', e: '💼' }, { txt: '“Você já passou da idade para isso”', e: '⌛' },
         { txt: '“Só passa quem pode parar tudo para estudar”', e: '💸' },
         { txt: '“Você estuda tanto e não passa?”', e: '😒' },
         { txt: 'Nenhuma dessas', e: '✨', excl: true } ] },

  { id: 'I6', t: 'ins', icone: 'alvo', fundo: 'cena-atacante.jpg', foco: '50% 20%', selo: '5º CÓDIGO · POSICIONAMENTO',
    tit: 'Quem chuta pode errar. Mas só quem se posiciona faz o gol.',
    pontos: [
      { i: 'alvo', t: 'Meu filho escolheu jogar de atacante: a posição que exige exposição, decisão e risco.' },
      { i: 'escada', t: 'Muita gente sonhava com a magistratura e acabava escolhendo “só escrevente”. Não por falta de capacidade: por não se ver naquele lugar.' },
      { i: 'bandeira', t: 'Com uns 5 meses de estudo, eu me inscrevi no concurso para juíza mesmo achando que era cedo. <b>Tá com medo? Vai com medo mesmo.</b>' }
    ],
    extras: [
      { when: A => is(A, 'P17', 2) || is(A, 'P17', 3), html: 'Você escolheu um cargo mais “possível”. Analista e escrevente são cargos excelentes. A pergunta é só uma: foi por chamado ou por medo?' },
      { when: A => is(A, 'P20', 4), html: 'Meu pai vendeu o carro para pagar o cursinho e estudou à luz de vela. Condição ajuda. Não decide.' },
      { when: A => is(A, 'G2', 3) || is(A, 'P20', 3), html: 'A mãe de uma aluna, aos 70 anos, quis estudar comigo para a OAB. Eu respondi: “Põe ela para dentro.” Idade não tira ninguém da posição.' },
      { when: A => is(A, 'P17', 0), html: 'Você disse que o cargo que estuda é o seu sonho. Agora é se posicionar como quem vai ocupá-lo: se inscrever e ir.' },
      { when: A => is(A, 'P17', 1), html: 'Você ainda não decidiu o cargo. Se posicionar começa por escolher onde você quer estar, e não o que parece mais possível.' }
    ],
    depoCod: 'seposiciona',
    codigo: 'Coloque-se na posição em que aquilo que você deseja pode acontecer.',
    btn: 'Próximo código' },

  /* GESTAR */
  { id: 'P21', t: 'q', cod: 'gesta', rotulo: 'Ao olhar o que falta',
    q: 'Quando você olha o quanto ainda falta do edital, o que sente?',
    o: [ { txt: 'Tranquilidade: sei que vou chegar', e: '😌', p: 3 }, { txt: 'Ansiedade, mas sigo', e: '😰', p: 2 },
         { txt: 'Sinto que nunca vou terminar', e: '🌀', p: 1 }, { txt: 'Travo e não consigo começar', e: '🧊', p: 0 } ] },

  { id: 'P22', t: 'q', cod: 'gesta', rotulo: 'Sobre ver resultado',
    q: 'Você sente que estuda, estuda e não vê resultado?',
    o: [ { txt: 'Não, vejo o meu progresso', e: '📈', p: 3 }, { txt: 'Às vezes', e: '🤏', p: 2 },
         { txt: 'Quase sempre', e: '😕', p: 1 }, { txt: 'Sempre. Parece que não saio do lugar', e: '🛑', p: 0 } ] },

  { id: 'I7', t: 'ins', icone: 'ampulheta', fundo: 'cena-gesta.jpg', foco: '50% 42%', selo: '6º CÓDIGO · GESTAR',
    tit: 'Existe um tempo em que o resultado ainda é invisível.',
    pontos: [
      { i: 'coracao', t: 'Com dois meses de gestação, o bebê já existe, mesmo que quase ninguém consiga vê-lo.' },
      { i: 'lampada', t: 'No estudo é igual: memória e raciocínio estão sendo formados <b>antes de aparecer no resultado</b>.' },
      { i: 'lua', t: 'Eu arrancava fios de cabelo de ansiedade. Ansiedade não é sinal de caminho errado: é sinal de que algo está sendo formado.' }
    ],
    extras: [ { when: A => is(A, 'P22', 2) || is(A, 'P22', 3), html: 'Você disse que sente que não sai do lugar. Nem todo crescimento aparece no simulado da semana.' },
              { when: A => is(A, 'P22', 1), html: 'Às vezes você sente que não vê resultado. É nessa fase que o resultado ainda está sendo formado.' },
              { when: A => is(A, 'P22', 0), html: 'Você vê o seu progresso. Guarde isso para os dias em que ele ficar invisível: eles vão chegar.' } ],
    depoCod: 'gesta',
    codigo: 'Não aborte o que ainda está sendo formado só porque você ainda não consegue ver.',
    btn: 'Próximo código' },

  /* PERSEVERANÇA */
  { id: 'P23', t: 'q', cod: 'persevera', rotulo: 'Depois de uma prova ruim',
    show: A => sel(A, 'P4').length > 0 && !is(A, 'P4', 0),
    q: 'Depois de uma prova que não deu certo, quanto tempo você levou para voltar a estudar?',
    o: [ { txt: 'Voltei em poucos dias', e: '🚀', p: 3 }, { txt: 'Algumas semanas', e: '🗓️', p: 2 },
         { txt: 'Alguns meses', e: '🌧️', p: 1 }, { txt: 'Ainda não voltei de verdade', e: '🥀', p: 0 } ] },

  { id: 'P24', t: 'q', cod: 'persevera', rotulo: 'Sobre desistir',
    q: 'Você já pensou em desistir?',
    o: [ { txt: 'Nunca pensei', e: '🦁', p: 3 }, { txt: 'Já pensei, mas passou', e: '🌤️', p: 2 },
         { txt: 'Penso nisso com frequência', e: '🌧️', p: 1 }, { txt: 'Estou pensando nisso agora', e: '⛈️', p: 0 } ] },

  { id: 'P25', t: 'e', cod: 'persevera',
    q: 'O quanto você concorda com esta frase?',
    frase: 'Se eu ainda não passei, talvez esse não seja o meu caminho.',
    o: [ { txt: 'Concordo totalmente', e: '✅', p: 0 }, { txt: 'Concordo em parte', e: '🤏', p: 1 },
         { txt: 'Não tenho certeza', e: '🤔', p: 2 }, { txt: 'Discordo', e: '❌', p: 3 } ] },

  { id: 'I8', t: 'ins', icone: 'montanha', fundo: 'cena-montanha.jpg', foco: '50% 32%', selo: '7º CÓDIGO · PERSEVERANÇA',
    tit: 'O aprovado permanece.',
    verso: { txt: 'Bem-aventurado o homem que persevera na provação, porque, depois de aprovado, receberá a coroa da vida.', ref: 'Tiago 1:12' },
    passos: ['Provação', 'Perseverança', 'Aprovação', 'Coroa'],
    pontos: [
      A => ({ i: 'livro', t: is(A, 'P6', 2)
        ? 'A palavra grega para “aprovado” é <em>dokimos</em>: aquele que passou pela prova e se mostrou verdadeiro.'
        : 'A palavra que a Bíblia usa para “aprovado” é <em>dokimos</em>: aquele que passou pela prova e se mostrou verdadeiro.' }),
      { i: 'subindo', t: 'Fui reprovada no vestibular da PUC e, 30 dias depois, passei em 12º lugar na UFG. No concurso de delegado, fiquei de fora por 1 ponto, e aquilo me animou: eu estava perto.' }
    ],
    extras: [ { when: A => is(A, 'P24', 3), html: 'Se você está pensando em desistir agora, eu te peço só uma coisa: termine este teste. Depois você decide.' },
              { when: A => is(A, 'P24', 2), html: 'Você pensa em desistir com frequência. A provação não é sinal de caminho errado: é o caminho de quem é aprovado.' },
              { when: A => is(A, 'P24', 1), html: 'Você já pensou em desistir, e passou. Isso já é perseverar.' },
              { when: A => is(A, 'P24', 0), html: 'Você nunca pensou em desistir. É essa força que vai te levar até a prova.' } ],
    depoCod: 'persevera',
    codigo: 'Não pare durante a provação. A aprovação pode estar depois dela.',
    btn: 'Continuar' },

  /* ---------- D. Desejo ---------- */
  { id: 'P26', t: 'q', q: 'Quando você imagina o seu nome na lista de aprovados, o que vem primeiro?',
    o: [ { txt: 'A estabilidade para a minha família', e: '🏡' }, { txt: 'O orgulho dos meus pais', e: '👪' },
         { txt: 'A liberdade de não depender de ninguém', e: '🕊️' }, { txt: 'A chance de servir e fazer justiça', e: '⚖️' } ] },

  { id: 'P27', t: 'q', q: 'Quem você mais quer que veja essa aprovação?',
    o: [ { txt: 'Meus pais', e: '👪' }, { txt: 'Meus filhos', e: '🧒' },
         { txt: 'Quem duvidou de mim', e: '👀' }, { txt: 'Eu, antes de qualquer pessoa', e: '🪞' } ] },

  { id: 'P28', t: 'q', q: 'Daqui a 12 meses, onde você quer estar?',
    o: [ { txt: 'Com o meu nome na lista', e: '🏆' }, { txt: 'Nas fases finais de um concurso', e: '🏁' },
         { txt: 'Com o edital fechado e revisado várias vezes', e: '📘' }, { txt: 'Com uma rotina que eu consigo manter', e: '🗓️' } ] },

  { id: 'I9', t: 'ins', icone: 'maos', fundo: 'cena-fe.jpg', foco: '50% 45%',
    tit: 'Às vezes a gente precisa pegar a fé emprestada.',
    pontos: [
      { i: 'lua', t: 'De madrugada, meu pai sentava ao meu lado e pegava alguma coisa para ler. Não explicava nada. Só ficava ali.' },
      { i: 'coracao', t: 'A presença dele me sustentava. Eu pegava a fé dele emprestada, até ter a minha.' }
    ],
    extras: [
      { when: A => is(A, 'P27', 0), html: 'Você quer que os seus pais vejam. Eu entendo isso mais do que você imagina.' },
      { when: A => is(A, 'P27', 1), html: 'Você quer que os seus filhos vejam. E eles já estão vendo: cada dia de estudo é uma lição para eles.' },
      { when: A => is(A, 'P27', 2), html: 'Quem duvidou de você não precisa ser convencido. Precisa ver. E quem vai mostrar é a sua constância.' },
      { when: A => is(A, 'P27', 3), html: 'Você quer provar para você mesm{o|a}. Essa é a aprovação que sustenta todas as outras.' }
    ],
    fecho: 'Agora eu vou cruzar as suas respostas com os 7 códigos.',
    btn: 'Ver o meu resultado' },

  /* ---------- E. Diagnóstico, solução e captura ---------- */
  { id: 'DIAG', t: 'diag' },

  { id: 'P29', t: 'q', q: 'O que mais te trava hoje?',
    sub: 'Escolha a que mais pesa.',
    o: [ { txt: 'Falta um método claro, não teoria solta', e: '📐' },
         { txt: 'Falta alguém que já passou me mostrando o caminho', e: '🧭' },
         { txt: 'Constância: eu começo e paro', e: '🔁' },
         { txt: 'Falta direção e fé para continuar', e: '🙏' },
         { txt: 'Acreditar que é para mim', e: '💛' } ] },

  /* Resposta imediata à trava da P29: uma tela para cada resposta (a pessoa vê só a dela). Regra da skill quiz-funnel, erro fatal nº 9. */
  { id: 'O1', t: 'ins', show: A => is(A, 'P29', 0), icone: 'repetir', fundo: 'cena-pratica.jpg', foco: '50% 32%', depoTrava: 0,
    selo: 'Você respondeu: um método claro',
    tit: 'Método claro é exatamente o que eu vou te entregar.',
    pontos: [
      { i: 'repetir', t: 'Em uns 7 meses de estudo, eu revisei o edital <b>pelo menos 6 vezes</b>.' },
      { i: 'relogio', t: 'O passo a passo está no bônus <b>Método 48, 7 e 30</b>: revisar no tempo certo, antes de esquecer.' },
      { i: 'play', t: 'E cada aula termina com uma prática para os próximos 7 dias. <b>Nada de teoria solta.</b>' }
    ],
    btn: 'Continuar' },
  { id: 'O2', t: 'ins', show: A => is(A, 'P29', 1), icone: 'balanca', fundo: 'dayana-toga.jpg', retrato: true, foco: '62% 6%', depoTrava: 1,
    selo: 'Você respondeu: alguém que já passou',
    tit: 'Eu já passei por esse caminho. E vou com você.',
    pontos: [
      { i: 'balanca', t: 'Aprovada juíza aos 23 anos, em 7º lugar, no <b>primeiro e único</b> concurso de juiz que fiz.' },
      { i: 'pessoa', t: 'De 2011 a 2021, fui mentora de concurseiros. Nunca dei aula de Direito: eu ensinava <b>como estudar e como continuar</b>.' }
    ],
    btn: 'Continuar' },
  { id: 'O3', t: 'ins', show: A => is(A, 'P29', 2), icone: 'broto', fundo: 'cena-semeia.jpg', foco: '50% 20%', depoTrava: 2,
    selo: 'Você respondeu: constância',
    tit: 'Começar e parar tem solução: a semente mínima.',
    pontos: [
      { i: 'broto', t: 'No código SEMEAR, eu te ensino a <b>semente mínima</b>: o pouco que você faz até no pior dia.' },
      { i: 'casa', t: 'Eu estudei trabalhando: saía do tribunal às 13h, estudava à tarde e ia para o cursinho à noite.' },
      { i: 'calendario', t: 'O seu mapa já vem com a <b>primeira ação para os próximos 7 dias</b>.' }
    ],
    btn: 'Continuar' },
  { id: 'O4', t: 'ins', show: A => is(A, 'P29', 3), icone: 'maos', fundo: 'cena-fe.jpg', foco: '50% 45%', depoTrava: 3,
    selo: 'Você respondeu: direção e fé',
    tit: 'Você não precisa escolher entre método e fé.',
    pontos: [
      { i: 'coroa', t: 'Na Aula 8, <b>Aprovado diante de Deus</b>, eu mostro como colocar a fé na sua preparação.' },
      { i: 'chave', t: 'No <b>Protocolo Antitrava</b>, eu te preparo para o dia da prova: para a ansiedade, o branco e a pressão.' },
      { i: 'bussola', t: 'E a direção começa no seu mapa: ele mostra <b>por qual código começar</b>.' }
    ],
    btn: 'Continuar' },
  { id: 'O5', t: 'ins', show: A => is(A, 'P29', 4), icone: 'alvo', fundo: 'cena-atacante.jpg', foco: '50% 20%', depoTrava: 4,
    selo: 'Você respondeu: acreditar que é para você',
    tit: 'Ninguém se sente pront{o|a}. Quem passa se posiciona mesmo assim.',
    pontos: [
      { i: 'casa', t: 'Eu estudei em escola pública no interior de Goiás.' },
      { i: 'subindo', t: 'Antes de passar para escrevente, aos 19 anos, fui reprovada para Fiscal de Posturas de Goiânia.' },
      { i: 'bandeira', t: '<b>Tá com medo? Vai com medo mesmo.</b>' }
    ],
    btn: 'Continuar' },

  { id: 'P30', t: 'q', q: 'Como você aprende melhor?',
    o: [ { txt: 'Assistindo', e: '🎥' }, { txt: 'Lendo', e: '📖' }, { txt: 'Os dois', e: '✨' } ] },

  { id: 'P31', t: 'q', q: 'Quanto você quer mudar isso agora?',
    o: [ { txt: 'Decidi: faço o que for preciso', e: '🔥' }, { txt: 'Quero muito', e: '💪' },
         { txt: 'Quero, mas tenho medo de não dar conta', e: '😟' }, { txt: 'Por enquanto, é só curiosidade', e: '👀' } ] },

  { id: 'I10', t: 'antesdepois',
    tit: 'O que muda quando os 7 códigos destravam',
    sub: 'Não é estudar mais. É o que você faz em 7 momentos específicos.',
    caixa: 'Nenhum desses momentos muda com mais horas de estudo. Todos mudam quando você sabe o que fazer na hora certa.',
    btn: 'Continuar' },

  { id: 'I11', t: 'prova',
    show: () => DEPOIMENTOS.length > 0 || (window.CONFIG && CONFIG.MOSTRAR_ESPACOS_RESERVADOS),
    tit: 'Não é teoria. É o que eu vi acontecer.',
    sub: 'Fui mentora de concurseiros de 2011 a 2021, enquanto era juíza. Veja o que alguns deles me mandaram:',
    btn: 'Montar o meu mapa' },

  { id: 'CAPTURA', t: 'captura',
    tit: 'Vamos montar o mapa dos seus 7 códigos',
    sub: 'Preencha os seus dados para ver o mapa completo, o que destravar primeiro e a sua primeira ação para os próximos 7 dias.',
    passos: [ [0, 'Organizando as suas respostas'],
              [14, 'Pontuando PRÁTICA, SEMEAR e CRIAR RAIZ'],
              [36, 'Pontuando NÃO DUVIDAR, POSICIONAMENTO, GESTAR e PERSEVERANÇA'],
              [66, 'Escolhendo a sua primeira ação'],
              [100, '✓ Mapa pronto'] ],
    btn: 'Ver o meu mapa' },

  { id: 'RESULTADO', t: 'resultado' }
];

/* Contagem de trocas (P15) — usada na inserção NÃO DUVIDAR */
function trocasCount(A) {
  const s = sel(A, 'P15');
  return s.filter(i => i !== 4).length;
}

/* --------------------------------------------------------------------------
   PÁGINA DE VENDAS (S47)
   -------------------------------------------------------------------------- */
/* Cor de cada código na página de vendas */
const COR_CODIGO = { pratica: '#1f6f50', seposiciona: '#1d2f55', persevera: '#7a1f3a', naoduvida: '#0f5c63',
  gesta: '#4b2a7b', criaraiz: '#b4532a', semeia: '#a8842f' };

const AULAS = [
  { n: 1, cod: 'pratica', img: 'cena-pratica.jpg',     tit: 'Aula 1 · PRÁTICA',      txt: 'Como transformar conteúdo em treino, para a prova encontrar o que você estudou' },
  { n: 2, cod: 'seposiciona', img: 'cena-atacante.jpg', tit: 'Aula 2 · POSICIONAMENTO', txt: 'Como parar de escolher o cargo pelo medo e se colocar onde o seu sonho pode acontecer' },
  { n: 3, cod: 'persevera', img: 'cena-montanha.jpg',   tit: 'Aula 3 · PERSEVERANÇA',    txt: 'O que fazer no dia seguinte à reprovação, e por que a aprovação vem depois da provação' },
  { n: 4, cod: 'naoduvida', img: 'cena-rota.jpg',   tit: 'Aula 4 · NÃO DUVIDAR',   txt: 'Como escolher a rota e o material, e parar de voltar para a linha de partida' },
  { n: 5, cod: 'gesta', img: 'cena-gesta.jpg',       tit: 'Aula 5 · GESTAR',        txt: 'Como atravessar o tempo em que o resultado ainda é invisível, sem que a ansiedade decida por você' },
  { n: 6, cod: 'criaraiz', img: 'cena-raiz.jpg',    tit: 'Aula 6 · CRIAR RAIZ',    txt: 'Foco, renúncia e a solidão do concurso vista como raiz, não como abandono' },
  { n: 7, cod: 'semeia', img: 'cena-semeia.jpg',      tit: 'Aula 7 · SEMEAR',       txt: 'A semente mínima: constância para quem trabalha, tem família e dias ruins' },
  { n: 8, cod: null, bonus: true, img: 'cena-fe.jpg', tit: 'Aula 8 · BÔNUS · Aprovado diante de Deus', txt: 'Aprovação além do cargo: <em>dokimos</em>, a palavra de Esdras sobre levantar juízes e como colocar a fé na sua preparação' }
];

const BONUS = [
  /* valor: preço de referência mostrado riscado. Definidos pela Mayara em 07/10/2026; só o livro (R$ 39,90) tem preço público. */
  { id: 'B1', ic: 'repetir', valor: 197, cor: '#1f6f50', tit: 'Bônus 1 · Ebook <em>Método 48, 7 e 30</em>',
    txt: 'O passo a passo da revisão que me fez revisar o edital pelo menos 6 vezes em cerca de 7 meses.',
    extra: { when: A => is(A, 'P8', 0), html: 'Você me disse que termina um assunto e não volta mais nele. Este bônus resolve exatamente isso.' } },
  { id: 'B2', ic: 'montanha', valor: 97, cor: '#1d2f55', tit: 'Bônus 2 · <em>Protocolo da Reprovação</em>',
    txt: 'O que fazer nas primeiras 24 horas depois de uma reprovação. Serve para qualquer concurso.',
    numerado: true,
    itens: ['Não tomar decisão emocional', 'Analisar o resultado', 'Identificar os pontos fracos', 'Separar incapacidade de falta de preparação', 'Montar o plano de recuperação'] },
  { id: 'B3', ic: 'chave', valor: 97, cor: '#b4532a', tit: 'Bônus 3 · <em>Protocolo Antitrava</em>',
    txt: 'Como chegar ao dia da prova preparad{o|a} não apenas para responder questões, mas para conseguir acessar tudo o que você estudou.',
    rotulo: 'Para', itens: ['Ansiedade', 'Nervosismo', 'Branco', 'Pressão'] },
  { id: 'B4', ic: 'livro', valor: 39.9, cor: '#7a1f3a', tit: 'Bônus 4 · Livro digital <em>Minha Última Sentença</em>',
    txt: 'A minha história, da escola pública até a toga. Vendido separadamente por R$ 39,90.' },
  { id: 'B5', ic: 'calendario', valor: 197, cor: '#4b2a7b', tit: 'Bônus 5 · <em>Diário do Concurseiro</em>',
    txt: 'Um mapa simples para registrar o seu estudo e enxergar a sua evolução.',
    rotulo: 'Você registra', itens: ['Horas estudadas', 'Questões feitas', 'Percentual de acerto', 'Matérias estudadas', 'Dificuldades', 'Evolução', 'Nível de energia', 'Cumprimento das metas'],
    nota: 'E um bloco de anotações: <b>Estudei · Aprendi · Errei · Preciso revisar · Próximo passo</b>.' }
];

const OFERTA_ITENS = [
  { t: '7 aulas dos 7 Códigos da Aprovação' },
  { t: 'Aula bônus: Aprovado diante de Deus' },
  { t: 'Ebook <em>Método 48, 7 e 30</em>', b: 'B1' },
  { t: '<em>Protocolo da Reprovação</em>', b: 'B2' },
  { t: '<em>Protocolo Antitrava</em>', b: 'B3' },
  { t: 'Livro digital <em>Minha Última Sentença</em>', b: 'B4' },
  { t: '<em>Diário do Concurseiro</em>', b: 'B5' }
];

const AUTORIDADE = [
  { i: 'balanca', cor: '#1d2f55', t: 'Aprovada juíza aos 23 anos, em 7º lugar, no primeiro e único concurso de juiz que fez' },
  { i: 'relogio', cor: '#1f6f50', t: 'Menos de 1 ano do início dos estudos até a posse' },
  { i: 'escada', cor: '#b4532a', t: '20 anos dentro do Judiciário, de escrevente a juíza' },
  { i: 'pessoa', cor: '#4b2a7b', t: 'Mentora de concurseiros de 2011 a 2021' },
  { i: 'livro', cor: '#7a1f3a', t: 'Autora de <em>Minha Última Sentença</em>' }
];

const PARA_QUEM_E = [
  'você já tem conteúdo, mas não consegue constância',
  'você estuda e esquece',
  'você já pensou em desistir',
  'você troca de rota a cada edital',
  'você quer alguém que já passou te mostrando o caminho'
];
const PARA_QUEM_NAO_E = [
  'você quer passar sem estudar',
  'você procura aula de Direito (isso o seu cursinho já faz)',
  'você quer promessa de aprovação com data'
];


/* Valores das variáveis (seção F do copy) */
const VALORES = {
  tempo: ['menos de 6 meses', 'menos de 1 ano', 'mais de 1 ano', 'mais de 3 anos', 'mais de 5 anos'],
  trabalho_frase: ['trabalha em tempo integral', 'trabalha meio período', 'hoje se dedica só aos estudos'],
  provas_frase: ['ainda não fez nenhuma prova para o cargo', 'já fez 1 ou 2 provas para o cargo', 'já fez de 3 a 5 provas', 'já fez mais de 5 provas'],
  carreira: ['a magistratura', 'o Ministério Público', 'a carreira de Delegado de Polícia', 'os tribunais', 'a OAB', 'o seu concurso'],
  trocas: ['cursinho', 'material', 'cronograma', 'concurso-alvo'],
  horas: ['menos de 2 horas', 'de 2 a 4 horas', 'de 4 a 6 horas', 'mais de 6 horas'],
  falta: ['um método claro', 'alguém que já passou te mostrando o caminho', 'constância', 'direção e fé para continuar', 'acreditar que é para você']
};
