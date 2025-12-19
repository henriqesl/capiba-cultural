import React from "react";
import TopNav from "./TopNav";
import BottomNav from "./BottomNav";

const MainLayout = ({ children, currentPath }) => {
  return (
    <div className="w-full min-h-screen bg-gray-100">
      <TopNav currentPath={currentPath} />

      <main>{children}</main>

      <BottomNav currentPath={currentPath} />
    </div>
  );
};

export default MainLayout;
