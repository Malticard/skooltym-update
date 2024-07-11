// Helper function to parse JSON dates
const parseDate = (dateString: string): Date => new Date(dateString);

export interface OvertimeModel {
    totalDocuments: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    results: Overtimes[];
}

export interface Overtimes {
    id: string;
    student: StudentO;
    school: string;
    guardian: GuardianO;
    staff: Staff_;
    overtimeCharge: number;
    status: string;
    comments: string;
    isComplete: boolean;
    overtimeKey: any[];
    createdAt: Date;
    updatedAt: Date;
    v: number;
}

export interface GuardianO {
    id: string;
    guardianFname: string;
    guardianLname: string;
}

export interface Staff_ {
    id: string;
    staffFname: string;
    staffLname: string;
}

export interface StudentO {
    id: string;
    studentFname: string;
    studentLname: string;
    studentProfilePic: string;
}

// Function to parse JSON string to OvertimeModel
function overtimeModelFromJson(jsonString: string): OvertimeModel {
    const json = JSON.parse(jsonString);
    return {
        totalDocuments: json.totalDocuments,
        totalPages: json.totalPages,
        currentPage: json.currentPage,
        pageSize: json.pageSize,
        results: json.results.map((x: any) => overtimesFromJson(x))
    };
}

// Function to convert OvertimeModel to JSON string
function overtimeModelToJson(data: OvertimeModel): string {
    return JSON.stringify(data);
}

// Helper function to parse Overtimes from JSON
function overtimesFromJson(json: any): Overtimes {
    return {
        id: json._id,
        student: studentOFromJson(json.student || {}),
        school: json.school,
        guardian: guardianOFromJson(json.guardian || {}),
        staff: staffFromJson(json.staff || {}),
        overtimeCharge: json.overtime_charge,
        status: json.status,
        comments: json.comments || "",
        isComplete: json.isComplete,
        overtimeKey: json.overtime_key,
        createdAt: parseDate(json.createdAt),
        updatedAt: parseDate(json.updatedAt),
        v: json.__v
    };
}

// Helper function to parse GuardianO from JSON
function guardianOFromJson(json: any): GuardianO {
    return {
        id: json._id || "",
        guardianFname: json.guardian_fname || "",
        guardianLname: json.guardian_lname || ""
    };
}

// Helper function to parse Staff_ from JSON
function staffFromJson(json: any): Staff_ {
    return {
        id: json._id || "",
        staffFname: json.staff_fname || "",
        staffLname: json.staff_lname || ""
    };
}

// Helper function to parse StudentO from JSON
function studentOFromJson(json: any): StudentO {
    return {
        id: json._id || "",
        studentFname: json.student_fname || "",
        studentLname: json.student_lname || "",
        studentProfilePic: json.student_profile_pic || ""
    };
}