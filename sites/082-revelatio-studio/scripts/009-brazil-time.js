function initBrazilTime() {
  const oldTimeElements = document.querySelectorAll('.time');
  const yourTimeElements = document.querySelectorAll('.your-time-zone');
  const ourTimeElements = document.querySelectorAll('.our-time-zone');
  if (!oldTimeElements.length && !yourTimeElements.length && !ourTimeElements.length) return;

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const userCountry = getCountryCodeFromTimeZone(userTimeZone);

  const localFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: userTimeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const brazilFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const updateTime = () => {
    const now = new Date();

    const localTime = localFormatter.format(now);
    const brazilTime = brazilFormatter.format(now);

    yourTimeElements.forEach((el) => {
      el.textContent = `Your Timezone (${userCountry}) ${localTime}`;
    });

    ourTimeElements.forEach((el) => {
      el.textContent = `Revelatio Timezone (BR) ${brazilTime}`;
    });

    oldTimeElements.forEach((el) => {
      el.textContent = brazilTime;
    });
  };

  updateTime();
  setInterval(updateTime, 1000);
}

function getCountryCodeFromTimeZone(timeZone) {
  const explicitMap = {
    UTC: 'UTC',
    'America/Sao_Paulo': 'BR',
    'America/New_York': 'US',
    'America/Chicago': 'US',
    'America/Denver': 'US',
    'America/Los_Angeles': 'US',
    'America/Phoenix': 'US',
    'America/Anchorage': 'US',
    'Pacific/Honolulu': 'US',
  };

  if (explicitMap[timeZone]) return explicitMap[timeZone];

  const parts = timeZone.split('/');
  const region = parts[0];
  const city = parts[1];

  if (region === 'America') {
    const countryMap = {
      Toronto: 'CA',
      Vancouver: 'CA',
      Montreal: 'CA',
      Mexico_City: 'MX',
      Bogota: 'CO',
      Lima: 'PE',
      Santiago: 'CL',
      Buenos_Aires: 'AR',
      Montevideo: 'UY',
    };
    return countryMap[city] || 'US';
  }

  const regionMap = {
    Europe: 'EU',
    Asia: 'AS',
    Africa: 'AF',
    Australia: 'AU',
    Pacific: 'OC',
    Atlantic: 'EU',
    Indian: 'AS',
  };

  return regionMap[region] || 'LOCAL';
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBrazilTime);
} else {
  initBrazilTime();
}
