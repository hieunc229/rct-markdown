import { ElType } from "./enum";

const { BLOCK, INLINE } = ElType;

function olReplacer(input: string): string {
  return input.replace(
    /^(\s*)([\da-z]+\.)\s+(.*)/gm,
    function (_, indent, marker, text) {
      const innerContent = olReplacer(text);
      const _marker = marker.substring(0, marker.length - 1);
      return `${indent.replaceAll("  ", "<ol>")}<ol${
        "1aAiI".includes(_marker) ? ` type="${_marker}"` : ""
      }><li>${innerContent}</li></ol>${indent.replaceAll("  ", "</ol>")}`;
      // return `${indent.replaceAll("  ", "<ol>")}<ol><li>${innerContent}</li></ol>${indent.replaceAll("  ", "</ol>")}`;
    }
  );
}

function ulReplacer(input: string): string {
  return input.replace(/^(\s*)(?:-|\*)\s(.*)/gm, function (_, indent, text) {
    const innerContent = ulReplacer(text);
    return `${indent.replaceAll(
      "  ",
      "<ul>"
    )}<ul><li>${innerContent}</li></ul>${indent.replaceAll("  ", "</ul>")}`;
  });
}

const ol = {
  // <ol>
  //
  // pattern: /\n[0-9]+\.\s*(.*)/g,
  type: BLOCK,
  replace: olReplacer,
};

const ul = {
  // <ul>
  //
  // pattern: /\n\s?(?:-|\*)\s(.*)/g,
  replace: ulReplacer,
  // replace: "<ul><li>$1</li></ul>",
  type: BLOCK,
};

const heading = {
  // <h1>
  // A line starting with 1-6 hashes.
  pattern: /\n(#{1,6})([^\n]+)/g,
  replace: "<h$L1>$2</h$L1>",
  type: BLOCK,
};

const blockquote = {
  // <blockquote>
  // A greater-than character preceding any characters.
  pattern: /\n(?:&gt;|\>)\W*(.*)/g,
  replace: "<blockquote><p>$1</p></blockquote>",
  type: BLOCK,
};

const bold = {
  // <strong>
  // Either two asterisks or two underscores, followed by any
  // characters, followed by the same two starting characters.
  pattern: /(\*\*|__)(.*?)\1/g,
  replace: "<strong>$2</strong>",
  type: INLINE,
};

const italic = {
  // <em>
  // Either one asterisk or one underscore, followed by any
  // characters, followed by the starting character.
  pattern: /\*(.*)\*/g,
  replace: "<em>$1</em>",
  type: INLINE,
};

const underscore = {
  // <em>
  // Either one asterisk or one underscore, followed by any
  // characters, followed by the starting character. /(\*|_)(.*?)\1/g,
  pattern: /_(.*)_/g,
  replace: "<u>$1</u>",
  type: INLINE,
};

const strike = {
  // <em>
  // Either one asterisk or one underscore, followed by any
  // characters, followed by the starting character. /(\*|_)(.*?)\1/g,
  pattern: /~(.*)~/g,
  replace: "<s>$1</s>",
  type: INLINE,
};

const sub = {
  // <em>
  // Either one asterisk or one underscore, followed by any
  // characters, followed by the starting character. /(\*|_)(.*?)\1/g,
  pattern: /\^(.*)\^/g,
  replace: "<sup>$1</sup>",
  type: INLINE,
};

const a = {
  // <a>
  // Not starting with an exclamation mark, square brackets
  // surrounding any characters, followed by parenthesis surrounding
  // any characters.
  pattern: /([^!])\[([^\[]+)\]\(([^\)]+)\)/g,
  replace: '$1<a href="$3">$2</a>',
  type: INLINE,
};

const img = {
  // <img>
  // Starting with an exclamation mark, then followed by square
  // brackets surrounding any characters, followed by parenthesis
  // surrounding any characters.
  pattern: /!\[([^\[]+)\]\(([^\)]+)\)/g,
  replace: '<img src="$2" alt="$1" />',
  type: INLINE,
};

const code = {
  // <pre>
  //
  pattern: /```((.|\n)*?)```/g,
  replace: "<pre>$1</pre>",
  type: INLINE,
};

const codeInline = {
  // <code>
  //
  pattern: /`(.*?)`/g,
  replace: "<code>$1</code>",
  type: INLINE,
};

const linebreak = {
  // <hr>
  //
  pattern: /\n-{3,}\n/g,
  replace: "<hr />",
  type: BLOCK,
};

const table = {
  // table
  // pattern: /^\|(.+)\|$/gm,
  type: BLOCK,
  replace: function (input: string) {
    const tableRegex = /^\|(.+)\|$/gm;
    const tables = [];
    let currentTable = [];
    const rows = input.split("\n");

    for (let row of rows) {
      if (row.match(tableRegex)) {
        currentTable.push(row);
      } else if (currentTable.length > 0) {
        tables.push(currentTable.join("\n"));
        currentTable = [];
      }
    }

    if (currentTable.length > 0) {
      tables.push(currentTable.join("\n"));
    }

    tables
      .map((table) => {
        const rows = table.match(tableRegex);
        return rows?.map((line) => ({
          line,
          cels: line
            .split("|")
            .slice(1, -1)
            .map((cell) => cell.trim()),
        }));
      })
      .forEach(([header, seperator, ...rows]: any) => {
        input = input.replace(
          header.line,
          `<table><thead><tr>${header.cels
            .map((name: string) => `<th>${name}<th>`)
            .join("")}</tr></thead><tbody>`
        );
        input = input.replace(seperator.line, "");

        rows.forEach((r: { line: string; cels: string[] }, i: number) => {
          input = input.replace(
            r.line,
            `<tr>${r.cels
              .map((name: string) => `<td>${name}<td>`)
              .join("")}</tr>${i === rows.length - 1 ? "</tbody></table>" : ""}`
          );
        });
      });

    return input;
  },
};

const p = {
  // <p>
  // Any line surrounded by newlines that doesn't start with
  // an HTML tag, asterisk or numeric value with dot following.
  pattern: /\n(?!\s*<|-{3,})([^\n]+)/g,
  // pattern: /\n(?!<\/?\w+>|\s?\*|\s?[0-9]+|>|\&gt;|-{3,})([^\n]+)/g,
  replace: "<p>$1</p>",
  type: BLOCK,
};

/**
 * An array of parse rule descriptor objects. Each object has two keys;
 * pattern (the RegExp to match), and replace (the replacement string or
 * function to execute).
 * @type {Array}
 */
export const parseMap: {
  [name: string]: RctMarkdownFormater;
} = {
  code,
  ol,
  ul,
  a,
  heading,
  blockquote,
  img,
  codeInline,
  linebreak,
  table,
  p,
  sub,
  bold,
  underscore,
  italic,
  strike,
};
