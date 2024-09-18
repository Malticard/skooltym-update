import axios, { AxiosResponse } from 'axios';
// import { format } from 'date-fns';
import AppUrls from './apis';
// import { useRouter } from 'next/navigation';
import { SettingsModel } from '@/interfaces/SettingsModel';
import { DashboardItem } from '@/interfaces/DashboardItem';
import { OvertimeModel } from '@/interfaces/OvertimeModel';
import { ClassDataModel, ClassDataModelConvert } from '@/interfaces/ClassDataModel';
import { StudentModelConvert, StudentsModel } from '@/interfaces/StudentsModel';
import { ClassPaginatedResult } from '@/interfaces/ClassModel';
import { PaginatedStreamResult } from '@/interfaces/StreamModel';
import { StaffResponse } from '@/interfaces/StaffModel';
import { RolesResponse } from '@/interfaces/RolesModel';
// const router = useRouter();
export async function loginUser(email: string, password: string): Promise<AxiosResponse<any, any>> {
    try {
        const response = await axios.post(AppUrls.login, {
            staff_contact: email,
            staff_password: password,
        },);
        return response;
    } catch (err: any) {
        throw new Error(err);
    }
}

// export async function assignRole(role: string): Promise<string> {
//     try {
//         const response = await axios.get(AppUrls.roles);
//         const roles = rolesFromJson(response.data);
//         const result = roles.find(element => element.roleType === role);
//         return result.id;
//     } catch (e) {
//         return Promise.reject("Lost connection to server");
//     }
// }

export async function fetchAndDisplayImage(imageURL: string): Promise<string> {
    return imageURL;
}

export function formatNumber(number: number): string {
    return new Intl.NumberFormat().format(number);
}

export async function fetchSettings(schoolId: string): Promise<SettingsModel> {
    const response = await axios.get(`${AppUrls.settings}${schoolId}`);
    return SettingsModel.fromJson(response.data);
}

export function greetUser(): string {
    const hour = new Date().getHours();
    if (hour > 20) return "Good night";
    if (hour > 15) return "Good evening";
    if (hour < 13) return "Good morning";
    return "Good afternoon";
}
// export function renameFile(fileName: string): string {
//     const fileExtension = fileName.split(".").pop();
//     return `${uuidv4()}.${fileExtension}`;
// }


// fetch drop offs
export async function fetchDropOffs(school: string): Promise<any> {
    try {
        let response = await axios.get(AppUrls.getDropOffs + school);
        return response;
    } catch (error: any) {
        throw new Error(error.toString());
    }
}
// fetch pick ups
export async function fetchPickUps(school: string): Promise<any> {
    try {
        let response = await axios.get(AppUrls.getPickUps + school);
        return response;
    } catch (error: any) {
        throw new Error(error.toString());
    }
}
// fetch pending overtime data
export async function fetchPendingOvertimeData(school: string, limit: number): Promise<any> {
    try {
        let response = await axios.get(AppUrls.pendingOvertime + school + `?limit=${limit}`);
        // return OvertimeModel.fromJSON(response.data);
        return response;
    } catch (error: any) {
        throw new Error(error.toString());
    }
}
// fetch cleared overtime data
export async function fetchClearedOvertimeData(school: string, page: number, limit: number): Promise<any> {
    try {
        let response = await axios.get(AppUrls.clearedOvertime + school + `?page=${page}&limit=${limit}`);
        // return OvertimeModel.fromJSON(response.data);
        return response;
    } catch (error: any) {
        throw new Error(error.toString());
    }
}


