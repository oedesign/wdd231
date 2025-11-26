    // Set the timestamp on form load in ISO format for clarity.
    (function setTimestamp() {
      const tsInput = document.getElementById('formTimestamp');
      if (!tsInput) return;
      const now = new Date();
      // Example ISO local (without timezone offset): YYYY-MM-DDTHH:mm:ss
      const pad = n => String(n).padStart(2,'0');
      const isoLocal = now.getFullYear() + '-' + pad(now.getMonth()+1) + '-' + pad(now.getDate())
        + 'T' + pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
      tsInput.value = isoLocal;
      // Also add an accessible visible timestamp for keyboard users (not required but helpful)
      const tsVis = document.createElement('div');
      tsVis.className = 'muted';
      tsVis.style.marginTop = '8px';
      tsVis.textContent = 'Form loaded: ' + isoLocal;
      document.querySelector('.form-card').appendChild(tsVis);
    })();

    // Accessible modal handling: open on link click, close on close button, click overlay, ESC
    (function modals() {
      const links = document.querySelectorAll('.info-link[data-modal]');
      const overlays = document.querySelectorAll('.modal-overlay');

      let lastFocused = null;

      function openModal(id, trigger) {
        const overlay = document.getElementById(id);
        if (!overlay) return;
        overlay.classList.add('open');
        overlay.setAttribute('aria-hidden','false');
        // find first focusable in dialog
        const modal = overlay.querySelector('.modal');
        const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const first = focusable[0] || modal;
        lastFocused = trigger || document.activeElement;
        first.focus();
        // trap focus (simple)
        overlay.addEventListener('keydown', trapFocus);
      }

      function closeModal(overlay) {
        if (!overlay) return;
        overlay.classList.remove('open');
        overlay.setAttribute('aria-hidden','true');
        overlay.removeEventListener('keydown', trapFocus);
        if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
      }

      function trapFocus(e){
        if (e.key !== 'Tab') {
          if (e.key === 'Escape') {
            // close the overlay if Esc
            const overlay = e.currentTarget;
            closeModal(overlay);
          }
          return;
        }
        const overlay = e.currentTarget;
        const modal = overlay.querySelector('.modal');
        const focusable = Array.from(modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
          .filter(el => !el.hasAttribute('disabled'));
        if (focusable.length === 0) return;
        const first = focusable[0], last = focusable[focusable.length-1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }

      links.forEach(link => {
        link.addEventListener('click', function(e){
          e.preventDefault();
          const id = this.getAttribute('data-modal');
          openModal(id, this);
        });
        link.addEventListener('keydown', function(e){
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
          }
        });
      });

      overlays.forEach(overlay=>{
        overlay.addEventListener('click', function(e){
          // close if click outside modal container
          const modal = overlay.querySelector('.modal');
          if (!modal) return;
          if (!modal.contains(e.target)) closeModal(overlay);
        });
        // close buttons
        overlay.querySelectorAll('[data-close]').forEach(btn=>{
          btn.addEventListener('click', ()=> closeModal(overlay));
        });
      });

      // Also close with global ESC when a modal is open
      window.addEventListener('keydown', function(e){
        if (e.key === 'Escape') {
          document.querySelectorAll('.modal-overlay.open').forEach(overlay => closeModal(overlay));
        }
      });
    })();

    // Basic client-side validation UX enhancement: when form submit occurs, enforce pattern validity and report.
    (function validationUX(){
      const form = document.getElementById('membershipForm');
      form.addEventListener('submit', function(e){
        // Let the browser handle required and type validation. We can check pattern for orgTitle
        const orgTitle = form.elements['orgTitle'];
        if (orgTitle && orgTitle.value) {
          const ok = new RegExp(orgTitle.getAttribute('pattern')).test(orgTitle.value);
          if (!ok) {
            e.preventDefault();
            orgTitle.focus();
            orgTitle.setCustomValidity('Organizational title must be letters, spaces or hyphens and at least 7 characters.');
            orgTitle.reportValidity();
            // clear the custom message after user edits
            orgTitle.addEventListener('input', ()=>orgTitle.setCustomValidity(''), {once:true});
            return;
          }
        }
        // allow submit (GET) to thankyou.html
      });
    })();
