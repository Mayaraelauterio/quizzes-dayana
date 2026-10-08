/* ==========================================================================
   AS 7 COLUNAS — conteúdo do quiz (Dayana Martins)
   Fonte dos textos: entregas/03-quiz-completo-copy.md (v1.2, 07/10/2026).
   Lógica e pontuação: entregas/03-quiz-completo.md.

   Convenções
   - Quiz só para mulheres: não há pergunta de gênero.
   - {variavel}: preenchida pelo app (ver ctx() em app.js).
   - p: pontos da alternativa na coluna da pergunta (0 a 3).
   - Nenhum número, depoimento ou valor sem fonte. Restrição: nada sobre as falas da Liz,
     a tentativa do pai ou o caso da criança.
   ========================================================================== */

/* Ordem canônica (resultado e aulas) */
const ORDEM_CANONICA = ['identidade', 'proposito', 'templo', 'alianca', 'heranca', 'prosperidade', 'transbordo'];
/* Desempates (02-blueprint / 03-quiz-completo, seção 4) */
const DESEMPATE_FRAGIL = ['proposito', 'identidade', 'heranca', 'alianca', 'templo', 'prosperidade', 'transbordo'];
const DESEMPATE_FORTE = ['transbordo', 'heranca', 'alianca', 'templo', 'prosperidade', 'identidade', 'proposito'];

/* Helpers de condição (A = respostas) */
const sel = (A, id) => (A[id] ? A[id].idx : []);
const is = (A, id, i) => sel(A, id).includes(i);
const mae = A => is(A, 'P2', 0);
const casada = A => is(A, 'P5', 0);

/* Banco de textos por coluna (roteiro, seção G) */
const COLUNAS = {
  identidade: {
    nome: 'IDENTIDADE', aula: 2,
    frase: 'A minha força não está apenas no que eu faço, mas em quem eu sou.',
    fragil: () => 'Você está se enxergando pelo que faz ou pelos papéis que ocupa: o cargo, ser mãe de alguém, esposa de alguém. Quando um desses papéis balança, parece que você inteira balança junto.',
    forte: 'Você sabe quem é, além do que faz. Isso te dá firmeza em qualquer estação.',
    saber: 'se firmar em quem você é',
    pratica: () => 'Escreva 3 frases que comecem com “Eu sou…”, sem citar profissão, estado civil ou filhos. Leia todas as manhãs.'
  },
  proposito: {
    nome: 'PROPÓSITO', aula: 3,
    frase: 'Onde estiver o seu tesouro, aí estará o seu coração.',
    fragil: () => 'Você sente que falta alguma coisa, mesmo quando tudo parece em ordem. Não é que o seu propósito não exista: o seu coração está guardado num lugar diferente de onde a sua vida acontece.',
    forte: 'Você já enxerga o seu propósito. Ele dá sentido ao que você faz.',
    saber: 'dar sentido ao que você faz',
    pratica: () => 'Toda noite, anote um momento do dia em que você se sentiu inteira. No sétimo dia, releia: é ali que o seu propósito já está aparecendo.'
  },
  templo: {
    nome: 'TEMPLO', aula: 4,
    frase: 'O seu corpo também é casa.',
    fragil: () => 'Você está sustentando todo mundo e se esquecendo de sustentar a si mesma. Mente cansada e corpo no automático fazem qualquer propósito parecer pesado.',
    forte: 'Você cuida da sua mente e do seu corpo. Isso sustenta todo o resto.',
    saber: 'cuidar do que sustenta a casa',
    pratica: () => 'Reserve 15 minutos por dia só seus, sempre no mesmo horário. Avise a sua casa: esse tempo é sagrado.'
  },
  alianca: {
    nome: 'ALIANÇA', aula: 5,
    frase: 'Não é a união de duas pessoas. É a união de dois propósitos.',
    fragil: () => 'Você está carregando decisões e sonhos mais sozinha do que deveria. Falta alguém caminhando com você na mesma direção.',
    forte: 'Você tem alguém caminhando na mesma direção. Isso multiplica a sua força.',
    saber: 'caminhar acompanhada',
    pratica: A => casada(A)
      ? 'Separe uma conversa de 20 minutos com o seu marido, com uma pergunta só: “Para onde nós estamos indo?”'
      : 'Conte a uma pessoa de confiança o que você quer viver. Aliança começa quando alguém sabe.'
  },
  heranca: {
    nome: 'HERANÇA', aula: 6,
    frase: 'Produtividade não é presença.',
    fragil: A => mae(A)
      ? 'Você está presente, mas nem sempre por inteiro. A pressa e a culpa estão ocupando o lugar que a presença deveria ocupar.'
      : 'Você está construindo muito para agora e pouco para quem vem depois.',
    forte: 'Você está presente de verdade. É isso que fica.',
    saber: 'estar presente de verdade',
    pratica: A => mae(A)
      ? 'Faça uma refeição por dia sem celular na mesa, conversando de verdade.'
      : 'Separe um tempo nesta semana para alguém mais novo: uma conversa, uma ajuda, um conselho.'
  },
  prosperidade: {
    nome: 'PROSPERIDADE', aula: 7,
    frase: 'Prosperar é ter provisão com paz.',
    fragil: () => 'Trabalho e dinheiro estão vindo junto com culpa ou medo, para qualquer lado que você vá. Enquanto isso não se resolve, nenhuma escolha parece certa.',
    forte: 'Você tem paz com o seu trabalho e com a provisão da sua casa.',
    saber: 'viver a provisão com paz',
    pratica: () => 'Escreva qual é hoje a sua escolha sobre trabalho (fora, em casa ou no lar) e o porquê dela. Releia todos os dias. Escolha consciente não pesa como culpa.'
  },
  transbordo: {
    nome: 'TRANSBORDO', aula: 8,
    frase: 'O propósito que você vive dentro de casa não fica preso nela.',
    fragil: () => 'O que você vive está ficando guardado. Não por falta de valor, mas por achar que ainda não é a hora, ou que não é para você.',
    forte: 'O que você vive já alcança outras pessoas. O seu propósito está transbordando.',
    saber: 'transformar o que vive em ajuda para outras pessoas',
    pratica: () => 'Nesta semana, compartilhe com uma mulher algo que Deus te ensinou recentemente. Uma mensagem basta.'
  }
};
const ICONE_COLUNA = { identidade: 'coroa', proposito: 'lampada', templo: 'chama', alianca: 'maos', heranca: 'arvore', prosperidade: 'broto', transbordo: 'estrela' };
/* Paleta do Quiz 2 (espiritualidade, paz, propósito e amor): lavanda, rosa antigo, sálvia, azul-céu, terracota suave, malva e água */
const COR_COLUNA = { identidade: '#6a5a9e', proposito: '#a5506b', templo: '#4f7a64', alianca: '#4a7090', heranca: '#b0604d', prosperidade: '#7d4f7e', transbordo: '#3f7f80' };

