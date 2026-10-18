import { expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import {
  checkClasses,
  checkCss,
  checkSource,
  readTheme,
  splitTopLevel,
} from "./check";

const theme = readTheme(
  "--spacing-panel: 1.25rem; --color-lake: #163f49; --text-card: 1.75rem; --radius-panel: .5rem; --leading-card: 1.3;"
);

test("variants retain arbitrary selector colons and nested calculations", () => {
  expect(
    splitTopLevel("[&:nth-child(2)]:md:gap-[calc(1rem_+_2px)]", ":")
  ).toEqual(["[&:nth-child(2)]", "md", "gap-[calc(1rem_+_2px)]"]);
  expect(
    checkClasses(
      "md:gap-panel lg:text-card/card rounded-panel border-lake",
      theme
    )
  ).toEqual([]);
});

test("controlled categories fail through responsive and selector variants", () => {
  for (const utility of [
    "p-[13px]",
    "gap-13",
    "text-[17px]",
    "leading-[1.17]",
    "tracking-[.03em]",
    "rounded-[7px]",
    "border-[3px]",
    "border-missing",
    "font-[550]",
  ]) {
    expect(
      checkClasses(`md:hover:[&>a]:${utility}`, theme).length
    ).toBeGreaterThan(0);
  }
  expect(checkClasses("max-[750px]:p-4", theme)[0]?.rule).toBe("breakpoint");
  expect(checkClasses("text-sm/[1.17]", theme)[0]?.rule).toBe("leading");
  expect(checkClasses("border-b outline-offset-4", theme)).toEqual([]);
});

test("static maps and cn arguments are checked, complete class composition is allowed", () => {
  expect(
    checkSource(
      "test.tsx",
      'const styles = { x: "md:p-[13px]" }; const el = <div className={cn("lg:gap-13", styles.x)} />;',
      theme
    )
  ).toHaveLength(2);
  expect(
    checkSource("test.tsx", "const cls = `px-4 ${focusRing}`;", theme)
  ).toEqual([]);
  expect(
    checkSource("test.tsx", "const cls = `text-${size}`;", theme)[0]?.rule
  ).toBe("dynamic-class");
  expect(checkSource("test.tsx", "const id = `page-${id}`;", theme)).toEqual(
    []
  );
  expect(
    checkSource(
      "test.tsx",
      "const el = <div style={{ padding: 13 }} />;",
      theme
    )[0]?.rule
  ).toBe("inline-design");
});

test("CSS declarations are checked in media and container ranges", () => {
  const bad = checkCss(
    "test.css",
    "@media (750px <= width < 900px) { .x { padding: 13px; border-radius: 7px; gap: 2rem; font-size: 17px; border: 3px solid red; } }",
    theme
  );
  expect(bad.filter(x => x.rule === "css-design")).toHaveLength(5);
  expect(bad.filter(x => x.rule === "css-breakpoint")).toHaveLength(2);
  expect(
    checkCss(
      "test.css",
      "@media (width >= 48rem) { .x { gap: var(--spacing-panel); border-color: var(--color-lake); } }",
      theme
    )
  ).toEqual([]);
  expect(
    checkCss("test.css", ".x { padding: var(--spacing-missing); }", theme)
  ).toHaveLength(1);
});

test("Biome actually runs the GritQL plugins on JS and nested CSS", async () => {
  const dir = mkdtempSync(resolve(tmpdir(), "sunchasers-grit-"));
  writeFileSync(
    resolve(dir, "biome.json"),
    JSON.stringify({
      plugins: [
        resolve("tooling/design/classes.grit"),
        resolve("tooling/design/css.grit"),
      ],
      formatter: { enabled: false },
      assist: { enabled: false },
      linter: { rules: { recommended: false } },
    })
  );
  writeFileSync(
    resolve(dir, "bad.tsx"),
    'const bad = <div className="md:p-[13px]" />;'
  );
  writeFileSync(
    resolve(dir, "bad.css"),
    "@media (width > 48rem) { .x { gap: 13px; } }"
  );
  const run = (file: string) =>
    Bun.spawnSync([
      resolve("node_modules/.bin/biome"),
      "check",
      `--config-path=${dir}`,
      resolve(dir, file),
    ]);
  for (const file of ["bad.tsx", "bad.css"]) {
    const result = run(file);
    expect(result.exitCode).toBe(1);
    expect(result.stderr.toString()).toContain("Use ");
    expect(result.stderr.toString()).not.toContain("Failed to compile");
  }
  writeFileSync(
    resolve(dir, "good.tsx"),
    'const good = <div className="md:p-panel rounded-panel border-lake" />;'
  );
  writeFileSync(
    resolve(dir, "good.css"),
    "@media (width > 48rem) { .x { gap: var(--spacing-panel); } }"
  );
  expect(run("good.tsx").exitCode).toBe(0);
  expect(run("good.css").exitCode).toBe(0);
});

test("repository Biome configuration applies plugins only to intended paths", () => {
  const run = (file: string, source: string) => {
    const directory = mkdtempSync(resolve(file.split("/")[0], "biome-probe-"));
    const fixture = resolve(directory, file.split("/").slice(1).join("/"));
    mkdirSync(resolve(fixture, ".."), { recursive: true });
    writeFileSync(fixture, source);
    try {
      const result = Bun.spawnSync([
        resolve("node_modules/.bin/biome"),
        "check",
        "--formatter-enabled=false",
        "--assist-enabled=false",
        fixture,
      ]);
      return result.stdout.toString() + result.stderr.toString();
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  };
  const badJs = `export default function Probe() {
	return <div className="p-[13px]" />;
}
`;
  const badCss = `@media (width > 48rem) {
	.x {
		gap: 13px;
	}
}
`;
  for (const path of ["app/probe/page.tsx", "components/Probe.tsx"])
    expect(run(path, badJs)).toContain("Use Sunchasers design tokens");
  for (const path of [
    "lib/probe.tsx",
    "components/Probe.test.tsx",
    "components/emails/Probe.tsx",
    "components/reference/Probe.tsx",
  ])
    expect(run(path, badJs)).not.toContain("Use Sunchasers design tokens");
  expect(run("app/probe.css", badCss)).toContain("Use a CSS design token");
  expect(run("components/probe.css", badCss)).not.toContain(
    "Use a CSS design token"
  );
  expect(
    run("components/Probe.tsx", badJs.replace("p-[13px]", "p-panel"))
  ).not.toContain("Use Sunchasers design tokens");
});
