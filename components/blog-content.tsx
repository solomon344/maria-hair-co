"use client";

import React from "react";

interface BlogContentProps {
  content: string;
}

export function BlogContent({ content }: BlogContentProps) {
  const lines = content.trim().split("\n");
  const elements: React.ReactElement[] = [];
  let key = 0;
  let inList = false;
  let listItems: string[] = [];
  let listOrdered = false;

  const flushList = () => {
    if (listItems.length > 0) {
      const Tag = listOrdered ? "ol" : "ul";
      elements.push(
        React.createElement(
          Tag,
          { key: key++, className: "space-y-2 my-4 ml-6" },
          ...listItems.map((item, i) =>
            React.createElement("li", { key: i, className: "text-[#3a2a1a] font-body leading-relaxed pl-2" }, item)
          )
        )
      );
      listItems = [];
      inList = false;
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    // Headings
    if (trimmed.startsWith("## ")) {
      flushList();
      elements.push(
        React.createElement(
          "h2",
          { key: key++, className: "font-header font-bold text-[#1a120b] text-2xl mt-10 mb-4" },
          trimmed.replace("## ", "")
        )
      );
      continue;
    }

    // Unordered list
    if (trimmed.startsWith("- **") || trimmed.startsWith("- ")) {
      if (!inList) {
        flushList();
        inList = true;
        listOrdered = false;
      }
      const match = trimmed.match(/^- \*\*(.+?)\*\*(?::\s)?(.+)?$/);
      if (match) {
        const bold = match[1];
        const rest = match[2];
        listItems.push(rest ? `${bold}: ${rest}` : bold);
      } else {
        listItems.push(trimmed.replace(/^- /, ""));
      }
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(trimmed)) {
      if (!inList) {
        flushList();
        inList = true;
        listOrdered = true;
      }
      listItems.push(trimmed.replace(/^\d+\.\s/, ""));
      continue;
    }

    // Empty line
    if (trimmed === "") {
      flushList();
      continue;
    }

    // Plain paragraph
    flushList();
    elements.push(
      React.createElement(
        "p",
        { key: key++, className: "text-[#3a2a1a] font-body leading-relaxed mb-4" },
        trimmed
      )
    );
  }

  flushList();

  return React.createElement("div", { className: "max-w-none" }, ...elements);
}