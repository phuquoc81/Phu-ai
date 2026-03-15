import './style.css'

const STORAGE_KEY = 'antimatter-reactor-state'
const BREACH_POINT = 100

const defaultState = {
  antimatter: 0,
  reactors: 0,
  stabilizers: 0,
  fragments: 0,
  entropy: 18,
  totalAntimatter: 0,
  totalClicks: 0,
  status: 'Boot the containment core and begin condensing antimatter.'
}

const state = loadState()
const app = document.querySelector('#app')

app.innerHTML = `
  <main class="game-shell">
    <section class="hero-card">
      <p class="eyebrow">Phu AI Experimental Division</p>
      <h1>Antimatter Reactor</h1>
      <p class="hero-copy">
        Balance production and entropy in a volatile antimatter lab. Build reactors,
        buy stabilizers, and survive containment breaches long enough to unlock a
        self-sustaining core.
      </p>
      <div class="hero-actions">
        <button id="condense-button" class="primary-action" type="button">
          Condense antimatter
        </button>
        <button id="vent-button" class="secondary-action" type="button">
          Vent entropy (-6 antimatter)
        </button>
      </div>
      <p id="status-text" class="status-text" aria-live="polite"></p>
    </section>

    <section class="dashboard" aria-label="Antimatter reactor dashboard">
      <article class="stat-card accent">
        <span class="stat-label">Antimatter</span>
        <strong id="antimatter-value" class="stat-value">0</strong>
        <span id="production-value" class="stat-meta">+0 / second</span>
      </article>
      <article class="stat-card">
        <span class="stat-label">Fragments</span>
        <strong id="fragments-value" class="stat-value">0</strong>
        <span class="stat-meta">Permanent expertise bonus</span>
      </article>
      <article class="stat-card">
        <span class="stat-label">Entropy</span>
        <strong id="entropy-value" class="stat-value">0%</strong>
        <div class="meter" aria-hidden="true">
          <span id="entropy-fill" class="meter-fill"></span>
        </div>
      </article>
      <article class="stat-card">
        <span class="stat-label">Containment</span>
        <strong id="containment-value" class="stat-value">Stable</strong>
        <span id="objective-value" class="stat-meta">Reach 250 total antimatter</span>
      </article>
    </section>

    <section class="systems-grid">
      <article class="panel">
        <h2>Lab controls</h2>
        <div class="system-row">
          <div>
            <h3>Micro-reactor array</h3>
            <p>Automates production, but adds entropy every cycle.</p>
          </div>
          <button id="buy-reactor-button" class="panel-button" type="button">
            Buy reactor
          </button>
        </div>
        <div class="system-row">
          <div>
            <h3>Field stabilizer</h3>
            <p>Suppresses entropy growth and keeps the core controllable.</p>
          </div>
          <button id="buy-stabilizer-button" class="panel-button" type="button">
            Buy stabilizer
          </button>
        </div>
      </article>

      <article class="panel">
        <h2>Reactor telemetry</h2>
        <dl class="telemetry-list">
          <div>
            <dt>Manual condensations</dt>
            <dd id="clicks-value">0</dd>
          </div>
          <div>
            <dt>Active reactors</dt>
            <dd id="reactors-value">0</dd>
          </div>
          <div>
            <dt>Installed stabilizers</dt>
            <dd id="stabilizers-value">0</dd>
          </div>
          <div>
            <dt>Total antimatter created</dt>
            <dd id="total-value">0</dd>
          </div>
        </dl>
      </article>
    </section>
  </main>
`

const elements = {
  antimatter: document.querySelector('#antimatter-value'),
  containment: document.querySelector('#containment-value'),
  clicks: document.querySelector('#clicks-value'),
  condenseButton: document.querySelector('#condense-button'),
  entropy: document.querySelector('#entropy-value'),
  entropyFill: document.querySelector('#entropy-fill'),
  fragments: document.querySelector('#fragments-value'),
  objective: document.querySelector('#objective-value'),
  production: document.querySelector('#production-value'),
  reactors: document.querySelector('#reactors-value'),
  reactorButton: document.querySelector('#buy-reactor-button'),
  stabilizers: document.querySelector('#stabilizers-value'),
  stabilizerButton: document.querySelector('#buy-stabilizer-button'),
  status: document.querySelector('#status-text'),
  total: document.querySelector('#total-value'),
  ventButton: document.querySelector('#vent-button')
}

elements.condenseButton.addEventListener('click', () => {
  const gain = getManualGain()
  state.antimatter += gain
  state.totalAntimatter += gain
  state.totalClicks += 1
  adjustEntropy(8 - state.stabilizers)
  state.status = `You condensed ${formatNumber(gain)} antimatter into the reactor core.`
  checkMilestones()
  saveAndRender()
})

