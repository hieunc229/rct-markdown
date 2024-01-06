
type ParseMarkdownOptions = {
  formater?: {
    [name: string]: {
      pattern: RegExp;
      replace: string;
      type: ElType;
    };
  };
};