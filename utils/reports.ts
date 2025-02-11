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
export function exportDropOffRecords() {
    const url = AppUrls.exportDropOffRecords;
    exportTor("dropOffs", url);
}
export function exportPickUpRecords() {
    const url = AppUrls.exportPickUpRecords;
    exportTor("pickUp", url);
}
// pending overtimes
export function exportPendingOvertimeRecords() {
    const url = AppUrls.exportPendingOvertimeRecords;
    exportTor("pending_overtime", url);
}

export function exportClearedRecords() {
    const url = AppUrls.exportClearedOvertimeRecords;
    exportTor("cleared_overtime", url);
}
// payment
export function exportPaymentRecords() {
    const url = AppUrls.exportPaymentRecords;
    exportTor("payments", url);
}
// student clocking
export function exportStudentClockInRecords() {
    const url = AppUrls.exportStudentClockIn;
    exportTor("student_clock_in", url);
}

export function exportStudentClockOutRecords() {
    const url = AppUrls.exportStudentClockOut;
    exportTor("student_clock_out", url);
}

export function exportStaffClockInRecords() {
    const url = AppUrls.exportStaffClockIn;
    exportTor("staff_clock_in", url);
}

export function exportStaffClockOutRecords() {
    const url = AppUrls.exportStaffClockOut;
    exportTor("staff_clock_out", url);
}
export function exportStaffLateRecords() {
    const url = AppUrls.exportStaffLateRecords;
    exportTor("staff_late", url);
}
export function exportStaffOvertimeRecords(startDate?: string, endDate?: string) {
    const url = AppUrls.exportStaffOvertimeRecords;
    exportTor("staff_overtime", url + "startDate=" + startDate + "&endDate=" + endDate);
}
// export-or
const exportTor = (name: string, url: string) => {
    let data = JSON.parse(localStorage.getItem("skooltym_user") as string);
    const docUrl = `${url}${data.school}`;
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