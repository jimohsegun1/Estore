import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Link } from "react-router-dom";

const inputClass =
  "w-full bg-[#0f0f0f] border border-[#2a2a2a] text-white placeholder-gray-600 rounded-xl px-4 py-2.5 focus:border-pink-500 focus:outline-none transition-colors";
const labelClass = "block text-sm font-medium text-gray-400 mb-1.5";

const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading }] = useProfileMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    setUserName(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.username]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const res = await updateProfile({ _id: userInfo._id, username, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="flex justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Avatar placeholder */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-pink-600 flex items-center justify-center text-white font-bold text-3xl mb-3">
            {userInfo.username?.[0]?.toUpperCase() || "U"}
          </div>
          <h1 className="text-xl font-bold">{userInfo.username}</h1>
          <p className="text-gray-500 text-sm">{userInfo.email}</p>
          {userInfo.isAdmin && (
            <span className="mt-2 bg-pink-600/20 text-pink-400 text-xs font-semibold px-3 py-1 rounded-full">
              Admin
            </span>
          )}
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8">
          <h2 className="text-lg font-bold mb-6">Update profile</h2>

          <form onSubmit={submitHandler} className="space-y-5">
            <div>
              <label className={labelClass}>Full name</label>
              <input
                type="text"
                className={inputClass}
                placeholder="Your name"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <div>
              <label className={labelClass}>Email address</label>
              <input
                type="email"
                className={inputClass}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className={labelClass}>New password <span className="text-gray-600">(leave blank to keep current)</span></label>
              <input
                type="password"
                className={inputClass}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className={labelClass}>Confirm password</label>
              <input
                type="password"
                className={inputClass}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-semibold rounded-xl py-2.5 transition-colors"
              >
                {isLoading ? "Saving…" : "Save changes"}
              </button>
              <Link
                to="/user-orders"
                className="flex-1 text-center border border-[#2a2a2a] hover:border-gray-500 text-gray-300 hover:text-white rounded-xl py-2.5 transition-colors text-sm font-semibold"
              >
                My Orders
              </Link>
            </div>
          </form>

          {isLoading && <Loader />}
        </div>
      </div>
    </div>
  );
};

export default Profile;
