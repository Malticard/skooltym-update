import axios from "axios";
import AppUrls from "./apis";
import { StaffClockingResponse } from "@/interfaces/StaffClockingModel";
import { StudentClockingResponse } from "@/interfaces/StudentClockingModel";

export const staffClocking = async (): Promise<StaffClockingResponse> => {
    try {
        const school = JSON.parse(localStorage.getItem("skooltym_user") as string).school;
        const response = await axios.get(AppUrls.clockingStaff + "/" + school);
        return response.data;
    } catch (error: any) {
        throw new Error(error.toString());
    }
}

// student clocking
export const studentClocking = async (): Promise<StudentClockingResponse> => {
    try {
        const school = JSON.parse(localStorage.getItem("skooltym_user") as string).school;
        const response = await axios.get(AppUrls.clockingStudent + "/" + school);
        return response.data;
    } catch (err: any) {
        throw new Error(err.toString());
    }
}