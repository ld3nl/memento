/** Jest/Bun stand-in: StyleX must be compiled by Babel; tests need stable props. */

function create(styles) {
  const out = {};
  for (const [name, value] of Object.entries(styles)) {
    if (typeof value === "function") {
      out[name] = (...args) => ({
        __stylexName: name,
        ...value(...args),
      });
    } else {
      out[name] = { __stylexName: name, ...value };
    }
  }
  return out;
}

function collectNames(arg, parts) {
  if (!arg) return;
  if (Array.isArray(arg)) {
    for (const item of arg) collectNames(item, parts);
    return;
  }
  if (typeof arg === "object") {
    if (typeof arg.__stylexName === "string") {
      parts.push(arg.__stylexName);
      return;
    }
    parts.push(...Object.keys(arg).filter(k => k !== "__stylexName"));
  }
}

function props(...styleArgs) {
  const parts = [];
  for (const arg of styleArgs) {
    collectNames(arg, parts);
  }
  return { className: parts.filter(Boolean).join(" ") || "x-mock" };
}

function defineVars(vars) {
  return vars;
}

function defineConsts(consts) {
  return consts;
}

function createTheme() {
  return {};
}

function keyframes(frames) {
  return frames;
}

function firstThatWorks(...values) {
  return values[0];
}

const stylex = {
  create,
  props,
  defineVars,
  defineConsts,
  createTheme,
  keyframes,
  firstThatWorks,
  defaultMarker: () => ({ className: "x-default-marker" }),
  when: {
    ancestor: () => ":hover",
    descendant: () => ":hover",
    anySibling: () => ":hover",
    siblingBefore: () => ":hover",
    siblingAfter: () => ":hover",
  },
};

module.exports = {
  __esModule: true,
  default: stylex,
  ...stylex,
};
