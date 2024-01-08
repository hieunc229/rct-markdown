import ParseMarkdown from "./parser";
import { sanitize as clean } from "dompurify";

type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  content?: string;
  sanitize?: boolean;
};

export default function RctMarkdown(props: Props) {
  const { children, content, sanitize = true, ...rest } = props;
  const html = ParseMarkdown(content || (children as any));

  return (
    <div
      {...rest}
      dangerouslySetInnerHTML={{
        __html: sanitize ? clean(html) : html,
      }}
    />
  );
}
