import ParseMarkdown from "./parser";
import { sanitize } from "dompurify";

type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  content?: string;
  formaters?: { [name: string]: RctMarkdownFormater };
};

export default function ReactMarkdownLite(props: Props) {
  const { children, content, formaters, ...rest } = props;

  return (
    <div
      {...rest}
      dangerouslySetInnerHTML={{
        __html: sanitize(
          ParseMarkdown(content || (children as any), { formaters })
        ),
      }}
    />
  );
}
