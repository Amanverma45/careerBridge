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
        font-semibold
        transition-all duration-300
        active:scale-95
        ${loading || disabled
          ? "opacity-60 cursor-not-allowed"
          : "hover:scale-[1.02] hover:shadow-sm"}
        ${className}
      `}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0"></div>
      )}

      <span>{children}</span>
    </button>
  );
}

export default Button;