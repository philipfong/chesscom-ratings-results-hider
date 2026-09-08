/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

const SELECTOR_GROUPS = {
  ratings: [
    '.cc-user-rating-boldest',
    '.cc-user-rating-default',
    '.cc-user-rating-white',
    '.game-over-message-component',
    '.game-over-stat-card-component',
    '.game-history-user-tagline-rating-diff',
    '.game-start-message-component',
    '.rating-score-component',
    '.user-popover-divider',
    '.user-rating-component',
    '.notification-item-container h4.cc-text-small', // Appears in Live Challenges 'Play' popover
    '.seeking-tagline-rating' // Appears as a rating range displayed while searching for opponent
  ],
  results: [
    '.archive-games-result-wrapper',
    '.archived-games-result-wrapper',
    '.game-result-icon',
    '.game-result-score'
  ],
  stats: [
    '.all-stats-table',
    '.cc-section[vsstats="false"]',
    '.overview-stats-component',
    '.profile-layout .overview-bottom',
    '.profile-layout #profile-sidebar',
    '#profile-main .stats-layout-content', // Hide stats in game type breakdowns (Rapid, Blitz, etc.)
    '#profile-main .game-parent',
    '#profile-main .overview-main-stats-badges',
    '.stats-component',
    '.sidebar-section[data-cy="stats"]',
    '.stat-item-stats-section',
    '.advanced-stats-report-card-ratingGroup', // Advanced stats that can appear post game
    '.type-header-rating', // Hide ratings that can appear in /stats/{game-type} pages
    '.delta-component' // Hide positive / negative rating changes
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
let hideResultsEnabled = DEFAULT_SETTINGS.hideResults

// Bolded outline marking a win on the white/black square icon. It shares an
// element with the color icon, so display:none would hide the icon too.
// Removing just this class leaves the other classes on the element intact.
const WON_CLASS = 'game-history-user-tagline-won'

const buildSelectorList = (settings) => {
  const selectors = []

  if (settings.hideRatings) selectors.push(...SELECTOR_GROUPS.ratings)
  if (settings.hideResults) selectors.push(...SELECTOR_GROUPS.results)
  if (settings.hideStats) selectors.push(...SELECTOR_GROUPS.stats)

  return selectors
}

const applySettings = (settings) => {
  hideRatingsEnabled = settings.hideRatings
  hideResultsEnabled = settings.hideResults
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

const stripWonHighlights = () => {
  if (!hideResultsEnabled) return

  document.querySelectorAll('.' + WON_CLASS).forEach((el) => {
    el.classList.remove(WON_CLASS)
  })
}

const onMutation = () => {
  hideRatingChangeMessages()
  stripWonHighlights()
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

  // 3) Run the JS-side hiding now and as new nodes arrive
  onMutation()
  new MutationObserver(onMutation).observe(document.documentElement, {
    childList: true,
    subtree: true
  })
}

init()