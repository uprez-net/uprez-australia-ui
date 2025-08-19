import { getReportsFromBackend } from "@/lib/data/reportPageAction";
import { ReportSummary } from "@/utils/convertReport";
import { Document } from "@prisma/client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface DocumentReport {
  id: string;
  report: string;
  summary: ReportSummary;
  status: string;
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
  { documents: Document[]; sessionToken: string },
  { rejectValue: string }
>(
  "report/fetchReportData",
  async ({ documents, sessionToken }, { rejectWithValue }) => {
    try {
      const res = await getReportsFromBackend(documents, sessionToken);
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
      });
  },
});

export const { clearReportData } = reportSlice.actions;
export default reportSlice.reducer;
