// POST /api/telas   { q: 'quiz-1-7-codigos', t: [{ id: 'P7', o: 12, n: 'P7 · Qual a sua idade?', c: 0 }, ...] }
// Retenção por tela (aba Leads do hub da Mayara, pedido de 06/11/2026): cada quiz avisa as telas que a pessoa viu,
// uma vez por pessoa e tela, em lotes. Aqui só se soma +1 em cada tela, no dia (São Paulo) e no total.
// SEM DADO PESSOAL: só o código, a posição e o título fixo da tela. Nada de nome, e-mail, WhatsApp, respostas ou IP.
// Banco: "quizzes-telas" (ligação TELAS no wrangler.toml), separado do banco do hub. Tabela: meu-hub/migrations-telas/.
// Recusa (sem gravar nada): outro método, outro site, quiz fora da lista, corpo grande ou tela fora do formato.

const QUIZZES = ['quiz-1-7-codigos', 'sentenca-anuncio'];
const MAX_CORPO = 6000;   // bytes
const MAX_TELAS = 20;     // telas por aviso
const dia = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' });

export async function onRequestPost({ request, env }) {
  const recusa = new Response(null, { status: 400 });
  try {
    const origem = request.headers.get('Origin');
    if (!origem || new URL(origem).host !== new URL(request.url).host) return recusa;
    if (!env.TELAS) return new Response(null, { status: 503 });

    const bruto = await request.text();
    if (!bruto || bruto.length > MAX_CORPO) return recusa;
    const d = JSON.parse(bruto);
    if (!d || !QUIZZES.includes(d.q) || !Array.isArray(d.t) || !d.t.length || d.t.length > MAX_TELAS) return recusa;

    const telas = new Map();
    for (const t of d.t) {
      if (!t || typeof t.id !== 'string' || !/^[A-Za-z0-9_-]{1,20}$/.test(t.id)) return recusa;
      const o = Number(t.o);
      if (!Number.isInteger(o) || o < 1 || o > 300) return recusa;
      const n = String(t.n == null ? '' : t.n).replace(/[\u0000-\u001f\u007f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 90);
      telas.set(t.id, { id: t.id, o, n, c: t.c ? 1 : 0 });
    }

    const agora = new Date().toISOString();
    await env.TELAS.prepare(`INSERT INTO telas_contagem (id, quiz, dia, tela, ordem, nome, condicional, pessoas, criado_em, atualizado_em, arquivado)
      SELECT ?1 || '|' || d.value || '|' || json_extract(t.value, '$.id'), ?1, d.value, json_extract(t.value, '$.id'),
        json_extract(t.value, '$.o'), json_extract(t.value, '$.n'), json_extract(t.value, '$.c'), 1, ?3, ?3, 0
      FROM json_each(?2) t, json_each(?4) d WHERE true
      ON CONFLICT(id) DO UPDATE SET pessoas = pessoas + 1, ordem = excluded.ordem, nome = excluded.nome,
        condicional = excluded.condicional, atualizado_em = excluded.atualizado_em`)
      .bind(d.q, JSON.stringify([...telas.values()]), agora, JSON.stringify([dia.format(new Date()), 'total'])).run();
    return new Response(null, { status: 204 });
  } catch (e) {
    return recusa;
  }
}
