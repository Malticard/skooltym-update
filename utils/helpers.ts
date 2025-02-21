import axios from "axios";
import AppUrls from "./apis";
import { StudentsModel } from "@/interfaces/StudentsModel";

// utils section
export async function fetchStudentsInStream(id: string, page = 1, limit = 10): Promise<StudentsModel> {
    try {
        const response = await axios.get(`${AppUrls.studentsInStream}/${id}?page=${page}&pageSize=${limit}`);
        console.log('response', response.data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.message);
    }
}