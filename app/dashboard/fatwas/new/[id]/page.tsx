'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import mammoth from 'mammoth';
import DOMPurify from 'dompurify';

const NewFatwaPage = () => {
  const { id } = useParams();
  const [content, setContent] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Fetch DOCX and convert to HTML
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const user = sessionStorage.getItem('user');
        const token = user ? JSON.parse(user).token : null;

        const response = await fetch(
          `https://lkp.pathok.com.bd/api/book/book-file/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const arrayBuffer = await response.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        const cleanHtml = DOMPurify.sanitize(result.value);
        setContent(cleanHtml); // Set the sanitized HTML
      } catch (error) {
        console.error('Error loading document:', error);
      }
    };

    if (id) fetchDocument();
  }, [id]);

  // Handle right-click context menu
  const handleContextMenu = (e: React.MouseEvent) => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      e.preventDefault();
      setSelectedText((prevText) => prevText + ' ' + selection.toString());
      setMenuPosition({ x: e.pageX, y: e.pageY });
      setShowMenu(true);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const closeMenu = () => setShowMenu(false);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  // Handle create issue
  const handleCreateIssue = () => {
    console.log('Selected Text:', selectedText);
    setShowMenu(false);
  };

  return (
    <div
      onContextMenu={handleContextMenu}
      style={{
        padding: '2rem',
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      {/* Document content */}
      <div
        ref={contentRef}
        dangerouslySetInnerHTML={{ __html: content }}
        style={{
          maxWidth: '8.5in',
          margin: '0 auto',
          padding: '1in',
          backgroundColor: 'white',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          minHeight: '11in',
          overflow: 'auto', // Add this to handle overflow of content
          whiteSpace: 'pre-wrap', // Ensure line breaks are respected
          wordWrap: 'break-word', // Handle long words
          lineHeight: '1.6', // Make text more readable
          color: '#000000', // Set text color to pure black
        }}
      />

      {/* Context menu */}
      {showMenu && (
        <div
          style={{
            position: 'absolute',
            left: menuPosition.x,
            top: menuPosition.y,
            backgroundColor: 'white',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
            zIndex: 1000,
          }}
        >
          <button
            onClick={handleCreateIssue}
            style={{
              padding: '8px 16px',
              border: 'none',
              background: 'none',
              width: '100%',
              textAlign: 'left',
              cursor: 'pointer',
              color: 'black', // Make the button text color black
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            Create Issue
          </button>
        </div>
      )}
    </div>
  );
};

export default NewFatwaPage;
