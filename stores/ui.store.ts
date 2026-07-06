import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type UiState = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
};

export const useUiStore = create<UiState>()(
  devtools(
    persist(
      (set) => ({
        sidebarOpen: true,
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        toggleSidebar: () =>
          set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      }),
      { name: "barberpro-ui" },
    ),
    { name: "UiStore" },
  ),
);
