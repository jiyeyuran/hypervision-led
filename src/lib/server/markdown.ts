import { marked } from 'marked';

marked.setOptions({
  gfm: true,
  breaks: false,
});

/**
 * 把 Markdown（或已是 HTML）渲染为 HTML 字符串。
 * 因为 marked 对顶层 HTML 块是透传的，旧的 HTML seed 内容仍能正常工作。
 */
export function renderMarkdown(source: string | null | undefined): string {
  if (!source) return '';
  return marked.parse(source, { async: false }) as string;
}
