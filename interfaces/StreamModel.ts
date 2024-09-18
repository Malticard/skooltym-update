export interface Stream {
    _id: string;
    school: string;
    stream_name: string;
    isComplete: boolean;
    isDeleted: boolean;
    createdAt: string; // ISO 8601 string
    updatedAt: string; // ISO 8601 string
    __v: number;
}

export interface PaginatedStreamResult {
    totalDocuments: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    results: Stream[];
}

