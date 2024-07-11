// To parse this data:
//
//   import { Convert } from "./file";
//
//   const classDataModel = Convert.toClassDataModel(json);

export interface ClassDataModel {
    class_name: string;
    class_streams: ClassStream[];
    class_students: ClassStudent[];
}

export interface ClassStream {
    _id: string;
    school: string;
    stream_name: string;
    isComplete: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

export interface ClassStudent {
    _id: string;
    school: string;
    _class: string;
    guardians: any[];
    student_fname: string;
    student_lname: string;
    other_name: string;
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
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

export interface StudentKey {
    key: number;
    _id: string;
}

// Converts JSON strings to/from your types
export class ClassDataModelConvert {
    public static toClassDataModel(json: string): ClassDataModel[] {
        return JSON.parse(json);
    }

    public static classDataModelToJson(value: ClassDataModel[]): string {
        return JSON.stringify(value);
    }
}
