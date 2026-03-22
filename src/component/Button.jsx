import React from "react";

function Button({
  children,
  loading = false,
  disabled = false,
  onClick,
  type = "button",  
  className = "",
}) {
  return (
    <button
      type={type} 
      onClick={onClick}
      disabled={loading || disabled}
      className={`px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition
        ${loading || disabled
          ? "opacity-60 cursor-not-allowed"
          : "hover:opacity-90"}
        ${className}
      `}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      )}
      {children}
    </button>
  );
}

export default Button;