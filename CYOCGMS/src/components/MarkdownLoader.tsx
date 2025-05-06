import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import React from 'react';

function convertWikilinks(md: string): string {
  return md
    // Convert image wikilinks: ![[image.png]]
    .replace(/!\[\[([^\]]+?)\]\]/g, (_, filename) => {
      const encoded = encodeURIComponent(filename.trim());
      return `![${filename}](/images/${encoded} "/vault/images/${encoded}")`;
    })
    // Convert normal wikilinks: [[page.md]]
    .replace(/\[\[([^\]]+?)\]\]/g, (_, filename) => {
      const encoded = encodeURIComponent(filename.trim());
      return `[${filename}](/hexes/${encoded} "/vault/${encoded}")`;
    });
}

const MarkdownLoader = ({ fileUrl }: { fileUrl: string }) => {
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch(fileUrl)
      .then((res) => res.text())
      .then((text) => setContent(text))
      .catch((err) => setContent("Failed to load content."));
  }, [fileUrl]);


  return (
    <div className="storybook-content">
      <ReactMarkdown
        components={{
          img({ node, ...props }) {
            const fallbackSrc = props.src?.replace('/images/', '/vault/images/');
            return (
              <img
                {...props}
                onError={(e) => {
                  if (e.currentTarget.src !== window.location.origin + fallbackSrc) {
                    e.currentTarget.src = fallbackSrc;
                  }
                }}
                alt={props.alt}
              />
            );
          },
        }}
      >
        {convertWikilinks(content)}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownLoader;