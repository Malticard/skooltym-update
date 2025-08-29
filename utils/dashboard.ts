import { ActivitySummary } from "@/interfaces/DashboardStatsInterface";
import axios from "axios";
import AppUrls from "./apis";

export const dashboardStats = async () => {
    try {
        let res = JSON.parse(localStorage.getItem("skooltym_user") as string);
        if (!res || !res.school) {
            throw new Error("School information is missing in user data");
        }
        // console.log("Fetching dashboard stats for school:", res);
        const response = await axios.get(AppUrls.dashboardStats + res.school);
        const data = response.data as ActivitySummary;
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
}