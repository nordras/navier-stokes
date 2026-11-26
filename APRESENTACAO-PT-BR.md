# A IA resolveu Navier–Stokes? — roteiro completo (PT-BR)

Apresentação de ~13 minutos para engenheiros de software. 19 slides.
Atalhos: **→ / Espaço** avança (passo ou slide) · **←** volta · **N** notas + cronômetro · **L** troca PT/EN · **F** tela cheia · **Esc** fecha um trecho aberto.

Legenda deste roteiro:
- 🎤 o que falar (texto corrido, para ler ou adaptar)
- 🖱️ ação na tela (clique, seta, chip)
- 🔊 como ler em voz alta as equações daquele slide
- ⏱️ tempo-alvo do slide · (acumulado)

---

## Parte 1 — A física

### Slide 1 · Título — "A IA resolveu Navier–Stokes?"
⏱️ 0:15 · (0:15)

🎤 Em setembro de 2026, a OpenAI disse que um sistema de IA resolveu um dos sete Problemas do Milênio — o de Navier–Stokes. Dois meses depois, ninguém aceitou oficialmente. Nos próximos treze minutos: a física, a alegação, a briga por crédito e um paper que explica por que "passou no type checker" não basta.

---

### Slide 2 · "Navier–Stokes é a engine de física de todo fluido"
⏱️ 0:35 · (0:50)

🖱️ Os termos da equação se destacam sozinhos, um a um. Passe o mouse num termo para fixá-lo.

🎤 Ar numa asa, sangue numa artéria, o clima — tudo isso é descrito por estas duas linhas. É o F = ma de Newton aplicado a cada ponto do fluido. Do lado esquerdo, como a velocidade muda. O termo rosa, a advecção, é o fluido carregando a própria velocidade: velocidade vezes velocidade, um loop de feedback. Do lado direito, a pressão, que age como um solver global; a viscosidade, que é um filtro de blur; e a força externa, o input do usuário. E a segunda equação é um invariante: o volume se conserva. Nos próximos slides eu abro cada peça.

🔊
- `∂u/∂t + (u·∇)u = −∇p + νΔu + f` → "derivada parcial de u em relação a t, mais u ponto nabla u, igual a menos gradiente de p, mais nu laplaciano de u, mais f"
- `∇·u = 0` → "divergente de u igual a zero"

---

### Slide 3 · "Conservação de massa: a equação da continuidade"
⏱️ 0:40 · (1:30)

🖱️ As três linhas da dedução aparecem sozinhas. Aponte o cano animado.

🎤 Primeira peça: massa não se cria nem se destrói. Essa é a forma geral. Se a densidade é constante — água, ou ar em baixa velocidade —, sobra só "divergente de u igual a zero". Na prática: tudo o que entra em qualquer volume tem que sair. É a lei de Kirchhoff dos fluidos. Olhem o cano: onde ele estreita, a área cai pela metade e a velocidade mais que dobra. Área vezes velocidade dá sempre 1 nas três seções.

🔊
- `∂ρ/∂t + ∇·(ρu) = 0` → "derivada parcial de rô em relação a t, mais divergente de rô u, igual a zero"
- `ρ = const` → "rô constante"
- `∇·u = 0` → "divergente de u igual a zero"
- `A·v = const` → "área vezes velocidade é constante"

---

### Slide 4 · "Conservação de momento: Newton para cada gota"
⏱️ 0:50 · (2:20)

🖱️ As quatro linhas aparecem em sequência. Aponte a parcela rosa se deformando.

🎤 Segunda peça: F = ma para cada parcela de fluido — essa é a equação de Cauchy. O D maiúsculo é a derivada material: seguir a gota, não olhar um ponto fixo. Quando você expande essa derivada, aparece o termo não linear — u ponto nabla u. Depois vem a hipótese de fluido newtoniano: o atrito interno é proporcional à taxa de deformação. É daí que nasce o termo de viscosidade. Junte com a continuidade e você tem Navier–Stokes. Na animação: a pressão empurra da esquerda; a camada lenta perto da parede freia; a rápida, no centro, puxa; e a parcela se deforma.

