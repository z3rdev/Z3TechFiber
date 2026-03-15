

## Tech-Fiber — PWA para Técnicos de Fibra Óptica

### Visão Geral
App mobile-first (PWA) com tema dark industrial inspirado na imagem de referência (sidebar escura com acentos verdes/cyan). O técnico abre o app, vê o mapa com sua localização e as CTOs próximas, e pode gerenciar portas e clientes.

---

### 1. Design System & PWA Setup
- Tema **Matte Obsidian** com cores da referência: fundo escuro `#0A0A0B`, cyan `#00FFFF` como cor primária, verde neon para status online, vermelho para LOS, âmbar para sinal alto
- Fontes: `Geist Mono` para IDs/números, `IBM Plex Sans` para corpo
- Configurar PWA (vite-plugin-pwa) para instalação na home screen
- Touch targets mínimos de 48px

### 2. Autenticação
- Tela de login com email/senha (Supabase será conectado depois, começar com mock)
- Layout clean e escuro seguindo o tema

### 3. Layout Principal — Sidebar + Mapa
- **Sidebar** estilo da imagem de referência: logo "Tech-Fiber" no topo com ícone de wifi, menu com seções:
  - **Painel** (Dashboard, Métricas)
  - **Sistema** (configurações)
  - **Site** (info)
  - **Tools** (ferramentas)
- Barra de pesquisa no topo da sidebar
- **Mapa** (MapLibre GL JS com estilo Dark Matter) ocupando a área principal
  - Geolocalização automática do técnico
  - Ícones hexagonais para as CTOs com número de portas livres

### 4. Tela de Manutenção da CTO (Bottom Sheet)
- Ao clicar numa CTO no mapa, abre um **drawer/bottom-sheet** (não modal)
- Header: "CTO-42: 12/16 Portas Ativas"
- **Grade de Portas** (2x8 para 16 portas): cada porta mostra:
  - Número da porta
  - Nome/ID do cliente
  - Nível de sinal (ex: `-19.2 dBm`)
  - LED de status (verde=online, vermelho=LOS, âmbar=sinal alto, cinza=offline)

### 5. Lógica de Troca de Porta (Smart Swap)
- Drag & drop para mover cliente entre portas
- Se a porta destino estiver **livre**: move direto
- Se a porta destino estiver **ocupada**: executa o **Swap Automático**:
  1. Cria porta temporária virtual
  2. Move ocupante da porta destino → temp
  3. Move cliente original → porta destino
  4. Move temp → porta original
  5. Remove porta temp
  6. Animação de carrossel + feedback visual (porta brilha em roxo durante o processo)

### 6. Dashboard
- Página inicial com resumo: total de CTOs, portas ativas, alertas de LOS, técnicos online
- Cards com métricas rápidas

### 7. Dados Mock
- CTOs com coordenadas fictícias próximas a uma localização padrão
- Clientes com status variados e níveis de sinal realistas
- Tudo pronto para substituir por API real depois

