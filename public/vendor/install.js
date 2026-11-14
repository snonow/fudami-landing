/* install.js - "add to home screen" tutorial. Shown once per browser on a phone, never when the app is
 * already installed, reopened by any <a href="#install">. Needs chrome.browser.js (FudamiDesign.t) loaded first.
 * ponytail: auto-shows on touch devices only; desktop visitors use the "#install" link. */
(() => {
  const KEY = "fudami-install-seen";
  const t = (s) => FudamiDesign.t(s);
  const mq = (q) => (window.matchMedia ? matchMedia(q) : { matches: false }); // jsdom has none
  const standalone = mq("(display-mode: standalone)");
  const installed = () => standalone.matches || navigator.standalone === true;
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const seen = () => { try { return localStorage.getItem(KEY); } catch { return "1"; } };
  const remember = () => { try { localStorage.setItem(KEY, "1"); } catch { /* storage off: nothing to remember */ } };

  const icon = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const ICON = {
    share: icon('<path d="M12 15V3M8 7l4-4 4 4M6 11H5v10h14V11h-1"/>'),
    add: icon('<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 8v8M8 12h8"/>'),
    menu: icon('<circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>'),
    install: icon('<path d="M12 3v12M8 11l4 4 4-4M5 21h14"/>'),
    done: icon('<path d="M5 12l5 5 9-10"/>'),
  };

  let deferred = null;
  addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferred = e; });

  function open() {
    if (installed() || document.querySelector("dialog.fd-install")) return;
    remember();
    const steps = ios
      ? [["share", "Tap the Share button in Safari"], ["add", "Choose “Add to Home Screen”"], ["done", "Tap Add: the app is on your home screen"]]
      : [["menu", "Open the browser menu"], ["install", "Choose “Install app” or “Add to Home screen”"], ["done", "Confirm: the app is on your home screen"]];
    const d = document.createElement("dialog");
    d.className = "fd-install";
    d.setAttribute("aria-labelledby", "fd-install-title");
    d.innerHTML = `<h2 id="fd-install-title"></h2><p></p><ol></ol><div class="fd-install-actions"></div>`;
    d.querySelector("h2").textContent = t("Install on your home screen");
    d.querySelector("p").textContent = t("Open it like an app, full screen, in one tap.");
    const ol = d.querySelector("ol");
    for (const [k, text] of deferred ? [] : steps) {
      const li = document.createElement("li");
      li.innerHTML = ICON[k];
      li.append(t(text));
      ol.append(li);
    }
    const actions = d.querySelector(".fd-install-actions");
    const btn = (cls, label, fn) => { const b = document.createElement("button"); b.type = "button"; b.className = cls; b.textContent = t(label); b.onclick = fn; actions.append(b); };
    btn("btn-ghost", "Not now", () => d.close());
    if (deferred) btn("btn-hanko", "Install", () => { deferred.prompt(); deferred = null; d.close(); });
    d.addEventListener("close", () => d.remove());
    document.body.append(d);
    d.showModal();
  }

  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest('a[href="#install"]');
    if (a) { e.preventDefault(); open(); }
  });
  // Late enough for beforeinstallprompt to have fired, so Android gets its one-tap button.
  if (!seen() && !installed() && mq("(pointer: coarse)").matches) setTimeout(open, 1500);
})();
