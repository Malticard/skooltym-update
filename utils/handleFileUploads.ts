import axios from "axios";
import AppUrls from "./apis";

export async function handleFileUploads(type: string, data: FormData) {
    const result = JSON.parse(localStorage.getItem("skooltym_user") as string);
    // console.log(result);
    try {
        const response = await axios.post(AppUrls.uploadFile + type + "/" + result.school, data,);
        return response.data
    } catch (error: any) {
        throw new Error(error.message.toString());
    }
}