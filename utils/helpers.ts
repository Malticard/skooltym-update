import axios from "axios";
import AppUrls from "./apis";
import { StudentsModel } from "@/interfaces/StudentsModel";

// utils section
export async function fetchStudentsInStream(id: string): Promise<StudentsModel> {
    try {
        const response = await axios.get(`${AppUrls.studentsInStream}/${id}`);
        console.log('response', response.data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.message);
    }
}