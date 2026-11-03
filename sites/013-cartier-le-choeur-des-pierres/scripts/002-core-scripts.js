/**
 * Script Injector
 *
 * This utility allows you to define a list of scripts to be dynamically injected
 * and executed in the browser.
 */

(function () {
  // Define the list of scripts to inject here
  const scripts = [
    // Example: '/js/analytics.js',
    // Example: 'https://example.com/widget.js',
    "/static/forter/forter-script.js"
  ];

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true; // Load asynchronously

      script.onload = () => {
        console.log(`[Script Injector] Loaded: ${src}`);
        resolve();
      };

      script.onerror = () => {
        console.error(`[Script Injector] Failed to load: ${src}`);
        reject(new Error(`Failed to load script: ${src}`));
      };

      document.body.appendChild(script);
    });
  }

  async function injectAllScripts() {
    // Load all scripts in parallel. The .catch() ensures that if one fails,
    // the others continue to load and we wait for all of them to finish.
    await Promise.all(scripts.map((src) => loadScript(src).catch((err) => console.error(err))));
  }

  // Run when the DOM is ready to ensure document.body exists
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectAllScripts);
  } else {
    injectAllScripts();
  }
})();