🔊
- `ρ Du/Dt = ∇·σ + ρf` → "rô vezes D u D t igual a divergente de sigma mais rô f"
- `Du/Dt = ∂u/∂t + (u·∇)u` → "D u D t é igual a derivada parcial de u em t mais u ponto nabla u"
- `σ = −pI + μ(∇u + ∇uᵀ)` → "sigma igual a menos p vezes a identidade, mais mi vezes, gradiente de u mais gradiente de u transposto"
- última linha: igual ao slide 2

---

### Slide 5 · "Euler: Navier–Stokes com ν = 0"
⏱️ 0:45 · (3:05)

🖱️ As duas simulações rodam sozinhas e reiniciam em loop.

🎤 Se você desliga a viscosidade, tem a equação de Euler — de 1757, quase um século mais velha que Navier–Stokes. Aqui embaixo está uma simulação de verdade, rodando no navegador, de um primo de brinquedo de uma dimensão, a equação de Burgers. Com viscosidade, à esquerda, a onda fica íngreme mas se estabiliza. Sem viscosidade, à direita, ela vira um degrau, e em t igual a 1 a inclinação vai a infinito. Em 3D o mecanismo é outro — esticamento de vórtices —, mas a intuição vale: sem o blur, é mais fácil quebrar. Por isso todo mundo atacou Euler primeiro.

🔊
- `∂ₜu + (u·∇)u = −∇p + f` → "derivada de u em t mais u ponto nabla u igual a menos gradiente de p mais f"
- `uₜ + u uₓ = ν uₓₓ` → "u t mais u vezes u x igual a nu u x x"
- `T* = 1` → "tê estrela igual a um"

---

### Slide 6 · "Navier–Stokes hipodissipativo"
⏱️ 0:50 · (3:55)

🖱️ Clique nos botões **α = 1 → 0,75 → 0,5 → 0,25**. A bolinha na reta acompanha.

🎤 Meio-termo: em vez de desligar a viscosidade, enfraquecer. No mundo de Fourier, o laplaciano vira k ao quadrado; trocando por k elevado a dois alfa, com alfa menor que um, as escalas pequenas são menos amortecidas. [clique] Vejam: quanto menor o alfa, mais íngreme a frente. Na reta: de cinco quartos para cima, já se provou que tudo fica suave — resultado de Lions. Alfa igual a um é o problema real, em aberto. E Córdoba, Martínez-Zoroa e Zheng construíram blow-up forçado, mas só para alfa muito pequeno, perto de Euler, e com uma força que não é totalmente suave. Essa distância é o que a OpenAI diz ter fechado.

🔊
- `∂ₜu + (u·∇)u = −∇p − ν(−Δ)^α u + f` → "… igual a menos gradiente de p, menos nu vezes menos laplaciano **elevado a alfa** aplicado a u, mais f" (aqui é potência de operador, então "elevado a" está certo)
- `−Δ ↔ |k|²` → "menos laplaciano corresponde a módulo de k ao quadrado"
- `(−Δ)^α ↔ |k|^{2α}` → "menos laplaciano elevado a alfa corresponde a módulo de k elevado a dois alfa"
- `α ≥ 5/4` → "alfa maior ou igual a cinco quartos"

---

### Slide 7 · "Blow-up: a própria matemática retorna NaN"
⏱️ 0:45 · (4:40)

🎤 Todo engenheiro já viu uma simulação explodir em NaN. Normalmente é bug numérico. A pergunta aqui é outra: a solução verdadeira, com matemática exata, pode explodir? A advecção concentra energia em redemoinhos cada vez menores; a viscosidade suaviza. Se a concentração vencer, a velocidade vai a infinito num tempo finito — tê estrela. Isso é uma singularidade, e o evento de chegar nela se chama blow-up. O desenho é ilustrativo: o redemoinho encolhe e gira cada vez mais rápido.

🔊
- `T*` → "tê estrela", o instante do blow-up
- tamanho `~ √(T*−t)` → "da ordem de raiz de tê estrela menos tê"
- velocidade `~ 1/√(T*−t)` → "da ordem de um sobre raiz de tê estrela menos tê"

---

### Slide 8 · "Um dos sete Problemas do Milênio" — ENQUETE
⏱️ 0:55 · (5:35) · **3 passos**

