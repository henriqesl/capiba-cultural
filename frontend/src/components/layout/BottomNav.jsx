import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Icon } from "../user/UserShared.jsx";
import { ICONS } from "../../utils/icons.jsx";

const NavItem = ({ href, iconPath, label, active = false }) => {
  const activeClass = active ? "text-blue-600" : "text-gray-400";
  return (
    <a
      href={href}
      className={`flex flex-col items-center gap-1 hover:text-blue-600 transition-colors ${activeClass}`}
    >
      <Icon path={iconPath} className="w-7 h-7" />
      <span className="text-xs font-bold">{label}</span>
    </a>
  );
};

const BottomNav = ({ currentPath }) => {
  const { authenticated, user, loading: authLoading } = useAuth();

  let userOrLoginItem;
  if (authLoading) {
    userOrLoginItem = (
      <NavItem href="#" iconPath={ICONS.user} label="..." active={false} />
    );
  } else if (authenticated) {
    userOrLoginItem = (
      <NavItem
        href="#/perfil"
        iconPath={ICONS.user}
        label={user?.nome?.split(" ")[0] || "Perfil"}
        active={currentPath.startsWith("#/perfil")}
      />
    );
  } else {
    userOrLoginItem = (
      <NavItem
        href="#/login"
        iconPath={ICONS.user}
        label="Login"
        active={currentPath === "#/login"}
      />
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] px-4 py-2 md:hidden z-50">
      <div className="flex justify-around items-center">

        <NavItem
          href="#/eventos"
          iconPath={ICONS.calendar}
          label="Agenda"
          active={currentPath.startsWith("#/eventos") || currentPath === "#/"}
        />
        <NavItem
          href="#/capiba"
          iconPath={ICONS.dollar}
          label="Capiba"
          active={currentPath.startsWith("#/capiba")}
        />
        <NavItem
          href="#/status"
          iconPath={ICONS.star}
          label="Status"
          active={currentPath.startsWith("#/status")}
        />

        {userOrLoginItem}
      </div>
    </nav>
  );
};

export default BottomNav;
