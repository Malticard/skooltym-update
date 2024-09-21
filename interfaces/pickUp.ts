interface PickupSettings {
    _id: string;
    pick_up_end_time: string;
    pick_up_allowance: string;
    overtime_rate: number;
    overtime_interval: string;
}

interface StudentName {
    student_fname: string;
    student_lname: string;
    student_profile_pic: string;
}

interface AuthorizedBy {
    _id: string;
    staff_fname: string;
    staff_lname: string;
}

interface PickedBy {
    guardian_fname?: string;
    guardian_lname?: string;
}

interface PickupKey {
    key: number;
    _id: string;
}

export interface PickupRecord {
    _id: string;
    school: string;
    settings: PickupSettings;
    student_name: StudentName;
    pick_up_time: string;
    picked_by: PickedBy | null;
    authorized_by: AuthorizedBy;
    comments: string;
    overtime_charge: number;
    pickup_key: PickupKey[];
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface PickupResponse {
    totalDocuments: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    results: PickupRecord[];
}
