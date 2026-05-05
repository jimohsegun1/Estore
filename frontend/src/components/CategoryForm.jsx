const CategoryForm = ({
  value,
  setValue,
  handleSubmit,
  buttonText = "Submit",
  handleDelete,
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-white placeholder-gray-500 rounded-xl px-4 py-2.5 focus:border-pink-500 focus:outline-none transition-colors"
        placeholder="Category name"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-xl px-5 py-2.5 transition-colors text-sm"
        >
          {buttonText}
        </button>
        {handleDelete && (
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl px-5 py-2.5 transition-colors text-sm"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
};

export default CategoryForm;
