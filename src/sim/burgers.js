/**
 * 1D "fractal" Burgers equation, solved pseudo-spectrally on [0, 2π):
 *
 *     u_t + u u_x = −ν (−Δ)^α u          (Fourier: −ν |k|^{2α} û)
 *
 * α = 1  → ordinary viscosity (the 1D cousin of Navier–Stokes)
 * α < 1  → hypodissipative (weaker damping of small scales)
 * ν = 0  → inviscid (the 1D cousin of Euler): a shock forms at t = 1 for u₀ = sin x
 *
 * It's a toy model: same fight between advection (u u_x) and dissipation,
 * in one dimension. Integrating factor + Heun (RK2), 2/3 de-aliasing.
 */

function fft(re, im, inverse) {
  const n = re.length
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1
    for (; j & bit; bit >>= 1) j ^= bit
    j ^= bit
    if (i < j) {
      ;[re[i], re[j]] = [re[j], re[i]]
      ;[im[i], im[j]] = [im[j], im[i]]
    }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = ((inverse ? 2 : -2) * Math.PI) / len
    const wr = Math.cos(ang), wi = Math.sin(ang)
    for (let i = 0; i < n; i += len) {
      let cr = 1, ci = 0
      for (let j = 0; j < len / 2; j++) {
        const a = i + j, b = a + len / 2
        const tr = re[b] * cr - im[b] * ci
        const ti = re[b] * ci + im[b] * cr
        re[b] = re[a] - tr; im[b] = im[a] - ti
        re[a] += tr; im[a] += ti
        const ncr = cr * wr - ci * wi
        ci = cr * wi + ci * wr
        cr = ncr
      }
    }
  }
  if (inverse) for (let i = 0; i < n; i++) { re[i] /= n; im[i] /= n }
}

export function createBurgers({ N = 256, nu = 0.05, alpha = 1, dt = 0.002, u0 = (x) => Math.sin(x) } = {}) {
  const k = new Float64Array(N)
  for (let i = 0; i < N; i++) k[i] = i < N / 2 ? i : i - N
  const kmax = N / 3 // 2/3 rule
  const mask = Float64Array.from(k, (kk) => (Math.abs(kk) < kmax ? 1 : 0))
  const E = Float64Array.from(k, (kk) => Math.exp(-nu * Math.pow(Math.abs(kk), 2 * alpha) * dt * (kk === 0 ? 0 : 1)))
  const x = Float64Array.from({ length: N }, (_, i) => (2 * Math.PI * i) / N)

  let ur = Float64Array.from(x, u0)
  let ui = new Float64Array(N)
  fft(ur, ui, false)
  let t = 0

  const tr = new Float64Array(N), ti = new Float64Array(N)
  // N(û) = −(1/2) i k F(u²)
  function nonlinear(ar, ai, outR, outI) {
    tr.set(ar); ti.set(ai)
    for (let i = 0; i < N; i++) { tr[i] *= mask[i]; ti[i] *= mask[i] }
    fft(tr, ti, true)
    for (let i = 0; i < N; i++) { tr[i] = tr[i] * tr[i]; ti[i] = 0 }
    fft(tr, ti, false)
    for (let i = 0; i < N; i++) {
      // −0.5 * i k (a + ib) = 0.5 k b − 0.5 i k a
      outR[i] = 0.5 * k[i] * ti[i] * mask[i]
      outI[i] = -0.5 * k[i] * tr[i] * mask[i]
    }
  }

  const n1r = new Float64Array(N), n1i = new Float64Array(N)
  const n2r = new Float64Array(N), n2i = new Float64Array(N)
  const pr = new Float64Array(N), pi = new Float64Array(N)

  function step() {
    nonlinear(ur, ui, n1r, n1i)
    for (let i = 0; i < N; i++) {
      pr[i] = (ur[i] + dt * n1r[i]) * E[i]
      pi[i] = (ui[i] + dt * n1i[i]) * E[i]
    }
    nonlinear(pr, pi, n2r, n2i)
    for (let i = 0; i < N; i++) {
      ur[i] = ur[i] * E[i] + 0.5 * dt * (n1r[i] * E[i] + n2r[i])
      ui[i] = ui[i] * E[i] + 0.5 * dt * (n1i[i] * E[i] + n2i[i])
    }
    t += dt
  }

  function field() {
    const a = Float64Array.from(ur), b = Float64Array.from(ui)
    fft(a, b, true)
    return a
  }
  /** max |u_x| */
  function maxGrad() {
    const a = new Float64Array(N), b = new Float64Array(N)
    for (let i = 0; i < N; i++) { a[i] = -k[i] * ui[i] * mask[i]; b[i] = k[i] * ur[i] * mask[i] }
    fft(a, b, true)
    let m = 0
    for (let i = 0; i < N; i++) m = Math.max(m, Math.abs(a[i]))
    return m
  }

  return { step, field, maxGrad, x, get t() { return t } }
}
