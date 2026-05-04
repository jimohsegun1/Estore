import { Outlet } from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer />
      <Navigation />
      <main className="py-3 lg:pl-16 pb-16 lg:pb-0">
        <Outlet />
      </main>
    </>
  );
}

export default App;