/* Antes × depois (S41) */
const ANTES_DEPOIS = [
  { cod: 'templo',       quando: 'o dia termina',                    a: 'Você é a última da lista',               d: 'Você tem um tempo que é só seu' },
  { cod: 'prosperidade', quando: 'o assunto é trabalho ou dinheiro', a: 'Culpa ou medo, para qualquer lado',      d: 'Provisão com paz' },
  { cod: 'alianca',      quando: 'chega uma decisão importante',     a: 'Você decide e carrega sozinha',          d: 'Vocês caminham na mesma direção' },
  { cod: 'heranca',      quando: 'quem você ama te procura',         a: 'Você está lá, mas com a cabeça longe',   d: 'Você está por inteiro' },
  { cod: 'identidade',   quando: 'perguntam quem você é',            a: 'Você responde com um cargo ou um papel', d: 'Você sabe quem é, além do que faz' },
  { cod: 'proposito',    quando: 'chega a folga',                    a: 'Vazio ou culpa',                         d: 'Paz' },
  { cod: 'transbordo',   quando: 'alguém precisa do que você vive',  a: 'Você guarda para si',                    d: 'Você compartilha' }
];

/* Depoimentos: não há (v1.1). Quando houver, cada um entra com `codigo` (coluna) e/ou `trava` (0 a 4, resposta da P28). */
const DEPOIMENTOS = [];

/* Frases de incentivo: acima da 4ª, 8ª, 12ª… pergunta, cada uma com emoji e cor próprios */
const MOTIVACAO = [
  { e: '🌸', cor: 'rosa',     txt: 'Ótimo começo! Cada resposta deixa o seu mapa mais claro.' },
  { e: '🏛️', cor: 'lavanda',  txt: 'Continue assim. Agora vamos olhar as colunas da sua casa.' },
  { e: '🧭', cor: 'ceu',      txt: 'Você já passou de um terço do teste. O seu mapa está tomando forma.' },
  { e: '🔥', cor: 'pessego',  txt: 'Você está quase na metade. Falta pouco para enxergar onde o seu propósito já está.' },
  { e: '💪', cor: 'ameixa',   txt: 'Você está indo muito bem. Já passou da metade do teste.' },
  { e: '🔓', cor: 'malva',    txt: 'Você está quase descobrindo o que está encobrindo o seu propósito.' },
  { e: '🏁', cor: 'salvia',   txt: 'Reta final: falta pouco para o seu resultado.' },
  { e: '🏆', cor: 'agua',     txt: 'Quase lá: o seu mapa está praticamente pronto.' }
];

/* --------------------------------------------------------------------------
   TELAS (ordem exata do fluxo)
   t: capa | q (única) | m (múltipla) | e (escala) | r (régua 0 a 10) | ins | antesdepois | diag | captura | resultado
   -------------------------------------------------------------------------- */
