export interface Student {
    _id: string;
    school: string;
    _class: {
        _id: string;
        class_name: string;
    };
    guardians: any[]; // Adjust type if more details about guardians are available
    student_fname: string;
    student_lname: string;
    other_name: string;
    username: string;
    isVanStudent: boolean;
    stream: {
        _id: string;
        stream_name: string;
    };
    student_gender: "Male" | "Female"; // Assuming only these two options; update if necessary
    student_profile_pic: string;
    isHalfDay: boolean;
    isDropped: boolean;
    isPicked: boolean;
    student_key: {
        key: number;
        _id: string;
    }[];
    isComplete: boolean;
    isDeleted: boolean;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    __v: number;
}

export type StudentsResponse = Student[];
