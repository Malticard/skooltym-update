export interface GuardianStudent {
    _id: string;
    school: string;
    _class: string;
    guardians: any[];
    student_fname: string;
    student_lname: string;
    username: string;
    isVanStudent: boolean;
    stream: string;
    student_gender: "Male" | "Female";
    student_profile_pic: string;
    isHalfDay: boolean;
    isDropped: boolean;
    isPicked: boolean;
    student_key: { key: string | null; _id: string }[];
    isComplete: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}