const TELAS = [

  /* ---------- B. Abertura e genéricas ---------- */
  { id: 'P1', t: 'capa', rotulo: 'Idade',
    selo: 'Ex-juíza, autora de <em>Minha Última Sentença</em>',
    tit: 'Descubra onde o seu propósito está, e qual coluna da sua casa está pedindo atenção.',
    sub: 'Responda ao teste e receba o mapa das suas 7 colunas.',
    tempo: 'Leva poucos minutos.',
    q: 'Qual a sua idade?',
    o: [ { txt: '18 a 24 anos', e: '🌱', img: 'idade-1.jpg' },
         { txt: '25 a 34 anos', e: '🌷', img: 'idade-2.jpg' },
         { txt: '35 a 50 anos', e: '🌹', img: 'idade-4.jpg' },
         { txt: '51 anos ou mais', e: '👑', img: 'idade-5.jpg' } ] },

  { id: 'P2', t: 'q', q: 'Você é mãe?',
    o: [ { txt: 'Sim', e: '🤱' }, { txt: 'Não', e: '🌸' } ] },

  { id: 'P3', t: 'q', show: A => mae(A), q: 'Quantos filhos você tem?',
    o: [ { txt: '1', e: '👶' }, { txt: '2', e: '👧' }, { txt: '3', e: '👨‍👩‍👧‍👦' }, { txt: '4 ou mais', e: '🏡' } ] },

  { id: 'P4', t: 'q', q: 'Hoje, qual frase descreve melhor a sua rotina?',
    o: [ { txt: 'Trabalho fora', e: '💼' }, { txt: 'Trabalho em casa ou empreendo', e: '💻' },
         { txt: 'Estou dedicada ao lar', e: '🏡' }, { txt: 'Faço tudo ao mesmo tempo', e: '🤹‍♀️' } ] },

  { id: 'P5', t: 'q', q: 'Hoje você é:',
    o: [ { txt: 'Casada ou em união', e: '💍' }, { txt: 'Solteira', e: '🌷' }, { txt: 'Divorciada ou viúva', e: '🕊️' } ] },

  /* Relação com a Bíblia: dado religioso (sensível). Só personaliza a tela; nunca vai para o CRM. */
  { id: 'P6', t: 'q', q: 'Como está a sua relação com a Bíblia hoje?',
    sub: 'Não existe resposta certa. Isso só ajuda a ajustar o seu resultado.',
    o: [ { txt: 'Leio todos os dias', e: '📖' }, { txt: 'Leio às vezes', e: '📘' },
         { txt: 'Quero ler, mas não consigo manter', e: '⏳' }, { txt: 'Ainda não tenho esse hábito', e: '🌱' } ] },

  { id: 'P7', t: 'q', q: 'Se você resumisse este momento da sua vida em uma palavra, qual seria?',
    o: [ { txt: 'Correria', e: '🏃‍♀️' }, { txt: 'Vazio', e: '🌫️' }, { txt: 'Transição', e: '🔄' }, { txt: 'Crescimento', e: '🌿' } ] },

  { id: 'I1', t: 'ins', icone: 'casa', fundo: 'dayana-retrato.jpg', retrato: true, foco: '50% 24%',
    tit: A => is(A, 'P7', 3) ? 'Crescimento. Que bom: este teste é justamente para você.' : '{palavra}. Eu conheço essa palavra.',
    pontos: [
      { i: 'balanca', t: 'Eu tinha tudo o que o mundo chama de sucesso: a toga, a carreira. <b>E um vazio que nada preenchia.</b>' },
      { i: 'lua', t: 'Nas férias, os meus filhos pulavam na minha cama, e eu só queria ficar deitada. Era falta de sentido.' },
      { i: 'lampada', t: 'O meu propósito estava na minha frente. <b>Eu só não conseguia enxergar.</b>' }
    ],
    extras: [
      { when: A => is(A, 'P1', 2), html: 'Eu estava perto dos 40 quando enxerguei isso.' },
      { when: A => is(A, 'P1', 3), html: 'E não, não é tarde. Eu só fui abrir a Bíblia perto dos 40.' },
      { when: A => is(A, 'P1', 0) || is(A, 'P1', 1), html: 'Enxergar o propósito cedo muda tudo o que vem depois.' }
    ],
    btn: 'Quero enxergar o meu' },

  /* ---------- C. As 7 colunas (dor) ---------- */
  /* TEMPLO */
  { id: 'P8', t: 'q', cod: 'templo', rotulo: 'Tempo só seu',
    q: 'Quanto tempo do seu dia é só seu?', sub: 'Para orar, cuidar do corpo, descansar.',
    o: [ { txt: 'Tenho um tempo garantido todos os dias', e: '⏰', p: 3 }, { txt: 'Alguns dias sim, outros não', e: '🌗', p: 2 },
         { txt: 'Só quando sobra, e quase nunca sobra', e: '⏳', p: 1 }, { txt: 'Nenhum. Nem lembro a última vez', e: '😮‍💨', p: 0 } ] },

  { id: 'P9', t: 'q', cod: 'templo', rotulo: 'Mente e corpo',
    q: 'Como estão a sua mente e o seu corpo hoje?',
    o: [ { txt: 'Em paz', e: '😌', p: 3 }, { txt: 'Cansados, mas firmes', e: '💪', p: 2 },
         { txt: 'No automático', e: '🤖', p: 1 }, { txt: 'Esgotados', e: '🪫', p: 0 } ] },

  { id: 'I2', t: 'ins', icone: 'chama', fundo: 'cena-templo.jpg', foco: '50% 35%', selo: 'Coluna · TEMPLO', depoCod: 'templo',
    tit: 'O seu corpo também é casa.',
    verso: { txt: 'Acaso não sabem que o corpo de vocês é santuário do Espírito Santo?', ref: '1 Coríntios 6:19' },
    pontos: [
      { i: 'lua', t: 'Quando a minha primeira filha nasceu, houve dias em que até escovar os dentes parecia uma vitória.' },
      { i: 'casa', t: 'Uma casa não fica de pé se a coluna que sustenta as outras está rachada. <b>Essa coluna é você</b>: a sua mente, o seu corpo, o seu descanso.' }
    ],
    extras: [
      { when: A => is(A, 'P8', 3), html: 'Você me disse que nem lembra a última vez que teve um tempo só seu. Isso não é falta de organização. É uma coluna pedindo atenção.' },
      { when: A => is(A, 'P9', 3), html: 'Você disse que está esgotada. Cuidar de você agora não é egoísmo: é o que mantém a casa de pé.' },
      { when: A => is(A, 'P9', 2), html: 'Você disse que está no automático. Viver no automático encobre o propósito, mesmo quando tudo parece em ordem.' },
      { when: A => is(A, 'P9', 1), html: 'Cansada, mas firme. A firmeza é sua; o cansaço é o aviso de que essa coluna precisa de cuidado.' },
      { when: A => is(A, 'P9', 0), html: 'A sua mente e o seu corpo estão em paz. Essa coluna sustenta todas as outras: guarde esse cuidado.' }
    ],
    codigo: 'Cuidar de você não é egoísmo. É cuidar da casa.',
    btn: 'Próxima coluna' },

  /* PROSPERIDADE */
  { id: 'P10', t: 'q', cod: 'prosperidade', rotulo: 'Sobre o trabalho',
    q: 'Como você se sente em relação ao seu trabalho, ou à ausência dele?',
    o: [ { txt: 'Em paz: ele faz parte do meu propósito', e: '🕊️', p: 3 }, { txt: 'Estou no lar, e em paz com essa escolha', e: '🏡', p: 3 },
         { txt: 'Ele paga as contas, mas me esvazia', e: '🪫', p: 1 }, { txt: 'Sinto culpa: por trabalhar fora ou por não trabalhar', e: '😔', p: 0 } ] },

  { id: 'P11', t: 'q', cod: 'prosperidade', rotulo: 'Sobre o dinheiro',
    q: 'Quando o assunto é dinheiro na sua casa, o que você sente?',
    o: [ { txt: 'Paz: confio na provisão', e: '🙏', p: 3 }, { txt: 'Preocupação, mas confio', e: '🤞', p: 2 },
         { txt: 'Medo de faltar', e: '😟', p: 1 }, { txt: 'Sinto-me dependente, e isso me pesa', e: '⚖️', p: 0 } ] },

  { id: 'I3', t: 'ins', icone: 'broto', fundo: 'cena-prosperidade.jpg', foco: '50% 35%', selo: 'Coluna · PROSPERIDADE', depoCod: 'prosperidade',
    tit: 'Prosperar não é escolher entre trabalhar e cuidar.',
    verso: { txt: 'Ela avalia um campo e o compra; com o que ganha, planta uma vinha.', ref: 'Provérbios 31:16' },
    pontos: [
      { i: 'coracao', t: 'Quando decidi deixar a magistratura, perguntei ao meu marido se ia faltar alguma coisa. Ele disse: <b>“Nada vai nos faltar.”</b>' },
      { i: 'casa', t: 'Hoje ajudo o meu marido no escritório da fazenda. A mulher de Provérbios 31 compra campo, planta vinha e cuida da casa.' }
    ],
    extras: [
      { when: A => is(A, 'P10', 3), html: 'Você me disse que sente culpa, seja por trabalhar fora, seja por não trabalhar. A culpa aparece dos dois lados: então o problema não é a sua escolha.' },
      { when: A => is(A, 'P11', 3), html: 'Você disse que se sente dependente, e isso pesa. Eu também passei por isso, e aprendi o tanto que Deus provê.' },
      { when: A => is(A, 'P11', 2), html: 'Você disse que tem medo de faltar. Prosperar começa por ter provisão com paz, não com medo.' },
      { when: A => is(A, 'P10', 2), html: 'Você disse que o seu trabalho paga as contas, mas te esvazia. Provisão sem paz também racha essa coluna.' },
      { when: A => is(A, 'P11', 1), html: 'Você se preocupa, mas confia. É essa confiança que sustenta a coluna da prosperidade.' },
      { when: A => is(A, 'P11', 0), html: 'Você tem paz e confia na provisão. Essa coluna já está de pé na sua casa.' }
    ],
    codigo: 'Prosperar é ter provisão com paz.',
    btn: 'Próxima coluna' },

  /* ALIANÇA (versão conforme a P5) */
  { id: 'P12', t: 'q', cod: 'alianca', show: A => casada(A), rotulo: 'Sobre sonhar na mesma direção',
    q: 'Você e o seu marido sonham na mesma direção?',
    o: [ { txt: 'Sim, temos um propósito em comum', e: '🤝', p: 3 }, { txt: 'Na maior parte das coisas', e: '👍', p: 2 },
         { txt: 'Cada um vive o seu', e: '↔️', p: 1 }, { txt: 'Sinto que estamos em direções opostas', e: '🔀', p: 0 } ] },
  { id: 'P12b', t: 'q', cod: 'alianca', show: A => !casada(A), rotulo: 'Sobre quem entende você',
    q: 'As pessoas mais próximas de você entendem o que você quer viver?',
    o: [ { txt: 'Sim, elas me apoiam', e: '🤗', p: 3 }, { txt: 'Algumas entendem', e: '🙂', p: 2 },
         { txt: 'Poucas', e: '😕', p: 1 }, { txt: 'Ninguém entende', e: '😶', p: 0 } ] },

  { id: 'P13', t: 'q', cod: 'alianca', show: A => casada(A), rotulo: 'Nas decisões importantes',
    q: 'Quando você toma uma decisão importante, ele…',
    o: [ { txt: 'Decide junto comigo', e: '🤝', p: 3 }, { txt: 'Apoia, mesmo sem participar', e: '👏', p: 2 },
         { txt: 'Discorda, e a gente trava', e: '🧱', p: 1 }, { txt: 'Nem fica sabendo', e: '🙈', p: 0 } ] },
  { id: 'P13b', t: 'q', cod: 'alianca', show: A => !casada(A), rotulo: 'Sobre quem caminha com você',
    q: 'Você tem alguém que caminha com você na fé e nos sonhos?',
    o: [ { txt: 'Sim, tenho', e: '👭', p: 3 }, { txt: 'Tinha, mas nos afastamos', e: '💔', p: 1 },
         { txt: 'Estou procurando', e: '🔎', p: 1 }, { txt: 'Não tenho', e: '🚶‍♀️', p: 0 } ] },

  { id: 'I4', t: 'ins', icone: 'maos', fundo: 'cena-alianca.jpg', foco: '50% 20%', selo: 'Coluna · ALIANÇA', depoCod: 'alianca',
    tit: 'Não é a união de duas pessoas. É a união de dois propósitos.',
    verso: { txt: 'É melhor ter companhia do que estar sozinho… Um cordão de três dobras não se rompe com facilidade.', ref: 'Eclesiastes 4:9,12' },
    pontos: [
      A => casada(A)
        ? { i: 'coracao', t: 'Quando eu disse que pensava em deixar de ser juíza, o meu marido levou um susto. E falou: <b>“A sua decisão é a minha.”</b>' }
        : { i: 'maos', t: 'Eu e os meus irmãos temos uma <b>aliança silenciosa</b>: um pacto de apoio que nunca precisou ser assinado.' },
      A => casada(A)
        ? { i: 'relogio', t: 'Levei dez anos de casamento para entender: <b>aliança é a união de dois propósitos.</b>' }
        : { i: 'casa', t: 'Quem caminha com você na fé e nos sonhos faz parte da sua casa. <b>Nenhuma de nós foi feita para edificar sozinha.</b>' }
    ],
    extras: [
      { when: A => is(A, 'P13', 3), html: 'Você disse que ele nem fica sabendo das suas decisões. Uma aliança começa quando o outro sabe para onde você está indo.' },
      { when: A => is(A, 'P13', 2), html: 'Você disse que vocês travam quando discordam. Aliança não é concordar em tudo: é caminhar para o mesmo lugar.' },
      { when: A => is(A, 'P13', 1), html: 'Você disse que ele apoia, mesmo sem participar. Esse apoio já é base: falta caminharem juntos na mesma direção.' },
      { when: A => is(A, 'P13', 0), html: 'Você disse que vocês decidem juntos. Essa coluna já sustenta a sua casa.' },
      { when: A => is(A, 'P13b', 3), html: 'Você disse que não tem alguém caminhando com você. Aliança começa quando uma pessoa sabe o que você quer viver.' },
      { when: A => is(A, 'P13b', 1), html: 'Você disse que tinha alguém, mas se afastaram. Alianças também se reconstroem.' },
      { when: A => is(A, 'P13b', 2), html: 'Você está procurando quem caminhe com você. Quem caminha na mesma direção multiplica a força.' },
      { when: A => is(A, 'P13b', 0), html: 'Você tem alguém caminhando com você na fé e nos sonhos. Isso multiplica a sua força.' }
    ],
    codigo: 'Quem caminha na mesma direção multiplica a força.',
    btn: 'Próxima coluna' },

  /* HERANÇA (versão conforme a P2) */
  { id: 'P14', t: 'q', cod: 'heranca', show: A => mae(A), rotulo: 'Presença por inteiro',
    q: 'Quanto do seu dia você passa por inteiro com {filhos}, sem celular e sem pressa?',
    o: [ { txt: 'Boa parte do dia', e: '🌞', p: 3 }, { txt: 'Alguns momentos', e: '⏱️', p: 2 },
         { txt: 'Pouco tempo, e quase sempre com pressa', e: '🏃‍♀️', p: 1 }, { txt: 'Quase nenhum', e: '😔', p: 0 } ] },
  { id: 'P14b', t: 'q', cod: 'heranca', show: A => !mae(A), rotulo: 'Tempo com alguém mais novo',
    q: 'Você dedica tempo a alguém mais novo (sobrinhos, afilhados, alunas, uma amiga mais nova)?',
    o: [ { txt: 'Sim, com frequência', e: '🌟', p: 3 }, { txt: 'Às vezes', e: '🙂', p: 2 },
         { txt: 'Raramente', e: '🌥️', p: 1 }, { txt: 'Não', e: '🚫', p: 0 } ] },

  { id: 'P15', t: 'q', cod: 'heranca', show: A => mae(A), rotulo: 'Sobre a culpa',
    q: 'Você sente culpa por não estar presente como gostaria?',
    o: [ { txt: 'Não, estou em paz com a minha presença', e: '😌', p: 3 }, { txt: 'Às vezes', e: '🤏', p: 2 },
         { txt: 'Com frequência', e: '😟', p: 1 }, { txt: 'Todos os dias', e: '😢', p: 0 } ] },
  { id: 'P15b', t: 'q', cod: 'heranca', show: A => !mae(A), rotulo: 'Sobre construir algo que fica',
    q: 'Você sente que está construindo algo que vai ficar?',
    o: [ { txt: 'Sim, com clareza', e: '🏛️', p: 3 }, { txt: 'Acho que sim', e: '🤔', p: 2 },
         { txt: 'Não sei', e: '🤷‍♀️', p: 1 }, { txt: 'Não', e: '🚫', p: 0 } ] },

  { id: 'I5', t: 'ins', icone: 'arvore', fundo: 'cena-heranca.jpg', foco: '50% 35%', selo: 'Coluna · HERANÇA', depoCod: 'heranca',
    tit: 'Produtividade não é presença.',
    verso: { txt: 'Ensina a criança no caminho em que deve andar, e, ainda quando for velho, não se desviará dele.', ref: 'Provérbios 22:6' },
    pontos: [
      A => mae(A)
        ? { i: 'relogio', t: 'Eu comprava tênis sem cadarço para ganhar tempo de manhã. Depois descobri que amarrar o cadarço desenvolve autonomia.' }
        : { i: 'arvore', t: 'A minha mãe me ensinou que a verdadeira herança não são bens. <b>São pessoas.</b> É o que fica em quem vem depois de você.' },
      { i: 'casa', t: 'Três dias depois que eu deixei a magistratura, o meu filho me disse: <b>“Mamãe, até que enfim você chegou!”</b>' }
    ],
    extras: [
      { when: A => is(A, 'P15', 2) || is(A, 'P15', 3), html: 'Você disse que sente culpa com frequência. A culpa não é presença: ela só ocupa o lugar que a presença deveria ocupar.' },
      { when: A => is(A, 'P14', 3), html: 'Você disse que quase não consegue estar por inteiro com {filhos}. Presença não depende de onde você trabalha: depende de onde está o seu coração.' },
      { when: A => is(A, 'P15', 1), html: 'Às vezes bate a culpa. Presença não é quantidade de horas: é estar por inteiro quando você está.' },
      { when: A => is(A, 'P15', 0), html: 'Você está em paz com a sua presença. É isso que fica para {filhos}.' },
      { when: A => is(A, 'P15b', 2) || is(A, 'P15b', 3), html: 'Herança começa em quem vem depois de você: uma conversa, uma ajuda, um conselho.' },
      { when: A => is(A, 'P15b', 1), html: 'Você acha que sim. A herança fica mais clara quando você investe em alguém mais novo.' },
      { when: A => is(A, 'P15b', 0), html: 'Você está construindo algo que vai ficar. Essa é a sua herança.' }
    ],
    codigo: 'Presença depende de onde está o seu coração.',
    btn: 'Próxima coluna' },

  /* IDENTIDADE */
  { id: 'P16', t: 'q', cod: 'identidade', rotulo: 'Quando perguntam quem você é',
    q: 'Quando alguém pergunta “quem é você?”, o que você responde primeiro?',
    o: [ { txt: 'Falo de quem eu sou, não só do que eu faço', e: '🌸', p: 3 }, { txt: 'Falo da minha profissão', e: '💼', p: 1 },
         { txt: 'Digo que sou mãe de alguém ou esposa de alguém', e: '👩‍👧', p: 1 }, { txt: 'Não sei o que responder', e: '🤷‍♀️', p: 0 } ] },

  { id: 'P17', t: 'q', cod: 'identidade', rotulo: 'Carreira e família',
    q: 'Você sente que precisa escolher entre a sua carreira e a sua família?',
    o: [ { txt: 'Nunca senti isso', e: '😌', p: 3 }, { txt: 'Já fiz a minha escolha e estou em paz', e: '🕊️', p: 3 },
         { txt: 'Às vezes', e: '⚖️', p: 1 }, { txt: 'O tempo todo', e: '😣', p: 0 } ] },

  { id: 'P18', t: 'e', cod: 'identidade',
    q: 'O quanto você concorda com esta frase?',
    frase: 'Eu só me sinto com valor quando estou produzindo.',
    o: [ { txt: 'Concordo totalmente', e: '✅', p: 0 }, { txt: 'Concordo em parte', e: '🤏', p: 1 },
         { txt: 'Não tenho certeza', e: '🤔', p: 2 }, { txt: 'Discordo', e: '❌', p: 3 } ] },

  { id: 'P19', t: 'm', cod: 'identidade', score: 'contagem', rotulo: 'Frases que você já ouviu',
    q: 'Quais dessas frases você já ouviu, ou repetiu para si mesma?',
    o: [ { txt: '“Mulher que fica em casa está desperdiçando potencial”', e: '🏠' },
         { txt: '“Mãe que trabalha fora não cria os filhos”', e: '💼' },
         { txt: '“Você tem que dar conta de tudo”', e: '🤹‍♀️' },
         { txt: '“Primeiro a carreira, depois a família”', e: '📈' },
         { txt: '“Dez minutos de qualidade por dia bastam”', e: '⏱️' },
         { txt: '“Mulher forte não pede ajuda”', e: '💪' },
         { txt: 'Nenhuma dessas', e: '✨', excl: true } ] },

  { id: 'I6', t: 'ins', icone: 'coroa', fundo: 'dayana-toga.jpg', retrato: true, foco: '62% 6%', selo: 'Coluna · IDENTIDADE', depoCod: 'identidade',
    tit: 'Lá fora, eu era autoridade. Dentro de casa, eu era autoritária.',
    verso: { txt: 'Antes que eu te formasse no ventre materno, eu te conheci.', ref: 'Jeremias 1:5' },
    pontos: [
      { i: 'balanca', t: 'Na magistratura, eu decidia o destino de pessoas. Em casa, fazer as crianças guardarem os brinquedos virava guerra.' },
      { i: 'coroa', t: 'Eu sabia o que fazia, mas não sabia quem eu era. <b>A sua identidade não é o seu cargo nem o seu estado civil.</b>' }
    ],
    extras: [
      { when: A => is(A, 'P19', 0) && is(A, 'P19', 1), html: 'Você marcou frases opostas: por isso qualquer escolha parece errada.' },
      { when: A => is(A, 'P18', 0), html: 'Você só se sente com valor quando produz. Mas o seu valor vem de quem você é.' },
      { when: A => is(A, 'P16', 3), html: 'Você não sabe responder quando perguntam quem você é. Esta coluna responde.' },
      { when: A => is(A, 'P16', 1) || is(A, 'P16', 2), html: 'Você se apresenta pelo que faz ou pelos papéis que ocupa. Você é muito mais do que isso.' },
      { when: A => is(A, 'P16', 0), html: 'Você fala de quem é, não só do que faz. Essa firmeza sustenta a sua casa.' }
    ],
    codigo: 'A minha força não está apenas no que eu faço, mas em quem eu sou.',
    btn: 'Próxima coluna' },

  /* PROPÓSITO */
  { id: 'P20', t: 'q', cod: 'proposito', rotulo: 'Na folga',
    q: 'Quando você finalmente para (uma folga, as férias), o que sente?',
    o: [ { txt: 'Paz', e: '😌', p: 3 }, { txt: 'Um cansaço que não passa', e: '😴', p: 1 },
         { txt: 'Culpa por não estar produzindo', e: '😓', p: 1 }, { txt: 'Um vazio', e: '🌫️', p: 0 } ] },

  { id: 'P21', t: 'r', cod: 'proposito', min: 0, max: 10, inicial: 5,
    q: 'De 0 a 10, o quanto você sente que vive o seu propósito hoje?',
    sub: 'Arraste até o número que representa o seu momento.',
    faixas: [ [0, 2, 0], [3, 5, 1], [6, 8, 2], [9, 10, 3] ] },

  { id: 'P22', t: 'q', cod: 'proposito', rotulo: 'Sobre o seu propósito',
    q: 'Hoje, o seu propósito está:',
    o: [ { txt: 'Claro, e eu vivo', e: '✨', p: 3 }, { txt: 'Claro, mas eu não vivo', e: '🚪', p: 2 },
         { txt: 'Existe, mas eu não enxergo', e: '🌫️', p: 1 }, { txt: 'Acho que eu não tenho um', e: '❓', p: 0 } ] },

  { id: 'I7', t: 'ins', icone: 'lampada', fundo: 'cena-proposito.jpg', foco: '50% 35%', selo: 'Coluna · PROPÓSITO', depoCod: 'proposito',
    tit: 'O meu propósito estava na minha frente. Eu é que não enxergava.',
    verso: { txt: 'Pois onde estiver o seu tesouro, aí também estará o seu coração.', ref: 'Mateus 6:21' },
    pontos: [
      { i: 'estrela', t: 'O meu tesouro estava lá fora: nos títulos e nos reconhecimentos. <b>Dentro de casa, havia dois filhos precisando de mim.</b>' },
      { i: 'livro', t: 'Eu era juíza e não sabia que existia o livro de Juízes. Abri a Bíblia na história de Débora: <b>“levantei-me como mãe em Israel”</b>.' }
    ],
    extras: [
      { when: A => is(A, 'P22', 2), html: 'Você disse que o seu propósito existe, mas você não enxerga. É exatamente isso que este teste vai te mostrar.' },
      { when: A => is(A, 'P22', 3), html: 'Você acha que não tem um propósito. Eu também achava. Termine o teste: você vai se surpreender.' },
      { when: A => is(A, 'P22', 1), html: 'Você disse que o seu propósito está claro, mas você não vive. Enxergar é o primeiro passo; viver com presença é o segundo.' },
      { when: A => is(A, 'P22', 0), html: 'Você disse que o seu propósito está claro e que você vive. Agora é deixar que ele transborde.' }
    ],
    codigo: 'Onde estiver o seu tesouro, aí estará o seu coração.',
    btn: 'Próxima coluna' },

  /* TRANSBORDO */
  { id: 'P23', t: 'q', cod: 'transbordo', rotulo: '“Você deveria ensinar isso”',
    q: 'Alguém já te disse “você deveria ensinar isso” ou “como você consegue?”',
    o: [ { txt: 'Muitas vezes', e: '🙌', p: 3 }, { txt: 'Algumas vezes', e: '🙂', p: 2 },
         { txt: 'Raramente', e: '🤏', p: 1 }, { txt: 'Nunca', e: '🚫', p: 0 } ] },

  { id: 'P24', t: 'q', cod: 'transbordo', rotulo: 'Sobre inspirar outras mulheres',
    q: 'O que você vive hoje inspira outras mulheres?',
    o: [ { txt: 'Sim, e eu compartilho', e: '💬', p: 3 }, { txt: 'Acho que sim, mas eu guardo para mim', e: '🤐', p: 2 },
         { txt: 'Acho que não', e: '🤷‍♀️', p: 1 }, { txt: 'Nunca pensei nisso', e: '💭', p: 0 } ] },

  { id: 'I8', t: 'ins', icone: 'estrela', fundo: 'cena-transbordo.jpg', foco: '50% 35%', selo: 'Coluna · TRANSBORDO', depoCod: 'transbordo',
    tit: 'Tudo o que você vive de verdade um dia transborda.',
    verso: { txt: 'Ninguém acende uma candeia e a coloca debaixo de uma vasilha.', ref: 'Mateus 5:15' },
    pontos: [
      { i: 'subindo', t: 'Eu aprendi que a gente tem um desafio: <b>aprender, viver, repassar e transbordar.</b>' },
      { i: 'livro', t: 'Este é o meu quarto ano lendo a Bíblia de capa a capa. Hoje, quase mil pessoas leem comigo. Eu não planejei: fui fiel ao que vivia, e transbordou.' }
    ],
    extras: [
      { when: A => is(A, 'P24', 1), html: 'Você disse que guarda para você. Talvez alguém esteja esperando justamente o que você vive.' },
      { when: A => is(A, 'P24', 3), html: 'Você nunca pensou nisso. Mas o que você vive dentro de casa pode ser exatamente o que outra mulher precisa ouvir.' },
      { when: A => is(A, 'P24', 2), html: 'Você acha que o que vive não inspira ninguém. O transbordo começa pequeno: uma conversa, uma mensagem.' },
      { when: A => is(A, 'P24', 0), html: 'Você já compartilha o que vive. O seu propósito está transbordando.' }
    ],
    codigo: 'O propósito que você vive dentro de casa não fica preso nela.',
    btn: 'Continuar' },

  /* ---------- D. Desejo ---------- */
  { id: 'P25', t: 'q', q: 'Daqui a um ano, o que você quer que a sua família diga de você?',
    o: [ { txt: '“Ela está mais presente”', e: '🤗' }, { txt: '“Ela está em paz”', e: '🕊️' },
         { txt: '“Ela está realizada”', e: '🌟' }, { txt: '“Ela nos inspira”', e: '✨' } ] },

  { id: 'P26', t: 'q', q: 'Que área você mais quer ver de pé primeiro?',
    o: [ { txt: 'Meu casamento', e: '💍', show: A => casada(A) }, { txt: 'Meus filhos', e: '👧', show: A => mae(A) },
         { txt: 'Eu mesma', e: '🌸' }, { txt: 'Meu trabalho', e: '💼' }, { txt: 'Minha fé', e: '🙏' } ] },

  { id: 'P27', t: 'q', q: 'Se você enxergasse o seu propósito com clareza amanhã, o que mudaria primeiro?',
    o: [ { txt: 'A forma como eu uso o meu tempo', e: '⏰' }, { txt: 'A forma como eu trato quem eu amo', e: '💛' },
         { txt: 'As escolhas do meu trabalho', e: '💼' }, { txt: 'A minha paz', e: '🕊️' } ] },

  { id: 'I9', t: 'ins', icone: 'casa', fundo: 'cena-casa.jpg', foco: '50% 35%',
    tit: 'A sabedoria edificou a sua casa.',
    verso: { txt: 'A Sabedoria edificou a sua casa, lavrou as suas sete colunas.', ref: 'Provérbios 9:1' },
    pontos: [
      { i: 'casa', t: 'Uma casa não se sustenta numa coluna só. Quando uma delas racha, a casa inteira sente, e o propósito fica encoberto.' }
    ],
    extras: [
      { when: A => is(A, 'P25', 0), html: 'Você quer ouvir da sua família: “Ela está mais presente”. Presença começa quando você enxerga onde está o seu coração.' },
      { when: A => is(A, 'P25', 1), html: '“Ela está em paz.” Paz é o que sobra quando as colunas da casa estão de pé.' },
      { when: A => is(A, 'P25', 2), html: '“Ela está realizada.” Realização não vem de fazer mais: vem de viver o propósito que já está aí.' },
      { when: A => is(A, 'P25', 3), html: '“Ela nos inspira.” Inspirar começa dentro de casa, e depois transborda.' }
    ],
    fecho: 'Agora eu vou te mostrar quais colunas sustentam a sua casa, onde o seu propósito já está e o que está impedindo você de vivê-lo por inteiro.',
    btn: 'Ver as minhas colunas' },

  /* ---------- E. Diagnóstico, solução e captura ---------- */
  { id: 'DIAG', t: 'diag' },

  /* A trava (escolha única) + uma tela de resposta para cada trava. Regra da skill quiz-funnel, erro fatal nº 9. */
  { id: 'P28', t: 'q', q: 'O que mais te trava hoje?',
    sub: 'Escolha a que mais pesa.',
    o: [ { txt: 'Falta direção na Palavra', e: '📖' }, { txt: 'Falta tempo para mim', e: '⏳' },
         { txt: 'Falta alguém que já passou por isso', e: '🧭' }, { txt: 'Constância: eu começo e paro', e: '🔁' },
         { txt: 'Falta coragem para mudar', e: '🦋' } ] },

  { id: 'O1', t: 'ins', show: A => is(A, 'P28', 0), icone: 'livro', fundo: 'cena-palavra.jpg', foco: '50% 35%', depoTrava: 0,
    selo: 'Você respondeu: direção na Palavra',
    tit: 'A Palavra é a lente que faz enxergar.',
    pontos: [
      { i: 'livro', t: 'A Bíblia que o meu marido me deu no começo do namoro ficou <b>13 anos fechada</b>, viajando comigo de comarca em comarca.' },
      { i: 'calendario', t: 'Hoje estou no quarto ano lendo de capa a capa. Na Aula 10 e no plano de leitura <b>A Palavra que Sustenta</b>, eu te mostro como.' },
      { i: 'ancora', t: 'Antes de construir qualquer coisa, precisamos fortalecer o fundamento. <b>E o fundamento é a Palavra.</b>' }
    ],
    btn: 'Continuar' },
  { id: 'O2', t: 'ins', show: A => is(A, 'P28', 1), icone: 'chama', fundo: 'cena-templo.jpg', foco: '50% 35%', depoTrava: 1,
    selo: 'Você respondeu: tempo para mim',
    tit: 'Tempo para você é parte da casa, não um luxo.',
    pontos: [
      { i: 'lua', t: 'Quando a minha primeira filha nasceu, até escovar os dentes parecia uma vitória. Eu sei o que é não ter tempo nem para mim.' },
      { i: 'relogio', t: 'Na coluna TEMPLO, a primeira prática é simples: <b>15 minutos por dia só seus</b>, sempre no mesmo horário.' },
      { i: 'lista', t: 'E cada coluna traz uma prática de <b>poucos minutos por dia</b>.' }
    ],
    btn: 'Continuar' },
  { id: 'O3', t: 'ins', show: A => is(A, 'P28', 2), icone: 'balanca', fundo: 'dayana-biblia.jpg', retrato: true, foco: '55% 4%', depoTrava: 2,
    selo: 'Você respondeu: alguém que já passou',
    tit: 'Eu passei por esse caminho. E caminho com você.',
    pontos: [
      { i: 'balanca', t: 'Fui juíza por cerca de 16 anos. <b>Tinha tudo o que o mundo chama de sucesso, e um vazio.</b>' },
      { i: 'casa', t: 'Em 2021, deixei a magistratura para estar com os meus filhos. Nas aulas, eu conto o que vivi em cada coluna.' }
    ],
    btn: 'Continuar' },
  { id: 'O4', t: 'ins', show: A => is(A, 'P28', 3), icone: 'repetir', fundo: 'cena-constancia.jpg', foco: '50% 35%', depoTrava: 3,
    selo: 'Você respondeu: constância',
    tit: 'Começar e parar tem solução: um pouco, todo dia.',
    pontos: [
      { i: 'calendario', t: 'Este é o meu quarto ano lendo a Bíblia de capa a capa, <b>todos os dias</b>.' },
      { i: 'ancora', t: 'O plano de leitura <b>A Palavra que Sustenta</b> te acompanha <b>por 1 ano</b>, um pouco a cada dia.' },
      { i: 'coracao', t: 'E o desafio <b>A Arte de Estar Presente</b> começa pequeno: <b>um passo por dia, durante 7 dias</b>.' }
    ],
    btn: 'Continuar' },
  { id: 'O5', t: 'ins', show: A => is(A, 'P28', 4), icone: 'coracao', fundo: 'cena-coragem.jpg', foco: '50% 35%', depoTrava: 4,
    selo: 'Você respondeu: coragem para mudar',
    tit: 'Mudar não é largar tudo. É enxergar onde você já está.',
    pontos: [
      { i: 'coracao', t: 'Quando eu disse ao meu marido que pensava em deixar de ser juíza, ele respondeu: <b>“A sua decisão é a minha.”</b>' },
      { i: 'balanca', t: 'Eu não vou te pedir para largar nada. Débora julgava um povo e foi chamada de <b>mãe em Israel</b>.' },
      { i: 'casa', t: 'A mudança começa por uma coluna. <b>O seu mapa mostra qual.</b>' }
    ],
    btn: 'Continuar' },

  { id: 'P29', t: 'q', q: 'Como você aprende melhor?',
    o: [ { txt: 'Assistindo', e: '🎥' }, { txt: 'Lendo', e: '📖' }, { txt: 'Os dois', e: '✨' } ] },

  { id: 'P30', t: 'q', q: 'Quanto você quer cuidar disso agora?',
    o: [ { txt: 'Decidi: é agora', e: '🔥' }, { txt: 'Quero muito', e: '💪' },
         { txt: 'Quero, mas tenho medo de não dar conta', e: '😟' }, { txt: 'Por enquanto, é só curiosidade', e: '👀' } ] },

  { id: 'I10', t: 'antesdepois',
    tit: 'O que muda quando as 7 colunas ficam de pé',
    sub: 'Não é sobre largar a sua vida. É sobre enxergar o que já está nela.',
    caixa: 'Nenhuma dessas mudanças exige largar o que você faz. Exige enxergar.',
    btn: 'Desenhar o meu mapa' },

  { id: 'CAPTURA', t: 'captura',
    tit: 'Vamos desenhar o mapa das suas 7 colunas',
    sub: 'Preencha os seus dados para ver o mapa completo, onde o seu propósito já está e a sua primeira prática para os próximos 7 dias.',
    passos: [ [0, 'Organizando as suas respostas'],
              [14, 'Olhando TEMPLO, PROSPERIDADE e ALIANÇA'],
              [36, 'Olhando HERANÇA, IDENTIDADE, PROPÓSITO e TRANSBORDO'],
              [66, 'Encontrando onde o seu propósito já está'],
              [100, '✓ Mapa pronto'] ],
    btn: 'Ver o meu mapa' },

  { id: 'RESULTADO', t: 'resultado' }
];

