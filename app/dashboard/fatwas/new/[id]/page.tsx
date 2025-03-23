"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import mammoth from "mammoth";

export default function NewFatwaPage() {
  const { id } = useParams();
  const router = useRouter();
  const [selectedBook, setSelectedBook] = useState("");
  const [title, setTitle] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [bookContent, setBookContent] = useState<string | null>(null);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ selectedBook, title, selectedTags, description });
    router.push("/dashboard/fatwas");
  };

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    const token = user ? JSON.parse(user).token : null;

    fetch(`https://lkp.pathok.com.bd/api/book/book-file/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.blob()) // Handle the response as a blob
      .then((data) => {
        // Convert the blob to ArrayBuffer
        const reader = new FileReader();
        reader.onload = () => {
          const arrayBuffer = reader.result as ArrayBuffer;

          // Use mammoth to extract HTML from the .docx file
          mammoth.convertToHtml({ arrayBuffer })
            .then((result) => {
              setBookContent(result.value); // Set the HTML content
            })
            .catch((error) => {
              console.error("Error converting docx to HTML:", error);
            });
        };
        reader.readAsArrayBuffer(data); // Read the file as ArrayBuffer
      })
      .catch((error) => {
        console.error("Error fetching book:", error);
      });
  }, [id]);

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default context menu from showing
    
    const currentSelectedText = window.getSelection()?.toString(); // Get currently selected text

    if (currentSelectedText) {
      // Add the new selected text to the existing selected text
      setSelectedText((prevText) => prevText + " " + currentSelectedText);
      setShowContextMenu(true);
      setContextMenuPosition({ x: e.pageX, y: e.pageY }); // Set the position of the context menu
    }
  };

  const handleCreateIssue = () => {
    // Log the selected text
    console.log("Selected Text:", selectedText);

    setShowContextMenu(false); // Close the context menu after selecting the option
  };

  const handleClick = () => {
    // Close the context menu if the user clicks anywhere else
    setShowContextMenu(false);
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Left side: PDF Viewer */}
      <div className="w-full sticky top-0 h-screen overflow-y-auto p-4">
        <Card className="h-full bg-white text-black border-gray-700">
          <CardContent className="flex items-center justify-center h-full">
            <div
              className="overflow-auto p-2 max-h-full"
              onContextMenu={handleRightClick} // Show custom context menu on right-click
            >
              {/* Show the converted HTML content */}
              {bookContent ? (
                <div
                  dangerouslySetInnerHTML={{ __html: bookContent }} // Set HTML content
                  className="whitespace-pre-wrap break-words" // Ensures text wraps correctly and prevents overflow
                />
              ) : (
                <p>Loading content...</p>
              )}
            </div>

            {/* Custom Context Menu */}
            {showContextMenu && (
              <div
                className="absolute z-50 bg-white border shadow-lg rounded p-2"
                style={{ left: `${contextMenuPosition.x}px`, top: `${contextMenuPosition.y}px` }}
              >
                <button
                  onClick={handleCreateIssue}
                  className="w-full text-black p-2 hover:bg-gray-200"
                >
                  Create Issue
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
