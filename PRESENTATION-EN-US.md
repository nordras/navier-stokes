# Did AI solve Navier–Stokes? — full script (EN-US)

~13-minute talk for software engineers. 19 slides.
Shortcuts: **→ / Space** next (step or slide) · **←** back · **N** notes + timer · **L** switch PT/EN · **F** fullscreen · **Esc** closes an open excerpt.

Legend:
- 🎤 what to say (spoken text, read or adapt)
- 🖱️ on-screen action (click, arrow, chip)
- 🔊 how to read that slide's equations out loud
- ⏱️ target time for the slide · (running total)

---

## Part 1 — The physics

### Slide 1 · Title — "Did AI solve Navier–Stokes?"
⏱️ 0:15 · (0:15)

🎤 In September 2026, OpenAI said an AI system had solved one of the seven Millennium Prize Problems — Navier–Stokes. Two months later, nobody has officially accepted it. In the next thirteen minutes: the physics, the claim, the fight over credit, and a paper explaining why "it type-checks" is not enough.

---

### Slide 2 · "Navier–Stokes is the physics engine for every fluid"
⏱️ 0:35 · (0:50)

🖱️ The terms highlight one by one on their own. Hover a term to pin it.

🎤 Air over a wing, blood in an artery, the weather — all described by these two lines. It's Newton's F = ma applied to every point of a fluid. On the left, how velocity changes. The pink term, advection, is the fluid carrying its own velocity: velocity times velocity, a feedback loop. On the right: pressure, which acts like a global solver; viscosity, a blur filter; and the external force, user input. The second line is an invariant: volume is conserved. Over the next slides I'll open up each piece.

🔊
- `∂u/∂t + (u·∇)u = −∇p + νΔu + f` → "partial u partial t, plus u dot grad u, equals minus grad p, plus nu Laplacian u, plus f"
- `∇·u = 0` → "divergence of u equals zero" (or "div u equals zero")

---

### Slide 3 · "Conservation of mass: the continuity equation"
⏱️ 0:40 · (1:30)

🖱️ The three derivation lines appear on their own. Point at the animated pipe.

🎤 First piece: mass is neither created nor destroyed. That's the general form. If density is constant — water, or slow air — all that's left is "divergence of u equals zero". In practice: whatever flows into any volume must flow out. It's Kirchhoff's law for fluids. Look at the pipe: where it narrows, the area halves and the speed more than doubles. Area times speed is 1 at all three sections.

🔊
- `∂ρ/∂t + ∇·(ρu) = 0` → "partial rho partial t, plus divergence of rho u, equals zero"
- `ρ = const` → "rho is constant"
- `∇·u = 0` → "divergence of u equals zero"
- `A·v = const` → "area times speed is constant"

---

### Slide 4 · "Conservation of momentum: Newton for every drop"
⏱️ 0:50 · (2:20)

🖱️ The four lines appear in sequence. Point at the pink parcel deforming.

🎤 Second piece: F = ma for every fluid parcel — that's Cauchy's equation. The capital D is the material derivative: follow the drop instead of watching a fixed point. Expand it and the nonlinear term appears — u dot grad u. Then the Newtonian-fluid assumption: internal friction is proportional to the rate of deformation. That's where the viscosity term comes from. Add continuity and you have Navier–Stokes. In the animation: pressure pushes from the left; the slow layer near the wall drags; the fast centre pulls; and the parcel deforms.

🔊
- `ρ Du/Dt = ∇·σ + ρf` → "rho D u D t equals divergence of sigma plus rho f"
- `Du/Dt = ∂u/∂t + (u·∇)u` → "D u D t equals partial u partial t plus u dot grad u"
- `σ = −pI + μ(∇u + ∇uᵀ)` → "sigma equals minus p times the identity, plus mu times, grad u plus grad u transpose"
- last line: same as slide 2

---

### Slide 5 · "Euler: Navier–Stokes with ν = 0"
⏱️ 0:45 · (3:05)

🖱️ Both simulations run and loop on their own.

🎤 Switch viscosity off and you get the Euler equation — from 1757, almost a century older than Navier–Stokes. Below is a real simulation, running in the browser, of a one-dimensional toy cousin: the Burgers equation. With viscosity, on the left, the wave steepens but stabilises. Without it, on the right, it becomes a step, and at t equals 1 the slope goes to infinity. In 3D the mechanism is different — vortex stretching — but the intuition holds: without the blur, it's easier to break. That's why everyone attacked Euler first.

