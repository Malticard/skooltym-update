interface Student {
    _id: string;
    student_fname: string;
    student_lname: string;
    student_profile_pic: string;
}

interface AuthorizedBy {
    staff_fname: string;
    staff_lname: string;
}

interface DroppedBy {
    guardian_fname: string;
    guardian_lname: string;
}

interface DropoffKey {
    key: number;
    _id: string;
}

export interface DropoffRecord {
    _id: string;
    school_name: string;
    student_name: Student;
    drop_off_time: string;
    dropped_by: DroppedBy | null;
    authorized_by: AuthorizedBy;
    comments: string;
    dropoff_key: DropoffKey[];
    isComplete: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface DropoffRecordsResponse {
    totalDocuments: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    results: DropoffRecord[];
}
