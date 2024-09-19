export interface GuardianKey {
    key: string | null;
    _id: string;
}

export interface Guardian {
    _id: string;
    students: string[]; // Array of student IDs
    school: string; // School ID
    relationship: string; // Guardian's relationship to students (e.g., "Guardian")
    type: string; // Education type (e.g., "Secondary")
    guardian_fname: string; // Guardian's first name
    guardian_lname: string; // Guardian's last name
    guardian_contact: number; // Guardian's contact number
    guardian_email: string; // Guardian's email address
    guardian_gender: string; // Guardian's gender (e.g., "Male")
    guardian_profile_pic: string; // URL to the guardian's profile picture
    isDeleted: boolean; // Indicates if the guardian record is deleted
    deviceId: string; // Device ID (if applicable)
    guardian_key: GuardianKey[]; // Array of guardian key objects
    isComplete: boolean; // Indicates if the guardian record is complete
    createdAt: string; // Creation timestamp (ISO string)
    updatedAt: string; // Update timestamp (ISO string)
    __v: number; // Version field (if using Mongoose or similar schema system)
}

export interface GuardianResponse {
    totalDocuments: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    results: Guardian[];
}