🖱️ **Passo 0** — as quatro cartas na mesma cor. Pergunte e clique nas cartas votadas (aparece "✋ votada").
🖱️ **→ Passo 1** — C e D acendem com o selo "alegação da OpenAI".
🖱️ **→ Passo 2** — aparece a "pegadinha".

🎤 O Clay Institute oferece um milhão de dólares. O enunciado oficial, de Charles Fefferman, tem quatro alternativas, e provar qualquer uma resolve o problema. A e B: sem força externa, tudo que começa suave continua suave para sempre — no espaço inteiro ou numa caixa periódica. C e D: existe um começo suave e uma força suave em que a solução quebra. **Quais vocês acham que são verdadeiras?** [votos] [→] A OpenAI alega ter provado C e D: o lado "quebra, se você empurrar com uma força suave". [→] E a pegadinha: A e C não se contradizem. Em C quem prova escolhe a força. Então, mesmo que a OpenAI esteja certa, "sem força, é sempre suave?" continua em aberto.

---

### Slide 9 · "Lean: um type checker para matemática"
⏱️ 0:40 · (6:15)

🎤 Um conceito antes da história. Simulação nenhuma prova nada — para o prêmio é preciso uma prova. Lean é uma linguagem em que enunciados são tipos e provas são programas: se compila, está provado, sem confiar em ninguém. O que o Lean garante: a prova formal prova o enunciado formal. O que ele não garante: que o enunciado formal é o que o paper em português ou inglês diz. Guardem essa frase — ela volta na Parte 3.

🔊
- `theorem add_comm' (a b : ℕ) : a + b = b + a` → "teorema: para naturais a e b, a mais b é igual a b mais a"

---

## Parte 2 — A alegação e a briga

### Slide 10 · "Uma década de humanos chegando perto"
⏱️ 0:45 · (7:00)

🖱️ Chip **W · Contexto matemático** abre o resumo da Wikipedia.

🎤 Isso não surgiu do nada. Em 2013, Luo e Hou mostraram evidência numérica de blow-up em Euler. Em 2023 e 2024, Diego Córdoba — matemático espanhol do ICMAT, em Madri —, Luis Martínez-Zoroa e Fan Zheng construíram exemplos de blow-up em versões facilitadas da equação: perto, mas com lacunas. Em 2025, a DeepMind com Buckmaster achou singularidades numéricas em equações parentes. E, chave para a polêmica: em agosto de 2026, Buckmaster e Alpöge já tinham, em sigilo, blow-up forçado para Euler, verificado em Lean, feito com ajuda de LLMs.

---

### Slide 11 · "Uma execução multiagente de 88 horas"
⏱️ 0:50 · (7:50)

🖱️ Chip **W · A solução da OpenAI**.

🎤 Então a OpenAI entra. Um sistema multiagente interno rodou 88 horas: mais de dez mil agentes, 2,7 milhões de mensagens, 130 bilhões de tokens de saída. Resultado: um paper de 166 páginas e uma formalização em Lean. Detalhe importante: a prova foi escrita primeiro em linguagem matemática e só depois traduzida para Lean, em mais 17 horas. Só a eletricidade custou milhões de dólares. Anunciado em 8 de setembro; Terence Tao deu os parabéns no mesmo dia.

---

### Slide 12 · "Quem chegou primeiro — e com as ideias de quem?"
⏱️ 0:55 · (8:45)

🖱️ Chips **W · Linha do tempo** e **W · Alegações e disputas**.

🎤 Linha do tempo comprimida. Dia 2, Alpöge é avisado de que o trabalho dele e de Buckmaster vazou. Dia 6, um pesquisador da OpenAI procura os dois e há uma reunião. Dia 7, perto da meia-noite, Buckmaster publica seus resultados. Dia 8, ao meio-dia, a OpenAI anuncia — doze horas depois. A disputa: ideias vazadas, ou dados de usuários do Codex, influenciaram os prompts da OpenAI? A OpenAI diz que as provas são muito diferentes, admite que dados de uso desidentificados podem ter ido para o treino, e nega qualquer influência.

---

### Slide 13 · "A comunidade matemática responde"
⏱️ 0:40 · (9:25)

🖱️ Chip **W · Reações**.

