export interface RoleKey {
    key: string | null;
    _id: string;
}

export interface Role {
    _id: string;
    role_type: string;
    role_key: RoleKey[];
    isComplete: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

// export type RolesResponse = Role[];
