export interface SettingsModel {
    _id: string;
    school_id: string;
    drop_off_start_time: string;
    drop_off_end_time: string;
    drop_off_allowance: string;
    pick_up_start_time: string;
    pick_up_end_time: string;
    pick_up_allowance: string;
    halfDay_pick_up_start_time: string;
    halfDay_pick_up_end_time: string;
    halfDay_pick_up_allowance: string;
    // clock_in_start_time, clock_in_end_time, clock_out_start_time, clock_out_end_time 
    clock_in_start_time: string;
    clock_in_end_time: string;
    clock_out_start_time: string;
    clock_out_end_time: string;
    allow_overtime: boolean;
    overtime_rate: number;
    overtime_rate_currency: string;
    overtime_interval: string;
    settings_key: {
        key: number;
        _id: string;
    }[];
    isComplete: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
    clock_in_clock_out: boolean;
}