🎤 A reação foi rápida. Vinte e cinco medalhistas Fields assinaram uma carta contra tratar problemas abertos como benchmark. Tao criticou anunciar matemática por press release em vez de preprint. Córdoba nem foi avisado — e disse que, sem o trabalho do grupo dele, a IA não teria resolvido. Strogatz defendeu que o prêmio fosse para Córdoba e Martínez-Zoroa. E Yau e Wiedemann levantaram a pergunta: quem consegue pagar dez mil agentes?

---

## Parte 3 — O paper crítico

### Slide 14 · "Navier–Stokes Lost in Translation"
⏱️ 0:50 · (10:15)

🖱️ Chip **📄 Seção 1** abre o PDF na página 1, com o trecho destacado.

🎤 Agora o paper que dá base à Parte 3, de Bastounis, Circelli e Hansen, de King's College e Cambridge. Todo mundo disse "está verificado em Lean". Eles separam duas coisas. Tipo um: o enunciado já está formalizado, e a IA só precisa achar alguma prova que compile. Tipo dois: traduzir o texto inteiro — definições, enunciados, provas — preservando o significado. "A prova foi verificada" pressupõe o tipo dois. E um aviso importante: eles não dizem que a prova da OpenAI está errada. Só que o Lean não a certifica.

---

### Slide 15 · "O tradutor consertou o bug — e ninguém viu"
⏱️ 0:40 · (10:55)

🖱️ Chips **📄 Exemplo 2.1** e **📄 Exemplo 2.2**.

🎤 Exemplo de brinquedo do próprio paper. Queremos provar que este polinômio é maior ou igual a zero para x maior ou igual a menos um. A prova em texto fatora errado. Pediram a um chatbot para formalizar essa prova errada; ele achou a fatoração certa sozinho, e o Lean compilou. Resultado: um selo de "verificado" em cima de uma prova errada. É como um PR com bug passando no CI porque o CI rodou num código que outra pessoa reescreveu.

🔊
- `p(x) = x³ − x² − x + 1 ≥ 0, x ≥ −1` → "p de x igual a x ao cubo menos x ao quadrado menos x mais um, maior ou igual a zero, para x maior ou igual a menos um"
- `(x−1)(x+1)²` → "x menos um, vezes x mais um ao quadrado" (errado)
- `(x−1)²(x+1)` → "x menos um ao quadrado, vezes x mais um" (certo)
- (modal 2.2) `tr(A²) ≥ 0` → "traço de A ao quadrado maior ou igual a zero"

---

### Slide 16 · "Compila. Mas não é o que o paper diz."
⏱️ 0:45 · (11:40)

🖱️ Chips **📄 Ex. 3.1** (PDF p. 4), **📄 Ex. 3.3** (p. 8) e **📄 Seções 3.3–3.4** (p. 12).

🎤 Agora no paper real da OpenAI. Lema 8.6: o texto diz que basta controlar quatro derivadas a mais; o código Lean precisa de cinco. É outro lema, mais fraco — e compila. No fluxo de pressão, equação 10.19, mudaram o enunciado e a prova: o limite do Lean depende de outra quantidade e nem é diretamente comparável. Os autores classificam: má tradução pode ser benigna, pode consertar erros, ou pode mudar o resultado.

🔊
- `‖N⁻¹F‖_{Cᵐ} ≤ Cₘ ‖F‖_{C^{m+4}}` → "a norma C m de N inversa de F é menor ou igual a C índice m vezes a norma C m mais quatro de F"
- versão Lean → "… K índice m vezes a norma C m **mais cinco** de F"
- `N = vₜ·∇_y` → "N é v t ponto gradiente em y"
- eq. 10.19 → não precisa ler; diga "a estimativa do fluxo de pressão"

---

### Slide 17 · "Os testes passam. A spec está errada."
⏱️ 0:45 · (12:25)

🖱️ Chips **📄 Seção 4.1** (p. 13) e **📄 Exemplo 4.3** (p. 14).

🎤 Por que isso acontece. Em Lean, o ínfimo do conjunto vazio é zero. Então "o menor n tal que…" compila mesmo quando esse n não existe — o "indefinido" vira zero em silêncio, como um `?? 0` escondendo um bug. E o loop típico de IA é: enquanto não compila, revisa. Ele aceita qualquer tradução que compila. Os autores mostram que traduzir fielmente, resolvendo ambiguidades, tem SCI infinito — informalmente, é mais difícil que o problema da parada.