/* --------------------------------------------------------------------------
   PÁGINA DE VENDAS (S43)
   -------------------------------------------------------------------------- */
const AULAS = [
  { n: 1,  cod: null, img: 'dayana-biblia.jpg', ic: 'lampada', curto: 'Abertura', tit: 'Aula 1 · Propósito se enxerga', txt: 'Propósito não se encontra, se enxerga. A minha história, Débora e a casa de 7 colunas' },
  { n: 2,  cod: 'identidade',   img: 'cena-identidade.jpg',   tit: 'Aula 2 · IDENTIDADE',   txt: 'Quem você é, além do que faz e dos papéis que ocupa' },
  { n: 3,  cod: 'proposito',    img: 'cena-proposito.jpg',    tit: 'Aula 3 · PROPÓSITO',    txt: 'Onde está o seu tesouro, e como trazer o coração de volta para casa' },
  { n: 4,  cod: 'templo',       img: 'cena-templo.jpg',       tit: 'Aula 4 · TEMPLO',       txt: 'A sua mente e o seu corpo como parte da casa' },
  { n: 5,  cod: 'alianca',      img: 'cena-alianca.jpg',      tit: 'Aula 5 · ALIANÇA',      txt: 'A união de propósitos, no casamento e nas relações que caminham com você' },
  { n: 6,  cod: 'heranca',      img: 'cena-heranca.jpg',      tit: 'Aula 6 · HERANÇA',      txt: 'O que fica em quem vem depois de você' },
  { n: 7,  cod: 'prosperidade', img: 'cena-prosperidade.jpg', tit: 'Aula 7 · PROSPERIDADE', txt: 'Provisão com paz, sem culpa para nenhum lado' },
  { n: 8,  cod: 'transbordo',   img: 'cena-transbordo.jpg',   tit: 'Aula 8 · TRANSBORDO',   txt: 'Quando o que você vive começa a alcançar outras pessoas' },
  { n: 9,  cod: null, img: 'cena-presenca.jpg', ic: 'coracao', curto: 'Presença', tit: 'Aula 9 · Presença não é produtividade', txt: 'Como viver com presença, e não no automático' },
  { n: 10, cod: null, img: 'cena-palavra.jpg', ic: 'livro', curto: 'A Palavra', tit: 'Aula 10 · A Palavra todos os dias', txt: 'Como eu leio a Bíblia de capa a capa e ligo cada leitura a uma coluna' }
];

