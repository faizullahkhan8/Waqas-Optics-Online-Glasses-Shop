import { useQuery } from "@tanstack/react-query";
import { getUserDashboardStats } from "../services/additional";
import toast from "react-hot-toast";

export const useUserDashboardStats = () => {
    return useQuery({
        queryKey: ["userDashboardStats"],
        queryFn: getUserDashboardStats,
        onError: (error) => {
            toast.error(
                error?.response?.data?.message ||
                    "Failed to load dashboard stats"
            );
        },
    });
};
