/* ==========================================================================
   CONFIGURAÇÃO — preencher antes de publicar.
   Tudo o que está vazio fica desligado (a página funciona sem quebrar).
   ========================================================================== */
window.CONFIG = {
  /* Vídeo de boas-vindas (roteiro: "Vídeo da página de obrigado", ~1min15s).
     Suba o arquivo assets/Aulas/Bem-vindo.mp4 como vídeo "não listado" no YouTube
     ou no Vimeo (não precisa ser público) e cole aqui o link de incorporar (embed):
     YouTube: https://www.youtube.com/embed/ID_DO_VIDEO
     Vimeo:   https://player.vimeo.com/video/ID_DO_VIDEO */
  VIDEO_EMBED_URL: '',

  /* Pré-visualização local (não é a versão publicada): toca o arquivo direto da pasta assets/video/.
     Some sozinho quando VIDEO_EMBED_URL estiver preenchido. Não sobe para o site publicado (arquivo
     grande demais para o GitHub Pages) — serve só para a Mayara ver como o vídeo fica na página. */
  VIDEO_LOCAL_SRC: 'assets/video/Bem-vindo.mp4',

  /* Link de acesso ao produto (área de membros, Hotmart, Google Drive...). Vazio = o botão não aparece. */
  ACESSO_URL: '',
  ACESSO_BOTAO_TEXTO: 'Acessar agora',

  /* Texto sobre como e quando o acesso chega (ex.: "Você recebe o acesso por e-mail em até 15 minutos.").
     Vazio = aparece um texto neutro, sem prometer prazo. */
  COMO_RECEBE: '',

  /* true = mostra caixas "FOTO/VÍDEO: …" onde ainda falta configurar algo.
     Deixar false na versão publicada. */
  MOSTRAR_ESPACOS_RESERVADOS: true
};
