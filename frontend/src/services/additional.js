import api from "../lib/api";

export const getUserDashboardStats = async () => {
    const { data } = await api.get("/additional/user-dashboard-stats");
    return data;
};