🔊
- `∂ₜu + (u·∇)u = −∇p + f` → "partial t u plus u dot grad u equals minus grad p plus f"
- `uₜ + u uₓ = ν uₓₓ` → "u sub t plus u u sub x equals nu u sub x x"
- `T* = 1` → "T star equals one"

---

### Slide 6 · "Hypodissipative Navier–Stokes"
⏱️ 0:50 · (3:55)

🖱️ Click **α = 1 → 0.75 → 0.5 → 0.25**. The dot on the line follows.

🎤 Middle ground: instead of switching viscosity off, weaken it. In Fourier space, the Laplacian becomes k squared; replace that with k to the two-alpha, with alpha below one, and small scales get damped less. [click] Watch: the smaller alpha, the steeper the front. On the line: from five-quarters up, everything is proved to stay smooth — that's Lions. Alpha equals one is the real, open problem. And Córdoba, Martínez-Zoroa and Zheng built forced blow-up, but only for very small alpha, close to Euler, and with a force that isn't fully smooth. That gap is what OpenAI claims to have closed.

🔊
- `∂ₜu + (u·∇)u = −∇p − ν(−Δ)^α u + f` → "… equals minus grad p, minus nu times minus-Laplacian **to the alpha** of u, plus f" (here it is an operator power, so "to the" is correct)
- `−Δ ↔ |k|²` → "minus Laplacian corresponds to k squared"
- `(−Δ)^α ↔ |k|^{2α}` → "minus Laplacian to the alpha corresponds to k to the two alpha"
- `α ≥ 5/4` → "alpha at least five quarters"

---

### Slide 7 · "Blow-up: the math itself returns NaN"
⏱️ 0:45 · (4:40)

🎤 Every engineer has seen a simulation explode into NaN. Usually it's a numerics bug. The question here is different: can the true solution, with exact math, blow up? Advection concentrates energy into ever-smaller swirls; viscosity smooths it out. If concentration wins, velocity goes to infinity at a finite time — T star. That's a singularity, and reaching it is called blow-up. The drawing is a cartoon: the swirl shrinks and spins faster and faster.

🔊
- `T*` → "T star", the blow-up time
- size `~ √(T*−t)` → "on the order of the square root of T star minus t"
- speed `~ 1/√(T*−t)` → "on the order of one over the square root of T star minus t"

---

### Slide 8 · "One of the seven Clay Millennium Prize Problems" — POLL
⏱️ 0:55 · (5:35) · **3 steps**

🖱️ **Step 0** — four cards, same colour. Ask, then click the cards people vote for ("✋ voted").
🖱️ **→ Step 1** — C and D light up with the "OpenAI's claim" badge.
🖱️ **→ Step 2** — the "catch" appears.

🎤 The Clay Institute offers one million dollars. Charles Fefferman's official statement has four alternatives, and proving any one solves the problem. A and B: with no external force, everything that starts smooth stays smooth forever — in all of space or on a periodic box. C and D: there's a smooth start and a smooth force for which the solution breaks down. **Which ones do you think are true?** [votes] [→] OpenAI claims to have proved C and D: the "it breaks if you push it with a smooth force" side. [→] And the catch: A and C don't contradict each other. In C, the prover chooses the force. So even if OpenAI is right, "without force, is it always smooth?" is still open.

---

### Slide 9 · "Lean: a type checker for mathematics"
⏱️ 0:40 · (6:15)

🎤 One concept before the story. No simulation proves anything — the prize needs a proof. Lean is a language where statements are types and proofs are programs: if it compiles, it's proved, no trust required. What Lean guarantees: the formal proof proves the formal statement. What it does not guarantee: that the formal statement is what the English paper says. Hold on to that — it comes back in Part 3.

🔊
- `theorem add_comm' (a b : ℕ) : a + b = b + a` → "theorem: for natural numbers a and b, a plus b equals b plus a"

---

## Part 2 — The claim and the fight

### Slide 10 · "A decade of humans closing in"
⏱️ 0:45 · (7:00)

🖱️ Chip **W · Mathematical background** opens the Wikipedia summary.