/* valor: preço de referência mostrado riscado, por posição: os mesmos valores do Quiz 1, pedido da Mayara (07/10/2026).
   Na v1.6 (08/10/2026) os bônus 1, 2, 4 e 5 mudaram de conteúdo e mantiveram o valor da posição:
   Agenda R$ 197 · Mapa da Nova Estação R$ 97 · livro R$ 39,90 (preço público) · A Arte de Estar Presente R$ 97 · A Palavra que Sustenta R$ 197. Soma: R$ 627,90.
   Pendente: o aval da Dayana para os valores de referência e o conteúdo dos materiais (ver especialista.md, Pendências). */
const BONUS = [
  { id: 'B1', ic: 'calendario', valor: 197, cor: '#6a5a9e', tag: 'Agenda', tit: 'Bônus 1 · Agenda da Mulher que Transborda', nome: 'Agenda da Mulher que Transborda',
    txt: 'Para planejar a sua rotina com propósito, sem deixar de fora o que mais importa.' },
  { id: 'B2', ic: 'bussola', valor: 97, cor: '#4f7a64', tag: 'Mapa', tit: 'Bônus 2 · O Mapa da Minha Nova Estação', nome: 'O Mapa da Minha Nova Estação',
    txt: 'Para você entender em que momento da vida está.' },
  { id: 'B3', ic: 'livro', valor: 39.9, cor: '#a5506b', tag: 'Livro digital', tit: 'Bônus 3 · Livro digital <em>Minha Última Sentença</em>', nome: '<em>Minha Última Sentença</em>',
    txt: 'A minha história, da toga ao “Mamãe, até que enfim você chegou”.' },
  { id: 'B4', ic: 'coracao', valor: 97, cor: '#4a7090', tag: 'Desafio de 7 dias', tit: 'Bônus 4 · A Arte de Estar Presente', nome: 'A Arte de Estar Presente',
    txt: 'Um desafio de 7 dias, um passo por dia.',
    /* Dias 4 e 6 mudam para quem não é mãe ou não é casada (o material da Dayana precisa ter as duas versões) */
    dias: ['Uma refeição sem celular', 'Uma conversa sem interrupções', 'Um momento de oração sem distrações',
           A => mae(A) ? 'Brincar ou conversar com os filhos' : 'Conversar com alguém que você ama',
           'Estar presente consigo mesma',
           A => casada(A) ? 'Estar presente no casamento' : 'Estar presente com quem caminha com você',
           'Observar onde a sua atenção realmente está'] },
  { id: 'B5', ic: 'ancora', valor: 197, cor: '#b0604d', tag: 'Plano de leitura', tit: 'Bônus 5 · A Palavra que Sustenta', nome: 'A Palavra que Sustenta',
    txt: 'Plano de leitura bíblica de 1 ano. Antes de construir qualquer coisa, precisamos fortalecer o fundamento. E o fundamento é a Palavra.',
    extra: { when: A => is(A, 'P6', 2) || is(A, 'P6', 3), html: 'Você me disse que {biblia_frase}. Este bônus foi feito exatamente para isso.' } }
];

