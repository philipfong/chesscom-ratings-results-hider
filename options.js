const DEFAULT_SETTINGS = {
  hideRatings: true,
  hideResults: true,
  hideStats: true
};

const $ = (id) => document.getElementById(id);

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
    $('hideRatings').checked = settings.hideRatings;
    $('hideResults').checked = settings.hideResults;
    $('hideStats').checked = settings.hideStats;
  });

  $('save').addEventListener('click', () => {
    const newSettings = {
      hideRatings: $('hideRatings').checked,
      hideResults: $('hideResults').checked,
      hideStats: $('hideStats').checked
    };

    chrome.storage.sync.set(newSettings, () => {
      const status = $('status');
      status.textContent = 'Options saved. Refresh chess.com tabs to apply.';
      setTimeout(() => (status.textContent = ''), 2000);
    });
  });
});
