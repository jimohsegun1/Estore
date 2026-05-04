const ProgressSteps = ({ step1, step2, step3 }) => {
  return (
    <div className="flex justify-center items-center gap-2 sm:gap-4 px-4 py-6 overflow-x-auto">
      <div className={`flex flex-col items-center ${step1 ? "text-green-500" : "text-gray-400"}`}>
        <span className="text-sm sm:text-base font-medium">Login</span>
        <div className="mt-1 text-lg">✅</div>
      </div>

      <div className={`h-0.5 w-8 sm:w-[6rem] ${step2 ? "bg-green-500" : "bg-gray-600"}`} />

      <div className={`flex flex-col items-center ${step2 ? "text-green-500" : "text-gray-400"}`}>
        <span className="text-sm sm:text-base font-medium">Shipping</span>
        <div className="mt-1 text-lg">{step2 ? "✅" : "⬜"}</div>
      </div>

      <div className={`h-0.5 w-8 sm:w-[6rem] ${step3 ? "bg-green-500" : "bg-gray-600"}`} />

      <div className={`flex flex-col items-center ${step3 ? "text-green-500" : "text-gray-400"}`}>
        <span className="text-sm sm:text-base font-medium">Summary</span>
        <div className="mt-1 text-lg">{step3 ? "✅" : "⬜"}</div>
      </div>
    </div>
  );
};

export default ProgressSteps;