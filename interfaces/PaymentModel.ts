export interface Guardian {
    _id: string;
    guardian_fname: string;
    guardian_lname: string;
}

export interface Student {
    _id: string;
    username: string;
    student_profile_pic: string;
}

export interface Staff {
    _id: string;
    staff_fname: string;
    staff_lname: string;
}

export interface Payment {
    _id: string;
    school: string;
    guardian: Guardian;
    student: Student;
    staff: Staff;
    date_of_payment: string;
    payment_method: string;
    paid_amount: number;
    comment: string;
    isComplete: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

// If your API returns paginated results, you can define a generic PaginatedResponse:

export interface PaginatedResponse {
    totalDocuments: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    results: Payment[];
}
