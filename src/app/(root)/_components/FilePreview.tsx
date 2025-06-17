import { X } from "lucide-react";

interface FilePreviewModalProps {
  url: string;
  type: "image" | "pdf";
  onClose: () => void;
}

export default function FilePreviewModal({ url, type, onClose }: FilePreviewModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="relative bg-[#1a1a1a] rounded-xl p-4 max-w-[90%] max-h-[90%] overflow-auto">
        <button
          className="absolute top-2 right-2 text-white"
          onClick={onClose}
        >
          <X />
        </button>
        {type === "image" ? (
          <img src={url} alt="Preview" className="max-w-full max-h-[80vh] rounded-lg" />
        ) : (
          <iframe
            src={url}
            title="PDF Preview"
            className="w-[80vw] h-[80vh] rounded-lg"
          ></iframe>
        )}
      </div>
    </div>
  );
}
