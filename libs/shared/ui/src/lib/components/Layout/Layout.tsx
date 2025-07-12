import { FC, ReactNode, useState } from "react";
import "./styles.scss";
import { SidebarMenu } from "../SidebarMenu";

interface ILayoutProps {
  children: ReactNode;
}

export const Layout: FC<ILayoutProps> = ({ children }) => {
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);

  const handleLogout = () => {
    console.log("Logout logic here");
  };

  const handleMenuToggle = (isHidden: boolean) => {
    setIsSidebarHidden(isHidden);
  };

  return (
    <div className={`layout ${isSidebarHidden ? "sidebar-hidden" : ""}`}>
      <SidebarMenu onLogout={handleLogout} onMenuToggle={handleMenuToggle}/>
      <main className="content">{children}</main>
    </div>
  );
};
