import { Outlet } from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "./context/ThemeContext";

function App() {
  const { theme } = useTheme();

  return (
    <>
      <ToastContainer
        theme={theme === "dark" ? "dark" : "light"}
        toastClassName={() =>
          "relative flex p-3 min-h-10 rounded-xl justify-between overflow-hidden cursor-pointer " +
          "bg-white dark:bg-[#0f0f1c] border border-[#e4e4ef] dark:border-[#2a2a45] " +
          "text-[#0f0f1a] dark:text-[#ededff] shadow-brand-sm mb-2"
        }
      />
      <Navigation />
      <main className="py-3 lg:pl-16 pb-16 lg:pb-0">
        <Outlet />
      </main>
    </>
  );
}

export default App;
