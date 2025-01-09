interface StaffKey {
    key: string | null;
    _id: string;
}

interface Staff {
    _id: string;
    staff_school: string;
    staff_fname: string;
    staff_lname: string;
    staff_contact: number;
    staff_email: string;
    staff_role: string;
    staff_gender: string;
    staff_profilePic: string;
    staff_password: string;
    staff_key: StaffKey[];
    isComplete: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
    is_first_time_user: boolean;
}

export interface StaffLateResult {
    _id: string;
    school: string;
    staff: Staff;
    time_in: string;
    late_charge: number;
    late_charge_currency: string;
    status: number;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface StaffLatePaginatedResponse {
    page: number;
    pages: number;
    limit: number;
    total: number;
    results: StaffLateResult[];
}
