import { prospectusData } from "@/lib/prospectus-data";
import { Prospectus } from "../interface/interface";
import { createSlice } from "@reduxjs/toolkit";

interface ProspectusState {
  isLoading: boolean;
  error: string | null;
  prospectusData: Prospectus[];
  activeProspectusId?: string;
}

const initialState: ProspectusState = {
  isLoading: false,
  error: null,
  prospectusData: [
    {
      id: "1",
      version: 1,
      sections: [...prospectusData],
      comments: [],
      createdBy: "user1",
      createdAt: new Date().toISOString(),
    },
  ],
  activeProspectusId: "1",
};

export const prospectusSlice = createSlice({
  name: "prospectus",
  initialState,
  reducers: {
    clearProspectusData: (state) => {
      state.prospectusData = [];
      state.isLoading = false;
      state.error = null;
      state.activeProspectusId = undefined;
    },
    setActiveProspectusId: (state, action) => {
      state.activeProspectusId = action.payload;
    },
    addNewSubsection: (state, action) => {
      const { sectionId, subsection } = action.payload;
      const prospectus = state.prospectusData.find(
        (p) => p.id === state.activeProspectusId
      );
      if (prospectus) {
        const section = prospectus.sections.find((s) => s.id === sectionId);
        if (section) {
          section.subsections.push(subsection);
        }
      }
    },
  },
});

export const { clearProspectusData, setActiveProspectusId, addNewSubsection } =
  prospectusSlice.actions;
export default prospectusSlice.reducer;