🔊
- `sInf ∅ = 0` → "o ínfimo do conjunto vazio é zero"
- `nₑ := sInf {n | P n}` → "n índice e é o ínfimo dos n tais que P de n"
- `rₑ = 1/(nₑ+1)` → "r índice e igual a um sobre n índice e mais um"
- `Σ⁰₂` → "sigma zero dois"
- `SCI = ∞` → "S C I igual a infinito"

---

### Slide 18 · "Status: em aberto"
⏱️ 0:40 · (13:05)

🖱️ Chip **W · Desfecho e status**.

🎤 Onde estamos: o Clay não reconheceu ninguém e exige publicação revisada por pares; no site, o problema está como "active". A OpenAI diz que não vai pedir o prêmio. Três lições para nós, engenheiros. Um: compilar não é estar correto — a spec é a parte difícil, igualzinho a software. Dois: compute virou instrumento de pesquisa — quem consegue pagar? Três: proveniência importa — dados, crédito e citações. Obrigado.

---

### Slide 19 · Referências
⏱️ — (deixe na tela durante as perguntas)

---

## Glossário

### Equações — leitura em voz alta e explicação curta

| Equação | Como ler | Em uma frase |
|---|---|---|
| `F = ma` | "F igual a m a" | Força é massa vezes aceleração (Newton). Navier–Stokes é isso para cada ponto de um fluido. |
| `∂u/∂t + (u·∇)u = −∇p + νΔu + f` | "derivada parcial de u em t, mais u ponto nabla u, igual a menos gradiente de p, mais nu laplaciano de u, mais f" | Navier–Stokes: como a velocidade do fluido muda, por advecção, pressão, viscosidade e força externa. |
| `∇·u = 0` | "divergente de u igual a zero" | Incompressibilidade: o que entra em qualquer volume, sai. |
| `∂ρ/∂t + ∇·(ρu) = 0` | "derivada parcial de rô em t mais divergente de rô u igual a zero" | Continuidade: massa não se cria nem se destrói. |
| `A·v = const` | "área vezes velocidade é constante" | Continuidade num cano: estreitou, acelera. |
| `ρ Du/Dt = ∇·σ + ρf` | "rô D u D t igual a divergente de sigma mais rô f" | Equação de Cauchy: F = ma por parcela, com as tensões internas σ. |
| `Du/Dt = ∂u/∂t + (u·∇)u` | "D u D t igual a derivada parcial de u em t mais u ponto nabla u" | Derivada material: a variação "seguindo a gota". Daqui sai o termo não linear. |
| `σ = −pI + μ(∇u + ∇uᵀ)` | "sigma igual a menos p identidade mais mi vezes gradiente de u mais gradiente de u transposto" | Fluido newtoniano: pressão mais atrito proporcional à deformação. |
| `∂ₜu + (u·∇)u = −∇p + f` | "derivada de u em t mais u ponto nabla u igual a menos gradiente de p mais f" | Equação de Euler: Navier–Stokes sem viscosidade. |
| `−ν(−Δ)^α u` | "menos nu, menos laplaciano elevado a alfa, aplicado a u" | Dissipação fracionária: com α < 1, viscosidade mais fraca (hipodissipativo). |
| `−Δ ↔ |k|²` | "menos laplaciano corresponde a k ao quadrado" | Em Fourier, o laplaciano vira multiplicação por k² — amortece mais as escalas pequenas. |
| `uₜ + u uₓ = ν uₓₓ` | "u t mais u u x igual a nu u x x" | Burgers 1D: o "primo de brinquedo" usado nas simulações. |
| `max|u| ~ 1/√(T*−t)` | "máximo de módulo de u cresce como um sobre raiz de tê estrela menos tê" | Desenho do blow-up: vai a infinito quando t chega em T*. |
| `‖N⁻¹F‖_{Cᵐ} ≤ Cₘ‖F‖_{C^{m+4}}` | "norma C m de N inversa de F menor ou igual a C m vezes norma C m mais quatro de F" | Lema 8.6 do paper da OpenAI; no Lean virou "m + 5". |
| `p(x) = (x−1)²(x+1)` | "x menos um ao quadrado vezes x mais um" | Fatoração certa do exemplo de brinquedo (Ex. 2.1). |
| `tr(A²) ≥ 0` | "traço de A ao quadrado maior ou igual a zero" | Exemplo 2.2: duas provas corretas, mas diferentes. |
| `sInf ∅ = 0` | "ínfimo do conjunto vazio igual a zero" | Convenção do Lean que transforma "indefinido" em 0 sem avisar. |
| `rₑ = 1/(nₑ+1)` | "r e igual a um sobre n e mais um" | Exemplo 4.1: só faz sentido se nₑ existir. |
| `a + b = b + a` (Lean) | "a mais b igual a b mais a" | Exemplo de teorema em Lean: enunciado = tipo, prova = programa. |
| `ω = ∇×u` | "ômega igual a rotacional de u" | Vorticidade: quanto o fluido gira em cada ponto. |
| `(ω·∇)u` | "ômega ponto nabla u" | Esticamento de vórtices: o mecanismo de concentração em 3D. |

