import {
  Diff,
  DiffProps,
  Hunk,
  parseDiff,
  tokenize,
  TokenNode,
} from "react-diff-view";
import "react-diff-view/style/index.css";
import { refractor } from "refractor";
import java from "refractor/java";
import javascript from "refractor/javascript";
import jsx from "refractor/jsx";
import python from "refractor/python";
import tsx from "refractor/tsx";
import typescript from "refractor/typescript";
import csharp from "refractor/csharp";
import cpp from "refractor/cpp";
import c from "refractor/c";
import go from "refractor/go";
import css from "refractor/css";
import markdown from "refractor/markdown";
import "prismjs/themes/prism.css";
import json from "refractor/json";

refractor.register(tsx);
refractor.register(jsx);
refractor.register(javascript);
refractor.register(typescript);
refractor.register(python);
refractor.register(java);
refractor.register(csharp);
refractor.register(cpp);
refractor.register(c);
refractor.register(go);
refractor.register(css);
refractor.register(markdown);
refractor.register(json);

export function DiffView({ diff }: { diff: string }) {
  const files = parseDiff(diff);

  function renderFile({
    oldRevision,
    newRevision,
    type,
    hunks,
    newPath,
  }: {
    oldRevision: string;
    newRevision: string;
    type: DiffProps["diffType"];
    hunks: DiffProps["hunks"];
    oldPath: string;
    newPath: string;
  }) {
    const extension = newPath.split(".").pop() || "";

    const langMap: Record<string, string> = {
      ts: "typescript",
      tsx: "tsx",
      js: "javascript",
      jsx: "jsx",
      py: "python",
      java: "java",
      cs: "csharp",
      cpp: "cpp",
      c: "c",
      go: "go",
      css: "css",
      json: "json",
    };

    const language = langMap[extension] || "markdown";

    const refractorWrapper = {
      highlight: (text: string, language: string) =>
        refractor.highlight(text, language).children,
    };

    console.log(
      tokenize(hunks, {
        highlight: true,
        refractor: refractorWrapper,
        language: language,
      }),
    );

    return (
      <div
        key={`${oldRevision}-${newRevision}`}
        className="diff-file-container text-black border border-gray-200 rounded-lg overflow-hidden bg-white mb-6"
      >
        <h3 className="bg-gray-50 border-b border-gray-200 px-4 py-2 font-mono text-sm">
          {newPath}
        </h3>
        <Diff
          key={oldRevision + "-" + newRevision}
          viewType="unified"
          diffType={type}
          hunks={hunks}
          tokens={tokenize(hunks, {
            highlight: true,
            refractor: refractorWrapper,
            language: language,
          })}
          renderToken={(token, defaultRender, i) => {
            // 1. If it's a plain text node, just return its value!
            if (token.type === "text") {
              return token.value;
            }
            // 2. If it's an element, extract the class names!
            // Notice how they were inside `properties.className` in the log?
            const className = token.properties?.className?.join(" ");
            // 3. Return a React <span> that uses that className,
            // and map over its children to render them recursively!
            return (
              <span key={i} className={className}>
                {token.children?.map((child: TokenNode, index: number) =>
                  defaultRender(child, index),
                )}
              </span>
            );
          }}
        >
          {(hunks) =>
            hunks.map((hunk) => <Hunk key={hunk.content} hunk={hunk} />)
          }
        </Diff>
      </div>
    );
  }
  return <div className="flex flex-col gap-5">{files.map(renderFile)}</div>;
}
