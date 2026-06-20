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
      className={`
        px-5 py-3
        rounded-xl
        flex items-center justify-center gap-2
        font-medium
        transition-all duration-300
        active:scale-95
        ${loading || disabled
          ? "opacity-60 cursor-not-allowed"
          : "hover:scale-[1.02]"}
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