### Notação

| Símbolo | Como ler | Significado |
|---|---|---|
| `u` | "u" (negrito: vetor) | Campo de velocidade: em cada ponto, para onde e quão rápido o fluido vai. |
| `p` | "p" | Pressão. |
| `ρ` | "rô" | Densidade. |
| `ν` | "nu" | Viscosidade cinemática (o tamanho do "blur"). |
| `μ` | "mi" | Viscosidade dinâmica (μ = ρν). |
| `f` | "f" | Força externa. |
| `σ` | "sigma" | Tensor de tensões (forças internas). |
| `∂/∂t` | "derivada parcial em relação a t" | Variação no tempo, num ponto fixo. |
| `∇` | "nabla" ou "gradiente" | Vetor de derivadas no espaço. |
| `∇p` | "gradiente de p" | Direção em que a pressão aumenta mais rápido; −∇p empurra para a pressão baixa. |
| `∇·u` | "divergente de u" | Quanto o fluido "sai" de um ponto. |
| `∇×u` | "rotacional de u" | Quanto o fluido gira. |
| `Δ` | "laplaciano" | Soma das segundas derivadas; mede o quanto um ponto difere da vizinhança. |
| `(−Δ)^α` | "menos laplaciano elevado a alfa" | Potência fracionária do laplaciano; aqui **é** potência. |
| `k`, `|k|` | "k", "módulo de k" | Frequência de Fourier; k alto = escala pequena. |
| `T*` | "tê estrela" | Instante do blow-up. |
| `ℝ³` | "erre três" | Espaço tridimensional. |
| `ℝ³/ℤ³` | "erre três sobre zê três" | Caixa periódica (toro): o que sai por um lado entra pelo outro. |
| `Cᵏ` | "C k" | Conjunto das funções com k derivadas contínuas. O sobrescrito é rótulo, **não** potência. |
| `C^∞` | "C infinito" | Funções suaves: todas as derivadas existem. |
| `C^(1,ε)` | "C um épsilon" | Uma derivada contínua "e um pouquinho mais", mas longe de suave. |
| `f ∈ C^∞` | "f pertence a C infinito" | f é suave. |
| `‖·‖` | "norma" | Tamanho de uma função. |
| `∅` | "conjunto vazio" | — |
| `Σ⁰₂` | "sigma zero dois" | Nível da hierarquia aritmética, acima do problema da parada. |

### Termos

