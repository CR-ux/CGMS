import React from 'react';

type BranchOption = {
  label: string;
  next: string;
};

type BranchNavigationProps = {
  options: BranchOption[];
  onNavigate: (path: string) => void;
};

const BranchNavigation: React.FC<BranchNavigationProps> = ({ options, onNavigate }) => {
  return (
    <div className="button-group" style={{ textAlign: 'center', marginBottom: '1rem' }}>
      {options.map((option) => (
        <button
          key={option.next}
          onClick={() => onNavigate(option.next)}
          style={{ margin: '0 0.5rem' }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default BranchNavigation;
