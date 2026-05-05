import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const editInput =
  "bg-[#0f0f0f] border border-[#2a2a2a] text-white rounded-lg px-3 py-1.5 text-sm focus:border-pink-500 focus:outline-none w-full";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");

  useEffect(() => { refetch(); }, [refetch]);

  const deleteHandler = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await deleteUser(id);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const toggleEdit = (id, username, email) => {
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email);
  };

  const updateHandler = async (id) => {
    try {
      await updateUser({ userId: id, username: editableUserName, email: editableUserEmail });
      setEditableUserId(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="px-4 sm:px-8 py-6">
      <AdminMenu />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <span className="text-gray-500 text-sm">{users?.length || 0} members</span>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.message}</Message>
      ) : (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[580px]">
              <thead className="border-b border-[#2a2a2a]">
                <tr className="text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-5 py-3 text-left">Name</th>
                  <th className="px-5 py-3 text-left">Email</th>
                  <th className="px-5 py-3 text-center">Admin</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a]">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-[#242424] transition-colors">
                    <td className="px-5 py-4">
                      {editableUserId === user._id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editableUserName}
                            onChange={(e) => setEditableUserName(e.target.value)}
                            className={editInput}
                          />
                          <button
                            onClick={() => updateHandler(user._id)}
                            className="p-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex-shrink-0"
                          >
                            <FaCheck size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{user.username}</span>
                          <button
                            onClick={() => toggleEdit(user._id, user.username, user.email)}
                            className="text-gray-500 hover:text-white transition-colors"
                          >
                            <FaEdit size={12} />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {editableUserId === user._id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="email"
                            value={editableUserEmail}
                            onChange={(e) => setEditableUserEmail(e.target.value)}
                            className={editInput}
                          />
                          <button
                            onClick={() => updateHandler(user._id)}
                            className="p-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex-shrink-0"
                          >
                            <FaCheck size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <a href={`mailto:${user.email}`} className="text-gray-400 hover:text-white transition-colors text-xs">
                            {user.email}
                          </a>
                          <button
                            onClick={() => toggleEdit(user._id, user.username, user.email)}
                            className="text-gray-500 hover:text-white transition-colors"
                          >
                            <FaEdit size={12} />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-center">
                      {user.isAdmin ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-500/10 text-pink-400">
                          Admin
                        </span>
                      ) : (
                        <span className="text-gray-600">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {!user.isAdmin && (
                        <button
                          onClick={() => deleteHandler(user._id)}
                          className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                          aria-label="Delete user"
                        >
                          <FaTrash size={13} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
