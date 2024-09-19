export interface StudentKey {
    key: string | null;
    _id: string;
}

export interface ClassInfo {
    class_name: string;
}

export interface StreamInfo {
    stream_name: string;
}

export interface StudentsNotPaginated {
    _id: string;
    school: string; // School ID
    _class: ClassInfo; // Class information
    guardians: string[]; // Array of guardian IDs (empty if no guardians)
    student_fname: string; // Student's first name
    student_lname: string; // Student's last name
    username: string; // Username of the student
    isVanStudent: boolean; // Indicates if the student uses a van service
    stream: StreamInfo; // Stream information
    student_gender: string; // Student's gender (e.g., "Male")
    student_profile_pic: string; // URL to the student's profile picture
    isHalfDay: boolean; // Indicates if the student is half-day
    isDropped: boolean; // Indicates if the student has been dropped off
    isPicked: boolean; // Indicates if the student has been picked up
    student_key: StudentKey[]; // Array of student key objects
    isComplete: boolean; // Indicates if the student record is complete
    isDeleted: boolean; // Indicates if the student record is deleted
    createdAt: string; // Creation timestamp (ISO string)
    updatedAt: string; // Update timestamp (ISO string)
    __v: number; // Version field (if using Mongoose or a similar schema system)
}
