interface StaffDetails {
    _id: string;
    staff_school: string;
    staff_fname: string;
    staff_lname: string;
    staff_contact: number;
    staff_email: string;
    staff_role: { role_type: string };
    staff_gender: string;
    staff_profilePic: string;
    staff_password: string;
    staff_key: {
        key: string | null;
        _id: string;
    }[];
    isComplete: boolean;
    isDeleted: boolean;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    __v: number;
    is_first_time_user: boolean;
}

export interface StaffLateChargesWithDetails {
    staffId: StaffDetails;
    period: {
        from: string; // ISO date string
        to: string; // ISO date string
    };
    accumulation: {
        totalCharges: number;
        totalHrsLate: number;
        totalMinsLate: number;
        late_rate: number;
        late_interval: number;
        numberOfRecords: number;
    };
}
