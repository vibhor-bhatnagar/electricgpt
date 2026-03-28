/**
 * Minimal markdown-to-HTML renderer for blueprint content.
 * Handles: h1-h4, bold, italic, code, blockquote, hr, ul/ol lists, paragraphs.
 */
export function renderMarkdown(md: string): string {
  const lines = md.split("\n");
  const out: string[] = [];
  let inUl = false;
  let inOl = false;

  const closeList = () => {
    if (inUl) { out.push("</ul>"); inUl = false; }
    if (inOl) { out.push("</ol>"); inOl = false; }
  };

  const inline = (text: string): string =>
    text
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/~~([^~]+)~~/g, "<del>$1</del>");

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (/^#{4}\s/.test(line)) {
      closeList();
      out.push(`<h3>${inline(line.replace(/^#{4}\s/, ""))}</h3>`);
    } else if (/^#{3}\s/.test(line)) {
      closeList();
      out.push(`<h3>${inline(line.replace(/^#{3}\s/, ""))}</h3>`);
    } else if (/^#{2}\s/.test(line)) {
      closeList();
      out.push(`<h2>${inline(line.replace(/^#{2}\s/, ""))}</h2>`);
    } else if (/^#{1}\s/.test(line)) {
      closeList();
      const h1Text = line.replace(/^#{1}\s/, "");
      const h1Id = "section-" + h1Text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/, "");
      out.push(`<h1 id="${h1Id}">${inline(h1Text)}</h1>`);
    } else if (/^---+$/.test(line)) {
      closeList();
      out.push("<hr/>");
    } else if (/^>\s/.test(line)) {
      closeList();
      out.push(`<blockquote>${inline(line.replace(/^>\s/, ""))}</blockquote>`);
    } else if (/^\d+\.\s/.test(line)) {
      if (inUl) { out.push("</ul>"); inUl = false; }
      if (!inOl) { out.push("<ol>"); inOl = true; }
      out.push(`<li>${inline(line.replace(/^\d+\.\s/, ""))}</li>`);
    } else if (/^[-*+]\s/.test(line)) {
      if (inOl) { out.push("</ol>"); inOl = false; }
      if (!inUl) { out.push("<ul>"); inUl = true; }
      out.push(`<li>${inline(line.replace(/^[-*+]\s/, ""))}</li>`);
    } else if (line === "") {
      closeList();
    } else {
      closeList();
      out.push(`<p>${inline(line)}</p>`);
    }
  }

  closeList();
  return out.join("\n");
}