🎤 This didn't come out of nowhere. In 2013, Luo and Hou showed numerical evidence of blow-up for Euler. In 2023 and 2024, Diego Córdoba — a Spanish mathematician at ICMAT in Madrid — with Luis Martínez-Zoroa and Fan Zheng built blow-up examples for "easier" versions of the equation: close, but with gaps. In 2025, DeepMind with Buckmaster found numerical singularities in related equations. And, key to the controversy: by August 2026, Buckmaster and Alpöge privately had forced blow-up for Euler, verified in Lean, built with help from LLMs.

---

### Slide 11 · "An 88-hour multi-agent run"
⏱️ 0:50 · (7:50)

🖱️ Chip **W · OpenAI's solution**.

🎤 Then OpenAI comes in. An internal multi-agent system ran for 88 hours: over ten thousand agents, 2.7 million messages, 130 billion output tokens. Output: a 166-page paper and a Lean formalisation. Important detail: the proof was written first in ordinary mathematical language and only then translated into Lean, in another 17 hours. Electricity alone cost millions of dollars. Announced September 8; Terence Tao congratulated them the same day.

---

### Slide 12 · "Who got there first — and with whose ideas?"
⏱️ 0:55 · (8:45)

🖱️ Chips **W · Timeline** and **W · Claims and disputes**.

🎤 Compressed timeline. September 2, Alpöge is tipped off that his and Buckmaster's work has leaked. September 6, an OpenAI researcher reaches out to both, and there's a meeting. September 7, just before midnight, Buckmaster posts his results. September 8 at noon, OpenAI announces — twelve hours later. The dispute: did leaked ideas, or Codex user data, shape OpenAI's prompts? OpenAI says the proofs are very different, admits de-identified usage data may have gone into training, and denies any influence.

---

### Slide 13 · "The math community responds"
⏱️ 0:40 · (9:25)

🖱️ Chip **W · Reactions**.

🎤 The reaction was fast. Twenty-five Fields Medalists signed a letter against treating open problems as benchmarks. Tao criticised announcing math by press release instead of a preprint. Córdoba wasn't even notified — and said that without his group's work, AI wouldn't have solved it. Strogatz argued the prize should go to Córdoba and Martínez-Zoroa. And Yau and Wiedemann asked: who can afford ten thousand agents?

---

## Part 3 — The critique paper

### Slide 14 · "Navier–Stokes Lost in Translation"
⏱️ 0:50 · (10:15)

🖱️ Chip **📄 Section 1** opens the PDF on page 1 with the passage highlighted.

🎤 Now the paper behind Part 3, by Bastounis, Circelli and Hansen, from King's College and Cambridge. Everyone said "it's verified in Lean". They separate two things. Type one: the statement is already formalised, and the AI just needs some proof that compiles. Type two: translate the whole text — definitions, statements, proofs — preserving the meaning. "The proof was verified" presupposes type two. And an important caveat: they do not say OpenAI's proof is wrong. Only that Lean doesn't certify it.

---

### Slide 15 · "The translator fixed the bug — and nobody noticed"
⏱️ 0:40 · (10:55)

🖱️ Chips **📄 Example 2.1** and **📄 Example 2.2**.

🎤 A toy example from the paper itself. We want to prove this polynomial is non-negative for x at least minus one. The written proof factors it wrong. Someone asked a chatbot to formalise that wrong proof; it found the right factorisation on its own, and Lean compiled. Result: a "verified" badge on top of a wrong proof. It's like a buggy PR passing CI because CI ran on code someone else rewrote.

🔊
- `p(x) = x³ − x² − x + 1 ≥ 0, x ≥ −1` → "p of x equals x cubed minus x squared minus x plus one, at least zero, for x at least minus one"
- `(x−1)(x+1)²` → "x minus one, times x plus one squared" (wrong)
- `(x−1)²(x+1)` → "x minus one squared, times x plus one" (right)
- (2.2 modal) `tr(A²) ≥ 0` → "trace of A squared is at least zero"

---

### Slide 16 · "It compiles. But it isn't what the paper says."
⏱️ 0:45 · (11:40)

🖱️ Chips **📄 Ex. 3.1** (PDF p. 4), **📄 Ex. 3.3** (p. 8) and **📄 Sections 3.3–3.4** (p. 12).

