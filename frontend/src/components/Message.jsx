const variants = {
  success: "bg-green-900/30 border border-green-500/30 text-green-400",
  danger: "bg-red-900/30 border border-red-500/30 text-red-400",
  warning: "bg-yellow-900/30 border border-yellow-500/30 text-yellow-400",
  info: "bg-blue-900/30 border border-blue-500/30 text-blue-400",
};

const Message = ({ variant = "info", children }) => {
  const cls = variants[variant] ?? variants.info;
  return (
    <div className={`px-4 py-3 rounded-xl text-sm ${cls}`}>{children}</div>
  );
};

export default Message;
