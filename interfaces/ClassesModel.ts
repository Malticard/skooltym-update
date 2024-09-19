export interface ClassStream {
    _id: string;
    stream_name: string; // Name of the stream (e.g., "Diamond")
}

export interface SchoolClass {
    _id: string;
    school: string; // School ID
    class_name: string; // Class name (e.g., "Play Group")
    class_streams: ClassStream[]; // Array of class streams
    isComplete: boolean; // Indicates if the class record is complete
    isDeleted: boolean; // Indicates if the class record is deleted
    createdAt: string; // Creation timestamp (ISO string)
    updatedAt: string; // Update timestamp (ISO string)
    __v: number; // Version field (if using Mongoose or similar schema system)
}

export interface ClassResponse {
    totalDocuments: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    results: SchoolClass[];
}
