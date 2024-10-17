class AppUrls {
    static devURL: string = "http://127.0.0.1:5050/"; //"http://13.127.169.59:5050/";// "http://127.0.0.1:5050/";//
    static imageUrl: string = "assets/images/";
    static iconUrl: string = "assets/icons/";
    static liveImages: string = "http://13.127.169.59:5050/image/images/";

    // post urls
    static login: string = `${AppUrls.devURL}post/staff-login`;
    static addClass: string = `${AppUrls.devURL}post/class/create`;
    static addStaff: string = `${AppUrls.devURL}post/staff/create`;
    static addSchool: string = `${AppUrls.devURL}post/schools/create`;
    static addStudent: string = `${AppUrls.devURL}post/students/create`;
    static addGuardian: string = `${AppUrls.devURL}post/guardians/create`;
    static addSettings: string = `${AppUrls.devURL}post/settings/create`;
    static addPickUp: string = `${AppUrls.devURL}post/pickup/create`;
    static addDropOff: string = `${AppUrls.devURL}post/dropoff/create`;
    static registerOvertime: string = `${AppUrls.devURL}post/overtime/create`;
    static addStream: string = `${AppUrls.devURL}post/stream/create`;
    static addPayment: string = `${AppUrls.devURL}post/payments/create`;

    // get urls
    static roles: string = `${AppUrls.devURL}get/roles/`;
    static schools: string = `${AppUrls.devURL}get/schools`;
    static students: string = `${AppUrls.devURL}get/students/`;
    static overtime: string = `${AppUrls.devURL}get/overtime/`;
    static staff: string = `${AppUrls.devURL}get/staff/`;
    static settings: string = `${AppUrls.devURL}get/settings/`;
    static years: string = `${AppUrls.devURL}get/years/`;
    static getStudents: string = `${AppUrls.devURL}get/students/`;
    static getGuardians: string = `${AppUrls.devURL}get/guardians/`;
    static getPickUps: string = `${AppUrls.devURL}get/pickup/`;
    static getDropOffs: string = `${AppUrls.devURL}get/dropoff/`;
    static getClasses: string = `${AppUrls.devURL}get/class/`;
    static getStreams: string = `${AppUrls.devURL}get/stream/`;
    static getPayment: string = `${AppUrls.devURL}get/payments/`;

    // fetch specific
    static specificOvertime: string = `${AppUrls.devURL}specific/overtime/`;
    static getGuardian: string = `${AppUrls.devURL}specific/guardians/`;
    static getStudent: string = `${AppUrls.devURL}specific/students/`;
    static pickUps: string = `${AppUrls.devURL}specific/pickup/`;
    static specificDropOffs: string = `${AppUrls.devURL}specific/dropoff/`;
    static getOtherGuardians: string = `${AppUrls.devURL}specific/otherGuardians/`;
    static specificClass: string = `${AppUrls.devURL}specific/class/`;
    static specificStream: string = `${AppUrls.devURL}specific/stream/`;
    static specificPayment: string = `${AppUrls.devURL}specific/payments/`;

    // delete
    static deleteStaff: string = `${AppUrls.devURL}delete/staff/`;
    static deleteStudent: string = `${AppUrls.devURL}delete/students/`;
    static deleteGuardian: string = `${AppUrls.devURL}delete/guardians/`;
    static deletePickUp: string = `${AppUrls.devURL}delete/pickup/`;
    static deleteDropOff: string = `${AppUrls.devURL}delete/dropoff/`;
    static deleteClass: string = `${AppUrls.devURL}delete/class/`;
    static deleteStream: string = `${AppUrls.devURL}delete/stream/`;
    static deletePayment: string = `${AppUrls.devURL}delete/payments/`;

    // update
    static updateStaff: string = `${AppUrls.devURL}update/staff/`;
    static updateStudent: string = `${AppUrls.devURL}update/students/`;
    static updateGuardian: string = `${AppUrls.devURL}update/guardians/`;
    static updatePickUp: string = `${AppUrls.devURL}update/pickup/`;
    static updateDropOff: string = `${AppUrls.devURL}update/dropoff/`;
    static updateClass: string = `${AppUrls.devURL}update/class/`;
    static updateStream: string = `${AppUrls.devURL}update/stream/`;
    static updateSettings: string = `${AppUrls.devURL}update/settings/`;
    static updateOvertime: string = `${AppUrls.devURL}update/overtime/`;
    static updatePayment: string = `${AppUrls.devURL}update/payments/`;
    static updateStaffFirstTime: string = `${AppUrls.devURL}update/staff-first-time/`;

    static setPass: string = `${AppUrls.devURL}password/set-password/`;
    static forgotPassword: string = `${AppUrls.devURL}password/forgot-password`;
    static verifyOtp: string = `${AppUrls.devURL}password/get-otp/`;
    static setPassword: string = `${AppUrls.devURL}password/set-password/`;
    static results: string = `${AppUrls.devURL}results/scanned-results/`;

    // dashboard
    static dashboard: string = `${AppUrls.devURL}dashboard/data/`;

    // searches
    static searchStudents: string = `${AppUrls.devURL}search/search-students/`;
    static searchStaff: string = `${AppUrls.devURL}search/search-staff/`;
    static searchGuardians: string = `${AppUrls.devURL}search/search-guardians/`;
    static searchClass: string = `${AppUrls.devURL}search/search-classes/`;
    static searchStreams: string = `${AppUrls.devURL}search/search-streams/`;
    static searchPickUps: string = `${AppUrls.devURL}search/search-pickups/`;
    static searchDropOffs: string = `${AppUrls.devURL}search/search-dropoffs/`;
    static searchPayments: string = `${AppUrls.devURL}search/search-payments/`;
    static searchClearedOvertime: string = `${AppUrls.devURL}search/cleared-overtime/`;
    static searchPendingOvertime: string = `${AppUrls.devURL}search/pending-overtime/`;

    // overtimes
    static pendingOvertime: string = `${AppUrls.devURL}overtime/pending/`;
    static clearedOvertime: string = `${AppUrls.devURL}overtime/cleared/`;
    static studentsNotPaginated: string = `${AppUrls.devURL}get/not-paginated-students/`;
    // get clocking staff
    static clockingStaff: string = `${AppUrls.devURL}clocking/staff`;
    static clockingStudent: string = `${AppUrls.devURL}clocking/student`;
}

export default AppUrls;