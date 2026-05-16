import React from "react";
import { Outlet } from "react-router-dom";
import { TopNav } from "../components/TopNav";
import { LeftSidebar } from "../components/LeftSidebar";

export const AppLayout = ({ showRightPanel = false, RightPanelComponent }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopNav />

      <div className="flex flex-1">
        <LeftSidebar />

        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>

        {showRightPanel && RightPanelComponent && (
          <div className="w-80 border-l border-gray-200 bg-white p-6 shrink-0">
            <RightPanelComponent />
          </div>
        )}
      </div>
    </div>
  );
};
