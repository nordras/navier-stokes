# A IA resolveu Navier–Stokes? / Did AI solve Navier–Stokes?

Apresentação de ~10 minutos em SPA React + Vite, em **português e inglês**. Animações com [Motion](https://motion.dev) (`motion/react`), equações com KaTeX, fundos de fluido em `<canvas>`.

## Rodar

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # build estático em dist/
```

## Atalhos

| Tecla | Ação |
| --- | --- |
| → / Espaço / Enter | próximo passo / slide (também inicia o cronômetro) |
| ← | passo / slide anterior |
| L | alterna português ↔ inglês (também há o botão PT/EN no canto) |
| N | notas do apresentador + cronômetro vs. meta por slide |
| T / R | pausar/retomar · zerar cronômetro |
| F | tela cheia |
| Esc | fecha o trecho aberto |
| ? | atalhos |

Cada slide tem endereço próprio: `#slide-3`. Slides com passos (como o 8) mostram bolinhas ao lado do contador; a seta avança o passo antes de trocar de slide.

As referências do último slide ficam em `src/references.js`.

## Trechos das fontes (modais)

Os chips 📄 (paper) e **W** (Wikipedia) nos slides abrem um modal com o trecho correspondente.

- **Paper:** o PDF fica no próprio projeto (`public/2610.08144v1.pdf`) e é renderizado com [pdf.js](https://mozilla.github.io/pdf.js/) dentro do modal, aberto na página certa e com o trecho destacado em amarelo. Ao lado, resumo em PT/EN, fórmulas e nomes dos arquivos/teoremas Lean citados. Dá para navegar pelas páginas e voltar ao trecho.
- **Wikipedia:** resumo em PT/EN com link para o artigo.

Conteúdo em `src/excerpts.js`: `page` é a página do PDF e `find` o texto a destacar (busca ignorando espaços). Para mostrar uma citação literal, preencha `quote`.

## Roteiro (~13:05)

| # | Slide | Meta |
|---|---|---|
| 1 | Título | 0:15 |
| 2 | A equação (passe o mouse nos termos) | 0:35 |
| 3 | Conservação de massa: continuidade (cano animado, A·v constante) | 0:40 |
| 4 | Conservação de momento: de Cauchy a Navier–Stokes (parcela sendo cisalhada) | 0:50 |
| 5 | Euler (ν = 0): simulação ao vivo, com vs. sem viscosidade | 0:45 |
| 6 | Navier–Stokes hipodissipativo: botões de α + reta 0 → 5/4 | 0:50 |
| 7 | Blow-up: "a matemática retorna NaN" | 0:45 |
| 8 | Prêmio do Milênio: **enquete** (A)–(D) em passos — clique nas cartas para marcar votos; → revela a alegação da OpenAI; → a "pegadinha" | 0:55 |
| 9 | Simulação ≠ prova · o que é Lean | 0:40 |
| 10 | Linha do tempo 2013 → 2026 | 0:45 |
| 11 | A execução de 88 h da OpenAI | 0:50 |
| 12 | A briga por prioridade | 0:55 |
| 13 | Reações da comunidade | 0:40 |
| 14 | "Lost in Translation": dois tipos de autoformalização | 0:50 |
| 15 | Exemplo de brinquedo (Ex. 2.1) | 0:40 |
| 16 | Más traduções no paper real (Lema 8.6, eq. 10.19) | 0:45 |
| 17 | Por que é difícil: `sInf ∅ = 0`, escada SCI | 0:45 |
| 18 | Status + lições + fontes | 0:40 |
| 19 | Referências (vídeo e bibliografia, com links) | — |

As simulações dos slides 5 e 6 são reais: equação de Burgers 1D (com dissipação fracionária) resolvida por método pseudo-espectral no navegador (`src/sim/burgers.js`). É um modelo de brinquedo de Navier–Stokes — a mesma briga entre advecção e viscosidade, numa dimensão.

Textos e notas ficam em `src/slides/index.jsx` e `src/slides/physics.jsx` (cada texto como `t('português', 'English')`).

## Fontes
- Wikipedia — Navier–Stokes priority controversy
- Bastounis, Circelli & Hansen — *Navier–Stokes Lost in Translation*, arXiv:2610.08144
- Luis Serrano Academy — *Did AI Solve Navier-Stokes?* (YouTube, ptE6BcaSwBY)
