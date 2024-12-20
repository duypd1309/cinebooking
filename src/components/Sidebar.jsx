import { Link } from "react-router";
import { useState } from "react";
import { FaUser } from "react-icons/fa";
import styles from "../styles/sidebar.module.css";
import Search from "./Search";

const menuItems = [
  { name: "home", label: "Home", link: "/" },
  {
    name: "movies",
    label: "Movies",
    link: "/movies",
    subMenu: [
      { label: "Submenu 1", link: "/movies/sub1" },
      { label: "Submenu 2", link: "/movies/sub2" },
    ],
  },
  {
    name: "events",
    label: "Events",
    link: "/events",
    subMenu: [
      { label: "Submenu 1", link: "/events/sub1" },
      { label: "Submenu 2", link: "/events/sub2" },
    ],
  },
  {
    name: "pages",
    label: "Pages",
    link: "/pages",
    subMenu: [
      { label: "Submenu 1", link: "/pages/sub1" },
      { label: "Submenu 2", link: "/pages/sub2" },
    ],
  },
  {
    name: "news",
    label: "News",
    link: "/news",
    subMenu: [
      { label: "Content 1", link: "/news/sub1" },
      { label: "Content 2", link: "/news/sub2" },
    ],
  },
  { name: "contact", label: "Contact", link: "/contact" },
];

function Sidebar() {
  const [dropdown, setDropdown] = useState(null);

  const handleMouseEnter = (menu) => {
    setDropdown(menu);
  };

  const handleMouseLeave = () => {
    setDropdown(null);
  };

  return (
    <>
      <div
        className={`${styles.sidebar} z-10 min-h-[80px] items-center justify-center text-base min-w-full flex sm:flex-row text-zinc-50 bg-[#0b0224] sm:space-x-4 space-y-4 sm:space-y-0 relative`}>
        {menuItems.map((item) => (
          <div
            key={item.name}
            onMouseEnter={() => handleMouseEnter(item.name)}
            onMouseLeave={handleMouseLeave}
            className="relative">
            <Link to={item.link}>
              {item.label} {item.subMenu && <span className="arrow">&#9662;</span>}
            </Link>
            {dropdown === item.name && item.subMenu && (
              <div
                className="dropdown-menu absolute top-full bg-white shadow-lg whitespace-nowrap 
                flex flex-col justify-start items-start"
                style={{
                  backgroundColor: "#333",
                  color: "#fff",
                  zIndex: 1001,
                }}>
                {item.subMenu.map((subItem, index) => (
                  <div key={index}>
                    <Link to={subItem.link}>{subItem.label}</Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        <Search />
        <Link to="/my-account">
          <FaUser size={24} />
        </Link>
      </div>
    </>
  );
}

export default Sidebar;