elements.ventButton.addEventListener('click', () => {
  if (state.antimatter < 6) {
    state.status = 'You need at least 6 antimatter to vent entropy safely.'
    render()
    return
  }

  state.antimatter -= 6
  adjustEntropy(-20)
  state.status = 'Containment vents opened. Entropy levels are falling.'
  saveAndRender()
})

elements.reactorButton.addEventListener('click', () => {
  const cost = getReactorCost()
  if (state.antimatter < cost) {
    state.status = `Not enough antimatter. The next reactor costs ${formatNumber(cost)}.`
    render()
    return
  }

  state.antimatter -= cost
  state.reactors += 1
  state.status = 'A new micro-reactor is online and feeding the core.'
  saveAndRender()
})

elements.stabilizerButton.addEventListener('click', () => {
  const cost = getStabilizerCost()
  if (state.antimatter < cost) {
    state.status = `Stabilizers require ${formatNumber(cost)} antimatter to install.`
    render()
    return
  }

  state.antimatter -= cost
  state.stabilizers += 1
  adjustEntropy(-10)
  state.status = 'Field stabilizer engaged. Core turbulence is reduced.'
  saveAndRender()
})

setInterval(() => {
  const passiveGain = getPassiveGain()
  if (passiveGain > 0) {
    state.antimatter += passiveGain
    state.totalAntimatter += passiveGain
  }

  adjustEntropy(Math.max(1, state.reactors * 2 - state.stabilizers * 3))

  if (state.entropy >= BREACH_POINT) {
    handleBreach()
  } else {
    checkMilestones()
  }

  saveAndRender()
}, 1000)

render()

function adjustEntropy(amount) {
  state.entropy = clamp(state.entropy + amount, 0, BREACH_POINT)
}

function checkMilestones() {
  if (state.totalAntimatter >= 250) {
    state.status =
      'Reactor stabilized. Your antimatter lab is now self-sustaining and mission complete.'
  }
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function formatNumber(value) {
  return new Intl.NumberFormat().format(Math.floor(value))
}

function getContainmentLabel() {
  if (state.entropy >= 80) return 'Critical'
  if (state.entropy >= 55) return 'Strained'
  return 'Stable'
}

function getManualGain() {
  return 1 + state.fragments
}

function getObjectiveText() {
  if (state.totalAntimatter >= 250) {
    return 'Objective achieved — the reactor is stable.'
  }

  return `Reach ${formatNumber(250 - state.totalAntimatter)} more total antimatter to win.`
}

function getPassiveGain() {
  return state.reactors * (1 + state.fragments)
}

function getReactorCost() {
  return 12 + state.reactors * 8
}

function getStabilizerCost() {
  return 24 + state.stabilizers * 14
}

function handleBreach() {
  state.fragments += 1
  state.antimatter = Math.floor(state.antimatter * 0.35)
  state.reactors = Math.max(0, state.reactors - 1)
  state.entropy = 30
  state.status =
    'Containment breach! You salvaged a fragment and learned from the collapse, but one reactor was lost.'
}

function loadState() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) return { ...defaultState }
    return { ...defaultState, ...JSON.parse(saved) }
  } catch {
    return { ...defaultState }
  }
}

function render() {
  const reactorCost = getReactorCost()
  const stabilizerCost = getStabilizerCost()
  const passiveGain = getPassiveGain()
  const containment = getContainmentLabel()

  elements.antimatter.textContent = formatNumber(state.antimatter)
  elements.clicks.textContent = formatNumber(state.totalClicks)
  elements.containment.textContent = containment
  elements.entropy.textContent = `${formatNumber(state.entropy)}%`
  elements.entropyFill.style.width = `${state.entropy}%`
  elements.fragments.textContent = formatNumber(state.fragments)
  elements.objective.textContent = getObjectiveText()
  elements.production.textContent = `+${formatNumber(passiveGain)} / second`
  elements.reactors.textContent = formatNumber(state.reactors)
  elements.reactorButton.textContent = `Buy reactor (${formatNumber(reactorCost)})`
  elements.reactorButton.disabled = state.antimatter < reactorCost
  elements.stabilizers.textContent = formatNumber(state.stabilizers)
  elements.stabilizerButton.textContent = `Buy stabilizer (${formatNumber(stabilizerCost)})`
  elements.stabilizerButton.disabled = state.antimatter < stabilizerCost
  elements.status.textContent = state.status
  elements.total.textContent = formatNumber(state.totalAntimatter)
  elements.ventButton.disabled = state.antimatter < 6

  document.body.dataset.containment = containment.toLowerCase()
}

function saveAndRender() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  render()
}
