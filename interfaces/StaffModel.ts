export interface StaffKey {
    key: string | null;
    _id: string;
}

export interface StaffRole {
    role_type: string;
}

export interface Staff {
    _id: string;
    staff_school: string;
    staff_fname: string;
    staff_lname: string;
    staff_contact: number;
    staff_email: string;
    staff_role: StaffRole;
    staff_gender: string;
    staff_profilePic: string;
    staff_password: string;
    staff_key: StaffKey[];
    is_first_time_user: boolean;
    isComplete: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface StaffResponse {
    totalDocuments: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    results: Staff[];
}
