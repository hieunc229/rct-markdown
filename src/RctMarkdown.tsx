import ParseMarkdown from "./parser";
import { sanitize as clean } from "dompurify";
import "./styles.css";

type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  content?: string;
  sanitize?: boolean;
};

export default function RctMarkdown(props: Props) {
  const { children, content, className, sanitize = true, ...rest } = props;
  const html = ParseMarkdown(content || (children as any));

  return (
    <div
      {...rest}
      className={`${className||""} rct-markdown`}
      dangerouslySetInnerHTML={{
        __html: sanitize ? clean(html) : html,
      }}
    />
  );
}
