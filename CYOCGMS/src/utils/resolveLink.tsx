export default function resolveImageLink(imgPath: string): string {
    // Optional: log here if debugging
    if (!imgPath) return '';
  
    // Ensure relative images from markdown are properly routed
    if (imgPath.startsWith('images/')) {
      return `/images/${imgPath.replace(/^images\//, '')}`;
    }
  
    // If already absolute, return as-is
    if (imgPath.startsWith('/images/')) {
      return imgPath;
    }
  
    // Else, fallback or warn
    return `/images/${imgPath}`;
  }