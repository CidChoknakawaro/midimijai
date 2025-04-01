import React, { useState, useEffect, useRef } from 'react';

interface DropdownProps {
  label: string;
  options: string[];
}

const Dropdown: React.FC<DropdownProps> = ({ label, options }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button onClick={() => setOpen((prev) => !prev)}>{label}</button>
      {open && (
        <div
          style={{
            position: 'absolute',
            background: 'white',
            border: '1px solid #ccc',
            marginTop: '0.5rem',
            zIndex: 10,
            whiteSpace: 'nowrap',
          }}
        >
          {options.map((opt, i) => (
            <div
              key={i}
              style={{
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                userSelect: 'none',
              }}
              onClick={() => {
                console.log(`Selected: ${opt}`);
                setOpen(false);
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;