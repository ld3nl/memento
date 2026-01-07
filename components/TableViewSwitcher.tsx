"use client";

import { useRouter, usePathname } from "next/navigation";
import LifeTable from "./LifeTable";
import BurstScene from "./BurstScene";
import ViewToggle from "./ViewToggle";

type ViewMode = "table" | "burst";

type TableViewSwitcherProps = {
  dob: Date;
  initialView?: ViewMode;
};

export function TableViewSwitcher({
  dob,
  initialView = "table",
}: TableViewSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Extract current view from pathname
  const currentView = pathname.startsWith("/burst") ? "burst" : "table";

  const handleViewChange = (newView: ViewMode) => {
    // Extract date from current path
    const dateMatch = pathname.match(/\/(table|burst)\/(.+)/);
    if (dateMatch) {
      const datePart = dateMatch[2];
      router.push(`/${newView}/${datePart}`);
    }
  };

  return (
    <div
      className={`relative ${currentView === "burst" ? "h-[80vh] w-full" : ""}`}
    >
      {/* Floating toggle button in top-right corner */}
      {/* <div className="fixed top-4 right-4 z-10">
        <ViewToggle currentView={currentView} onViewChange={handleViewChange} />
      </div> */}

      {currentView === "table" ? (
        <LifeTable dob={dob} />
      ) : (
        <BurstScene dob={dob} />
      )}
    </div>
  );
}

export default TableViewSwitcher;
