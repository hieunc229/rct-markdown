type RctMarkdownFormater = {
  pattern?: RegExp;
  replace: any;
  type: ElType;
};

type ParseMarkdownOptions = {
  formaters?: { [name: string]: RctMarkdownFormater };
};
