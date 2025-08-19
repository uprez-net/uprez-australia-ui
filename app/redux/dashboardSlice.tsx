import { IntermediaryProfile, SMECompany, SMEProfile } from "@prisma/client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { deleteSMECompanyAction, getDashboardData } from "@/lib/data/dashboardAction";


interface DashboardState {
    isLoading: boolean;
    error: string | null;
    SWE: SMECompany[];
    organization: IntermediaryProfile | SMEProfile | null;
    orgType?: "intermediary" | "sme";
    userId: string | null;
    organizationId: string | null;
}

const initialState: DashboardState = {
    isLoading: false,
    error: null,
    SWE: [],
    organization: null,
    orgType: undefined,
    userId: null,
    organizationId: null,
};

export const setDashboard = createAsyncThunk<
    { SWE: SMECompany[]; organization: IntermediaryProfile | SMEProfile, orgType: "intermediary" | "sme", userId: string, organizationId: string },
    // { organizationId: string, orgType: "intermediary" | "sme" },
    void,
    { state: RootState }
>("dashboard/setDashboard", async (data, { rejectWithValue }) => {
    try {
        const dashboardData = await getDashboardData();

        return { ...dashboardData };
    } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch dashboard data");
    }

});

export const deleteSMECompany = createAsyncThunk<
    SMECompany,
    { id: string },
    { state: RootState }
>("dashboard/deleteSMECompany", async ({ id }, { rejectWithValue }) => {
    try {
        // Assuming there's a function to delete SMECompany by ID
        const deletedSME = await deleteSMECompanyAction(id);

        return deletedSME;
    } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : "Failed to delete SME Company");
    }
});

export const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        resetDashboard: () => {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(setDashboard.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(setDashboard.fulfilled, (state, action) => {
                state.isLoading = false;
                state.SWE = action.payload.SWE;
                state.organization = action.payload.organization;
                state.orgType = action.payload.orgType;
                state.userId = action.payload.userId;
                state.organizationId = action.payload.organizationId;
            })
            .addCase(setDashboard.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteSMECompany.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteSMECompany.fulfilled, (state, action) => {
                state.isLoading = false;
                state.SWE = state.SWE.filter(sme => sme.id !== action.payload.id);
            })
            .addCase(deleteSMECompany.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { resetDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;