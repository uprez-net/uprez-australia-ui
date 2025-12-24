import {
  getReportsFromBackend,
  saveUserNote,
} from "@/lib/data/reportPageAction";
import { ReportSummary } from "@/utils/convertReport";
import { Document, ReportUserNotes } from "@prisma/client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface DocumentReport {
  id: string;
  report: string;
  summary: ReportSummary;
  status: string;
  userNotes: (ReportUserNotes & { userName: string })[];
}

interface ReportPageState {
  isLoading: boolean;
  error: string | null;
  docReport: DocumentReport[];
}

const initialState: ReportPageState = {
  isLoading: false,
  error: null,
  docReport: [],
};

export const fetchReportData = createAsyncThunk<
  DocumentReport[],
  { documents: Document[]; sessionToken: string; smeCompanyId: string; generationId: string },
  { rejectValue: string }
>(
  "report/fetchReportData",
  async ({ documents, sessionToken, smeCompanyId, generationId }, { rejectWithValue }) => {
    try {
      const res = await getReportsFromBackend(documents, smeCompanyId, generationId, sessionToken);
      return res;
    } catch (error) {
      let errorMessage = "An unknown error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

export const saveNote = createAsyncThunk<
  (ReportUserNotes & { userName: string }),
  {
    content: string;
    documentId: string;
    generationId: string;
    genNumber: number;
    isVerified: boolean;
    smeCompanyId: string;
  },
  { rejectValue: string }
>(
  "report/saveUserNote",
  async (
    { content, documentId, generationId, genNumber, isVerified, smeCompanyId },
    { rejectWithValue }
  ) => {
    try {
      const newNote = await saveUserNote(
        content,
        documentId,
        generationId,
        genNumber,
        isVerified,
        smeCompanyId
      );
      return newNote;
    } catch (error) {
      let errorMessage = "An unknown error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

export const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    clearReportData: (state) => {
      state.docReport = [];
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReportData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReportData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.docReport = action.payload;
      })
      .addCase(fetchReportData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(saveNote.fulfilled, (state, action) => {
        const newNote = action.payload;
        const docReport = state.docReport.find(
          (report) => report.id === newNote.documentId
        );
        if (docReport) {
          docReport.userNotes.push(newNote);
        }
      })
      .addCase(saveNote.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearReportData } = reportSlice.actions;
export default reportSlice.reducer;
