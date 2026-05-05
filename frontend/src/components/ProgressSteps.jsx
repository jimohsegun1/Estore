const ProgressSteps = ({ step1, step2, step3 }) => {
  const steps = [
    { label: "Login", done: step1 },
    { label: "Shipping", done: step2 },
    { label: "Summary", done: step3 },
  ];

  return (
    <div className="flex items-center justify-center gap-0 py-8 px-4">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                step.done
                  ? "bg-pink-600 border-pink-600 text-white"
                  : "border-[#2a2a2a] text-gray-600"
              }`}
            >
              {step.done ? "✓" : i + 1}
            </div>
            <span
              className={`text-xs font-medium ${step.done ? "text-pink-400" : "text-gray-600"}`}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-16 sm:w-24 h-0.5 mb-5 mx-1 ${steps[i + 1].done ? "bg-pink-600" : "bg-[#2a2a2a]"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ProgressSteps;
