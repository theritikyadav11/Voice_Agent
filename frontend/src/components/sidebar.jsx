import React from "react";
import NewSession from "../sub_components/sidebar/newSession";
import RecentSession from "../sub_components/sidebar/recentSession";
import { HiX } from "react-icons/hi";

const Sidebar = ({
  closeSidebar,
  onCreateNewSession,
  recentSessions,
  onSessionSelect,
  onSessionDelete,
  currentSessionId,
}) => {
  return (
    <div className="h-full flex flex-col justify-between">
      <div className="md:hidden flex justify-end p-2">
        <button
          onClick={closeSidebar}
          className="text-purple-300 hover:text-white"
        >
          <HiX size={28} />
        </button>
      </div>

      <div className="p-3">
        <NewSession onCreateNewSession={onCreateNewSession} />
      </div>

      <div className="p-3 flex-1 overflow-y-auto">
        <RecentSession
          recentSessions={recentSessions}
          onSessionSelect={onSessionSelect}
          onSessionDelete={onSessionDelete}
          currentSessionId={currentSessionId}
        />
      </div>
    </div>
  );
};

export default Sidebar;
