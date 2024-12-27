export interface IStaffSettings {
    school: string; // ObjectId as a string, referenced from "schools"
    staff_clock_in_start?: string; // Optional, default is an empty string
    staff_clock_in_end?: string; // Optional, default is an empty string
    staff_clock_out_start?: string; // Optional, default is an empty string
    staff_clock_out_end?: string; // Optional, default is an empty string
    staff_currency?: string; // Optional, default is "UGX"
    staff_clock_out_allowance: number; // Optional, default is 0
    staff_clock_in_allowance: number; // Optional, default is 0
    staff_overtime: boolean; // Optional, default is false
    staff_overtime_rate?: number; // Optional, default is 0
    staff_interval?: number; // Optional, default is 0
}
