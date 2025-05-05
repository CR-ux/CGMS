import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

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
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default MarkdownLoader;