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
import { Role } from '@/interfaces/RolesModel';
import { StudentsNotPaginated } from '@/interfaces/StudentsNonPaginated';
import { GuardianResponse } from '@/interfaces/GuardiansModel';
import { DropoffRecordsResponse } from '@/interfaces/DropOff';
import { PickupResponse } from '@/interfaces/pickUp';
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

export async function fetchSettings(): Promise<SettingsModel> {
    let data = JSON.parse(localStorage.getItem("skooltym_user") as string);
    const response = await axios.get(`${AppUrls.settings}${data.school}`);
    return (response.data[0]);
}
// function to update settings
export async function createSettings(data: FormData): Promise<any> {
    try {
        let response = await axios.post(AppUrls.addSettings, data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.toString());
    }
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
export async function fetchDropOffs(page = 1, limit = 20): Promise<DropoffRecordsResponse> {
    let data = JSON.parse(localStorage.getItem("skooltym_user") as string);
    try {
        let response = await axios.get(AppUrls.getDropOffs + data.school + `?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.toString());
    }
}
// fetch pick ups
export async function fetchPickUps(page = 1, limit = 20): Promise<PickupResponse> {
    let data = JSON.parse(localStorage.getItem("skooltym_user") as string);
    try {
        let response = await axios.get(AppUrls.getPickUps + data.school + `?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.toString());
    }
}
// fetch pending overtime data
export async function fetchPendingOvertimeData(page = 1, limit = 20): Promise<any> {
    let data = JSON.parse(localStorage.getItem("skooltym_user") as string);
    try {
        let response = await axios.get(AppUrls.pendingOvertime + data.school + `?page=${page}&limit=${limit}`);
        // return OvertimeModel.fromJSON(response.data);
        return response;
    } catch (error: any) {
        throw new Error(error.toString());
    }
}
// fetch cleared overtime data
export async function fetchClearedOvertimeData(page = 1, limit = 20): Promise<any> {
    let school = JSON.parse(localStorage.getItem("skooltym_user") as string).school;
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
    const pendingOvertimes = await fetchPendingOvertimeData(1, 150);
    const clearedOvertimes = await fetchClearedOvertimeData(1, 150);

    const dashboardData: DashboardItem[] = [
        {
            label: "DROP OFFS",
            value: drops.totalDocuments,
            icon: "assets/icons/004-playtime.svg",
            page: "/dashboard/DropOffs",
        },
        {
            label: "PICK UPS",
            value: picks.totalDocuments,
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
            value: pendingOvertimes.data.totalDocuments,
            icon: "assets/icons/005-overtime.svg",
            page: "/dashboard/PendingOvertime",
        },
        // Commented out in the original code
        {
            label: "PAYMENTS",
            value: pendingOvertimes.data.totalDocuments,
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

    try {
        let response = await axios.post(AppUrls.updateStudent + id, data);
        return response.data;
    } catch (error: any) {
        console.log(error);
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
export async function fetchClasses(page = 1, limit = 15): Promise<ClassPaginatedResult> {
    let data = JSON.parse(localStorage.getItem("skooltym_user") as string);
    console.log("school id", data.school)
    try {
        let response = await fetch(`${AppUrls.getClasses}${data.school}?page=${page}&pageSize=${limit}}`);
        // console.log("class data", response);
        return response.json();

    } catch (error: any) {
        throw new Error(error.toString());
    }
}
// function to post class data to server
export async function postClassData(data: FormData): Promise<any> {
    try {
        let response = await axios.post(AppUrls.addClass, {
            school: data.get('school'),
            class_name: data.get('class_name'),
            class_streams: data.get('class_streams'),
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.toString());
    }
}
// update class data
export async function updateClassData(data: FormData, id: any): Promise<any> {
    try {
        let response = await axios.post(AppUrls.updateClass + id, data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.toString());
    }
}
// delete class data
export async function deleteClassData(id: string): Promise<any> {
    try {
        let response = await axios.delete(AppUrls.deleteClass + id);
        return response.data;
    } catch (error: any) {
        throw new Error(error.toString());
    }
}
// ----------------- end of class data ------------

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
// post stream data
export async function postStreamData(data: FormData): Promise<any> {
    try {
        let response = await axios.post(AppUrls.addStream, {
            school: data.get('school'),
            stream_name: data.get('stream_name')
        });
        return response.data;
    } catch (error: any) {
        console.dir(error)
        throw new Error(error.toString());
    }
}
// update stream data
export async function updateStreamData(data: FormData, id: any): Promise<any> {
    try {
        let response = await axios.patch(AppUrls.updateStream + id, {
            stream_name: data.get('stream_name')
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.toString());
    }
}
// delete stream data
export async function deleteStreamData(id: string): Promise<any> {
    try {
        let response = await axios.delete(AppUrls.deleteStream + id);
        return response.data;
    } catch (error: any) {
        throw new Error(error.toString());
    }
}
// ----------------- end of stream data ------------


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
        console.dir(error);
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
export async function fetchRoles(): Promise<Role[]> {
    try {
        let response = await axios.get(AppUrls.roles);
        return response.data;
    } catch (error: any) {
        throw new Error(error.toString());
    }
}
//-------- end of roles ---------------------

// ============= guardians
export async function fetchGuardians(page = 1, limit = 15): Promise<GuardianResponse> {
    let data = JSON.parse(localStorage.getItem("skooltym_user") as string);
    try {
        let response = await axios.get(`${AppUrls.getGuardians}${data.school}?page=${page}&pageSize=${limit}}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.toString());
    }
}
// function to post guardian data to server
export async function postGuardianData(data: FormData): Promise<any> {
    try {
        let response = await axios.post(AppUrls.addGuardian, data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.toString());
    }
}
// update guardian data
export async function updateGuardianData(data: FormData, id: any): Promise<any> {
    try {
        let response = await axios.post(AppUrls.updateGuardian + id, data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.toString());
    }
}
// delete guardian data
export async function deleteGuardianData(id: string): Promise<any> {
    try {
        let response = await axios.delete(AppUrls.deleteGuardian + id);
        return response.data;
    } catch (error: any) {
        throw new Error(error.toString());
    }
}
// ------------- no paginated students
export async function fetchStudentsNoPaginate(): Promise<StudentsNotPaginated[]> {
    let data = JSON.parse(localStorage.getItem("skooltym_user") as string);
    try {
        let response = await axios.get(`${AppUrls.studentsNotPaginated}${data.school}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.toString());
    }
}
// ----------------- end of guardian data ------------

// pending Overtime
export async function fetchSpecificOvertime(page = 1, limit = 20): Promise<OvertimeModel> {
    let data = JSON.parse(localStorage.getItem("skooltym_user") as string);
    try {
        let response = await axios.get(AppUrls.pendingOvertime + data.school + "?page=" + page + "&limit=" + limit);
        return (response.data);
    } catch (error: any) {
        throw new Error(error.toString());
    }
}
// cleared overtime
export async function fetchClearedOvertime(page = 1, limit = 20): Promise<OvertimeModel> {
    let data = JSON.parse(localStorage.getItem("skooltym_user") as string);
    try {
        let response = await axios.get(AppUrls.clearedOvertime + data.school + "?page=" + page + "&limit=" + limit);
        return (response.data);
    } catch (error: any) {
        throw new Error(error.toString());
    }
}

// payments
export async function fetchPayments(page = 1, limit = 20): Promise<any> {
    let data = JSON.parse(localStorage.getItem("skooltym_user") as string);
    try {
        let response = await axios.get(AppUrls.getPayment + data.school + "?page=" + page + "&limit=" + limit);
        return response.data;
    } catch (error: any) {
        throw new Error(error.toString());
    }
}
// get drop offs
export async function fetchSpecificDropOffs(page = 1, limit = 20): Promise<any> {
    let data = JSON.parse(localStorage.getItem("skooltym_user") as string);
    try {
        let response = await axios.get(AppUrls.getDropOffs + data.school + "?page=" + page + "&limit=" + limit);
        return response.data;
    } catch (error: any) {
        throw new Error(error.toString());
    }
}
// get pick ups
export async function fetchSpecificPickUps(page = 1, limit = 20): Promise<any> {
    let data = JSON.parse(localStorage.getItem("skooltym_user") as string);
    try {
        let response = await axios.get(AppUrls.pickUps + data.school + "?page=" + page + "&limit=" + limit);
        return response.data;
    } catch (error: any) {
        throw new Error(error.toString());
    }
}
//------------------------------------------------------`