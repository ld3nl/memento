import { readdir, readFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "@babel/parser";
import postcss from "postcss";
import policy from "./policy.json";

export type Diagnostic = {
  file: string;
  line: number;
  column: number;
  rule: string;
  value: string;
  message: string;
};

type AstNode = {
  type: string;
  start?: number | null;
  loc?: { start: { line: number; column: number } } | null;
  [key: string]: unknown;
};

export type Theme = Map<string, string>;

// Delimit only at top level: arbitrary variants and calc() contain colons/spaces.
export function splitTopLevel(input: string, delimiter: "space" | ":" | "/") {
  const parts: string[] = [];
  let part = "";
  let depth = 0;
  let escaped = false;
  let quote = "";
  for (const character of input) {
    if (escaped) {
      part += character;
      escaped = false;
      continue;
    }
    if (character === "\\") {
      part += character;
      escaped = true;
      continue;
    }
    if (quote) {
      part += character;
      if (character === quote) quote = "";
      continue;
    }
    if (character === '"' || character === "'") quote = character;
    if (character === "[" || character === "(") depth++;
    if (character === "]" || character === ")") depth--;
    if (
      depth === 0 &&
      !quote &&
      (delimiter === "space" ? /\s/.test(character) : character === delimiter)
    ) {
      if (part) parts.push(part);
      part = "";
    } else {
      part += character;
    }
  }
  if (part) parts.push(part);
  return parts;
}

function known(
  theme: Theme,
  namespace: string,
  value: string,
  defaults: string[]
) {
  return defaults.includes(value) || theme.has(`--${namespace}-${value}`);
}

function color(theme: Theme, value: string) {
  return known(theme, "color", value, policy.colors);
}

function utilityProblem(
  utility: string,
  theme: Theme
): [string, string] | null {
  const base = utility.replace(/^!/, "").replace(/!$/, "").replace(/^-/, "");
  const [name] = splitTopLevel(base, "/");
  const value = name ?? "";
  const spacing = value.match(
    /^(p[xytrblse]?|m[xytrblse]?|gap(?:-[xy])?|space-[xy]|scroll-[pm][xytrblse]?)-(.+)$/
  );
  if (spacing) {
    const allowed = [
      ...policy.spacing,
      "px",
      ...(spacing[1].startsWith("m") ? ["auto"] : []),
    ];
    if (!known(theme, "spacing", spacing[2], allowed))
      return [
        "spacing",
        "Choose an approved spacing step or --spacing-* token.",
      ];
  }
  const text = value.match(/^text-(.+)$/);
  if (
    text &&
    ![
      "left",
      "center",
      "right",
      "justify",
      "start",
      "end",
      "ellipsis",
      "clip",
      "wrap",
      "nowrap",
      "balance",
      "pretty",
    ].includes(text[1])
  ) {
    if (!known(theme, "text", text[1], policy.text) && !color(theme, text[1]))
      return [
        "typography-or-color",
        "Choose a --text-* size or approved --color-* token.",
      ];
  }
  for (const [prefix, namespace, defaults] of [
    ["leading", "leading", policy.leading],
    ["tracking", "tracking", policy.tracking],
    ["shadow", "shadow", policy.shadow],
  ] as const) {
    if (
      value.startsWith(`${prefix}-`) &&
      !known(theme, namespace, value.slice(prefix.length + 1), [...defaults])
    )
      return [prefix, `Choose an approved --${namespace}-* token.`];
  }
  const radius = value.match(
    /^rounded(?:-(?:[trblse]|[tb][lr]|[se][se]|[se][trbl]))?(?:-(.+))?$/
  );
  if (radius?.[1] && !known(theme, "radius", radius[1], policy.radius))
    return ["radius", "Choose an approved --radius-* token."];
  const font = value.match(/^font-(.+)$/);
  if (
    font &&
    !known(theme, "font", font[1], ["sans", "serif", "mono"]) &&
    !known(theme, "font-weight", font[1], [
      "thin",
      "extralight",
      "light",
      "normal",
      "medium",
      "semibold",
      "bold",
      "extrabold",
      "black",
    ])
  )
    return ["font", "Choose an approved font family or weight token."];
  if (/^(?:border-[xytrblse]|divide-[xy])$/.test(value)) return null;
  if (
    /^(?:outline-offset|ring-offset)-\d+$/.test(value) &&
    policy.spacing.includes(value.split("-").at(-1) ?? "")
  )
    return null;
  const border = value.match(
    /^(border(?:-[xytrblse])?|divide-[xy]|outline|ring|ring-offset|outline-offset)-(.*)$/
  );
  if (
    border &&
    ![
      ...policy.borderWidth,
      "solid",
      "dashed",
      "dotted",
      "double",
      "hidden",
      "none",
      "auto",
      "inset",
    ].includes(border[2]) &&
    !color(theme, border[2])
  )
    return ["border", "Choose an approved border width or color token."];
  const paint = value.match(
    /^(bg|from|via|to|divide|decoration|fill|stroke|caret|accent)-(.+)$/
  );
  if (paint) {
    const suffix = paint[2];
    if (
      /^(?:linear-|radial|conic|clip-|origin-|repeat|no-repeat|cover|contain|fixed|local|scroll|none|auto|center|top|bottom|left|right|blend-)/.test(
        suffix
      )
    )
      return null;
    if (
      paint[1] === "decoration" &&
      [
        "solid",
        "double",
        "dotted",
        "dashed",
        "wavy",
        "auto",
        "from-font",
        "0",
        "1",
        "2",
        "4",
        "8",
      ].includes(suffix)
    )
      return null;
    if (
      (paint[1] === "stroke" && ["0", "1", "2"].includes(suffix)) ||
      /^(?:\d+%|\[url\()/.test(suffix)
    )
      return null;
    if (!color(theme, suffix))
      return [
        "color",
        "Use an approved --color-* token; default palette additions require an explicit design decision.",
      ];
  }
  const arbitrary = value.match(/^\[([^:]+):/);
  if (
    arbitrary &&
    /^(?:padding|margin|gap|font|line-height|letter-spacing|border|border-radius|color|background|box-shadow)/.test(
      arbitrary[1]
    )
  )
    return [
      "arbitrary-property",
      "Use a named design utility rather than bypassing the token policy.",
    ];
  return null;
}

export function checkClasses(input: string, theme: Theme) {
  const problems: { rule: string; value: string; message: string }[] = [];
  for (const token of splitTopLevel(input, "space")) {
    const chain = splitTopLevel(token, ":");
    const utility = chain.pop();
    for (const variant of chain) {
      if (
        /^(?:min|max)-\[/.test(variant) ||
        /^@(?:min-|max-)?\[/.test(variant) ||
        (variant.startsWith("[") && /@(?:media|container)/.test(variant))
      )
        problems.push({
          rule: "breakpoint",
          value: token,
          message: "Use an approved named breakpoint or container variant.",
        });
    }
    if (utility) {
      const problem = utilityProblem(utility, theme);
      if (problem)
        problems.push({ rule: problem[0], value: token, message: problem[1] });
      const slash = splitTopLevel(utility, "/");
      if (
        utility.startsWith("text-") &&
        slash[1] &&
        !color(theme, slash[0].slice(5)) &&
        !known(theme, "leading", slash[1], policy.leading)
      )
        problems.push({
          rule: "leading",
          value: token,
          message:
            "Use approved line-height steps or leading tokens after a text-size slash.",
        });
    }
  }
  return problems;
}

function isNode(value: unknown): value is AstNode {
  return (
    !!value &&
    typeof value === "object" &&
    "type" in value &&
    typeof value.type === "string"
  );
}

function walk(node: AstNode, visit: (node: AstNode) => void) {
  visit(node);
  for (const [key, value] of Object.entries(node)) {
    if (["loc", "comments", "tokens", "errors"].includes(key)) continue;
    if (Array.isArray(value)) {
      for (const item of value) if (isNode(item)) walk(item, visit);
    } else if (isNode(value)) walk(value, visit);
  }
}

const classCandidate =
  /(?:^|\s|:)(?:!?-?(?:p[xytrblse]?|m[xytrblse]?|gap|space|text|leading|tracking|rounded|border|divide|bg|from|via|to|ring|outline|shadow|font|fill|stroke|caret|accent|decoration)-|\[(?:padding|margin|font|gap|border|color|background|line-height):)/;

export function checkSource(
  file: string,
  source: string,
  theme: Theme
): Diagnostic[] {
  const ast = parse(source, {
    sourceType: "unambiguous",
    plugins: ["typescript", "jsx"],
  });
  const results: Diagnostic[] = [];
  const report = (
    node: AstNode,
    rule: string,
    value: string,
    message: string
  ) => {
    results.push({
      file,
      line: node.loc?.start.line ?? 1,
      column: (node.loc?.start.column ?? 0) + 1,
      rule,
      value,
      message,
    });
  };
  walk(ast as unknown as AstNode, node => {
    // Covers JSX strings, cn() strings, returned classes, map keys and constants.
    if (
      node.type === "StringLiteral" &&
      !(
        file === "lib/html/parse.tsx" &&
        [
          "text-align-left",
          "text-align-center",
          "text-align-right",
          "text-align-justify",
          "text-tiny",
          "text-small",
          "text-big",
          "text-huge",
        ].includes(String(node.value))
      ) &&
      typeof node.value === "string" &&
      classCandidate.test(node.value)
    ) {
      for (const problem of checkClasses(node.value, theme))
        report(node, problem.rule, problem.value, problem.message);
    }
    if (node.type === "TemplateLiteral" && Array.isArray(node.quasis)) {
      const chunks = node.quasis.filter(isNode).map(quasi => {
        const value = quasi.value;
        return value && typeof value === "object" && "raw" in value
          ? String(value.raw)
          : "";
      });
      if (
        Array.isArray(node.expressions) &&
        node.expressions.length &&
        chunks.some(
          chunk => classCandidate.test(chunk) && /(?:-|:|\[)$/.test(chunk)
        )
      ) {
        report(
          node,
          "dynamic-class",
          source.slice(node.start ?? 0, Number(node.end)),
          "Use complete class strings in a static map; interpolated utilities bypass token validation and Tailwind detection."
        );
      } else
        for (const chunk of chunks)
          for (const problem of checkClasses(chunk, theme))
            report(node, problem.rule, problem.value, problem.message);
    }
    if (
      node.type === "JSXAttribute" &&
      isNode(node.name) &&
      node.name.name === "style" &&
      isNode(node.value)
    ) {
      walk(node.value, child => {
        if (child.type !== "ObjectProperty" || !isNode(child.key)) return;
        const key = String(child.key.name ?? child.key.value ?? "");
        if (
          /^(?:padding|margin|gap|rowGap|columnGap|fontSize|fontFamily|fontWeight|lineHeight|letterSpacing|border|color|backgroundColor|boxShadow)/.test(
            key
          )
        ) {
          const value = isNode(child.value) ? child.value.value : undefined;
          if (
            value !== 0 &&
            !(
              typeof value === "string" &&
              /^(?:var\(--|inherit$|currentColor$|transparent$)/.test(value)
            )
          )
            report(
              child,
              "inline-design",
              key,
              "Use design utilities or a CSS token for this inline style."
            );
        }
      });
    }
  });
  return results;
}

const designProperty =
  /^(?:padding(?:-.+)?|margin(?:-.+)?|(?:row-|column-)?gap|font(?:-(?:size|family|weight))?|text-underline-offset|text-decoration-thickness|line-height|letter-spacing|border(?:-.+)?|outline(?:-.+)?|color|background(?:-color)?|box-shadow)$/;

export function readTheme(css: string): Theme {
  const theme: Theme = new Map();
  postcss.parse(css).walkDecls(declaration => {
    if (declaration.prop.startsWith("--"))
      theme.set(declaration.prop, declaration.value);
  });
  return theme;
}

export function checkCss(
  file: string,
  css: string,
  theme: Theme
): Diagnostic[] {
  const root = postcss.parse(css, { from: file });
  const results: Diagnostic[] = [];
  root.walkDecls(declaration => {
    if (!designProperty.test(declaration.prop)) return;
    const value = declaration.value;
    const variables = [...value.matchAll(/var\((--[\w-]+)/g)].map(
      match => match[1]
    );
    const validVariables =
      variables.length > 0 && variables.every(variable => theme.has(variable));
    const remaining = value.replace(/var\(--[\w-]+\)/g, "");
    if (
      (validVariables && !/[\d#]/.test(remaining)) ||
      /^(?:0|auto|none|inherit|initial|unset|revert|currentColor|transparent|solid|dashed|dotted)$/.test(
        value
      )
    )
      return;
    results.push({
      file,
      line: declaration.source?.start?.line ?? 1,
      column: declaration.source?.start?.column ?? 1,
      rule: "css-design",
      value: `${declaration.prop}: ${value}`,
      message:
        "Use defined design tokens for CSS design properties, including media/container rules.",
    });
  });
  root.walkAtRules(rule => {
    if (!["media", "container"].includes(rule.name)) return;
    const allowed =
      rule.name === "media"
        ? Object.entries(policy.breakpoints).map(
            ([name, value]) => theme.get(`--breakpoint-${name}`) ?? value
          )
        : Object.entries(policy.containerBreakpoints).map(
            ([name, value]) => theme.get(`--container-${name}`) ?? value
          );
    const queries = rule.params.matchAll(/([\d.]+(?:px|rem|em))/g);
    for (const query of queries)
      if (!allowed.includes(query[1]))
        results.push({
          file,
          line: rule.source?.start?.line ?? 1,
          column: rule.source?.start?.column ?? 1,
          rule: "css-breakpoint",
          value: rule.params,
          message:
            "Use the named theme breakpoint values and consistent units in CSS queries.",
        });
  });
  return results;
}

export function diagnosticKey(diagnostic: Diagnostic) {
  return `${diagnostic.file}|${diagnostic.rule}|${diagnostic.value}`;
}

async function filesIn(directory: string): Promise<string[]> {
  const files: string[] = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (["emails", "reference"].includes(entry.name)) continue;
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await filesIn(path)));
    else if (/\.(?:tsx?|css)$/.test(entry.name) && !/\.test\./.test(entry.name))
      files.push(path);
  }
  return files;
}

export async function audit(root: string) {
  const theme = readTheme(
    await readFile(resolve(root, "app/globals.css"), "utf8")
  );
  const diagnostics: Diagnostic[] = [];
  for (const directory of ["app", "components", "lib"]) {
    for (const path of await filesIn(resolve(root, directory))) {
      const file = relative(root, path).replaceAll("\\", "/");
      const source = await readFile(path, "utf8");
      diagnostics.push(
        ...(path.endsWith(".css")
          ? checkCss(file, source, theme)
          : checkSource(file, source, theme))
      );
    }
  }
  return diagnostics;
}

if (import.meta.main) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
  const diagnostics = await audit(root);
  if (process.argv.includes("--inventory")) {
    console.log(JSON.stringify(diagnostics, null, 2));
  } else {
    const baseline: {
      exceptions: { key: string; count: number; reason: string }[];
    } = JSON.parse(
      await readFile(resolve(root, "tooling/design/baseline.json"), "utf8")
    );
    const remaining = new Map(
      baseline.exceptions.map(entry => [entry.key, entry.count])
    );
    const unexpected = diagnostics.filter(diagnostic => {
      const key = diagnosticKey(diagnostic);
      const count = remaining.get(key) ?? 0;
      if (count > 0) {
        remaining.set(key, count - 1);
        return false;
      }
      return true;
    });
    for (const diagnostic of unexpected)
      console.error(
        `${diagnostic.file}:${diagnostic.line}:${diagnostic.column} [design/${diagnostic.rule}] ${diagnostic.value}\n  ${diagnostic.message}`
      );
    const stale = [...remaining].filter(([, count]) => count > 0);
    for (const [key, count] of stale)
      console.error(`Remove stale design exception (${count}): ${key}`);
    console.log(
      `Design check: ${diagnostics.length - unexpected.length} bounded legacy exceptions, ${unexpected.length} new violations, ${stale.length} stale exceptions.`
    );
    if (unexpected.length || stale.length) process.exitCode = 1;
  }
}
