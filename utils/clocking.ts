import axios from "axios";
import AppUrls from "./apis";
import { StaffClockingResponse } from "@/interfaces/StaffClockingModel";
import { StudentClockingResponse } from "@/interfaces/StudentClockingModel";

export const staffClockingIn = async (page = 1, limit = 10): Promise<StaffClockingResponse> => {
    try {
        const school = JSON.parse(localStorage.getItem("skooltym_user") as string).school;
        const response = await axios.get(`${AppUrls.clockingStaffIn}/${school}?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.toString());
    }
}
// clocking out
export const staffClockingOut = async (page = 1, limit = 10): Promise<StaffClockingResponse> => {
    try {
        const school = JSON.parse(localStorage.getItem("skooltym_user") as string).school;
        const response = await axios.get(`${AppUrls.clockingStaffOut}/${school}?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.toString());
    }
}

// student clocking
export const studentClockingIn = async (page = 1, limit = 10): Promise<StudentClockingResponse> => {
    try {
        const school = JSON.parse(localStorage.getItem("skooltym_user") as string).school;
        const response = await axios.get(`${AppUrls.clockingStudentIn}/${school}?page=${page}&limit=${limit}`);
        return response.data;
    } catch (err: any) {
        throw new Error(err.toString());
    }
}

// student clocking
export const studentClockingOut = async (page = 1, limit = 10): Promise<StudentClockingResponse> => {
    try {
        const school = JSON.parse(localStorage.getItem("skooltym_user") as string).school;
        const response = await axios.get(`${AppUrls.clockingStudentOut}/${school}?page=${page}&limit=${limit}`);
        return response.data;
    } catch (err: any) {
        throw new Error(err.toString());
    }
}