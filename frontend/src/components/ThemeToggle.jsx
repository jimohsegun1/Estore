import { useTheme } from "../context/ThemeContext";
import { HiSun, HiMoon } from "react-icons/hi2";

const ThemeToggle = ({ className = "" }) => {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className={`relative w-9 h-9 flex items-center justify-center rounded-xl transition-colors
        text-[#6b6b8a] hover:text-[#6366f1] hover:bg-[#6366f1]/10
        dark:text-[#7777a0] dark:hover:text-[#818cf8] dark:hover:bg-[#818cf8]/10 ${className}`}
    >
      {theme === "dark" ? <HiSun size={18} /> : <HiMoon size={18} />}
    </button>
  );
};

export default ThemeToggle;