🎤 Now in OpenAI's real paper. Lemma 8.6: the text says controlling four extra derivatives is enough; the Lean code needs five. That's a different, weaker lemma — and it compiles. In the pressure-flux estimate, equation 10.19, both statement and proof changed: the Lean bound depends on another quantity and isn't even directly comparable. The authors classify it: a mistranslation can be benign, can repair errors, or can change the result.

🔊
- `‖N⁻¹F‖_{Cᵐ} ≤ Cₘ ‖F‖_{C^{m+4}}` → "the C-m norm of N inverse F is at most C sub m times the C-m-plus-four norm of F"
- Lean version → "… K sub m times the C-m-**plus-five** norm of F"
- `N = vₜ·∇_y` → "N is v sub t dot grad y"
- eq. 10.19 → no need to read it; say "the pressure-flux estimate"

---

### Slide 17 · "Tests pass. The spec is wrong."
⏱️ 0:45 · (12:25)

🖱️ Chips **📄 Section 4.1** (p. 13) and **📄 Example 4.3** (p. 14).

🎤 Why this happens. In Lean, the infimum of the empty set is zero. So "the least n such that…" compiles even when no such n exists — "undefined" silently becomes zero, like a `?? 0` hiding a bug. And the typical AI loop is: while it doesn't compile, revise. It accepts any translation that compiles. The authors show that faithful translation, resolving ambiguity, has SCI equal to infinity — informally, harder than the Halting problem.

🔊
- `sInf ∅ = 0` → "the infimum of the empty set is zero"
- `nₑ := sInf {n | P n}` → "n sub e is the infimum of the n such that P of n"
- `rₑ = 1/(nₑ+1)` → "r sub e equals one over n sub e plus one"
- `Σ⁰₂` → "sigma zero two"
- `SCI = ∞` → "S-C-I equals infinity"

---

### Slide 18 · "Status: unresolved"
⏱️ 0:40 · (13:05)

🖱️ Chip **W · Outcome and status**.

🎤 Where it stands: Clay hasn't recognised anyone and requires peer-reviewed publication; its website lists the problem as "active". OpenAI says it won't claim the prize. Three takeaways for us engineers. One: compiling isn't being correct — the spec is the hard part, exactly like software. Two: compute is now a research instrument — who can afford it? Three: provenance matters — data, credit and citations. Thank you.

---

### Slide 19 · References
⏱️ — (leave it up during Q&A)

---

## Glossary

### Equations — how to read them and a one-line explanation

