// Helper function to parse JSON dates
const parseDate = (dateString: string): Date => new Date(dateString);

export interface OvertimeResponse {
    totalDocuments: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    results: OvertimeRecord[];
}

export interface OvertimeRecord {
    _id: string;
    student: Student;
    school: string;
    guardian: Guardian;
    staff: Staff;
    cleared_by: string;
    actual_time: string;
    overtime_charge: number;
    overtime_rate: number;
    overtime_currency: string;
    overtime_interval: string;
    status: string;
    comments: string;
    delayedBy: string;
    isComplete: boolean;
    isDeleted: boolean;
    overtime_key: any[]; // Can be refined if structure is known
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface Student {
    _id: string;
    student_fname: string;
    student_lname: string;
    student_profile_pic: string;
}

export interface Guardian {
    _id: string;
    guardian_fname: string;
    guardian_lname: string;
}

export interface Staff {
    staff_fname: string;
    staff_lname: string;
}