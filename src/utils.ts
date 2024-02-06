import { ElType } from "./enum";

export function replace(matchList: any, replacement: any, type: ElType) {
  var i;

  for (i in matchList) {
    if (!matchList.hasOwnProperty(i)) {
      continue;
    }

    // Replace $n with the matching regexp group.
    replacement = replacement.split("$" + i).join(matchList[i]);

    // Replace $Ln with the matching regexp group's string length.
    replacement = replacement.split("$L" + i).join(matchList[i].length);
  }

  if (type === ElType.BLOCK) {
    replacement = replacement.trim(); // + "\n";
  }

  return replacement;
}

export function clean(string: string) {
  var cleaningRuleArray = [
    {
      match: /<\/([uo]l)><\/([uo]l)>\s*<\1><\2>/g,
      replacement: "",
    },
    {
      match: /<\/([uo]l)>\s*<\1>/g,
      replacement: "",
    },
    {
      match: /(<\/\w+>)<\/(blockquote)>\s*<\2>/g,
      replacement: "$1",
    },
  ];

  cleaningRuleArray.forEach(function (rule) {
    string = string.replace(rule.match, rule.replacement);
  });

  return string;
}

export function slugify(str: string) {
  return str
    .normalize("NFKD") // split accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, "") // remove all the accents, which happen to be all in the \u03xx UNICODE block.
    .trim() // trim leading or trailing whitespace
    .toLowerCase() // convert to lowercase
    .replace(/[^a-z0-9 -]/g, "") // remove non-alphanumeric characters
    .replace(/\s+/g, "-") // replace spaces with hyphens
    .replace(/-+/g, "-"); // remove consecutive hyphens
}
