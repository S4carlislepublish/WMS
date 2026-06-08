import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import mammoth from "mammoth";
import ReactQuill from "react-quill-new";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { useNavigate as useNavigateRouter } from "react-router-dom";
import "react-quill-new/dist/quill.snow.css";
import {
  Save,
  ArrowLeft,
  Download,
  FileText,
  Undo2,
  Redo2,
  Printer,
  Search,
  Moon,
  Sun,
  ChevronDown,
} from "lucide-react";

export default function Editor() {
  const location = useLocation() as any;
  const navigate = useNavigateRouter();
  
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const locationState = location.state || {};
  const { project_id, chapter_id, file_id, fileName: stateFileName } = locationState;
  
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  const quillRef = useRef<ReactQuill | null>(null);

  const { filePath, fileName, fileData } = location.state || {};
  

  const currentFileName = fileName?.replace(".docx", "") || "document";
  const [darkMode, setDarkMode] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ size: ["small", false, "large", "huge"] }],

        ["bold", "italic", "underline", "strike"],

        [{ color: [] }, { background: [] }],

        [{ script: "sub" }, { script: "super" }],

        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],

        [{ align: [] }],

        ["blockquote", "code-block"],

        ["link", "image", "video"],

        ["clean"],
      ],
    }),
    [],
  );

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "list",
    "indent",
    "align",
    "blockquote",
    "code-block",
    "link",
    "image",
    "video",
  ];

  const handleUndo = () => {
    const editor = quillRef.current?.getEditor?.();
    if (!editor) return;
    editor.history.undo();
  };

  const [searchText, setSearchText] = useState("");
  const handleSearch = (value: string) => {
    const editor = quillRef.current?.getEditor?.();

    if (!editor) return;

    // REMOVE OLD HIGHLIGHTS
    editor.formatText(0, editor.getLength(), {
      background: false,
      color: false,
      bold: false,
    });

    if (!value.trim()) return;

    const text = editor.getText().toLowerCase();

    const search = value.toLowerCase();

    const index = text.indexOf(search);

    if (index !== -1) {
      // HIGHLIGHT
      editor.formatText(index, search.length, {
        background: "yellow",
        color: "red",
        bold: true,
      });

      // MOVE CURSOR
      editor.setSelection(index + search.length, 0);

      editor.focus();

      // SCROLL
      const bounds = editor.getBounds(index);
      if (bounds) {
        const container = (editor as any).scrollingContainer || (editor as any).container;
        if (container) {
          container.scrollTop = bounds.top - 120;
        }
      }
    }
  };

  const handleRedo = () => {
    const editor = quillRef.current?.getEditor?.();
    if (!editor) return;
    editor.history.redo();
  };
  const handleSave = async () => {
    try {
      // =========================
      // SAVE EDITOR CONTENT
      // =========================

      const response = await fetch(
        "http://localhost:5000/save-editor-content",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            file_id: fileData.id,
            content: content,
          }),
        },
      );

      const data = await response.json();

      // =========================
      // SAVE EDITOR END TIME
      // =========================

      await fetch("http://localhost:5000/editor-end", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          user_id: user?.id,
          project_id: project_id,
          chapter_id: chapter_id,
          file_name: fileName,
        }),
      });

      // =========================
      // SUCCESS MESSAGE
      // =========================

      setMessage(data.message);

      setMessageType("success");

      setTimeout(() => {
        setMessage("");

        navigate(-1);
      }, 2000);
    } catch (error) {
      console.log(error);

      setMessage("Save failed");

      setMessageType("error");

      setTimeout(() => {
        setMessage("");
      }, 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], {
      type: "text/html",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "chapter-content.html";

    a.click();

    URL.revokeObjectURL(url);
  };
  useEffect(() => {
    const loadDocx = async () => {
      try {
        if (!filePath) return;

        const cleanPath = filePath.replace(/\\/g, "/");

const fileUrl = `${import.meta.env.VITE_API_URL}/${cleanPath}`;

        console.log(fileUrl);
        if (fileData?.editor_content) {
          setContent(fileData.editor_content);

          setTimeout(() => {
            const editor = quillRef.current?.getEditor();

            if (editor) {
              editor.history.clear();
            }
          }, 100);
        } else {
            console.log("FILE PATH:", filePath);
console.log("FILE URL:", fileUrl);
          const response = await fetch(fileUrl);

          // DOCX FILE

          if (fileName.endsWith(".docx")) {
            const arrayBuffer = await response.arrayBuffer();

            const result = await mammoth.convertToHtml({
              arrayBuffer,
            });

            setContent(result.value);
          }

          // HTML FILE
          else if (fileName.endsWith(".html")) {
            const htmlText = await response.text();

            setContent(htmlText);
          }

          // TXT FILE
          else if (fileName.endsWith(".txt")) {
            const text = await response.text();

            const cleanText = text.replace(/\n/g, "<br>");

            setContent(`
  <div style="
    color:#111827;
    font-family:Calibri,sans-serif;
    font-size:18px;
    line-height:1.8;
    background:white;
  ">
    ${cleanText}
  </div>
`);
          }

          setTimeout(() => {
            const editor = quillRef.current?.getEditor();

            if (editor) {
              editor.history.clear();
            }
          }, 100);
        }
      } catch (error) {
        console.log(error);
      }
    };

    loadDocx();
  }, [filePath]);

  useEffect(() => {
    fetch("http://localhost:5000/editor-start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        user_id: user?.id,
        user_name: user?.name,
        project_id,
        chapter_id,
        file_id,
        file_name: fileName,
      }),
    });
  }, []);

  const exportHTML = () => {
    const blob = new Blob([content], {
      type: "text/html",
    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = `${currentFileName}.html`;
    link.click();
  };

  const exportTXT = () => {
    const text = quillRef.current?.getEditor?.()?.getText?.();

    const blob = new Blob([text || ""], {
      type: "text/plain",
    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = `${currentFileName}.txt`;
    link.click();
  };

  const exportDOCX = () => {
    const blob = new Blob([content], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = `${currentFileName}.docx`;
    link.click();
  };

  const exportPDF = () => {
    window.print();
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? "bg-slate-900" : "bg-white"}`}>
      {/* NOTIFICATION */}
      {message && (
        <div className={`fixed top-6 right-6 z-[999999] px-6 py-4 rounded-lg shadow-xl text-white font-medium flex items-center gap-3 animate-in fade-in ${
          messageType === "success" ? "bg-emerald-500" : "bg-red-500"
        }`}>
          <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
          <span>{message}</span>
        </div>
      )}

      {/* HEADER */}
      <div className={`${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"} border-b sticky top-0 z-40`}>
        {/* TOP BAR */}
        <div className={`px-6 py-3 flex items-center justify-between border-b ${darkMode ? "border-slate-700" : "border-slate-200"}`}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className={`p-2 rounded-lg hover:bg-slate-200 transition ${darkMode ? "hover:bg-slate-700" : ""}`}
            >
              <ArrowLeft size={20} className={darkMode ? "text-white" : "text-slate-900"} />
            </button>
            <div className="h-8 w-px bg-slate-300"></div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText size={18} className="text-blue-600" />
              </div>
              <div>
                <h1 className={`text-lg font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
                  Manuscript Editor
                </h1>
                <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Professional Document Editing
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition ${darkMode ? "bg-slate-700 text-white hover:bg-slate-600" : "hover:bg-slate-100"}`}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>

        {/* TOOLBAR */}
        <div className={`px-6 py-4 ${darkMode ? "bg-slate-800" : "bg-slate-50"}`}>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* LEFT SECTION */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleUndo}
                  className={`p-2 rounded-md transition tooltip-hover ${darkMode ? "hover:bg-slate-700 text-white" : "hover:bg-slate-200 text-slate-700"}`}
                  title="Undo"
                >
                  <Undo2 size={18} />
                </button>
                <button
                  onClick={handleRedo}
                  className={`p-2 rounded-md transition ${darkMode ? "hover:bg-slate-700 text-white" : "hover:bg-slate-200 text-slate-700"}`}
                  title="Redo"
                >
                  <Redo2 size={18} />
                </button>
              </div>

              <div className={`w-px h-6 ${darkMode ? "bg-slate-700" : "bg-slate-300"}`}></div>

              <div className="flex items-center gap-1">
                <input
                  type="text"
                  placeholder="Search in document..."
                  value={searchText}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchText(value);
                    handleSearch(value);
                  }}
                  className={`px-3 py-2 rounded-md text-sm border transition ${darkMode ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" : "bg-white border-slate-300 placeholder-slate-500"}`}
                />
                <button className={`p-2 rounded-md ${darkMode ? "hover:bg-slate-700 text-white" : "hover:bg-slate-200"}`}>
                  <Search size={18} />
                </button>
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className={`p-2 rounded-md transition ${darkMode ? "hover:bg-slate-700 text-white" : "hover:bg-slate-200 text-slate-700"}`}
                title="Print"
              >
                <Printer size={18} />
              </button>

              <div className="relative group">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition text-sm font-medium"
                >
                  <Download size={16} />
                  Export
                  <ChevronDown size={16} />
                </button>

                {showExportMenu && (
                  <div className={`absolute right-0 top-12 w-48 rounded-lg shadow-2xl overflow-hidden z-50 ${darkMode ? "bg-slate-700" : "bg-white border border-slate-200"}`}>
                    <button
                      onClick={() => {
                        exportHTML();
                        setShowExportMenu(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm transition ${darkMode ? "hover:bg-slate-600 text-white" : "hover:bg-slate-100"}`}
                    >
                      📄 Export as HTML
                    </button>
                    <button
                      onClick={() => {
                        exportTXT();
                        setShowExportMenu(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm transition ${darkMode ? "hover:bg-slate-600 text-white" : "hover:bg-slate-100"}`}
                    >
                      📋 Export as TXT
                    </button>
                    <button
                      onClick={() => {
                        exportDOCX();
                        setShowExportMenu(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm transition ${darkMode ? "hover:bg-slate-600 text-white" : "hover:bg-slate-100"}`}
                    >
                      📘 Export as DOCX
                    </button>
                    <button
                      onClick={() => {
                        exportPDF();
                        setShowExportMenu(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm transition ${darkMode ? "hover:bg-slate-600 text-white" : "hover:bg-slate-100"}`}
                    >
                      🖨️ Export as PDF
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition text-sm font-medium"
              >
                <Save size={16} />
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DOCUMENT HEADER - STICKY */}
      <div className={`sticky top-16 z-30 px-6 py-4 border-b flex items-center justify-between ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
        <div>
          <h2 className={`text-base font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
            {fileName}
          </h2>
          <p className={`text-xs mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            Auto-saved • Rich text enabled
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className={`text-xs font-medium ${darkMode ? "text-white" : "text-slate-900"}`}>
            Online
          </span>
        </div>
      </div>

      {/* EDITOR AREA */}
      <div className={`flex-1 overflow-hidden ${darkMode ? "bg-slate-900" : "bg-slate-100"}`}>
        <div className="h-full overflow-hidden p-8">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className={`text-lg font-medium ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                  Loading manuscript...
                </p>
              </div>
            </div>
          ) : (
            <div className={`mx-auto max-w-4xl h-full rounded-lg shadow-2xl border overflow-hidden flex flex-col ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
              {/* QUILL EDITOR */}
              <div className={`flex-1 overflow-hidden flex flex-col ${darkMode ? "bg-slate-800" : "bg-white"}`}>
                <style>
                  {`
                    .ql-toolbar.ql-snow {
                      background: ${darkMode ? "#1e293b" : "#f8fafc"};
                      border: none;
                      border-bottom: 1px solid ${darkMode ? "#475569" : "#e2e8f0"};
                      padding: 12px 16px;
                      flex-shrink: 0;
                      display: flex;
                      flex-wrap: wrap;
                      gap: 8px;
                    }

                    .ql-toolbar button {
                      color: ${darkMode ? "#e2e8f0" : "#475569"};
                      width: 28px;
                      height: 28px;
                    }

                    .ql-toolbar button:hover,
                    .ql-toolbar button.ql-active {
                      color: ${darkMode ? "#60a5fa" : "#3b82f6"};
                    }

                    .ql-container.ql-snow {
                      border: none !important;
                      background: ${darkMode ? "#1f2937" : "#f3f4f6"};
                      padding: 40px;
                      flex: 1;
                      overflow-y: auto;
                      overflow-x: hidden;
                      display: flex;
                      justify-content: center;
                      align-items: flex-start;
                    }

                    .ql-editor.ql-snow {
                      background: ${darkMode ? "#111827" : "white"};
                      color: ${darkMode ? "#f1f5f9" : "#111827"};
                      font-family: 'Calibri', 'Segoe UI', sans-serif;
                      font-size: 16px;
                      line-height: 1.6;
                      padding: 40px;
                      width: 100%;
                      max-width: 900px;
                      border-radius: 8px;
                      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                      box-sizing: border-box;
                      flex-shrink: 0;
                    }

                    .ql-editor.ql-blank::before {
                      color: ${darkMode ? "#64748b" : "#cbd5e1"};
                      font-style: italic;
                    }

                    .ql-editor h1 {
                      font-size: 32px;
                      font-weight: bold;
                      margin: 24px 0 16px 0;
                    }

                    .ql-editor h2 {
                      font-size: 26px;
                      font-weight: bold;
                      margin: 20px 0 12px 0;
                    }

                    .ql-editor h3 {
                      font-size: 20px;
                      font-weight: bold;
                      margin: 16px 0 8px 0;
                    }

                    .ql-editor p {
                      margin: 8px 0;
                    }

                    .ql-container.ql-snow::-webkit-scrollbar {
                      width: 8px;
                    }

                    .ql-container.ql-snow::-webkit-scrollbar-track {
                      background: transparent;
                    }

                    .ql-container.ql-snow::-webkit-scrollbar-thumb {
                      background: ${darkMode ? "#475569" : "#cbd5e1"};
                      border-radius: 4px;
                    }

                    @media print {
                      body { background: white; }
                      .ql-toolbar { display: none; }
                      .ql-container { background: white; padding: 0; }
                    }
                  `}
                </style>

                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  formats={formats}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
