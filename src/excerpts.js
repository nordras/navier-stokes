/**
 * Trechos das fontes, abertos em modal pelos chips <Ref id="..."/> nos slides.
 *
 * Os textos abaixo são RESUMOS/paráfrases com a referência exata (seção, exemplo),
 * fórmulas e nomes de arquivos/teoremas citados nas fontes.
 * Trechos do paper abrem o PDF local (public/2610.08144v1.pdf) na página `page`,
 * destacando o texto `find` (busca ignorando espaços).
 * Se quiser mostrar a citação literal no modal, preencha `quote` com o trecho
 * copiado da fonte (curto, com atribuição) — o modal exibe automaticamente.
 */

const PAPER = 'https://arxiv.org/abs/2610.08144'
const WIKI = 'https://en.wikipedia.org/wiki/Navier%E2%80%93Stokes_priority_controversy'

export const SOURCES = {
  paper: {
    name: 'Bastounis, Circelli & Hansen — "Navier-Stokes Lost in Translation", arXiv:2610.08144',
    url: PAPER,
  },
  wiki: {
    name: 'Wikipedia — "Navier–Stokes priority controversy"',
    url: WIKI,
  },
}

export const EXCERPTS = {
  /* ───────────── Wikipedia ───────────── */
  'wiki-background': {
    source: 'wiki',
    where: { pt: 'Contexto matemático', en: 'Mathematical background' },
    title: { pt: 'De Luo–Hou (2013) a Córdoba–Martínez-Zoroa (2023)', en: 'From Luo–Hou (2013) to Córdoba–Martínez-Zoroa (2023)' },
    body: {
      pt: [
        'Euler é o caso particular de Navier–Stokes com viscosidade zero.',
        'Em 2013, Guo Luo e Thomas Hou apresentaram evidência numérica de que soluções de Euler poderiam explodir em tempo finito.',
        'Em 2023, Diego Córdoba e Luis Martínez-Zoroa introduziram novas construções de blow-up. Com Fan Zheng, obtiveram blow-up sem forçamento para Euler 3D e blow-up forçado para Navier–Stokes hipodissipativo — ambos com lacunas em relação ao problema original.',
      ],
      en: [
        'Euler is the special case of Navier–Stokes with zero viscosity.',
        'In 2013, Guo Luo and Thomas Hou presented numerical evidence that Euler solutions could blow up in finite time.',
        'In 2023, Diego Córdoba and Luis Martínez-Zoroa introduced new blow-up constructions. With Fan Zheng they obtained unforced blow-up for 3D Euler and forced blow-up for hypodissipative Navier–Stokes — both with gaps relative to the original problem.',
      ],
    },
  },
  'wiki-run': {
    source: 'wiki',
    where: { pt: 'A solução da OpenAI', en: "OpenAI's solution" },
    title: { pt: 'A execução de 88 horas', en: 'The 88-hour run' },
    body: {
      pt: [
        'Um sistema multiagente interno rodou por 88 horas a partir de 1º de setembro de 2026, com pelo menos 10.000 agentes, 2,7 milhões de mensagens e 130 bilhões de tokens de saída.',
        'Resultado: um paper de 166 páginas e uma formalização verificada em Lean. A OpenAI anunciou ter estabelecido as alternativas (C) e (D) de Fefferman.',
        'Só a eletricidade foi estimada em milhões de dólares, o que Noam Brown confirmou. Segundo Brown, a OpenAI já havia tentado os problemas do Milênio antes, sem resultado; o treino do modelo usado começou em 28 de agosto.',
      ],
      en: [
        'An internal multi-agent system ran for 88 hours starting Sep 1, 2026, with at least 10,000 agents, 2.7 million messages and 130 billion output tokens.',
        "Output: a 166-page paper and a computer-verified Lean formalisation. OpenAI announced it had established Fefferman's alternatives (C) and (D).",
        'Electricity alone was estimated in the millions of dollars, which Noam Brown confirmed. Brown said OpenAI had tried the Millennium problems before without results; training of the model used began on Aug 28.',
      ],
    },
  },
  'wiki-timeline': {
    source: 'wiki',
    where: { pt: 'Linha do tempo', en: 'Timeline' },
    title: { pt: '2 a 8 de setembro de 2026', en: 'September 2–8, 2026' },
    body: {
      pt: [
        '31/ago: Alpöge publica "Augustus Mirabilis", que a OpenAI teria lido como indício de que a Anthropic resolvera um problema do Milênio. 1/set: começa a execução multiagente da OpenAI.',
        '2/set: Alpöge contata a OpenAI após ser avisado de que o trabalho dele e de Buckmaster tinha vazado. 3/set: Buckmaster contata um matemático da OpenAI.',
        '6/set: Bubeck escreve para Alpöge (11h48) sobre a solução da OpenAI e para Buckmaster (12h45) pedindo uma reunião, que acontece à tarde sem Alpöge.',
        '7/set, antes da meia-noite: Buckmaster publica sua declaração e os resultados para Euler/IPM/Boussinesq. 8/set, meio-dia: a OpenAI anuncia sua solução, cerca de 12 horas depois.',
      ],
      en: [
        'Aug 31: Alpöge posts "Augustus Mirabilis", which OpenAI reportedly read as implying Anthropic had solved a Millennium problem. Sep 1: OpenAI\'s multi-agent run begins.',
        'Sep 2: Alpöge contacts OpenAI after being tipped that his and Buckmaster\'s work had leaked. Sep 3: Buckmaster contacts an OpenAI mathematician.',
        'Sep 6: Bubeck messages Alpöge (11:48) about OpenAI\'s solution and Buckmaster (12:45) asking to meet; the meeting happens that afternoon without Alpöge.',
        'Sep 7, before midnight: Buckmaster posts his statement and the Euler/IPM/Boussinesq results. Sep 8, noon: OpenAI announces its solution, about 12 hours later.',
      ],
    },
  },
  'wiki-dispute': {
    source: 'wiki',
    where: { pt: 'Alegações e disputas', en: 'Claims and disputes' },
    title: { pt: 'As duas versões', en: 'The two versions' },
    body: {
      pt: [
        'Buckmaster e Alpöge: os resultados deles para Euler podem ter vazado para a OpenAI e inspirado os prompts dos agentes. Buckmaster também questionou se a OpenAI acessou dados de usuários do Codex ou os usou em treino.',
        'OpenAI: as provas diferem "significativamente". Inicialmente disse que dados de usuário não foram acessados; depois confirmou que dados desidentificados derivados de uso podem ter sido usados em treino — negando qualquer influência dos prompts de Buckmaster.',
        'A OpenAI propôs que Buckmaster reportasse o resultado de Euler primeiro, ou reescrevesse a prova da OpenAI como autor principal. Ambos recusaram. Bubeck depois se desculpou pelo tom de uma mensagem.',
      ],
      en: [
        "Buckmaster and Alpöge: their Euler results may have leaked to OpenAI and inspired its agent prompts. Buckmaster also asked whether OpenAI accessed Codex user data or used it in training.",
        'OpenAI: the proofs differ "significantly". It first said user data was not accessed; it later confirmed de-identified usage-derived data may have been used in training — while denying any influence from Buckmaster\'s prompts.',
        "OpenAI proposed that Buckmaster report the Euler result first, or rewrite OpenAI's proof as lead author. Both declined. Bubeck later apologised for the wording of one message.",
      ],
    },
  },
  'wiki-reactions': {
    source: 'wiki',
    where: { pt: 'Reações', en: 'Reactions' },
    title: { pt: 'A comunidade matemática responde', en: 'The math community responds' },
    body: {
      pt: [
        'Carta aberta "A Severe Misalignment of AI in Mathematics" (11/set): assinada inicialmente por 24 medalhistas Fields, depois por mais quatro. Alerta contra empresas de IA tratando problemas abertos como benchmarks.',
        'Terence Tao elogiou os resultados de Euler, mas criticou anunciar resultados matemáticos por press release e redes sociais em vez de preprints ou palestras.',
        'Diego Córdoba não foi avisado por nenhuma das partes; disse que, sem o trabalho do grupo dele, a IA não teria resolvido o problema. Steven Strogatz defendeu que o prêmio fosse para Córdoba e Martínez-Zoroa.',
        'Shing-Tung Yau e Emil Wiedemann levantaram a disparidade de recursos entre laboratórios de IA e matemáticos.',
      ],
      en: [
        'Open letter "A Severe Misalignment of AI in Mathematics" (Sep 11): initially signed by 24 Fields Medalists, later four more. It warns against AI companies treating open problems as benchmarks.',
        'Terence Tao praised the Euler results but criticised announcing math results via press releases and social media instead of preprints or talks.',
        "Diego Córdoba wasn't notified by either party; he said that without his group's work, AI would not have solved the problem. Steven Strogatz argued the prize should go to Córdoba and Martínez-Zoroa.",
        'Shing-Tung Yau and Emil Wiedemann raised the resource gap between AI labs and mathematicians.',
      ],
    },
  },
  'wiki-clay': {
    source: 'wiki',
    where: { pt: 'Desfecho e status', en: 'Outcome and status' },
    title: { pt: 'O que diz o Clay Institute', en: 'What the Clay Institute says' },
    body: {
      pt: [
        'Em 11/set, o Clay disse que o problema "aparentemente foi resolvido", mas que a verificação e a atribuição de crédito seriam "deliberadamente sem pressa". O site agora lista o problema como "active".',
        'O presidente Martin Bridson exige publicação revisada por pares antes de qualquer prêmio. Nenhuma parte foi reconhecida. A OpenAI diz que não pretende reivindicar o prêmio.',
        'O único precedente é 2010: a prova da conjectura de Poincaré por Grigori Perelman foi aceita — e ele recusou o prêmio.',
      ],
      en: [
        'On Sep 11, Clay said the problem "has apparently been settled" but that verification and credit assignment would be "deliberately unhurried". Its website now lists the problem as "active".',
        'President Martin Bridson requires peer-reviewed publication before any award. No party has been acknowledged. OpenAI says it does not plan to claim the prize.',
        "The only precedent is 2010: Grigori Perelman's proof of the Poincaré conjecture was accepted — and he declined the prize.",
      ],
    },
  },

  /* ───────────── Paper arXiv:2610.08144 ───────────── */
  'paper-intro': {
    source: 'paper',
    page: 1,
    find: 'NTRODUCTION',
    where: { pt: 'Seção 1 — Introdução: dois tipos de autoformalização', en: 'Section 1 — Introduction: two types of autoformalisation' },
    title: { pt: 'Tradução de prova vs. tradução semântica fiel', en: 'Proof translation vs. faithful semantic translation' },
    body: {
      pt: [
        'Tipo (i) — tradução de prova: pegar a prova em linguagem natural (LN) de um enunciado já formalizado e produzir uma prova em Lean que compila sem `sorry` nem axiomas extras.',
        'Tipo (ii) — tradução semântica fiel: traduzir o texto inteiro (definições, enunciados e provas) preservando o conteúdo matemático.',
        'Tese central: compilar em Lean uma tradução gerada por IA não mostra que a prova em LN está correta. O repositório da OpenAI (openai/NavierStokesAndEuler) traz formalizações em Lean 4 do paper de Navier–Stokes e de um paper relacionado de Euler; segundo os autores, elas não são traduções semanticamente fiéis.',
        'Os autores deixam explícito que não afirmam nada sobre a correção da prova em LN da OpenAI.',
      ],
      en: [
        'Type (i) — proof translation: take the natural-language (NL) proof of an already-formalised statement and produce a Lean proof that compiles without `sorry` or extra axioms.',
        'Type (ii) — faithful semantic translation: translate the whole text (definitions, statements and proofs) while preserving its mathematical content.',
        "Central thesis: compiling an AI-generated Lean translation does not show the NL proof is correct. OpenAI's repository (openai/NavierStokesAndEuler) has Lean 4 formalisations of the Navier–Stokes paper and a related Euler paper; per the authors, they are not semantically faithful translations.",
        "The authors explicitly make no claim about whether OpenAI's NL proof is correct.",
      ],
    },
  },
  'paper-ex21': {
    source: 'paper',
    page: 2,
    find: 'Example 2.1 (',
    where: { pt: 'Seção 2 — Exemplo 2.1 e Figura 1', en: 'Section 2 — Example 2.1 and Figure 1' },
    title: { pt: 'Prova errada, Lean correto', en: 'Wrong proof, correct Lean' },
    tex: ['p(x) = x^3 - x^2 - x + 1 \\ \\ge 0 \\quad \\text{para } x \\ge -1', '\\text{prova em LN (errada): } p(x) = (x-1)(x+1)^2', '\\text{correto: } p(x) = (x-1)^2(x+1)'],
    body: {
      pt: [
        'A prova em LN erra as raízes e suas multiplicidades. Um usuário pediu a um chatbot para formalizar essa prova errada.',
        'O chatbot encontrou as multiplicidades corretas e produziu uma prova em Lean que compila. Ou seja: uma prova errada em LN foi "mal traduzida" para uma prova correta em Lean.',
      ],
      en: [
        'The NL proof gets the roots and their multiplicities wrong. A user asked a chatbot to formalise this wrong proof.',
        'The chatbot found the correct multiplicities and produced a Lean proof that compiles. So a wrong NL proof was "mistranslated" into a correct Lean proof.',
      ],
    },
  },
  'paper-ex22': {
    source: 'paper',
    page: 3,
    find: 'Example 2.2 (',
    where: { pt: 'Seção 2 — Exemplo 2.2 e Figura 2', en: 'Section 2 — Example 2.2 and Figure 2' },
    title: { pt: 'Duas provas corretas, argumentos diferentes', en: 'Two correct proofs, different arguments' },
    tex: ['A \\text{ real simétrica} \\implies \\operatorname{tr}(A^2) \\ge 0', '\\text{LN: diagonaliza } A \\Rightarrow \\textstyle\\sum \\lambda_i^2', '\\text{Lean: } a_{ij}=a_{ji} \\Rightarrow \\textstyle\\sum_{i,j} a_{ij}^2'],
    body: {
      pt: ['A prova em LN diagonaliza A e soma os autovalores ao quadrado. O Lean pula a mudança de base e usa a simetria para obter uma soma de quadrados. Ambas estão corretas — mas não são a mesma prova.'],
      en: ["The NL proof diagonalises A and sums squared eigenvalues. Lean skips the change of basis and uses symmetry to get a sum of squares. Both are correct — but they aren't the same proof."],
    },
  },
  'paper-ex31': {
    source: 'paper',
    page: 4,
    find: 'Example 3.1 (',
    where: { pt: 'Seção 3.1 — Exemplo 3.1 (Lema 8.6, eq. 8.19 do paper da OpenAI)', en: "Section 3.1 — Example 3.1 (Lemma 8.6, eq. 8.19 of OpenAI's paper)" },
    title: { pt: 'O paper afirma mais do que o Lean prova', en: 'The NL paper claims more than Lean proves' },
    tex: ['\\text{LN (3.1): } \\|N^{-1}F\\|_{C^m_y} \\le C_m \\|F\\|_{C^{m+4}_y}', '\\text{Lean (3.2): } \\|N^{-1}F\\|_{C^m_y} \\le K_m \\|F\\|_{C^{m+5}_y}', 'N = v_t\\cdot\\nabla_y,\\quad v_t = (\\sqrt2 - 1,\\ 1)'],
    code: '-- SmoothFamilyTorusInverse.lean (commit f9e8bc5)\ntheorem norm_derivativeWord_inverse_le ...\n  -- hypotheses require  w.length + 5',
    body: {
      pt: [
        'A prova em LN usa m+4 derivadas, deixando um decaimento somável (1+|k|)⁻³ em duas dimensões. O teorema em Lean precisa de m+5 derivadas, via um limite de coeficientes com expoente de frequência 4.',
        'Resultado: o Lean prova uma versão mais fraca, com uma derivada a mais. A Observação 3.2 aponta exigências m+5 semelhantes em `inverse_finiteJets` e `mixedJet_inverse_bound`.',
      ],
      en: [
        'The NL proof uses m+4 derivatives, leaving a summable (1+|k|)⁻³ decay in two dimensions. The Lean theorem needs m+5 derivatives, via a coefficient bound with frequency exponent 4.',
        'Result: Lean proves a weaker version, needing one more derivative. Remark 3.2 notes similar m+5 requirements in `inverse_finiteJets` and `mixedJet_inverse_bound`.',
      ],
    },
  },
  'paper-ex33': {
    source: 'paper',
    page: 8,
    find: 'Example 3.3 (',
    where: { pt: 'Seção 3.2 — Exemplo 3.3 (estimativa do fluxo de pressão, eq. 10.19)', en: 'Section 3.2 — Example 3.3 (pressure-flux estimate, eq. 10.19)' },
    title: { pt: 'Enunciado e prova, ambos mal traduzidos', en: 'Statement and proof, both mistranslated' },
    tex: [
      '\\text{LN: } \\Big|\\!\\int \\pi\\, w\\cdot\\nabla\\chi_R\\Big| \\le \\tfrac{C_T}{R}\\big[(B_R+1)B_R^{1/2} + R^{-3/4}B_R^{3/4}\\big]',
      '\\text{Lean: } \\Big|\\!\\int \\pi\\, w\\cdot\\nabla\\chi_R\\Big| \\le C_T\\big[(B_R^{1/2}+1)(\\tfrac{A_R}{R}+\\tfrac{1}{R^2}) + R^{-7/4}B_R^{3/4}\\big]',
      'A_R = \\big(\\textstyle\\int \\chi_R|\\nabla w|^2\\big)^{1/2},\\quad B_R = \\|\\varphi_R^4 w\\|_{L^6}',
    ],
    code: '-- PressureFlux.lean, line 576\ntheorem exists_uniform_actual_pressure_flux_bound ...',
    body: {
      pt: [
        'O limite em LN usa só B_R; o do Lean também depende de A_R e tem outra forma — os dois não são diretamente comparáveis.',
        'A prova em Lean fatora φ_R² em vez de φ_R⁴, usa Hölder com expoentes 6 e 6/5, imersão de Sobolev e a limitação da transformada de Riesz em L² (em vez de L^{3/2}, como na prova em LN), além de outra interpolação.',
      ],
      en: [
        "The NL bound uses only B_R; Lean's also depends on A_R and has a different shape — the two aren't directly comparable.",
        'The Lean proof factors out φ_R² instead of φ_R⁴, uses Hölder with exponents 6 and 6/5, Sobolev embedding and Riesz-transform boundedness on L² (instead of L^{3/2}, as in the NL proof), plus a different interpolation.',
      ],
    },
  },
  'paper-taxonomy': {
    source: 'paper',
    page: 12,
    find: '3.3. Mistranslations',
    where: { pt: 'Seções 3.3–3.4 e 5 — Conclusões', en: 'Sections 3.3–3.4 and 5 — Conclusions' },
    title: { pt: 'Nem toda má tradução é igual', en: 'Not all mistranslations are equal' },
    body: {
      pt: [
        'Más traduções podem ser benignas (outra prova correta), podem consertar erros, ou podem enfraquecer/fortalecer o resultado — como no código Lean da OpenAI, que exige derivadas a mais.',
        'Traduzir o Lean de volta para LN não resolve o problema (Observação 3.5). Os autores preveem que a formalização da prova de Euler também terá más traduções substanciais, mas não a analisam.',
        'Pedem revisão por pares das provas em LN geradas por IA; a verificação em Lean não substitui isso.',
      ],
      en: [
        "Mistranslations can be benign (a different correct proof), can repair errors, or can weaken/strengthen the result — as OpenAI's Lean code does by needing extra derivatives.",
        'Back-translating Lean to NL does not fix it (Remark 3.5). The authors predict the Euler formalisation will also contain substantial mistranslations, but do not analyse it.',
        'They call for peer review of AI-generated NL proofs; Lean verification is not a substitute.',
      ],
    },
  },
  'paper-sinf': {
    source: 'paper',
    page: 13,
    find: 'Example 4.1 (',
    where: { pt: 'Seção 4.1 (Exemplo 4.1) e Seção 4.2', en: 'Section 4.1 (Example 4.1) and Section 4.2' },
    title: { pt: '"Seja nₑ o menor n tal que…"', en: '"Let nₑ be the least n such that…"' },
    tex: ['n_e = \\min\\{n : p_e(n, x_1,\\dots,x_k) = 0 \\text{ não tem solução em } \\mathbb N\\},\\qquad r_e = \\tfrac{1}{n_e+1}'],
    code: 'def n_e := sInf {n | B_e n}\n-- in Lean, sInf (∅ : Set ℕ) = 0\n-- e.g. p_e(n,x₁,x₂) = x₁ + x₂ − n has root (n,0) for every n\n-- ⇒ empty set ⇒ n_e = 0, r_e = 1  — and it compiles',
    body: {
      pt: [
        'Há uma pressuposição de existência escondida: r_e só está bem definido se n_e existir — e decidir isso pode ser indecidível.',
        'Em Lean, o ínfimo do conjunto vazio de naturais é 0. A tradução compila, mas atribui silenciosamente um valor a algo que no texto original não está definido.',
      ],
      en: [
        'There is a hidden existence presupposition: r_e is only well-defined if n_e exists — and deciding that can be undecidable.',
        'In Lean, the infimum of the empty set of naturals is 0. The translation compiles, but silently assigns a value to something the original text leaves undefined.',
      ],
    },
  },
  'paper-sci': {
    source: 'paper',
    page: 14,
    find: 'Example 4.3 (',
    where: { pt: 'Exemplo 4.3, Teorema A.3, Corolário A.5', en: 'Example 4.3, Theorem A.3, Corollary A.5' },
    title: { pt: 'Mais difícil que o problema da parada', en: 'Harder than the Halting problem' },
    code: '# Exemplo 4.3 — "guess and check"\nwhile not lean_compiles(translation):\n    translation = ai.revise(translation)\n# may never halt, and accepts ANY translation that compiles',
    body: {
      pt: [
        'Teorema A.3 (k ≥ 9): o conjunto dos e para os quais nₑ está bem definido é Σ⁰₂-completo — nenhuma IA consegue sempre decidir isso, mesmo com um oráculo para o problema da parada.',
        'Teorema A.4 e Corolário A.5 estendem para todos os níveis da hierarquia; logo, resolver ambiguidades fielmente tem SCI (Solvability Complexity Index) = ∞, enquanto o problema da parada tem SCI = 1.',
        'Abordagens atuais de IA se parecem com o loop "chuta e confere" do Exemplo 4.3, que é estruturalmente propenso a más traduções.',
      ],
      en: [
        'Theorem A.3 (k ≥ 9): the set of e for which nₑ is well-defined is Σ⁰₂-complete — no AI can always decide it, even with a Halting oracle.',
        'Theorem A.4 and Corollary A.5 extend this to every level of the hierarchy; so faithfully resolving ambiguity has SCI (Solvability Complexity Index) = ∞, while the Halting problem has SCI = 1.',
        'Current AI approaches resemble the "guess and check" loop of Example 4.3, which is structurally prone to mistranslation.',
      ],
    },
  },
}
