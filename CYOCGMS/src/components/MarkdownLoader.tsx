import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import React from 'react';

const MarkdownLoader = ({ fileUrl }: { fileUrl: string }) => {
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch(fileUrl)
      .then((res) => res.text())
      .then((text) => setContent(text))
      .catch((err) => setContent("Failed to load content."));
  }, [fileUrl]);

  const BASE_URL = import.meta.env.PROD
    ? 'https://yourdomain.com'
    : 'http://localhost:5173';

  return (
    <div className="storybook-content">
      <ReactMarkdown
        components={{
          img({ node, ...props }) {
            return (
              <img
                {...props}
                src={
                  props.src?.startsWith('/images')
                    ? `${BASE_URL}${props.src}`
                    : props.src
                }
                alt={props.alt}
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownLoader;