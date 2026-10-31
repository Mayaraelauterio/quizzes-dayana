/* ==========================================================================
   CONFIGURAÇÃO — preencher antes de publicar.
   Tudo o que está vazio fica desligado (o quiz funciona sem quebrar).
   ========================================================================== */
window.CONFIG = {
  /* Preço por faixa de pontuação do lead (ver leadScore() em app.js, 0 a 100: carreira, tempo de estudo,
     provas já feitas e quanto quer mudar agora). Da pontuação mínima mais baixa (lead mais frio, preço menor)
     para a mais alta (lead mais quente, preço maior). As UTMs da visita são repassadas automaticamente em cada link.
     PRECOS vazio = usa CHECKOUT_URL e PRECO abaixo, um preço só para todo mundo. */
  PRECOS: [
    { min: 0,  preco: 'R$ 47,00',  valor: 47,  checkout: 'https://payfast.greenn.com.br/200695/offer/tqH6qo' },
    { min: 20, preco: 'R$ 67,00',  valor: 67,  checkout: 'https://payfast.greenn.com.br/200695/offer/vk5ZMe' },
    { min: 40, preco: 'R$ 87,00',  valor: 87,  checkout: 'https://payfast.greenn.com.br/200695/offer/wzB3JK' },
    { min: 60, preco: 'R$ 127,00', valor: 127, checkout: 'https://payfast.greenn.com.br/200695/offer/Q6LL86' },
    { min: 80, preco: 'R$ 147,00', valor: 147, checkout: 'https://payfast.greenn.com.br/200695/offer/IPyWYP' }
  ],

  /* Link do checkout (Green ou outra plataforma), usado só se PRECOS estiver vazio. */
  CHECKOUT_URL: '',

  /* Webhook que recebe o lead (n8n, Make, CRM). POST em JSON. */
  WEBHOOK_URL: '',

  /* Meta Pixel (só o número). */
  META_PIXEL_ID: '',

  /* Oferta (preço usado só se PRECOS estiver vazio) */
  PRECO: 'R$ 47,00',
  PARCELAS_TEXTO: 'ou parcelado no cartão (valor calculado pela plataforma)',

  /* Texto do FAQ "Como eu recebo?". Vazio = a pergunta não aparece. */
  COMO_RECEBE: '',

  /* Ex.: 'Acesso imediato'. Vazio = não aparece. Confirmar com a plataforma. */
  ACESSO_TEXTO: '',

  /* Rodapé */
  EMPRESA_RAZAO: '',
  EMPRESA_CNPJ: '',
  POLITICA_URL: '',
  TERMOS_URL: '',

  /* true = mostra caixas "FOTO: …" e "DEPOIMENTO 1 (aguardando)" onde ainda faltam arquivos.
     Deixar false na versão publicada: aí as fotos ausentes somem e a tela de depoimentos
     só aparece quando houver depoimentos em data.js. */
  MOSTRAR_ESPACOS_RESERVADOS: true
};
