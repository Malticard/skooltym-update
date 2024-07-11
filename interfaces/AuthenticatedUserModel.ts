// To parse this data:
//
//   import { Convert, AuthenticatedUserModel } from "./file";
//
//   const authenticatedUserModel = Convert.toAuthenticatedUserModel(json);

export interface AuthenticatedUserModel {
    id: string;
    staff_email: string;
    fname: string;
    lname: string;
    contact: number;
    profile_pic: string;
    role: string;
    school: string;
    school_badge: string;
    schoolName: string;
    schoolEmail: string;
    isNewUser: boolean;
    _token: string;
    isDeleted: boolean;
}

// Converts JSON strings to/from your types
export class AuthenticatedUserModelConvert {
    public static toAuthenticatedUserModel(json: string): AuthenticatedUserModel {
        return JSON.parse(json);
    }

    public static authenticatedUserModelToJson(value: AuthenticatedUserModel): string {
        return JSON.stringify(value);
    }
}
