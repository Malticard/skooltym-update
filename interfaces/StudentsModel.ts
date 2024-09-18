// To parse this data:
//
//   import { Convert, StudentsModel } from "./file";
//
//   const studentsModel = Convert.toStudentsModel(json);
export interface StudentsModel {
    totalDocuments: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    results: StudentResult[];
}

export interface StudentResult {
    _id: string;  // Update to match API
    school: string;
    _class: Class;
    guardians: any[];
    student_fname: string;  // Use snake_case
    student_lname: string;  // Use snake_case
    other_name: string;
    username: string;
    isVanStudent: boolean;
    stream: Stream;
    student_gender: string;
    student_profile_pic: string;
    isHalfDay: boolean;
    isDropped: boolean;
    isPicked: boolean;
    student_key: StudentKey[];
    isComplete: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    __v: number;  // Match the API response with double underscores
}

export interface Class {
    class_name: string;
}

export interface Stream {
    stream_name: string;
}

export interface StudentKey {
    key: null;
    _id: string;
}
export interface StudentKey {
    key: null;
    id: string;
}

// Converts JSON strings to/from your types
export class StudentModelConvert {
    public static toStudentsModel(json: string): StudentsModel {
        return JSON.parse(json);
    }

    public static studentsModelToJson(value: StudentsModel): string {
        return JSON.stringify(value);
    }
}
