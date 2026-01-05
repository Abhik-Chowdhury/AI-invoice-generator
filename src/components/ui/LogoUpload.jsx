import React, { useRef } from "react";
import { Camera } from "lucide-react";

const LogoUpload = ({ label, name, preview, onFileSelect }) => {
  const fileInputRef = useRef(null);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
        </label>
      )}

      <div
        onClick={() => fileInputRef.current.click()}
        className="relative flex items-center justify-center w-full h-36 sm:h-40 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition"
      >
        {preview ? (
          <img
            src={preview}
            alt="Business Logo"
            className="max-h-full max-w-full object-contain rounded-lg"
          />
        ) : (
          <div className="flex flex-col items-center text-slate-500">
            <Camera className="w-8 h-8 mb-2" />
            <p className="text-sm">Click to upload logo</p>
            <p className="text-xs text-slate-400">PNG, JPG up to 2MB</p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        name={name}
        accept="image/*"
        className="hidden"
        onChange={onFileSelect}
      />
    </div>
  );
};

export default LogoUpload;
