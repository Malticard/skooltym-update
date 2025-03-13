import AppUrls from "./apis";
// export students
export function exportStudents() {
    const url = `${AppUrls.exportStudentsRecords}`;
    exportTor("students", url);
}
// export staff
export function exportStaff() {
    const url = `${AppUrls.exportStaffRecords}`;
    exportTor("staff", url);
}
// guardians
export function exportGuardianRecords() {
    const url = AppUrls.exportGuardianRecords;
    exportTor("guardians", url);
}
// drop offs
export function exportDropOffRecords(startDate = "", endDate = "") {
    console.log("exportDropOffRecords", startDate, endDate);
    const url = AppUrls.exportDropOffRecords;
    exportTor("dropOffs", url, startDate, endDate);
}
export function exportPickUpRecords(startDate = "", endDate = "") {
    const url = AppUrls.exportPickUpRecords;
    exportTor("pickUp", url, startDate, endDate);
}
// pending overtimes
export function exportPendingOvertimeRecords(startDate = "", endDate = "") {
    const url = AppUrls.exportPendingOvertimeRecords;
    exportTor("pending_overtime", url, startDate, endDate);
}

export function exportClearedRecords(startDate = "", endDate = "") {
    const url = AppUrls.exportClearedOvertimeRecords;
    exportTor("cleared_overtime", url, startDate, endDate);
}
// payment
export function exportPaymentRecords(startDate = "", endDate = "") {
    const url = AppUrls.exportPaymentRecords;
    exportTor("payments", url, startDate, endDate);
}
// student clocking
export function exportStudentClockInRecords(startDate = "", endDate = "") {
    const url = AppUrls.exportStudentClockIn;
    exportTor("student_clock_in", url, startDate, endDate);
}

export function exportStudentClockOutRecords(startDate = "", endDate = "") {
    const url = AppUrls.exportStudentClockOut;
    exportTor("student_clock_out", url, startDate, endDate);
}

export function exportStaffClockInRecords(startDate = "", endDate = "") {
    const url = AppUrls.exportStaffClockIn;
    exportTor("staff_clock_in", url, startDate, endDate);
}

export function exportStaffClockOutRecords(startDate = "", endDate = "") {
    const url = AppUrls.exportStaffClockOut;
    exportTor("staff_clock_out", url, startDate, endDate);
}
export function exportStaffLateRecords(startDate = "", endDate = "") {
    const url = AppUrls.exportStaffLateRecords;
    exportTor("staff_late", url, startDate, endDate);
}
export function exportStaffOvertimeRecords(startDate?: string, endDate?: string) {
    const url = AppUrls.exportStaffOvertimeRecords;
    exportTor("staff_overtime", url, startDate, endDate);
}
// export-or
const exportTor = (name: string, url: string, startDate = "", endDate = "") => {
    let data = JSON.parse(localStorage.getItem("skooltym_user") as string);
    const docUrl = `${url}${data.school}?startDate=${startDate}&endDate=${endDate}`;
    // alert(docUrl);
    try {
        fetch(docUrl)
            .then(response => response.blob())
            .then(blob => {
                // Create a blob URL
                const blobUrl = window.URL.createObjectURL(blob);

                // Create a temporary anchor element
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = `${name}_${Date.now()}.xlsx`; // Name for the downloaded file

                // Append to document, click, and remove
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Clean up the blob URL
                window.URL.revokeObjectURL(blobUrl);
            })
            .catch(error => {
                console.error('Error downloading docs:', error);
            });
    } catch (error) {
        console.log(error);
    }

}