- **Navier–Stokes**: equações do movimento de fluidos viscosos (Navier 1822, Stokes 1845). Conservação de massa + conservação de momento.
- **Euler (equação de)**: Navier–Stokes sem viscosidade, de Leonhard Euler (1757). Não vale o prêmio do Clay.
- **Advecção**: o fluido carregando as próprias propriedades, inclusive a velocidade. Termo `(u·∇)u`, não linear.
- **Viscosidade**: atrito interno; suaviza gradientes. Termo `νΔu`.
- **Incompressível**: densidade constante; volume se conserva (`∇·u = 0`).
- **Fluido newtoniano**: atrito proporcional à taxa de deformação (água, ar). Mel e ketchup não são.
- **Derivada material (D/Dt)**: variação seguindo a parcela de fluido, em vez de olhar um ponto fixo.
- **Parcela de fluido**: um "pedacinho" de fluido acompanhado ao longo do movimento.
- **Força externa / força suave**: empurrão de fora (gravidade, colher). "Suave" = sem saltos, picos ou quinas; C^∞.
- **Suave (C^∞)**: tem todas as derivadas, todas finitas e contínuas.
- **Singularidade**: ponto onde a solução deixa de ser suave (algo vai a infinito).
- **Blow-up / breakdown**: o evento de, partindo de algo suave, chegar a uma singularidade em tempo finito.
- **Choque**: em Burgers 1D, a onda vira um degrau; é o blow-up do modelo de brinquedo.
- **Esticamento de vórtices**: redemoinho esticado fica mais fino e gira mais rápido (patinadora fechando os braços). Só existe em 3D.
- **Hipodissipativo**: Navier–Stokes com viscosidade enfraquecida, `(−Δ)^α` com α < 1.
- **Hiperdissipativo**: viscosidade reforçada, α > 1; com α ≥ 5/4 já se provou que tudo fica suave (J.-L. Lions).
- **Burgers (equação de)**: modelo 1D com advecção e viscosidade; usado nas simulações dos slides 5 e 6.
- **Boussinesq**: Navier–Stokes/Euler com temperatura e empuxo (o quente sobe).
- **IPM (incompressible porous media)**: fluxo num meio poroso (lei de Darcy); "primo" das equações de fluidos.
- **Problemas do Milênio**: sete problemas escolhidos pelo Clay Mathematics Institute em 2000, US$ 1 milhão cada. Só um foi resolvido (Poincaré, Perelman, 2010).
- **Alternativas (A)–(D)**: as quatro formas de resolver o problema no enunciado de Fefferman. A/B: sempre suave sem força. C/D: quebra com força suave.
- **Lean**: linguagem de programação e assistente de provas; se a prova compila, o enunciado formal está provado.
- **Formalização**: escrever matemática em Lean.
- **Autoformalização**: a IA traduzindo matemática em texto para Lean.
- **Tradução de prova (tipo i)**: achar alguma prova em Lean para um enunciado já formal.
- **Tradução semântica fiel (tipo ii)**: traduzir o texto inteiro preservando o significado.
- **Má tradução (mistranslation)**: código Lean que compila mas não diz o que o texto diz.
- **`sorry`**: em Lean, "pular esta prova"; uma prova com `sorry` não vale.
- **Ínfimo (`sInf`)**: o "menor valor" de um conjunto; em Lean, o do conjunto vazio é 0 por convenção.
- **Problema da parada**: decidir se um programa termina; impossível em geral (SCI = 1).
- **SCI (Solvability Complexity Index)**: medida de quão "impossível" é um problema computacional; o paper argumenta que traduzir fielmente tem SCI = ∞.
- **Preprint / revisão por pares**: artigo publicado antes de revisão (arXiv) vs. artigo checado por especialistas antes da publicação. O Clay exige o segundo.
- **Sistema multiagente**: muitas instâncias de IA trabalhando em paralelo e trocando mensagens.

### Pessoas e instituições

- **Charles Fefferman**: autor do enunciado oficial do problema (Clay).
- **Diego Córdoba** (ICMAT-CSIC, Madri), **Luis Martínez-Zoroa**, **Fan Zheng**: construções de blow-up de 2023–24.
- **Thomas Hou** e **Guo Luo**: evidência numérica de blow-up em Euler (2013).
- **Tristan Buckmaster** (NYU) e **Levent Alpöge** (Anthropic, a título pessoal): blow-up forçado para Euler, IPM e Boussinesq (ago/2026).
- **Sébastien Bubeck**, **Noam Brown**: pesquisadores da OpenAI citados na história.
- **Terence Tao**: matemático, medalhista Fields; elogiou e depois criticou o modo de anúncio.
- **Steven Strogatz**: matemático; defendeu dar o prêmio a Córdoba e Martínez-Zoroa.
- **Shing-Tung Yau**, **Emil Wiedemann**: alertaram para a disparidade de recursos.
- **Bastounis, Circelli & Hansen** (King's College London, Cambridge): autores do paper "Lost in Translation".
- **Martin Bridson**: presidente do Clay Mathematics Institute.
- **J.-L. Lions**: provou regularidade para α ≥ 5/4.
- **Kiselev, Nazarov & Shterenberg**: limite α = ½ no Burgers fracionário.