| Equation | Read as | In one sentence |
|---|---|---|
| `F = ma` | "F equals m a" | Force is mass times acceleration (Newton). Navier–Stokes is this for every point of a fluid. |
| `∂u/∂t + (u·∇)u = −∇p + νΔu + f` | "partial u partial t, plus u dot grad u, equals minus grad p, plus nu Laplacian u, plus f" | Navier–Stokes: how fluid velocity changes through advection, pressure, viscosity and external force. |
| `∇·u = 0` | "divergence of u equals zero" | Incompressibility: whatever flows into a volume flows out. |
| `∂ρ/∂t + ∇·(ρu) = 0` | "partial rho partial t plus divergence of rho u equals zero" | Continuity: mass is neither created nor destroyed. |
| `A·v = const` | "area times speed is constant" | Continuity in a pipe: narrower means faster. |
| `ρ Du/Dt = ∇·σ + ρf` | "rho D u D t equals divergence of sigma plus rho f" | Cauchy's equation: F = ma per parcel, with internal stresses σ. |
| `Du/Dt = ∂u/∂t + (u·∇)u` | "D u D t equals partial u partial t plus u dot grad u" | Material derivative: change "following the drop". Source of the nonlinear term. |
| `σ = −pI + μ(∇u + ∇uᵀ)` | "sigma equals minus p identity plus mu times grad u plus grad u transpose" | Newtonian fluid: pressure plus friction proportional to deformation. |
| `∂ₜu + (u·∇)u = −∇p + f` | "partial t u plus u dot grad u equals minus grad p plus f" | Euler equation: Navier–Stokes without viscosity. |
| `−ν(−Δ)^α u` | "minus nu, minus-Laplacian to the alpha, of u" | Fractional dissipation: with α < 1, weaker viscosity (hypodissipative). |
| `−Δ ↔ |k|²` | "minus Laplacian corresponds to k squared" | In Fourier space the Laplacian becomes multiplication by k² — it damps small scales more. |
| `uₜ + u uₓ = ν uₓₓ` | "u sub t plus u u sub x equals nu u sub x x" | 1D Burgers: the toy cousin used in the simulations. |
| `max|u| ~ 1/√(T*−t)` | "max of u grows like one over root of T star minus t" | Blow-up cartoon: goes to infinity as t reaches T*. |
| `‖N⁻¹F‖_{Cᵐ} ≤ Cₘ‖F‖_{C^{m+4}}` | "C-m norm of N inverse F at most C sub m times C-m-plus-four norm of F" | Lemma 8.6 of OpenAI's paper; in Lean it became "m + 5". |
| `p(x) = (x−1)²(x+1)` | "x minus one squared times x plus one" | Correct factorisation in the toy example (Ex. 2.1). |
| `tr(A²) ≥ 0` | "trace of A squared at least zero" | Example 2.2: two correct but different proofs. |
| `sInf ∅ = 0` | "infimum of the empty set equals zero" | Lean convention that turns "undefined" into 0 without warning. |
| `rₑ = 1/(nₑ+1)` | "r sub e equals one over n sub e plus one" | Example 4.1: only makes sense if nₑ exists. |
| `a + b = b + a` (Lean) | "a plus b equals b plus a" | A Lean theorem: statement = type, proof = program. |
| `ω = ∇×u` | "omega equals curl of u" | Vorticity: how much the fluid spins at each point. |
| `(ω·∇)u` | "omega dot grad u" | Vortex stretching: the concentration mechanism in 3D. |

### Notation

| Symbol | Read as | Meaning |
|---|---|---|
| `u` | "u" (bold: vector) | Velocity field: at each point, where and how fast the fluid moves. |
| `p` | "p" | Pressure. |
| `ρ` | "rho" | Density. |
| `ν` | "nu" | Kinematic viscosity (the size of the "blur"). |
| `μ` | "mu" | Dynamic viscosity (μ = ρν). |
| `f` | "f" | External force. |
| `σ` | "sigma" | Stress tensor (internal forces). |
| `∂/∂t` | "partial with respect to t" | Change in time at a fixed point. |
| `∇` | "nabla" or "grad" | Vector of spatial derivatives. |
| `∇p` | "grad p" | Direction of fastest pressure increase; −∇p pushes towards low pressure. |
| `∇·u` | "divergence of u" / "div u" | How much fluid "leaves" a point. |
| `∇×u` | "curl of u" | How much the fluid spins. |
| `Δ` | "Laplacian" | Sum of second derivatives; how much a point differs from its neighbourhood. |
| `(−Δ)^α` | "minus Laplacian to the alpha" | Fractional power of the Laplacian; here it **is** a power. |
| `k`, `|k|` | "k", "magnitude of k" | Fourier frequency; high k = small scale. |
| `T*` | "T star" | Blow-up time. |
| `ℝ³` | "R three" | Three-dimensional space. |
| `ℝ³/ℤ³` | "R three mod Z three" | Periodic box (torus): leave one side, re-enter on the other. |
| `Cᵏ` | "C k" | Set of functions with k continuous derivatives. The superscript is a label, **not** a power. |
| `C^∞` | "C infinity" | Smooth functions: all derivatives exist. |
| `C^(1,ε)` | "C one epsilon" | One continuous derivative "and a bit more", but far from smooth. |
| `f ∈ C^∞` | "f is in C infinity" | f is smooth. |
| `‖·‖` | "norm" | Size of a function. |
| `∅` | "empty set" | — |
| `Σ⁰₂` | "sigma zero two" | A level of the arithmetical hierarchy, above the Halting problem. |

### Terms

