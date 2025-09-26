import { prospectusData } from "@/lib/prospectus-data";
import {
  CommentsExtended,
  Prospectus,
  ProspectusSection,
} from "../interface/interface";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addCommentToProspectus,
  createNewProspectusVersion,
  fetchOrCreateClientProspectus,
} from "@/lib/data/prospectusAction";
import { RootState } from "./store";

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

export const loadProspectusData = createAsyncThunk<
  Prospectus[],
  { clientId: string; offset?: number },
  { rejectValue: string }
>(
  "prospectus/loadProspectusData",
  async ({ clientId, offset }, { rejectWithValue }) => {
    try {
      const res = await fetchOrCreateClientProspectus(clientId, offset);
      return res;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

export const addComment = createAsyncThunk<
  CommentsExtended,
  { prospectusId: string; content: string },
  { rejectValue: string }
>(
  "prospectus/addCommentToProspectus",
  async ({ prospectusId, content }, { rejectWithValue }) => {
    try {
      const res = await addCommentToProspectus(prospectusId, content);
      return res;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

export const saveProgress = createAsyncThunk<
  Prospectus,
  { clientId: string; content?: ProspectusSection[] },
  { rejectValue: string }
>(
  "prospectus/saveProgress",
  async ({ clientId, content }, { rejectWithValue, getState, dispatch }) => {
    try {
      if (content) {
        const res = await createNewProspectusVersion(clientId, content);
        return res;
      } else {
        const state = getState() as RootState;
        const prospectusState = state.prospectus;
        console.log(
          `Saving prospectus for client ${clientId} with state`,
          prospectusState
        );
        const activeProspectusId = prospectusState.activeProspectusId;
        const activeProspectus = prospectusState.prospectusData.find(
          (p) => p.id === activeProspectusId
        );

        if (!activeProspectus) {
          return rejectWithValue("Active prospectus not found");
        }

        const res = await createNewProspectusVersion(
          clientId,
          activeProspectus.sections
        );
        return res;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

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
    deleteSubsection: (state, action) => {
      const { sectionId, subsectionId } = action.payload;
      const prospectus = state.prospectusData.find(
        (p) => p.id === state.activeProspectusId
      );
      if (prospectus) {
        const section = prospectus.sections.find((s) => s.id === sectionId);
        if (section) {
          section.subsections = section.subsections.filter(
            (sub) => sub.id !== subsectionId
          );
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProspectusData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.prospectusData = [];
      })
      .addCase(loadProspectusData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.prospectusData = [...action.payload];
        if (action.payload.length > 0) {
          state.activeProspectusId = action.payload[0].id;
        }
        state.error = null;
      })
      .addCase(loadProspectusData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.prospectusData = [];
      })
      .addCase(addComment.pending, (state) => {
        // state.isLoading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        // state.isLoading = false;
        const prospectus = state.prospectusData.find(
          (p) => p.id === action.payload.prospectusId
        );
        if (prospectus) {
          prospectus.comments.push(action.payload);
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        // state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(saveProgress.pending, (state) => {
        // state.isLoading = true;
        state.error = null;
      })
      .addCase(saveProgress.fulfilled, (state, action) => {
        // state.isLoading = false;
        state.prospectusData.unshift(action.payload);
        state.activeProspectusId = action.payload.id;
        state.error = null;
      })
      .addCase(saveProgress.rejected, (state, action) => {
        // state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearProspectusData,
  setActiveProspectusId,
  addNewSubsection,
  deleteSubsection,
} = prospectusSlice.actions;
export default prospectusSlice.reducer;
