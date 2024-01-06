import { parseMap } from "./map";
import { clean, replace } from "./utils";

/**
 * Parses a provided Markdown string into valid HTML.
 *
 * @param  {string} string Markdown input for transformation
 * @return {string}        Transformed HTML output
 */
function ParseMarkdown(string: string, options?: ParseMarkdownOptions) {
  // Pad with newlines for compatibility.
  let output = "\n" + string + "\n";

  Object.entries(Object.assign({}, parseMap, options?.formaters)).forEach(
    function ([, p], i) {
      // if (i === 10) {
      //   console.log(output)
      // }
      // Replace all matches of provided RegExp pattern with either the
      // replacement string or callback function.
      output = p.pattern
        ? output.replace(p.pattern, function () {

            if (typeof arguments[2] === "string") {
              arguments[2] = arguments[2].trim();
            }

            // console.log(p.pattern, i)
            if (i === 6) {
              // trim code
              arguments[1] = arguments[1].trim().replace(/\n/g, "<br/>");
            }

            // @ts-ignore
            return replace.call(this, arguments, p.replace, p.type);
          })
        : p.replace(output);
    }
  );

  // Perform any post-processing required.
  output = clean(output);
  // Trim for any spaces or newlines.
  output = output.trim();
  // Tidy up newlines to condense where more than 1 occurs back to back.
  output = output.replace(/[\n]{1,}/g, "\n");
  return output;
}

export default ParseMarkdown;
