import { useState, useCallback, useEffect } from "react";
import { getUserDashboardStats } from "../services/additional";

export const useUserDashboardStats = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUserDashboardStats = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getUserDashboardStats();
            setData(result);
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to fetch dashboard stats"
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUserDashboardStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { data, loading, error, refetch: fetchUserDashboardStats };
};
