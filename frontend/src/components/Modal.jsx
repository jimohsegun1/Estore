const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors text-lg leading-none"
          aria-label="Close"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