const OFERTA_ITENS = [
  { t: '10 aulas de <em>As 7 Colunas</em>' },
  { t: 'Agenda da Mulher que Transborda', b: 'B1' },
  { t: 'O Mapa da Minha Nova Estação', b: 'B2' },
  { t: 'Livro digital <em>Minha Última Sentença</em>', b: 'B3' },
  { t: 'Desafio <em>A Arte de Estar Presente</em>', b: 'B4' },
  { t: 'Plano de leitura <em>A Palavra que Sustenta</em>', b: 'B5' }
];

const AUTORIDADE = [
  { i: 'balanca', cor: '#4a7090', t: 'Juíza por cerca de 16 anos, aprovada aos 23' },
  { i: 'casa', cor: '#a5506b', t: 'Deixou a magistratura em 2021 para estar com os filhos' },
  { i: 'livro', cor: '#6a5a9e', t: 'Autora de <em>Minha Última Sentença</em>' },
  { i: 'calendario', cor: '#4f7a64', t: 'No 4º ano lendo a Bíblia de capa a capa, com quase mil pessoas' },
  { i: 'coracao', cor: '#b0604d', t: 'Esposa e mãe de dois filhos' },
  { i: 'pessoa', cor: '#3f7f80', t: 'Fala em encontros como o “Mulheres Formadoras de Gerações”' }
];

