export interface StudentKey {
    key: string | null;
    _id: string;
}

export interface Student {
    _id: string;
    school: string;
    _class: string;
    guardians: any[];
    student_fname: string;
    student_lname: string;
    username: string;
    isVanStudent: boolean;
    stream: string;
    student_gender: string;
    student_profile_pic: string;
    isHalfDay: boolean;
    isDropped: boolean;
    isPicked: boolean;
    student_key: StudentKey[];
    isComplete: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface StudentClockingResult {
    _id: string;
    school: string;
    student: Student;
    clock_in: string;
    clock_out: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface StudentClockingResponse {
    page: number;
    limit: number;
    total: number;
    results: StudentClockingResult[];
}
