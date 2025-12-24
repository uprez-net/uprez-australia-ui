// import { prospectusData } from "@/lib/prospectus-data";
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
  generateNewProspectusVersion,
} from "@/lib/data/prospectusAction";
import { RootState } from "./store";
import { set } from "zod";

interface ProspectusState {
  isLoading: boolean;
  error: string | null;
  prospectusData: Prospectus[];
  hasMore: boolean;
  offset: number;
  activeProspectusId?: string;
  editingSubsectionId?: string;
  locked: boolean;
}

const initialState: ProspectusState = {
  isLoading: true,
  error: null,
  hasMore: false,
  offset: 0,
  prospectusData: [],
  activeProspectusId: undefined,
  editingSubsectionId: undefined,
  locked: false,
};

export const loadProspectusData = createAsyncThunk<
  { data: Prospectus[]; hasMore: boolean; offset: number },
  { clientId: string; generationId: string; offset?: number },
  { rejectValue: string }
>(
  "prospectus/loadProspectusData",
  async ({ clientId, generationId, offset }, { rejectWithValue }) => {
    try {
      const res = await fetchOrCreateClientProspectus(clientId, generationId, offset);
      return {
        data: res.data,
        hasMore: res.hasMore,
        offset: (offset || 0) + res.data.length,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

export const addComment = createAsyncThunk<
  CommentsExtended,
  { prospectusId: string; content: string; parentId?: string },
  { rejectValue: string }
>(
  "prospectus/addCommentToProspectus",
  async ({ prospectusId, content, parentId }, { rejectWithValue }) => {
    try {
      const res = await addCommentToProspectus(prospectusId, content, parentId);
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

export const generateProspectus = createAsyncThunk<
  Prospectus,
  { clientId: string; generationId: string },
  { rejectValue: string }
>(
  "prospectus/generateProspectus",
  async ({ clientId, generationId }, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLock(true));
      const res = await generateNewProspectusVersion(clientId, generationId);
      
      return res;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      return rejectWithValue(errorMessage);
    }
  });

export const prospectusSlice = createSlice({
  name: "prospectus",
  initialState,
  reducers: {
    clearProspectusData: (state) => {
      state = {...initialState};
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
    setEditingSubsectionId: (state, action) => {
      console.log(`Setting editingSubsectionId to ${action.payload}`);
      state.editingSubsectionId = action.payload;
    },
    setLock: (state, action) => {
      state.locked = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProspectusData.pending, (state) => {
        if (state.offset === 0) {
          state.isLoading = true;
        }
        state.error = null;
        state.prospectusData = [];
      })
      .addCase(loadProspectusData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.prospectusData = [...action.payload.data];
        if (action.payload.data.length > 0) {
          state.activeProspectusId = action.payload.data[0].id;
        }
        state.hasMore = action.payload.hasMore;
        state.offset = action.payload.offset;
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
      })
      .addCase(generateProspectus.pending, (state) => {
        // state.isLoading = true;
        state.error = null;
      })
      .addCase(generateProspectus.fulfilled, (state, action) => {
        state.locked = false;
        // state.isLoading = false;
        state.prospectusData.unshift(action.payload);
        state.activeProspectusId = action.payload.id;
        state.error = null;
      })
      .addCase(generateProspectus.rejected, (state, action) => {
        state.locked = false;
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
  setEditingSubsectionId,
  setLock,
} = prospectusSlice.actions;
export default prospectusSlice.reducer;