export async function fetchDashboardMetaData(): Promise<DashboardItem[]> {
    let data = JSON.parse(localStorage.getItem("skooltym_user") as string);
    const drops = await fetchDropOffs(data.school);
    const picks = await fetchPickUps(data.school);
    const pendingOvertimes = await fetchPendingOvertimeData(data.school, 150);
    const clearedOvertimes = await fetchClearedOvertimeData(data.school, 1, 150);

    const dashboardData: DashboardItem[] = [
        {
            label: "DROP OFFS",
            value: drops.data.totalDocuments,
            icon: "assets/icons/004-playtime.svg",
            page: "/dashboard/DropOffs",
        },
        {
            label: "PICK UPS",
            value: picks.data.totalDocuments,
            icon: "assets/icons/009-student.svg",
            page: "/dashboard/PickUps",
        },
        {
            label: "CLEARED OVERTIME",
            value: clearedOvertimes.data.totalDocuments,
            icon: "assets/icons/002-all.svg",
            page: "/dashboard/ClearedOvertime",

        },
        {
            label: "PENDING OVERTIME",
            value: pendingOvertimes.data.totalDocuments,
            icon: "assets/icons/005-overtime.svg",
            page: "/dashboard/PendingOvertime",

        },
    ];

    const financeData: DashboardItem[] = [
        {
            label: "CLEARED OVERTIME",
            value: clearedOvertimes.data.totalDocuments,
            icon: "assets/icons/005-overtime.svg",
            page: "/dashboard/ClearedOvertime",
        },
        {
            label: "PENDING OVERTIME",
            value: pendingOvertimes.totalDocuments,
            icon: "assets/icons/005-overtime.svg",
            page: "/dashboard/PendingOvertime",
        },
        // Commented out in the original code
        {
            label: "PAYMENTS",
            value: pendingOvertimes.totalDocuments,
            icon: "assets/icons/005-overtime.svg",
            page: "/dashboard/Payments",

        }
    ];

    return data.role === 'Admin' ? dashboardData : financeData;
}

// function to process images
export async function fetchDashBoardData(): Promise<ClassDataModel[]> {
    let data = JSON.parse(localStorage.getItem("skooltym_user") as string);
    try {
        let response = await axios.get(AppUrls.dashboard + data.school);
        return ClassDataModelConvert.toClassDataModel(JSON.stringify(response.data));
    } catch (error: any) {
        throw new Error(error.toString());

    }

}

// ----------------------  students
export async function fetchStudents(page = 1, limit = 15): Promise<StudentsModel> {
    let data = JSON.parse(localStorage.getItem("skooltym_user") as string);
    try {
        let response = await axios.get(`${AppUrls.getStudents}${data.school}?page=${page}&pageSize=${limit}}`);
        return StudentModelConvert.toStudentsModel(JSON.stringify(response.data));
    } catch (error: any) {
        throw new Error(error.toString());
    }
}
// function to post student data to server
export async function postStudentData(data: FormData): Promise<any> {
    try {
        let response = await axios.post(AppUrls.addStudent, data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.toString());
    }
}
// update student data
export async function updateStudentData(data: FormData, id: any): Promise<any> {
    console.log(AppUrls.updateStudent + id);
    try {
        let response = await axios.post(AppUrls.updateStudent + id, data);
        console.log(response.data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.toString());
    }
}
// delete student data
export async function deleteStudentData(id: string): Promise<any> {
    try {
        let response = await axios.delete(AppUrls.deleteStudent + id);
        return response.data;
    } catch (error: any) {
        throw new Error(error.toString());
    }
}
// ------------- end of student data -------------
// --------------------- fetch classes
export async function fetchClasses(page = 1, limit = 10): Promise<ClassPaginatedResult> {
    let data = JSON.parse(localStorage.getItem("skooltym_user") as string);
    try {
        let response = await axios.get(`${AppUrls.getClasses}${data.school}?page=${page}&pageSize=${limit}}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.toString());
    }
}

// ------- fetch stream
export async function fetchStream(page = 1, limit = 20): Promise<PaginatedStreamResult> {
    let data = JSON.parse(localStorage.getItem("skooltym_user") as string);
    try {
        let response = await axios.get(`${AppUrls.getStreams}${data.school}?page=${page}&pageSize=${limit}}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.toString());
    }
}

/// ============ staff
export async function fetchStaff(page = 1, limit = 15): Promise<StaffResponse> {
    let data = JSON.parse(localStorage.getItem("skooltym_user") as string);
    try {
        let response = await axios.get(`${AppUrls.staff}${data.school}?page=${page}&pageSize=${limit}}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.toString());
    }
}
// function to post staff data to server
export async function postStaffData(data: FormData): Promise<any> {
    try {
        let response = await axios.post(AppUrls.addStaff, data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.toString());
    }
}
// update staff data
export async function updateStaffData(data: FormData, id: any): Promise<any> {
    try {
        let response = await axios.post(AppUrls.updateStaff + id, data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.toString());
    }
}
// delete staff data
export async function deleteStaffData(id: string): Promise<any> {
    try {
        let response = await axios.delete(AppUrls.deleteStaff + id);
        return response.data;
    } catch (error: any) {
        throw new Error(error.toString());
    }
}
// ----------------- end of staff data ------------

// ============ roles
export async function fetchRoles(): Promise<RolesResponse> {
    try {
        let response = await axios.get(AppUrls.roles);
        return response.data;
    } catch (error: any) {
        throw new Error(error.toString());
    }
}
//-------- end of roles ---------------------