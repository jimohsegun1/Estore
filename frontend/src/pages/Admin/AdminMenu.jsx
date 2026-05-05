import { NavLink } from "react-router-dom";

const links = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/categorylist", label: "Categories" },
  { to: "/admin/productlist", label: "New Product" },
  { to: "/admin/allproductslist", label: "All Products" },
  { to: "/admin/userlist", label: "Users" },
  { to: "/admin/orderlist", label: "Orders" },
];

const AdminMenu = () => (
  <nav className="flex flex-wrap gap-1 mb-6 bg-white dark:bg-[#0f0f1c] border border-[#e4e4ef] dark:border-[#2a2a45] rounded-2xl p-2 shadow-sm">
    {links.map(({ to, label }) => (
      <NavLink
        key={to}
        to={to}
        className={({ isActive }) =>
          `px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            isActive
              ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-brand-sm"
              : "text-[#6b6b8a] dark:text-[#7777a0] hover:text-[#0f0f1a] dark:hover:text-[#ededff] hover:bg-[#f1f1f7] dark:hover:bg-[#17172a]"
          }`
        }
      >
        {label}
      </NavLink>
    ))}
  </nav>
);

export default AdminMenu;
