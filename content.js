const SELECTOR_GROUPS = {
  ratings: [
    '.cc-user-rating-boldest',
    '.cc-user-rating-default',
    '.cc-user-rating-white',
    '.game-over-message-component',
    '.game-start-message-component',
    '.rating-score-component',
    '.user-popover-divider',
    '.user-rating-component'
  ],
  results: [
    '.archive-games-result-wrapper',
    '.archived-games-result-wrapper'
  ],
  stats: [
    '.cc-section[vsstats="false"]',
    '.overview-stats-component',
    '.profile-layout .overview-bottom',
    '.profile-layout #profile-sidebar',
    '#profile-main .game-parent',
    '#profile-main .overview-main-stats-badges',
    '.stats-component',
    '.sidebar-section[data-cy="stats"]'
  ]
}

const DEFAULT_SETTINGS = {
  hideRatings: true,
  hideResults: true,
  hideStats: true
}

let currentSelectors = []
let styleEl = null
let hideRatingsEnabled = DEFAULT_SETTINGS.hideRatings

const buildSelectorList = (settings) => {
  const selectors = []

  if (settings.hideRatings) selectors.push(...SELECTOR_GROUPS.ratings)
  if (settings.hideResults) selectors.push(...SELECTOR_GROUPS.results)
  if (settings.hideStats) selectors.push(...SELECTOR_GROUPS.stats)

  return selectors
}

const applySettings = (settings) => {
  hideRatingsEnabled = settings.hideRatings
  currentSelectors = buildSelectorList(settings)

  const css = currentSelectors
    .map((sel) => `${sel} { display: none !important; }`)
    .join('\n')

  if (!styleEl) {
    styleEl = document.createElement('style')
    styleEl.textContent = css
    document.documentElement.appendChild(styleEl)
  } else {
    styleEl.textContent = css
  }
}

// Hide rating-change messages: the 2nd <p> in a message body when it contains "=>"
// (e.g. "Rapid: 1240 + 9 => 1249"). Text-content matching isn't possible in CSS.
const hideRatingChangeMessages = () => {
  if (!hideRatingsEnabled) return

  document.querySelectorAll('.message-conversation-item-body').forEach((body) => {
    const second = body.querySelectorAll('p')[1]
    if (second && second.textContent.includes('=>')) {
      second.style.display = 'none'
    }
  })
}

const init = () => {
  // 1) Apply defaults immediately to avoid flash (hide everything)
  applySettings(DEFAULT_SETTINGS)

  // 2) Then load real settings (may relax hiding if user disabled things)
  if (chrome?.storage?.sync) {
    chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
      applySettings(settings)
    })
  }

  // 3) Hide rating-change messages now and as new ones arrive
  hideRatingChangeMessages()
  new MutationObserver(hideRatingChangeMessages).observe(document.documentElement, {
    childList: true,
    subtree: true
  })
}

init()
