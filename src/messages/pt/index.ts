export default {
  common: {
    download: 'Baixar',
    downloadVideo: 'Baixar Vídeo',
    downloadOriginalVideo: 'Baixar Vídeo Original',
    downloadMP3: 'Baixar MP3',
    processing: 'Processando...',
    error: 'Ocorreu um erro',
    success: 'Sucesso',
    retry: 'Tentar Novamente',
    videoLoadError: 'Erro ao carregar o vídeo. A conexão pode estar instável.',
  },
  home: {
    title: 'Baixe e Corte seus Vídeos',
    subtitle: 'Ferramenta online para download e edição de vídeos de qualquer plataforma',
  },
  videoForm: {
    title: 'Baixar Vídeo',
    subtitle: 'Cole a URL do vídeo abaixo para começar',
    urlLabel: 'URL do Vídeo',
    urlPlaceholder: 'https://www.youtube.com/watch?v=exemplo',
    supportedPlatforms: 'Suporta YouTube, Vimeo, Twitter e muitas outras plataformas.',
    invalidUrl: 'Por favor, insira uma URL válida',
    downloadFailure: 'Falha ao baixar o vídeo',
    unexpectedError: 'Ocorreu um erro inesperado',
  },
  videoStatus: {
    downloading: 'Baixando vídeo de {url}',
    downloadComplete: 'Download concluído com sucesso!',
    incompleteResponse: 'Resposta incompleta do servidor. Verifique o console para detalhes.',
  },
  originalVideo: {
    title: 'Vídeo Original',
    subtitle: 'Baixe o vídeo completo sem edição',
  },
  processedMedia: {
    videoReady: 'Seu vídeo está pronto!',
    videoProcessed: 'O vídeo foi cortado com sucesso e está pronto para download.',
    audioReady: 'Seu áudio está pronto!',
    audioProcessed: 'O MP3 foi extraído com sucesso e está pronto para download.',
  },
  navigation: {
    backToHome: '← Voltar para a Página Inicial',
  },
  footer: {
    termsLink: 'Termos de Uso',
    privacyLink: 'Política de Privacidade',
    disclaimer:
      'Esta ferramenta deve ser usada apenas para conteúdo que você possui direitos ou que esteja em domínio público. Não nos responsabilizamos pelo uso indevido que viole direitos autorais ou termos de serviço de plataformas.',
    copyright: '© {year} VideoDownCut -',
    licensedUnder: ' Licenciado sob ',
    mitLicense: 'Licença MIT',
  },
  cutControls: {
    title: 'Cortar Vídeo',
    selectSegment: 'Selecione o segmento de vídeo para cortar:',
    currentTime: 'Tempo atual:',
    totalDuration: 'Duração total:',
    markStart: 'Marcar Início',
    markEnd: 'Marcar Fim',
    fullVideoDownloadTitle: 'Baixar vídeo completo',
    fullVideoDownloadSubtitle: 'Prefere o vídeo original sem edições? Baixe o arquivo completo.',
    downloadFull: 'Baixar Completo',
    outputType: 'Tipo de Saída',
    videoOption: 'Vídeo',
    audioOption: 'Áudio (MP3)',
    videoFormat: 'Formato de Vídeo',
    mp4Option: 'MP4 - Formato mais compatível',
    webmOption: 'WebM - Melhor para web',
    mkvOption: 'MKV - Maior qualidade',
    processing: 'Processando...',
    cutVideoButton: 'Cortar Vídeo',
    extractMp3Button: 'Extrair MP3',
    processedVideo: 'Vídeo Processado:',
    processedAudio: 'Áudio Processado:',
    mp3SuccessMessage:
      'Seu arquivo MP3 foi extraído com sucesso! Você pode reproduzir acima ou baixar diretamente.',
    openInWindow: 'Abrir em Nova Janela',
    downloadDirectly: 'Baixar Diretamente',
    returnToEditing: 'Voltar para Edição',
  },
  terms: {
    title: 'Termos de Uso',
    intro: 'Ao utilizar o VideoDownCut, você concorda com os seguintes termos e condições:',
    contentOwnership: {
      title: '1. Propriedade do Conteúdo',
      text: 'Você deve baixar e modificar apenas vídeos sobre os quais você tenha direitos legais de acesso e modificação, ou aqueles que estejam em domínio público. O VideoDownCut não é responsável por qualquer violação de direitos autorais resultante do uso do serviço.',
    },
    usageLimitations: {
      title: '2. Limitações de Uso',
      text: 'O VideoDownCut é fornecido "como está" sem garantia de qualquer tipo. O serviço pode ter limitações de uso baseadas na capacidade do servidor, e nos reservamos o direito de modificar ou descontinuar o serviço a qualquer momento sem aviso prévio.',
    },
    prohibitedActivities: {
      title: '3. Atividades Proibidas',
      text: 'Você não pode usar o VideoDownCut para fins ilegais ou para baixar conteúdo que viole os termos de serviço das plataformas de origem. Não armazenamos vídeos permanentemente em nossos servidores - todos os vídeos processados são armazenados temporariamente e excluídos automaticamente após um curto período.',
    },
  },
  privacy: {
    title: 'Política de Privacidade',
    intro:
      'Esta Política de Privacidade descreve como o VideoDownCut coleta, usa e protege as informações que você fornece ao utilizar nosso serviço.',
    infoCollection: {
      title: '1. Coleta de Informações',
      text: 'Ao utilizar o VideoDownCut, coletamos apenas as informações mínimas necessárias para fornecer nosso serviço, que incluem:',
      items: [
        'As URLs dos vídeos que você envia para download/processamento',
        'Arquivos de vídeo temporários durante o processamento',
        'Logs padrão do servidor, incluindo endereços IP e informações do navegador',
      ],
    },
    infoUsage: {
      title: '2. Uso das Informações',
      text: 'As informações que coletamos são usadas exclusivamente para:',
      items: [
        'Processar suas solicitações de vídeo',
        'Melhorar a funcionalidade do nosso serviço',
        'Solucionar problemas técnicos',
      ],
      additional:
        'Não compartilhamos suas informações pessoais com terceiros. Todos os arquivos de vídeo são excluídos automaticamente de nossos servidores logo após o processamento.',
    },
    cookies: {
      title: '3. Cookies e Rastreamento',
      text: 'O VideoDownCut usa cookies mínimos apenas para funcionalidades essenciais. Não utilizamos cookies de rastreamento ou análises que identifiquem usuários individuais.',
    },
  },
};
