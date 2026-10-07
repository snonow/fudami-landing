const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");

// The header comes from vendor/*.js; Tailwind only emits classes it finds in `content`.
test("design-system.css has the responsive classes the vendored header uses", () => {
  const css = fs.readFileSync("design-system.css", "utf8");
  assert.ok(css.includes("md\\:hidden"), "rebuild with `npm run build`; tailwind.config.js must scan ./vendor/*.js");
});
