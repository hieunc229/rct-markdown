import ParseMarkdown from "./parser";
import { sanitize as clean } from "dompurify";

type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  content?: string;
  formaters?: { [name: string]: RctMarkdownFormater };
  sanitize?: boolean;
};

export default function RctMarkdown(props: Props) {
  const { children, content, sanitize = true, formaters, ...rest } = props;
  const html = ParseMarkdown(content || (children as any), { formaters });
  
  return (
    <div
      {...rest}
      dangerouslySetInnerHTML={{
        __html: sanitize ? clean(html) : html,
      }}
    />
  );
}