- **Navier–Stokes**: equations of motion for viscous fluids (Navier 1822, Stokes 1845). Conservation of mass + conservation of momentum.
- **Euler equation**: Navier–Stokes without viscosity, by Leonhard Euler (1757). Not a Clay prize problem.
- **Advection**: the fluid carrying its own properties, including velocity. The `(u·∇)u` term, nonlinear.
- **Viscosity**: internal friction; smooths gradients. The `νΔu` term.
- **Incompressible**: constant density; volume is conserved (`∇·u = 0`).
- **Newtonian fluid**: friction proportional to the rate of deformation (water, air). Honey and ketchup aren't.
- **Material derivative (D/Dt)**: change following a fluid parcel, rather than watching a fixed point.
- **Fluid parcel**: a small "chunk" of fluid tracked as it moves.
- **External force / smooth force**: a push from outside (gravity, a spoon). "Smooth" = no jumps, spikes or corners; C^∞.
- **Smooth (C^∞)**: has all derivatives, all finite and continuous.
- **Singularity**: a point where the solution stops being smooth (something goes to infinity).
- **Blow-up / breakdown**: starting smooth and reaching a singularity in finite time.
- **Shock**: in 1D Burgers, the wave turns into a step; the toy model's blow-up.
- **Vortex stretching**: a stretched swirl gets thinner and spins faster (a skater pulling in her arms). Only exists in 3D.
- **Hypodissipative**: Navier–Stokes with weakened viscosity, `(−Δ)^α` with α < 1.
- **Hyperdissipative**: strengthened viscosity, α > 1; for α ≥ 5/4 everything is proved to stay smooth (J.-L. Lions).
- **Burgers equation**: 1D model with advection and viscosity; used in the simulations on slides 5 and 6.
- **Boussinesq**: Navier–Stokes/Euler with temperature and buoyancy (hot rises).
- **IPM (incompressible porous media)**: flow through a porous medium (Darcy's law); a cousin of the fluid equations.
- **Millennium Prize Problems**: seven problems chosen by the Clay Mathematics Institute in 2000, $1M each. Only one solved (Poincaré, Perelman, 2010).
- **Alternatives (A)–(D)**: the four ways to solve the problem in Fefferman's statement. A/B: always smooth without force. C/D: breakdown with a smooth force.
- **Lean**: programming language and proof assistant; if the proof compiles, the formal statement is proved.
- **Formalisation**: writing mathematics in Lean.
- **Autoformalisation**: AI translating written math into Lean.
- **Proof translation (type i)**: finding some Lean proof for an already-formal statement.
- **Faithful semantic translation (type ii)**: translating the whole text while preserving meaning.
- **Mistranslation**: Lean code that compiles but doesn't say what the text says.
- **`sorry`**: in Lean, "skip this proof"; a proof with `sorry` doesn't count.
- **Infimum (`sInf`)**: the "smallest value" of a set; in Lean, the empty set's is 0 by convention.
- **Halting problem**: deciding whether a program terminates; impossible in general (SCI = 1).
- **SCI (Solvability Complexity Index)**: a measure of how "impossible" a computational problem is; the paper argues faithful translation has SCI = ∞.
- **Preprint / peer review**: paper posted before review (arXiv) vs. paper checked by experts before publication. Clay requires the latter.
- **Multi-agent system**: many AI instances working in parallel and exchanging messages.

### People and institutions

- **Charles Fefferman**: wrote the official problem statement (Clay).
- **Diego Córdoba** (ICMAT-CSIC, Madrid), **Luis Martínez-Zoroa**, **Fan Zheng**: 2023–24 blow-up constructions.
- **Thomas Hou** and **Guo Luo**: numerical evidence of Euler blow-up (2013).
- **Tristan Buckmaster** (NYU) and **Levent Alpöge** (Anthropic, personal capacity): forced blow-up for Euler, IPM and Boussinesq (Aug 2026).
- **Sébastien Bubeck**, **Noam Brown**: OpenAI researchers in the story.
- **Terence Tao**: mathematician, Fields Medalist; praised, then criticised how it was announced.
- **Steven Strogatz**: mathematician; argued the prize should go to Córdoba and Martínez-Zoroa.
- **Shing-Tung Yau**, **Emil Wiedemann**: raised the resource gap.
- **Bastounis, Circelli & Hansen** (King's College London, Cambridge): authors of "Lost in Translation".
- **Martin Bridson**: president of the Clay Mathematics Institute.
- **J.-L. Lions**: proved regularity for α ≥ 5/4.
- **Kiselev, Nazarov & Shterenberg**: the α = ½ threshold for fractal Burgers.