const PARA_QUEM_E = [
  'você trabalha fora, está no lar ou faz tudo ao mesmo tempo',
  'você sente que falta alguma coisa, mesmo com a vida em ordem',
  'você quer ler a Bíblia e aplicar no seu dia a dia',
  'você quer estar presente de verdade com quem ama'
];
const PARA_QUEM_NAO_E = [
  'você procura alguém que te diga para largar o seu trabalho (eu não vou dizer)',
  'você quer uma fórmula sem prática',
  'você não quer olhar para a sua própria casa'
];

/* Valores das variáveis (roteiro, seção F) */
const VALORES = {
  idade: ['18 a 24 anos', '25 a 34 anos', '35 a 50 anos', '51 anos ou mais'],
  palavra: ['Correria', 'Vazio', 'Transição', 'Crescimento'],
  folga: ['paz', 'um cansaço que não passa', 'culpa por não estar produzindo', 'um vazio'],
  desejo_familia: ['“Ela está mais presente”', '“Ela está em paz”', '“Ela está realizada”', '“Ela nos inspira”'],
  falta: ['direção na Palavra', 'tempo para você', 'alguém que já passou por isso', 'constância', 'coragem para mudar'],
  biblia_frase: ['lê a Bíblia todos os dias', 'lê às vezes', 'quer ler, mas não consegue manter', 'ainda não tem esse hábito']
};
