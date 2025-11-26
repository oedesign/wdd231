    // Parse query string and display required fields.
    (function displaySubmitted(){
      const params = new URLSearchParams(window.location.search);

      function out(key, elId) {
        const el = document.getElementById(elId);
        const val = params.get(key);
        if (!el) return;
        if (!val) {
          el.textContent = '—';
          return;
        }
        // For safety, escape output (simple)
        el.textContent = val;
      }

      out('firstName','out-firstName');
      out('lastName','out-lastName');
      out('email','out-email');
      out('mobile','out-mobile');
      out('organization','out-organization');

      // timestamp may be in ISO local format - show as-is but also make it more human if possible
      const tsRaw = params.get('timestamp');
      const outTs = document.getElementById('out-timestamp');
      if (tsRaw) {
        // Try to parse as local ISO-like string "YYYY-MM-DDTHH:MM:SS"
        let human = tsRaw;
        try {
          // insert timezone offset by treating it as local: Date constructor will treat "YYYY-MM-DDTHH:MM:SS" as local
          const d = new Date(tsRaw);
          if (!isNaN(d.getTime())) {
            human = d.toLocaleString(undefined, {dateStyle:'medium', timeStyle:'short'});
          }
        } catch(e){}
        outTs.textContent = human;
      } else {
        outTs.textContent = '—';
      }

      // For accessibility: move focus to the heading so screen reader users hear the notification
      document.getElementById('main').focus?.();
    })();