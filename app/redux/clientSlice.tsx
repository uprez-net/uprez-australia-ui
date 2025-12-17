import { deleteFile } from "@/lib/data/bucketAction";
import {
  createDocument,
  deleteDocument,
  fetchClientData,
  refreshAccessToken,
} from "@/lib/data/clientPageAction";
import { SMECompany, Document, IPOValuation } from "@prisma/client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface ClientPageState {
  isLoading: boolean;
  error: string | null;
  clientData: SMECompany | null;
  documents: Document[];
  ipoValuations: IPOValuation[];
  sessionToken?: string;
}

const initialState: ClientPageState = {
  isLoading: false,
  error: null,
  clientData: null,
  documents: [],
  ipoValuations: [],
};

export const setClientData = createAsyncThunk<
  SMECompany & { Documents: Document[] } & { sessionToken?: string } & { IPOValuations: IPOValuation[] },
  string,
  { rejectValue: string }
>("clientPage/fetchClientData", async (clientId, { rejectWithValue }) => {
  try {
    const res = await fetchClientData(clientId);

    return res;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});

export const refreshToken = createAsyncThunk<
string,
{ sessionToken: string },
  { rejectValue: string }
>("clientPage/refreshAccessToken", async ({ sessionToken }, { rejectWithValue }) => {
  try {
    // Implement refresh token logic here
    // For now, we will just return a dummy response
    const session_token = await refreshAccessToken(sessionToken);

    return session_token;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});

export const createDocumentClient = createAsyncThunk<
  Document,
  { Document: Document; sessionToken?: string, isIPO?: boolean },
  { rejectValue: string }
>(
  "clientPage/createDocument",
  async ({ Document, sessionToken, isIPO = false }, { rejectWithValue }) => {
    try {
      if (!sessionToken) {
        return rejectWithValue(
          "Session token is required to create a document"
        );
      }
      const res = createDocument(Document, sessionToken, isIPO);

      return res;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const deleteDocumentClient = createAsyncThunk<
  Document,
  { documentId: string; filePath: string },
  { rejectValue: string }
>("clientPage/deleteDocument", async ({ documentId, filePath }, { rejectWithValue }) => {
  try {
    // Implement delete document logic here
    // For now, we will just return a dummy response
    // const res = await deleteDocument(documentId);
    const res = await deleteFile(filePath, documentId);

    return res;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});

export const clientSlice = createSlice({
  name: "clientPage",
  initialState,
  reducers: {
    clearClient: (state) => {
      state.isLoading = false;
      state.error = null;
      state.clientData = null;
    },
    setGenerationId: (state, action) => {
      if (state.clientData) {
        state.clientData.generationId = action.payload;
        state.clientData.eligibilityStatus = "Pending"; // Reset eligibility status when generation ID is set
        state.clientData.complianceStatus = "pending"; // Reset compliance status when generation ID is set
        state.clientData.updatedAt = new Date();

        state.documents = state.documents.map((doc) => ({
          ...doc,
          generationId: doc.generationId || action.payload, // Ensure all documents have the new generation ID
        })); // Reset documents to pending status
      }
    },
    setGenerationNumber: (state, action) => {
      if (state.clientData) {
        state.clientData.generationNumber = action.payload; // Add after migrating to new schema
        state.documents = state.documents.map((doc) => ({
          ...doc,
          generationNumber: doc.generationNumber || action.payload, // Ensure all documents have the new generation ID
        })); // Reset documents to pending status
      }
    },
    updateDocument: (state, action) => {
      const updatedDocument = action.payload;
      const index = state.documents.findIndex(
        (doc) => doc.id === updatedDocument.id
      );
      if (index !== -1) {
        state.documents[index] = updatedDocument;
      } else {
        state.documents.push(updatedDocument);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setClientData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(setClientData.fulfilled, (state, action) => {
        state.isLoading = false;
        const { Documents, sessionToken, IPOValuations, ...rest } = action.payload;
        state.clientData = rest;
        state.documents = Documents || [];
        state.ipoValuations = IPOValuations || [];
        state.sessionToken = sessionToken;
      })
      .addCase(setClientData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch client data";
      })
      .addCase(createDocumentClient.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createDocumentClient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.documents.push(action.payload);
      })
      .addCase(createDocumentClient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to create document";
      })
      .addCase(deleteDocumentClient.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteDocumentClient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.documents = state.documents.filter(
          (doc) => doc.id !== action.payload.id
        );
      })
      .addCase(deleteDocumentClient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to delete document";
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.sessionToken = action.payload;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.error = action.payload || "Failed to refresh session token";
      });
  },
});

export const {
  clearClient,
  setGenerationId,
  setGenerationNumber,
  updateDocument,
} = clientSlice.actions;
export default clientSlice.reducer;
