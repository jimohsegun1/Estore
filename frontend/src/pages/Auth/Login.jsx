import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

const inputClass =
  "w-full bg-[#f1f1f7] dark:bg-[#17172a] border border-[#e4e4ef] dark:border-[#2a2a45] text-[#0f0f1a] dark:text-[#ededff] placeholder-[#6b6b8a] dark:placeholder-[#7777a0] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center font-bold text-white text-sm flex-shrink-0 shadow-brand-sm">
            E
          </div>
          <span className="font-bold text-lg tracking-tight text-[#0f0f1a] dark:text-[#ededff]">Estore</span>
        </div>

        <div className="bg-white dark:bg-[#0f0f1c] border border-[#e4e4ef] dark:border-[#2a2a45] rounded-2xl p-8 shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight mb-1 text-[#0f0f1a] dark:text-[#ededff]">Welcome back</h1>
          <p className="text-[#6b6b8a] dark:text-[#7777a0] text-sm mb-7">Sign in to your account</p>

          <form onSubmit={submitHandler} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#0f0f1a] dark:text-[#ededff] mb-1.5">
                Email address
              </label>
              <input type="email" id="email" className={inputClass} placeholder="you@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#0f0f1a] dark:text-[#ededff] mb-1.5">
                Password
              </label>
              <input type="password" id="password" className={inputClass} placeholder="••••••••"
                value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <button disabled={isLoading} type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-2.5 transition-all shadow-brand-sm hover:shadow-brand-md active:scale-[0.98]">
              {isLoading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          {isLoading && <Loader />}

          <p className="mt-6 text-center text-sm text-[#6b6b8a] dark:text-[#7777a0]">
            No account?{" "}
            <Link to={redirect ? `/register?redirect=${redirect}` : "/register"}
              className="text-indigo-500 dark:text-[#818cf8] hover:underline font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
