import ReactMarkdown from 'react-markdown';
import '../App.css'; // we'll style it here
import remarkGfm from 'remark-gfm';
import comfortably from '../assets/comfortably.md?raw';


const SongBook = () => {
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
<ReactMarkdown remarkPlugins={[remarkGfm]}>
      {comfortably}
    </ReactMarkdown>
</div>
      </div>
    </div>
  );
};

export default SongBook;