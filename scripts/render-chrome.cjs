const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const PUBLIC = path.join(__dirname, '..', 'public');
for (const name of fs.readdirSync(PUBLIC).filter(name => name.endsWith('.html'))) {
  const file = path.join(PUBLIC, name);
  let html = fs.readFileSync(file, 'utf8');
  const active = html.match(/injectHeader\('([^']*)'\)/)?.[1];
  if (active === undefined) throw new Error(`${name} has no header configuration`);
  const dom = new JSDOM('<!doctype html><body></body>', { runScripts: 'outside-only', url: 'https://fudami.net/' });
  for (const script of ['vendor/fudami-design.browser.js', 'components.js']) {
    dom.window.eval(fs.readFileSync(path.join(PUBLIC, script), 'utf8'));
  }
  dom.window.injectHeader(active);
  dom.window.injectFooter();
  for (const part of ['header', 'footer']) {
    const block = `<!-- fd-${part}:start -->${dom.window.document.getElementById(`site-${part}`).outerHTML}<!-- fd-${part}:end -->`;
    const marker = new RegExp(`<!-- fd-${part}:start -->[\\s\\S]*?<!-- fd-${part}:end -->`);
    html = marker.test(html) ? html.replace(marker, () => block)
      : part === 'header' ? html.replace(/<body\b[^>]*>/i, match => `${match}\n${block}`)
      : html.replace(/<\/body>/i, () => `${block}\n</body>`);
  }
  fs.writeFileSync(file, html);
  dom.window.close();
}
