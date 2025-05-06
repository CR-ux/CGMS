import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import '../App.css';

type BranchOption = {
  label: string;
  next: string;
};

const SongBook = () => {
  console.log("Rendering SongBook component");
  const [markdown, setMarkdown] = useState("");
  const [currentPath, setCurrentPath] = useState("centre.md");
  const [options, setOptions] = useState<BranchOption[]>([
    { label: "Queen", next: "Queen.md" },
    { label: "Pawn", next: "hex-1-B.md" },
    { label: "Knight", next: "hex-1-C.md" },
    { label: "Bishop", next: "hex-1-D.md" },
    { label: "Rook", next: "hex-1-E.md" },
    { label: "King", next: "hex-1-F.md" },
  ]);

  const fetchMarkdown = async (path: string) => {
    try {
      console.log("Fetching markdown for path:", path);
      const res = await fetch(`https://raw.githubusercontent.com/CR-ux/CGMS/main/cgms_engine/The%20Woman%20In%20The%20Wallpaper/${encodeURIComponent(path)}`);
      const text = await res.text();
      // setMarkdown(text); // replaced by strippedText
      const strippedText = text
        .split('## Links')[0]
        .split('## Exits')[0]
        .trim();
      setMarkdown(strippedText);
      if (path === "centre.md") {
        setOptions([
          { label: "Queen", next: "hex-1-A.md" },
          { label: "Pawn", next: "hex-1-B.md" },
          { label: "Knight", next: "hex-1-C.md" },
          { label: "Bishop", next: "hex-1-D.md" },
          { label: "Rook", next: "hex-1-E.md" },
          { label: "King", next: "hex-1-F.md" },
        ]);
      } else {
        setOptions(parseExits(text));
      }
    } catch (err) {
      setMarkdown("Error loading document.");
      setOptions([]);
    }
  };

  const parseExits = (text: string): BranchOption[] => {
    const lines = text.split('\n');
    const exitStart = lines.findIndex(line => line.trim().toLowerCase().includes('## exits'));
    if (exitStart === -1) return [];

    const exits = lines.slice(exitStart + 1).filter(line => line.startsWith('- '));
    return exits.map(line => {
      const match = line.match(/\[\[(.*?)\]\]\s*\|\s*(.+)/);
      if (match) {
        return { next: `${match[1]}.md`, label: match[2].trim() };
      }
      return { next: '', label: 'Unknown' };
    }).filter(opt => opt.next);
  };

  useEffect(() => {
    console.log("useEffect triggered, currentPath:", currentPath);
    fetchMarkdown(currentPath);
  }, [currentPath]);

  // Renders embedded .md files from THE VAULT repo (transclusion)
  const EmbeddedMarkdown: React.FC<{ fileName: string }> = ({ fileName }) => {
    const [embeddedContent, setEmbeddedContent] = useState('');
    useEffect(() => {
      fetch(`https://raw.githubusercontent.com/CR-ux/THE-VAULT/refs/heads/main/${fileName}.md`)
        .then(res => res.text())
        .then(text => setEmbeddedContent(text))
        .catch(() => setEmbeddedContent('Error loading transcluded content.'));
    }, [fileName]);

    return (
      <div style={{
        border: '1px solid #ccc',
        padding: '1rem',
        margin: '1rem 0',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
      }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {embeddedContent}
        </ReactMarkdown>
      </div>
    );
  };

  const transcludedBlocks: string[] = [];
  const strippedMarkdown = markdown.replace(/\!\[\[(.*?)\]\]/g, (_, match) => {
    transcludedBlocks.push(match.trim().replace(/\.(md|png|jpg|jpeg)$/, ''));
    return ''; // remove from markdown body
  });

  return (
    <div className="storybook-page">
      <div className="storybook-frame">
        <img
          src="/images/openart-image_cyzBTo5Z_1739795105459_raw.jpg"
          alt="alt text"
          style={{
            maxWidth: '80%',
            height: 'auto',
            display: 'block',
            margin: '2rem auto',
            borderRadius: '12px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          }}
        />
        <div className="storybook-content">
          <>
            {transcludedBlocks.map((fileName, index) => (
              <div key={index} style={{ padding: '1rem', border: '1px dashed #888', margin: '1rem 0' }}>
                <EmbeddedMarkdown fileName={`notBorges/${fileName}`} />
              </div>
            ))}
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ href, children }) => {
                  const isInternal = href?.endsWith('.md');
                  return (
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (isInternal && href) setCurrentPath(href);
                      }}
                    >
                      {children}
                    </a>
                  );
                },
                ul: (props) => React.createElement('ul', { className: 'exit-doors' }, props.children),
                li: (props) => React.createElement('li', { className: 'door' }, props.children),
                img: ({ src, alt }) => {
                  return (
                    <img
                      src={src?.startsWith('/') ? src : `/${src}`}
                      alt={alt || ''}
                      style={{
                        maxWidth: '80%',
                        height: 'auto',
                        display: 'block',
                        margin: '2rem auto',
                        borderRadius: '12px',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                      }}
                    />
                  );
                },
                // Handles inline Obsidian-style embeds like ![[Some Note]] in markdown body
                text: ({ children }) => {
                  if (typeof children[0] === 'string') {
                    const text = children[0];
                    const matches = [...text.matchAll(/\!\[\[(.*?)\]\]/g)];
                    if (matches.length > 0) {
                      return (
                        <>
                          {matches.map((match, index) => {
                            const fileName = match[1]
                              .trim()
                              .replace(/\.(md|png|jpg|jpeg)$/, '')
                              .replace(/ /g, '%20');
                            const rawUrl = `https://raw.githubusercontent.com/CR-ux/CGMS/main/cgms_engine/The%20Woman%20In%20The%20Wallpaper/${fileName}.md`;
                            return (
                              <div key={index} style={{ padding: '1rem', border: '1px dashed #888', margin: '1rem 0' }}>
                                <EmbeddedMarkdown fileName={decodeURIComponent(fileName)} />
                                
                              </div>
                            );
                          })}
                        </>
                      );
                    }
                  }
                  return <>{children}</>;
                }
              }}
            >
              {strippedMarkdown}
            </ReactMarkdown>
          </>
          <div className="button-group" style={{ textAlign: 'center', marginBottom: '1rem' }}>
            {options.map((option) => (
              <button key={option.next} onClick={() => setCurrentPath(option.next)} style={{ margin: '0 0.5rem' }}>
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongBook;