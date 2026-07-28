import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const COLUMNS = [
  { key: "surname", label: "Surname" },
  { key: "firstName", label: "First Name" },
  { key: "middleName", label: "Middle Name" },
  { key: "serviceNumber", label: "Service No" },
  { key: "rank", label: "Rank" },
  { key: "formation", label: "Formation" },
  { key: "zone", label: "Zone" },
  { key: "gender", label: "Gender" },
  { key: "phoneNumber", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "stateOfOrigin", label: "State of Origin" },
  { key: "lgaOfOrigin", label: "LGA" },
  { key: "dateOfBirth", label: "Date of Birth" },
  { key: "dateOfFirstAppointment", label: "Date of First Appt." },
  { key: "nin", label: "NIN" },
  { key: "bvn", label: "BVN" },
  { key: "nhf", label: "NHF" },
  { key: "permanentAddress", label: "Address" },
];

function mapStaff(staff) {
  return staff.map((s) => {
    const row = {};
    for (const { key } of COLUMNS) {
      row[key] = s[key] ?? "";
    }
    return row;
  });
}

export function exportToExcel(staff, filename = "staff") {
  const data = mapStaff(staff);
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Staff");
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

export function exportToCSV(staff, filename = "staff") {
  const data = mapStaff(staff);
  const ws = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(ws);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

export function exportToPDF(staff, filename = "staff") {
  const data = mapStaff(staff);
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  doc.autoTable({
    columns: COLUMNS.map((c) => ({ header: c.label, dataKey: c.key })),
    body: data,
    styles: { fontSize: 6, cellPadding: 1.5 },
    headStyles: { fontSize: 7, halign: "center" },
  });
  doc.save(`${filename}.pdf`);
}