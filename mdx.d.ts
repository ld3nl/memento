declare module "*.mdx" {
  import type { FC } from "react";

  export const frontmatter: unknown;
  const MDXComponent: FC;
  export default MDXComponent;
}
