export interface SettingsModel {
    clockInClockOut: boolean;
    id: string;
    schoolId: string;
    dropOffStartTime: string;
    dropOffEndTime: string;
    dropOffAllowance: string;
    pickUpStartTime: string;
    pickUpEndTime: string;
    pickUpAllowance: string;
    halfDayPickUpStartTime: string;
    halfDayPickUpEndTime: string;
    halfDayPickUpAllowance: string;
    allowOvertime: boolean;
    overtimeRate: number;
    overtimeRateCurrency: string;
    overtimeInterval: string;
    settingsKey: SettingsKey[];
    isComplete: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    v: number;
}

export interface SettingsKey {
    key: number;
    id: string;
}

export function settingsModelFromJson(str: string): SettingsModel[] {
    return JSON.parse(str).map((x: any) => SettingsModel.fromJson(x));
}

export function settingsModelToJson(data: SettingsModel[]): string {
    return JSON.stringify(data.map(x => x.toJson()));
}

export class SettingsModel implements SettingsModel {
    constructor(
        public clockInClockOut: boolean,
        public id: string,
        public schoolId: string,
        public dropOffStartTime: string,
        public dropOffEndTime: string,
        public dropOffAllowance: string,
        public pickUpStartTime: string,
        public pickUpEndTime: string,
        public pickUpAllowance: string,
        public halfDayPickUpStartTime: string,
        public halfDayPickUpEndTime: string,
        public halfDayPickUpAllowance: string,
        public allowOvertime: boolean,
        public overtimeRate: number,
        public overtimeRateCurrency: string,
        public overtimeInterval: string,
        public settingsKey: SettingsKey[],
        public isComplete: boolean,
        public isDeleted: boolean,
        public createdAt: Date,
        public updatedAt: Date,
        public v: number
    ) { }

    static fromJson(json: any): SettingsModel {
        return new SettingsModel(
            json.clock_in_clock_out,
            json._id,
            json.school_id,
            json.drop_off_start_time,
            json.drop_off_end_time,
            json.drop_off_allowance,
            json.pick_up_start_time,
            json.pick_up_end_time,
            json.pick_up_allowance,
            json.halfDay_pick_up_start_time,
            json.halfDay_pick_up_end_time,
            json.halfDay_pick_up_allowance,
            json.allow_overtime,
            json.overtime_rate,
            json.overtime_rate_currency,
            json.overtime_interval,
            json.settings_key.map((x: any) => SettingsKey.fromJson(x)),
            json.isComplete,
            json.isDeleted,
            new Date(json.createdAt),
            new Date(json.updatedAt),
            json.__v
        );
    }

    toJson(): any {
        return {
            clock_in_clock_out: this.clockInClockOut,
            _id: this.id,
            school_id: this.schoolId,
            drop_off_start_time: this.dropOffStartTime,
            drop_off_end_time: this.dropOffEndTime,
            drop_off_allowance: this.dropOffAllowance,
            pick_up_start_time: this.pickUpStartTime,
            pick_up_end_time: this.pickUpEndTime,
            pick_up_allowance: this.pickUpAllowance,
            halfDay_pick_up_start_time: this.halfDayPickUpStartTime,
            halfDay_pick_up_end_time: this.halfDayPickUpEndTime,
            halfDay_pick_up_allowance: this.halfDayPickUpAllowance,
            allow_overtime: this.allowOvertime,
            overtime_rate: this.overtimeRate,
            overtime_rate_currency: this.overtimeRateCurrency,
            overtime_interval: this.overtimeInterval,
            settings_key: this.settingsKey.map(x => x.toJson()),
            isComplete: this.isComplete,
            isDeleted: this.isDeleted,
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString(),
            __v: this.v
        };
    }
}

export class SettingsKey implements SettingsKey {
    constructor(
        public key: number,
        public id: string
    ) { }

    static fromJson(json: any): SettingsKey {
        return new SettingsKey(
            json.key,
            json._id
        );
    }

    toJson(): any {
        return {
            key: this.key,
            _id: this.id
        };
    }
}