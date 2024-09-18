export interface ClassStream {
    _id: string;
    stream_name: string;
}

export interface SchoolClass {
    _id: string;
    school: string;
    class_name: string;
    class_streams: ClassStream[];
    isComplete: boolean;
    isDeleted: boolean;
    createdAt: string; // ISO 8601 string
    updatedAt: string; // ISO 8601 string
    __v: number;
}

export interface ClassPaginatedResult {
    totalDocuments: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    results: SchoolClass[];
}
