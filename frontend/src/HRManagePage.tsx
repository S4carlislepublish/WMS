import React, { useMemo, useState, useEffect } from "react";
import { apiService } from "./services/api";
import {
  HomeIcon, UserGroupIcon, ClockIcon, ShieldCheckIcon, BuildingOfficeIcon,
  MagnifyingGlassIcon, PlusIcon, CheckCircleIcon, XCircleIcon, CalendarDaysIcon,
  ChartBarIcon, DocumentTextIcon, Cog6ToothIcon, BellIcon
} from "@heroicons/react/24/outline";

const theme = {
  bg: "#F8FAFF", surface: "#FFFFFF", surface2: "#F0F4FF", border: "#DCDEF5",
  text: "#1E293B", textMuted: "#64748B", accent: "#6366F1", green: "#10B981",
  amber: "#F59E0B", red: "#EF4444", blue: "#3B82F6"
};

const EMPLOYEES = [
  { id: "EMP001", name: "Arjun Krishnamurthy", dept: "Engineering", role: "Senior Engineer", status: "active", loc: "Chennai", email: "arjun@corp.in", av: "AK", salary: "₹1,85,000", access: "Employee" },
  { id: "EMP002", name: "Priya Nair", dept: "Product", role: "Product Manager", status: "active", loc: "Bangalore", email: "priya@corp.in", av: "PN", salary: "₹2,40,000", access: "Manager" },
  { id: "EMP003", name: "Rohit Sharma", dept: "Sales", role: "Sales Lead", status: "active", loc: "Mumbai", email: "rohit@corp.in", av: "RS", salary: "₹1,60,000", access: "Employee" },
  { id: "EMP004", name: "Sneha Pillai", dept: "HR", role: "HR Manager", status: "active", loc: "Chennai", email: "sneha@corp.in", av: "SP", salary: "₹1,70,000", access: "Employee" },
  { id: "EMP005", name: "Vikram Mehta", dept: "Finance", role: "Finance Analyst", status: "on_leave", loc: "Delhi", email: "vikram@corp.in", av: "VM", salary: "₹1,50,000", access: "Employee" },
  { id: "EMP006", name: "Anita Desai", dept: "Engineering", role: "QA Engineer", status: "active", loc: "Chennai", email: "anita@corp.in", av: "AD", salary: "₹1,35,000", access: "Employee" },
];

const LEAVES = [
  { id: 1, empId: "EMP003", empName: "Rohit Sharma", av: "RS", type: "Casual Leave", from: "2026-06-10", to: "2026-06-12", days: 3, reason: "Family function", status: "pending" },
  { id: 2, empId: "EMP005", empName: "Vikram Mehta", av: "VM", type: "Annual Leave", from: "2026-06-15", to: "2026-06-22", days: 8, reason: "Vacation with family", status: "pending" },
  { id: 3, empId: "EMP006", empName: "Anita Desai", av: "AD", type: "Sick Leave", from: "2026-06-05", to: "2026-06-06", days: 2, reason: "Medical treatment", status: "pending" },
  { id: 4, empId: "EMP002", empName: "Priya Nair", av: "PN", type: "Casual Leave", from: "2026-06-20", to: "2026-06-20", days: 1, reason: "Personal errand", status: "approved" },
];

const ATTENDANCE = [
  { emp: "Arjun Krishnamurthy", av: "AK", in: "09:02", out: "18:45", hrs: "9h 43m", status: "present", dept: "Engineering" },
  { emp: "Priya Nair", av: "PN", in: "09:30", out: "19:00", hrs: "9h 30m", status: "present", dept: "Product" },
  { emp: "Rohit Sharma", av: "RS", in: "10:15", out: "18:30", hrs: "8h 15m", status: "late", dept: "Sales" },
  { emp: "Sneha Pillai", av: "SP", in: "09:00", out: "18:00", hrs: "9h 0m", status: "present", dept: "HR" },
  { emp: "Vikram Mehta", av: "VM", in: "—", out: "—", hrs: "—", status: "absent", dept: "Finance" },
  { emp: "Anita Desai", av: "AD", in: "08:55", out: "18:00", hrs: "9h 5m", status: "present", dept: "Engineering" },
];

const DEPTS = [
  { name: "Engineering", head: "Arjun Krishnamurthy", hc: 45, budget: "₹85L", color: "#6366F1" },
  { name: "Product", head: "Priya Nair", hc: 12, budget: "₹24L", color: "#10B981" },
  { name: "Sales", head: "Rohit Sharma", hc: 28, budget: "₹42L", color: "#F59E0B" },
  { name: "HR", head: "Sneha Pillai", hc: 8, budget: "₹15L", color: "#EC4899" },
  { name: "Finance", head: "Vikram Mehta", hc: 10, budget: "₹18L", color: "#3B82F6" },
];

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: HomeIcon },
  { id: "directory", label: "Staff Directory", icon: UserGroupIcon },
  { id: "attendance", label: "Attendance", icon: ClockIcon },
  { id: "leave", label: "Leave Management", icon: CalendarDaysIcon },
  { id: "performance", label: "Performance", icon: ChartBarIcon },
  { id: "documents", label: "Documents", icon: DocumentTextIcon },
  { id: "settings", label: "Settings", icon: Cog6ToothIcon },
];

const HR_LETTERS = ["Experience Letter", "Bonafide Certificate", "NOC", "Employment Contract", "Salary Certificate", "Relieving Letter"];

function Avatar({ initials, size = 36 }: { initials: string; size?: number }) {
  const colors = ["#6366F1", "#10B981", "#F59E0B", "#EC4899", "#3B82F6", "#8B5CF6"];
  const idx = initials.charCodeAt(0) % colors.length;
  const c = colors[idx];
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: `${c}18`, border: `2px solid ${c}66`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.38, fontWeight: 700, color: c }}>
      {initials}
    </div>
  );
}

function Chip({ type }: { type: string }) {
  const styles: any = {
    active: { bg: "#D1FAE5", c: "#10B981", txt: "ACTIVE" },
    pending: { bg: "#FEF3C7", c: "#F59E0B", txt: "PENDING" },
    approved: { bg: "#D1FAE5", c: "#10B981", txt: "APPROVED" },
    rejected: { bg: "#FEE2E2", c: "#EF4444", txt: "REJECTED" },
    present: { bg: "#D1FAE5", c: "#10B981", txt: "PRESENT" },
    absent: { bg: "#FEE2E2", c: "#EF4444", txt: "ABSENT" },
    late: { bg: "#FEF3C7", c: "#F59E0B", txt: "LATE" },
    on_leave: { bg: "#DBEAFE", c: "#3B82F6", txt: "ON LEAVE" },
  };
  const s = styles[type] || styles.active;
  return <span style={{ background: s.bg, color: s.c, fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 999 }}>{s.txt}</span>;
}

function Panel({ children, style = {} }: any) {
  return <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 20, ...style }}>{children}</div>;
}

function Btn({ children, onClick, variant = "primary" }: any) {
  const bg = variant === "primary" ? theme.accent : "transparent";
  const color = variant === "primary" ? "#fff" : theme.textMuted;
  const border = variant === "primary" ? "none" : `1px solid ${theme.border}`;
  return (
    <button onClick={onClick} style={{ background: bg, color, border, padding: "10px 16px", borderRadius: 8, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12 }}>
      {children}
    </button>
  );
}

export default function HRAdminDashboard() {
  const [nav, setNav] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [leaves, setLeaves] = useState(LEAVES);
  const [employees, setEmployees] = useState(EMPLOYEES);
  const [addEmpOpen, setAddEmpOpen] = useState(false);
  const [profileCompleteOpen, setProfileCompleteOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<any>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [attendance, setAttendance] = useState([]);

  const fetchAttendance = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/attendance/"
    );

    const data = await response.json();

    setAttendance(data || []);
  } catch (error) {
    console.error("Attendance Error:", error);
  }
};

useEffect(() => {
  fetchEmployees();
  fetchAttendance();
}, []);

  useEffect(() => {
  fetchTeams();
}, []);

useEffect(() => {
  fetchTeams();
  fetchRoles();
}, []);

const fetchRoles = async () => {
  try {
    const res = await apiService.getRoles();
    setRoles(res.data.roles || []);
  } catch (err) {
    console.error(err);
  }
};

const fetchTeams = async () => {
  try {
    const res = await apiService.getTeams();

    setTeams(res.data.teams || []);
  } catch (err) {
    console.error(err);
  }
};

  // HR-only fields (mandatory)
  const [newEmp, setNewEmp] = useState({
  employee_id: "",
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  department: "",
  designation: "",
  role: "",
  reporting_manager: "",
  joining_date: "",
  salary: "",
  status: "Active"
});

  // Employee profile completion fields
  const [profileData, setProfileData] = useState({
    dob: "",
    gender: "",
    marital_status: "",
    blood_group: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    pan_number: "",
    aadhaar_number: "",
    bank_name: "",
    account_number: "",
    ifsc_code: "",
    qualification: "",
    college: "",
    passing_year: "",
    skills: "",
    emergency_contact_name: "",
    emergency_contact_number: ""
  });

  const counts = useMemo(() => ({
    total: employees.length,
    active: employees.filter(e => e.status === "active").length,
    onLeave: employees.filter(e => e.status === "on_leave").length,
    pendingLeaves: leaves.filter(l => l.status === "pending").length,
  }), [employees, leaves]);

const filteredEmps = employees.filter((e) =>
  `${e.first_name || ""} ${e.last_name || ""}`
    .toLowerCase()
    .includes(search.toLowerCase()) ||

  (e.department || "")
    .toLowerCase()
    .includes(search.toLowerCase()) ||

  (e.role || "")
    .toLowerCase()
    .includes(search.toLowerCase()) ||

  (e.reporting_manager || "")
    .toLowerCase()
    .includes(search.toLowerCase()) ||

  (e.designation || "")
    .toLowerCase()
    .includes(search.toLowerCase())
);

  const handleApproveLeave = (id: number) => {
    const leave = leaves.find(l => l.id === id);
    if (leave) {
      setLeaves(leaves.map(l => l.id === id ? { ...l, status: "approved", approvedBy: "HR Admin" } : l));
      setEmployees(employees.map(e => e.id === leave.empId ? { ...e, status: "on_leave" } : e));
    }
  };

  const handleRejectLeave = (id: number) => {
    setLeaves(leaves.map(l => l.id === id ? { ...l, status: "rejected", approvedBy: "HR Admin" } : l));
  };

  const handleAddEmployee = async () => {
    // Validate mandatory fields
    if (!newEmp.employee_id || !newEmp.first_name || !newEmp.last_name || !newEmp.email || !newEmp.phone || !newEmp.department || !newEmp.role || !newEmp.joining_date || !newEmp.salary) {
      alert("Please fill all mandatory fields (*)");
      return;
    }

    try {
      const response = await fetch("http://10.1.8.103:5000/api/employees/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmp)
      });

      const data = await response.json();
      alert(data.message || "Employee Added Successfully");
      setAddEmpOpen(false);
      setNewEmp({
        employee_id: "", first_name: "", last_name: "", email: "", phone: "",
        department: "", designation: "", role: "", joining_date: "", salary: "", status: "Active"
      });
    } catch (error) {
      console.error(error);
      alert("Error adding employee");
    }
  };

  const handleProfileComplete = async () => {
    if (!currentEmployee) return;

    try {
      const response = await fetch(`http://localhost:5000/api/employees/${currentEmployee.id}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();
      alert(data.message || "Profile Completed Successfully");
      setProfileCompleteOpen(false);
      setProfileData({
        dob: "", gender: "", marital_status: "", blood_group: "",
        address: "", city: "", state: "", country: "", pincode: "",
        pan_number: "", aadhaar_number: "", bank_name: "", account_number: "", ifsc_code: "",
        qualification: "", college: "", passing_year: "", skills: "",
        emergency_contact_name: "", emergency_contact_number: ""
      });
    } catch (error) {
      console.error(error);
      alert("Error completing profile");
    }
  };

  const simulateEmployeeLogin = (emp: any) => {
    setCurrentEmployee(emp);
    setProfileCompleteOpen(true);
  };

  const labelStyle = {
  fontSize: 11,
  fontWeight: 700,
  color: "#64748B",
  display: "block",
  marginBottom: 6,
  letterSpacing: "0.02em"
};

const inputStyle = {
  width: "100%",
  padding: 12,
  background: "#F8FAFC",
  border: "1px solid #CBD5E1",
  borderRadius: 10,
  fontSize: 13,
  outline: "none",
  color: "#0F172A"
};
const [formData, setFormData] = useState({
  employee_id: 0,
  full_name: '',
  email: '',
  password: '',
  company_email: '',
  role_id: 0,
  team_id: 0,
  access_level: 'standard',
  status: 'active',
});

const fetchEmployees = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/employees/"
    );

    const data = await response.json();

    setEmployees(data || []);
  } catch (error) {
    console.error(error);
  }
};

useEffect(() => {
  fetchEmployees();
}, []);

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* ========== HEADER ========== */}
      <header style={{ position: "sticky", top: 0, zIndex: 40, background: theme.surface, borderBottom: `1px solid ${theme.border}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg, ${theme.accent}, #4F46E5)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BuildingOfficeIcon style={{ width: 22, height: 22, color: "#fff" }} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>HR Admin Dashboard</div>
              <div style={{ fontSize: 11, color: theme.textMuted }}>Full Access • All Features • Manage Everything</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Btn onClick={() => setAddEmpOpen(true)}><PlusIcon style={{ width: 14, height: 14 }} /> Add Employee</Btn>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", background: theme.surface2, borderRadius: 10, border: `1px solid ${theme.border}` }}>
              <Avatar initials="HR" size={28} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 700 }}>HR Admin</div>
                <div style={{ fontSize: 10, color: theme.textMuted }}>Full Access</div>
              </div>
            </div>
          </div>
        </div>

        {/* ========== NAVIGATION ========== */}
        <div style={{ display: "flex", gap: 4, padding: "0 24px 10px", overflowX: "auto" }}>
          {NAV.map(item => {
            const isActive = nav === item.id;
            return (
              <button 
                key={item.id} 
                onClick={() => setNav(item.id)} 
                style={{
                  border: "none", 
                  background: isActive ? `${theme.accent}18` : "transparent",
                  color: isActive ? theme.accent : theme.textMuted, 
                  padding: "8px 14px", 
                  borderRadius: 8,
                  display: "flex", 
                  alignItems: "center", 
                  gap: 8, 
                  fontSize: 13, 
                  fontWeight: isActive ? 700 : 500, 
                  cursor: "pointer",
                  whiteSpace: "nowrap"
                }}
              >
                <item.icon style={{ width: 16, height: 16 }} />
                {item.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* ========== MAIN CONTENT ========== */}
      <main style={{ padding: 24 }}>
        
        {/* --- DASHBOARD VIEW --- */}
        {nav === "dashboard" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Stats Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
              <Panel style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 12, color: theme.textMuted, fontWeight: 600 }}>Total Employees</div>
                  <div style={{ fontSize: 32, fontWeight: 800, marginTop: 4 }}>{counts.total}</div>
                  <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>All departments</div>
                </div>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${theme.accent}18`, color: theme.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>👥</div>
              </Panel>
              
              <Panel style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 12, color: theme.textMuted, fontWeight: 600 }}>Active Now</div>
                  <div style={{ fontSize: 32, fontWeight: 800, marginTop: 4, color: theme.green }}>{counts.active}</div>
                  <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>Working today</div>
                </div>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "#D1FAE5", color: theme.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>✓</div>
              </Panel>
              
              <Panel style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 12, color: theme.textMuted, fontWeight: 600 }}>On Leave</div>
                  <div style={{ fontSize: 32, fontWeight: 800, marginTop: 4, color: theme.blue }}>{counts.onLeave}</div>
                  <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>Away from work</div>
                </div>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "#DBEAFE", color: theme.blue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🏖️</div>
              </Panel>
              
              <Panel style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 12, color: theme.textMuted, fontWeight: 600 }}>Pending Leaves</div>
                  <div style={{ fontSize: 32, fontWeight: 800, marginTop: 4, color: theme.amber }}>{counts.pendingLeaves}</div>
                  <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>Need approval</div>
                </div>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "#FEF3C7", color: theme.amber, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>⏳</div>
              </Panel>
            </div>

            {/* Departments */}
            <Panel>
              <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 16, color: theme.text }}>Department Overview</div>
              {DEPTS.map(d => (
                <div key={d.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: theme.surface2, borderRadius: 10, marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 4, height: 28, background: d.color, borderRadius: 2 }} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{d.name}</div>
                      <div style={{ fontSize: 11, color: theme.textMuted }}>Head: {d.head}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{d.hc} Employees</div>
                    <div style={{ fontSize: 11, color: theme.textMuted }}>Budget: {d.budget}</div>
                  </div>
                </div>
              ))}
            </Panel>

            {/* Quick Actions */}
            <Panel>
              <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 16 }}>Quick Actions</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
                <button onClick={() => setNav("leave")} style={{ padding: 16, background: "#FEF3C7", border: `1px solid ${theme.amber}`, borderRadius: 10, cursor: "pointer", textAlign: "center" }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>⏳</div>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>Review Leaves</div>
                </button>
                <button onClick={() => setNav("directory")} style={{ padding: 16, background: `${theme.accent}18`, border: `1px solid ${theme.accent}`, borderRadius: 10, cursor: "pointer", textAlign: "center" }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>👥</div>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>View Directory</div>
                </button>
                <button onClick={() => setNav("attendance")} style={{ padding: 16, background: "#D1FAE5", border: `1px solid ${theme.green}`, borderRadius: 10, cursor: "pointer", textAlign: "center" }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>🕐</div>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>Check Attendance</div>
                </button>
                <button onClick={() => setAddEmpOpen(true)} style={{ padding: 16, background: "#DBEAFE", border: `1px solid ${theme.blue}`, borderRadius: 10, cursor: "pointer", textAlign: "center" }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>➕</div>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>Add Employee</div>
                </button>
              </div>
            </Panel>
          </div>
        )}

        {/* --- DIRECTORY VIEW --- */}
        {nav === "directory" && (
  <Panel>
    {/* Header Section */}
    <div style={{ 
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center", 
      marginBottom: 24, 
      flexWrap: "wrap", 
      gap: 16 
    }}>
      <div>
        <h1 style={{ 
          fontSize: 26, 
          fontWeight: 700, 
          color: theme.text, 
          margin: "0 0 4px 0" 
        }}>
          Employee Directory
        </h1>
        <p style={{ 
          fontSize: 14, 
          color: theme.textMuted, 
          margin: 0 
        }}>
          View and manage all employees
        </p>
      </div>
      
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 12,
        flexWrap: "wrap"
      }}>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 8, 
          background: theme.surface2, 
          border: `1px solid ${theme.border}`, 
          borderRadius: 10, 
          padding: "8px 14px"
        }}>
          <MagnifyingGlassIcon style={{ width: 18, height: 18, color: theme.textMuted }} />
          <input 
            placeholder="Search by name, dept, or role..." 
            value={search} 
            onChange={(e: any) => setSearch(e.target.value)} 
            style={{ 
              border: "none", 
              background: "transparent", 
              outline: "none", 
              fontSize: 13, 
              width: 250,
              color: theme.text
            }} 
          />
        </div>
        <Btn 
          onClick={() => setAddEmpOpen(true)}
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 6, 
            padding: "9px 18px",
            fontSize: 13,
            fontWeight: 600
          }}
        >
          <PlusIcon style={{ width: 14, height: 14 }} /> 
          Add Employee
        </Btn>
      </div>
    </div>
    
    {/* Table Container */}
    <div style={{ 
      overflowX: "auto",
      background: theme.surface2,
      border: `1px solid ${theme.border}`,
      borderRadius: 12,
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
    }}>
      <table style={{ 
        width: "100%", 
        textAlign: "left", 
        fontSize: 13, 
        borderCollapse: "collapse"
      }}>
        <thead>
          <tr style={{ 
            borderBottom: `2px solid ${theme.border}`, 
            color: theme.textMuted,
            background: theme.surface
          }}>
            <th style={{ padding: "16px 16px", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Employee
            </th>
            <th style={{ padding: "16px 16px", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Department
            </th>
            <th style={{ padding: "16px 16px", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Role
            </th>
            <th style={{ padding: "16px 16px", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Reporting Manager
            </th>
            <th style={{ padding: "16px 16px", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Team/Designation
            </th>
            <th style={{ padding: "16px 16px", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredEmps.map((emp, index) => (
            <tr 
              key={emp.id}
              style={{ 
                borderBottom: `1px solid ${theme.border}`,
                background: index % 2 === 0 ? theme.surface2 : theme.surface,
                transition: "background 0.15s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = theme.primary + "15";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = index % 2 === 0 ? theme.surface2 : theme.surface;
              }}
            >
              <td style={{ padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "white"
                  }}>
                    {(emp.first_name?.[0] || "E") + (emp.last_name?.[0] || "")}
                  </div>
                  <div>
                    <div style={{ 
                      fontSize: 14, 
                      fontWeight: 600, 
                      color: theme.text,
                      marginBottom: 2
                    }}>
                      {emp.first_name} {emp.last_name}
                    </div>
                  </div>
                </div>
              </td>

              <td style={{ padding: "14px 16px" }}>
                <div style={{ 
                  display: "inline-flex", 
                  alignItems: "center", 
                  gap: 6,
                  padding: "6px 12px",
                  background: theme.surface,
                  borderRadius: 6,
                  border: `1px solid ${theme.border}`
                }}>
                  <svg style={{ width: 14, height: 14, color: theme.textMuted }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span style={{ fontSize: 13, color: theme.text, fontWeight: 500 }}>
                    {emp.department || "N/A"}
                  </span>
                </div>
              </td>

              <td style={{ padding: "14px 16px" }}>
                <span style={{ 
                  fontSize: 13, 
                  color: theme.text,
                  fontWeight: 500
                }}>
                  {emp.role || "N/A"}
                </span>
              </td>

              <td style={{ padding: "14px 16px" }}>
                <span style={{ 
                  fontSize: 13, 
                  color: theme.textMuted
                }}>
                  {emp.reporting_manager || "—"}
                </span>
              </td>

              <td style={{ padding: "14px 16px" }}>
                <span style={{ 
                  fontSize: 13, 
                  color: theme.text,
                  fontWeight: 500
                }}>
                  {emp.designation || "N/A"}
                </span>
              </td>

              <td style={{ padding: "14px 16px" }}>
                <div style={{ 
                  display: "inline-flex", 
                  alignItems: "center", 
                  gap: 6,
                  padding: "6px 12px",
                  background: "#dcfce7",
                  borderRadius: 6,
                  border: "1px solid #86efac"
                }}>
                  <div style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#22c55e"
                  }} />
                  <span style={{ 
                    fontSize: 12, 
                    color: "#166534",
                    fontWeight: 600
                  }}>
                    Active
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Empty State */}
      {filteredEmps.length === 0 && (
        <div style={{ 
          textAlign: "center", 
          padding: "50px 20px",
          color: theme.textMuted
        }}>
          <svg style={{ 
            width: 48, 
            height: 48, 
            margin: "0 auto 12px",
            color: theme.border
          }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <div style={{ 
            fontSize: 15, 
            fontWeight: 600, 
            color: theme.text,
            marginBottom: 6
          }}>
            No employees found
          </div>
          <div style={{ fontSize: 13, marginBottom: 16 }}>
            Try adjusting your search terms
          </div>
          <Btn 
            onClick={() => setSearch("")}
            style={{ fontSize: 12, padding: "7px 16px" }}
          >
            Clear Search
          </Btn>
        </div>
      )}
    </div>

    {/* Employee Count Footer */}
    {filteredEmps.length > 0 && (
      <div style={{ 
        marginTop: 16,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: 13,
        color: theme.textMuted
      }}>
        <span>
          Showing <strong style={{ color: theme.text }}>{filteredEmps.length}</strong> {filteredEmps.length === 1 ? 'employee' : 'employees'}
        </span>
        <span>
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>
    )}
  </Panel>
)}

        {/* --- ATTENDANCE VIEW --- */}
        {nav === "attendance" && (
          <Panel>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>Today's Attendance</div>
            <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 20 }}>June 1, 2026 • Monday</div>
            
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", textAlign: "left", fontSize: 13, borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${theme.border}`, color: theme.textMuted }}>
                    <th style={{ padding: "14px 12px" }}>Employee</th>
                    <th style={{ padding: "14px 12px" }}>Department</th>
                    <th style={{ padding: "14px 12px" }}>Check In</th>
                    <th style={{ padding: "14px 12px" }}>Check Out</th>
                    <th style={{ padding: "14px 12px" }}>Working Hours</th>
                    <th style={{ padding: "14px 12px" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
  {attendance.map((at, i) => (
    <tr key={i}>
      <td style={{ padding: "14px 12px" }}>
        {at.employee_name}
      </td>

      <td style={{ padding: "14px 12px" }}>
        {at.department}
      </td>

      <td style={{ padding: "14px 12px" }}>
        {at.check_in}
      </td>

      <td style={{ padding: "14px 12px" }}>
        {at.check_out || "-"}
      </td>

      <td style={{ padding: "14px 12px" }}>
        {at.working_hours || "-"}
      </td>

      <td style={{ padding: "14px 12px" }}>
        <Chip type={at.status} />
      </td>
    </tr>
  ))}
</tbody>
              </table>
            </div>
          </Panel>
        )}

        {/* --- LEAVE MANAGEMENT VIEW --- */}
        {nav === "leave" && (
          <Panel>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>Leave Management</div>
            <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 20 }}>Approve or reject leave requests as HR Admin</div>
            
            {leaves.map(l => (
              <div key={l.id} style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                padding: 18, 
                border: `1px solid ${theme.border}`, 
                borderRadius: 12, 
                background: theme.surface2, 
                marginBottom: 16,
                flexWrap: "wrap",
                gap: 16
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1 }}>
                  <Avatar initials={l.av} size={44} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
                      {l.empName} <span style={{ fontWeight: 600, color: theme.accent }}>- {l.type}</span>
                    </div>
                    <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 2 }}>
                      📅 {l.from} to {l.to} • <strong>{l.days} days</strong>
                    </div>
                    <div style={{ fontSize: 12, color: theme.textMuted, fontStyle: "italic" }}>
                      "{l.reason}"
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Chip type={l.status} />
                  {l.status === "pending" && (
                    <div style={{ display: "flex", gap: 10 }}>
                      <button 
                        onClick={() => handleApproveLeave(l.id)} 
                        style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          gap: 6,
                          border: "none", 
                          background: theme.green, 
                          color: "#fff", 
                          padding: "10px 20px", 
                          borderRadius: 8, 
                          fontWeight: 700, 
                          cursor: "pointer",
                          fontSize: 12
                        }}
                      >
                        <CheckCircleIcon style={{ width: 16, height: 16 }} />
                        Approve
                      </button>
                      <button 
                        onClick={() => handleRejectLeave(l.id)} 
                        style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          gap: 6,
                          border: "none", 
                          background: theme.red, 
                          color: "#fff", 
                          padding: "10px 20px", 
                          borderRadius: 8, 
                          fontWeight: 700, 
                          cursor: "pointer",
                          fontSize: 12
                        }}
                      >
                        <XCircleIcon style={{ width: 16, height: 16 }} />
                        Reject
                      </button>
                    </div>
                  )}
                  {l.status === "approved" && (
                    <div style={{ fontSize: 11, color: theme.textMuted }}>
                      Approved by HR Admin
                    </div>
                  )}
                  {l.status === "rejected" && (
                    <div style={{ fontSize: 11, color: theme.textMuted }}>
                      Rejected by HR Admin
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {counts.pendingLeaves === 0 && (
              <div style={{ textAlign: "center", padding: 40, color: theme.textMuted }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>✓</div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>All caught up!</div>
                <div style={{ fontSize: 13 }}>No pending leave requests</div>
              </div>
            )}
          </Panel>
        )}

        {/* --- PERFORMANCE VIEW --- */}
        {nav === "performance" && (
          <Panel>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 20 }}>Team Performance Overview</div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Efficiency Score</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: theme.accent }}>87% / 90%</span>
                </div>
                <div style={{ height: 40, background: theme.surface2, borderRadius: 8, display: "flex", alignItems: "center", padding: 4 }}>
                  <div style={{ width: "87%", height: "100%", background: `linear-gradient(90deg, ${theme.accent}, #8B5CF6)`, borderRadius: 6 }} />
                  <span style={{ marginLeft: 12, fontSize: 11, fontWeight: 700 }}>87%</span>
                </div>
                <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 6 }}>Task completion rate</div>
              </div>
              
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Quality Assessment</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: theme.green }}>92% / 95%</span>
                </div>
                <div style={{ height: 40, background: theme.surface2, borderRadius: 8, display: "flex", alignItems: "center", padding: 4 }}>
                  <div style={{ width: "92%", height: "100%", background: `linear-gradient(90deg, ${theme.green}, #10B981)`, borderRadius: 6 }} />
                  <span style={{ marginLeft: 12, fontSize: 11, fontWeight: 700 }}>92%</span>
                </div>
                <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 6 }}>Error rate tracking</div>
              </div>
              
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Productivity Index</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: theme.blue }}>94% / 90%</span>
                </div>
                <div style={{ height: 40, background: theme.surface2, borderRadius: 8, display: "flex", alignItems: "center", padding: 4 }}>
                  <div style={{ width: "94%", height: "100%", background: `linear-gradient(90deg, ${theme.blue}, #3B82F6)`, borderRadius: 6 }} />
                  <span style={{ marginLeft: 12, fontSize: 11, fontWeight: 700 }}>94%</span>
                </div>
                <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 6 }}>Output per hour</div>
              </div>
              
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Customer Satisfaction</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: theme.amber }}>88% / 95%</span>
                </div>
                <div style={{ height: 40, background: theme.surface2, borderRadius: 8, display: "flex", alignItems: "center", padding: 4 }}>
                  <div style={{ width: "88%", height: "100%", background: `linear-gradient(90deg, ${theme.amber}, #F59E0B)`, borderRadius: 6 }} />
                  <span style={{ marginLeft: 12, fontSize: 11, fontWeight: 700 }}>88%</span>
                </div>
                <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 6 }}>Client feedback score</div>
              </div>
            </div>
          </Panel>
        )}

        {/* --- DOCUMENTS VIEW --- */}
        {nav === "documents" && (
          <Panel>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>HR Documents & Templates</div>
            <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 20 }}>Download policies, templates, and corporate letters</div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {["Corporate Policy Handbook v2026.pdf", "Employee Onboarding Pack.zip", "Leave Management Policy v3.pdf", "Code of Conduct 2026.pdf", "Salary Structure Template.xlsx", "Q2 Performance Review Template.docx"].map((doc, i) => (
                <div key={i} style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "space-between", 
                  padding: "14px 16px", 
                  background: theme.surface2, 
                  borderRadius: 10,
                  border: `1px solid ${theme.border}`
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, background: `${theme.accent}18`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <DocumentTextIcon style={{ width: 20, height: 20, color: theme.accent }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{doc}</div>
                      <div style={{ fontSize: 11, color: theme.textMuted }}>HR Department</div>
                    </div>
                  </div>
                  <button 
                    style={{ 
                      background: theme.accent, 
                      color: "#fff", 
                      padding: "8px 16px", 
                      borderRadius: 6, 
                      fontSize: 11, 
                      fontWeight: 700, 
                      cursor: "pointer",
                      border: "none"
                    }}
                    onClick={() => alert(`Downloading ${doc}...`)}
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 24, paddingTop: 24, borderTop: `1px solid ${theme.border}` }}>
              <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 16 }}>HR Letter Generator</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
                {HR_LETTERS.map((letter, i) => (
                  <button 
                    key={i}
                    onClick={() => alert(`Generating ${letter}...`)}
                    style={{ 
                      padding: 14, 
                      background: theme.surface2, 
                      border: `1px solid ${theme.border}`, 
                      borderRadius: 8, 
                      cursor: "pointer",
                      textAlign: "center",
                      fontSize: 12,
                      fontWeight: 600
                    }}
                  >
                    📄 {letter}
                  </button>
                ))}
              </div>
            </div>
          </Panel>
        )}

        {/* --- SETTINGS VIEW --- */}
        {nav === "settings" && (
          <Panel>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 20 }}>HR Admin Settings</div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 16, background: theme.surface2, borderRadius: 10 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>System Notifications</div>
                  <div style={{ fontSize: 11, color: theme.textMuted }}>Receive dashboard notifications</div>
                </div>
                <input type="checkbox" defaultChecked style={{ width: 20, height: 20, cursor: "pointer" }} />
              </div>
              
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 16, background: theme.surface2, borderRadius: 10 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Email Alerts for Leave Requests</div>
                  <div style={{ fontSize: 11, color: theme.textMuted }}>Get notified when leaves are requested</div>
                </div>
                <input type="checkbox" defaultChecked style={{ width: 20, height: 20, cursor: "pointer" }} />
              </div>
              
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 16, background: theme.surface2, borderRadius: 10 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Auto-approve Leaves under 2 days</div>
                  <div style={{ fontSize: 11, color: theme.textMuted }}>Automatically approve short leaves</div>
                </div>
                <input type="checkbox" style={{ width: 20, height: 20, cursor: "pointer" }} />
              </div>
              
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 16, background: theme.surface2, borderRadius: 10 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Daily Attendance Report</div>
                  <div style={{ fontSize: 11, color: theme.textMuted }}>Receive daily attendance summary</div>
                </div>
                <input type="checkbox" defaultChecked style={{ width: 20, height: 20, cursor: "pointer" }} />
              </div>
              
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 16, background: theme.surface2, borderRadius: 10 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Performance Review Reminders</div>
                  <div style={{ fontSize: 11, color: theme.textMuted }}>Get reminded before review deadlines</div>
                </div>
                <input type="checkbox" defaultChecked style={{ width: 20, height: 20, cursor: "pointer" }} />
              </div>
              
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button style={{ flex: 1, padding: 14, background: theme.accent, color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>Save All Settings</button>
                <button style={{ padding: 14, background: "transparent", color: theme.textMuted, border: `1px solid ${theme.border}`, borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>Reset to Defaults</button>
              </div>
            </div>
          </Panel>
        )}
      </main>

      {/* ========== ADD EMPLOYEE MODAL (HR ONLY - MANDATORY FIELDS) ========== */}
      {addEmpOpen && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(15, 23, 42, 0.55)",
      backdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 100,
      padding: 16,
    }}
  >
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 24,
        width: 920,
        maxWidth: "100%",
        maxHeight: "92vh",
        overflowY: "auto",
        boxShadow: "0 24px 60px rgba(15, 23, 42, 0.25)",
        border: "1px solid #E2E8F0",
      }}
    >
      <div
        style={{
          padding: "22px 26px",
          borderBottom: "1px solid #E2E8F0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #EEF2FF, #FFFFFF)",
        }}
      >
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#0F172A" }}>
            Add New Employee
          </div>
          <div style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>
            HR can create a new employee record with essential details
          </div>
        </div>

        <button
          onClick={() => setAddEmpOpen(false)}
          style={{
            border: "none",
            background: "#F1F5F9",
            width: 38,
            height: 38,
            borderRadius: 12,
            cursor: "pointer",
            fontSize: 22,
            color: "#475569",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ×
        </button>
      </div>

      <div style={{ padding: 26 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 18,
          }}
        >
          <div>
            <label style={labelStyle}>EMPLOYEE ID *</label>
            <input
              value={newEmp.employee_id}
              onChange={(e) =>
                setNewEmp({ ...newEmp, employee_id: e.target.value })
              }
              placeholder="e.g., EMP001"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>FIRST NAME *</label>
            <input
              value={newEmp.first_name}
              onChange={(e) =>
                setNewEmp({ ...newEmp, first_name: e.target.value })
              }
              placeholder="e.g., John"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>LAST NAME *</label>
            <input
              value={newEmp.last_name}
              onChange={(e) =>
                setNewEmp({ ...newEmp, last_name: e.target.value })
              }
              placeholder="e.g., Smith"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>EMAIL *</label>
            <input
              type="email"
              value={newEmp.email}
              onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })}
              placeholder="e.g., john@company.com"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>PHONE *</label>
            <input
              value={newEmp.phone}
              onChange={(e) => setNewEmp({ ...newEmp, phone: e.target.value })}
              placeholder="e.g., +91 9876543210"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>DEPARTMENT *</label>
            <select
              value={newEmp.department}
              onChange={(e) =>
                setNewEmp({ ...newEmp, department: e.target.value })
              }
              style={inputStyle}
            >
              <option value="">Select Department</option>
              <option value="Engineering">Engineering</option>
              <option value="Product">Product</option>
              <option value="Sales">Sales</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Designation *</label>
            <select
  value={newEmp.designation}
  onChange={(e) =>
    setNewEmp({
      ...newEmp,
      designation: e.target.value
    })
  }
  style={inputStyle}
>
  <option value="">Select Designation</option>

  {teams?.map((team) => (
    <option key={team.id} value={team.name}>
      {team.name}
    </option>
  ))}
</select>
          </div>
          <div>
  <label style={labelStyle}>
    REPORTING MANAGER *
  </label>

  <select
    value={newEmp.reporting_manager}
    onChange={(e) =>
      setNewEmp({
        ...newEmp,
        reporting_manager: e.target.value,
      })
    }
    style={inputStyle}
  >
    <option value="">
      Select Manager
    </option>

    {employees?.map((emp) => (
      <option
        key={emp.id}
        value={emp.name}
      >
        {emp.name}
      </option>
    ))}
  </select>
</div>

          <div>
            <label style={labelStyle}>Role *</label>
            <select
              value={newEmp.role}
              onChange={(e) => setNewEmp({ ...newEmp, role: e.target.value })}
              style={inputStyle}
            >
              <option value="">Select Role</option>
              {roles?.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>JOINING DATE *</label>
            <input
              type="date"
              value={newEmp.joining_date}
              onChange={(e) =>
                setNewEmp({ ...newEmp, joining_date: e.target.value })
              }
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>SALARY *</label>
            <input
              type="number"
              value={newEmp.salary}
              onChange={(e) => setNewEmp({ ...newEmp, salary: e.target.value })}
              placeholder="e.g., 150000"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>STATUS *</label>
            <select
              value={newEmp.status}
              onChange={(e) => setNewEmp({ ...newEmp, status: e.target.value })}
              style={inputStyle}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 28,
            justifyContent: "flex-end",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => setAddEmpOpen(false)}
            style={{
              padding: "12px 20px",
              background: "#F8FAFC",
              color: "#334155",
              border: "1px solid #CBD5E1",
              borderRadius: 12,
              fontWeight: 700,
              cursor: "pointer",
              minWidth: 120,
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleAddEmployee}
            style={{
              padding: "12px 20px",
              background: "linear-gradient(135deg, #6366F1, #4F46E5)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              fontWeight: 700,
              cursor: "pointer",
              minWidth: 140,
              boxShadow: "0 10px 20px rgba(99, 102, 241, 0.25)",
            }}
          >
            Add Employee
          </button>
        </div>
      </div>
    </div>
  </div>
)}

          {/* ========== EMPLOYEE PROFILE COMPLETION MODAL (FIRST LOGIN) ========== */}
      {profileCompleteOpen && currentEmployee && (
        <div style={{ 
          position: "fixed", 
          inset: 0, 
          background: "rgba(0,0,0,0.5)", 
          backdropFilter: "blur(4px)",
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          zIndex: 100,
          padding: 16,
          overflowY: "auto"
        }}>
          <div style={{ 
            background: theme.surface, 
            borderRadius: 20, 
            padding: 28, 
            width: 600, 
            maxWidth: "100%",
            boxShadow: "0 20px 50px rgba(0,0,0,0.2)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800 }}>Complete Your Profile</div>
                <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 4 }}>Welcome, {currentEmployee.name}! Please fill the remaining details</div>
              </div>
              <button 
                onClick={() => setProfileCompleteOpen(false)} 
                style={{ border: "none", background: "transparent", fontSize: 24, cursor: "pointer", color: theme.textMuted }}
              >
                ×
              </button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 14, maxHeight: "70vh", overflowY: "auto", padding: "0 4px" }}>
              
              {/* Personal Information */}
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: theme.accent, marginBottom: 10 }}>PERSONAL INFORMATION</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, display: "block", marginBottom: 6 }}>DATE OF BIRTH *</label>
                    <input 
                      type="date"
                      value={profileData.dob} 
                      onChange={(e: any) => setProfileData({ ...profileData, dob: e.target.value })} 
                      style={{ width: "100%", padding: 12, background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 13, outline: "none" }} 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, display: "block", marginBottom: 6 }}>GENDER *</label>
                    <select 
                      value={profileData.gender} 
                      onChange={(e: any) => setProfileData({ ...profileData, gender: e.target.value })} 
                      style={{ width: "100%", padding: 12, background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 13, outline: "none" }}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, display: "block", marginBottom: 6 }}>MARITAL STATUS *</label>
                    <select 
                      value={profileData.marital_status} 
                      onChange={(e: any) => setProfileData({ ...profileData, marital_status: e.target.value })} 
                      style={{ width: "100%", padding: 12, background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 13, outline: "none" }}
                    >
                      <option value="">Select Status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, display: "block", marginBottom: 6 }}>BLOOD GROUP *</label>
                    <select 
                      value={profileData.blood_group} 
                      onChange={(e: any) => setProfileData({ ...profileData, blood_group: e.target.value })} 
                      style={{ width: "100%", padding: 12, background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 13, outline: "none" }}
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: theme.accent, marginBottom: 10 }}>ADDRESS</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, display: "block", marginBottom: 6 }}>ADDRESS *</label>
                    <textarea 
                      value={profileData.address} 
                      onChange={(e: any) => setProfileData({ ...profileData, address: e.target.value })} 
                      rows={2}
                      placeholder="Enter full address"
                      style={{ width: "100%", padding: 12, background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 13, outline: "none", resize: "vertical" }} 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, display: "block", marginBottom: 6 }}>CITY *</label>
                    <input 
                      value={profileData.city} 
                      onChange={(e: any) => setProfileData({ ...profileData, city: e.target.value })} 
                      style={{ width: "100%", padding: 12, background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 13, outline: "none" }} 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, display: "block", marginBottom: 6 }}>STATE *</label>
                    <input 
                      value={profileData.state} 
                      onChange={(e: any) => setProfileData({ ...profileData, state: e.target.value })} 
                      style={{ width: "100%", padding: 12, background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 13, outline: "none" }} 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, display: "block", marginBottom: 6 }}>COUNTRY *</label>
                    <input 
                      value={profileData.country} 
                      onChange={(e: any) => setProfileData({ ...profileData, country: e.target.value })} 
                      placeholder="e.g., India"
                      style={{ width: "100%", padding: 12, background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 13, outline: "none" }} 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, display: "block", marginBottom: 6 }}>PINCODE *</label>
                    <input 
                      value={profileData.pincode} 
                      onChange={(e: any) => setProfileData({ ...profileData, pincode: e.target.value })} 
                      placeholder="e.g., 600032"
                      style={{ width: "100%", padding: 12, background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 13, outline: "none" }} 
                    />
                  </div>
                </div>
              </div>

              {/* Identity Documents */}
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: theme.accent, marginBottom: 10 }}>IDENTITY DOCUMENTS</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, display: "block", marginBottom: 6 }}>PAN NUMBER *</label>
                    <input 
                      value={profileData.pan_number} 
                      onChange={(e: any) => setProfileData({ ...profileData, pan_number: e.target.value.toUpperCase() })} 
                      placeholder="e.g., ABCDE1234F"
                      style={{ width: "100%", padding: 12, background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 13, outline: "none" }} 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, display: "block", marginBottom: 6 }}>AADHAAR NUMBER *</label>
                    <input 
                      value={profileData.aadhaar_number} 
                      onChange={(e: any) => setProfileData({ ...profileData, aadhaar_number: e.target.value })} 
                      placeholder="e.g., 1234 5678 9012"
                      style={{ width: "100%", padding: 12, background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 13, outline: "none" }} 
                    />
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: theme.accent, marginBottom: 10 }}>BANK DETAILS</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, display: "block", marginBottom: 6 }}>BANK NAME *</label>
                    <input 
                      value={profileData.bank_name} 
                      onChange={(e: any) => setProfileData({ ...profileData, bank_name: e.target.value })} 
                      placeholder="e.g., HDFC Bank"
                      style={{ width: "100%", padding: 12, background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 13, outline: "none" }} 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, display: "block", marginBottom: 6 }}>ACCOUNT NUMBER *</label>
                    <input 
                      value={profileData.account_number} 
                      onChange={(e: any) => setProfileData({ ...profileData, account_number: e.target.value })} 
                      placeholder="Enter account number"
                      style={{ width: "100%", padding: 12, background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 13, outline: "none" }} 
                    />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, display: "block", marginBottom: 6 }}>IFSC CODE *</label>
                    <input 
                      value={profileData.ifsc_code} 
                      onChange={(e: any) => setProfileData({ ...profileData, ifsc_code: e.target.value.toUpperCase() })} 
                      placeholder="e.g., HDFC0001234"
                      style={{ width: "100%", padding: 12, background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 13, outline: "none" }} 
                    />
                  </div>
                </div>
              </div>

              {/* Education */}
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: theme.accent, marginBottom: 10 }}>EDUCATION</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, display: "block", marginBottom: 6 }}>QUALIFICATION *</label>
                    <select 
                      value={profileData.qualification} 
                      onChange={(e: any) => setProfileData({ ...profileData, qualification: e.target.value })} 
                      style={{ width: "100%", padding: 12, background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 13, outline: "none" }}
                    >
                      <option value="">Select Qualification</option>
                      <option value="10th">10th Standard</option>
                      <option value="12th">12th Standard</option>
                      <option value="Diploma">Diploma</option>
                      <option value="B.E/B.Tech">B.E/B.Tech</option>
                      <option value="M.E/M.Tech">M.E/M.Tech</option>
                      <option value="MBA">MBA</option>
                      <option value="MCA">MCA</option>
                      <option value="B.Sc">B.Sc</option>
                      <option value="M.Sc">M.Sc</option>
                      <option value="B.Com">B.Com</option>
                      <option value="M.Com">M.Com</option>
                      <option value="PhD">PhD</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, display: "block", marginBottom: 6 }}>COLLEGE/UNIVERSITY *</label>
                    <input 
                      value={profileData.college} 
                      onChange={(e: any) => setProfileData({ ...profileData, college: e.target.value })} 
                      placeholder="e.g., Anna University"
                      style={{ width: "100%", padding: 12, background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 13, outline: "none" }} 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, display: "block", marginBottom: 6 }}>PASSING YEAR *</label>
                    <input 
                      type="number"
                      value={profileData.passing_year} 
                      onChange={(e: any) => setProfileData({ ...profileData, passing_year: e.target.value })} 
                      placeholder="e.g., 2022"
                      style={{ width: "100%", padding: 12, background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 13, outline: "none" }} 
                    />
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, display: "block", marginBottom: 6 }}>SKILLS</label>
                <textarea 
                  value={profileData.skills} 
                  onChange={(e: any) => setProfileData({ ...profileData, skills: e.target.value })} 
                  rows={2}
                  placeholder="e.g., JavaScript, React, Node.js, Python (comma separated)"
                  style={{ width: "100%", padding: 12, background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 13, outline: "none", resize: "vertical" }} 
                />
              </div>

              {/* Emergency Contact */}
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: theme.accent, marginBottom: 10 }}>EMERGENCY CONTACT</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, display: "block", marginBottom: 6 }}>CONTACT NAME *</label>
                    <input 
                      value={profileData.emergency_contact_name} 
                      onChange={(e: any) => setProfileData({ ...profileData, emergency_contact_name: e.target.value })} 
                      placeholder="e.g., Parent/Spouse Name"
                      style={{ width: "100%", padding: 12, background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 13, outline: "none" }} 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, display: "block", marginBottom: 6 }}>CONTACT NUMBER *</label>
                    <input 
                      value={profileData.emergency_contact_number} 
                      onChange={(e: any) => setProfileData({ ...profileData, emergency_contact_number: e.target.value })} 
                      placeholder="e.g., +91 9876543210"
                      style={{ width: "100%", padding: 12, background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 13, outline: "none" }} 
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: 12, marginTop: 8, paddingTop: 8 }}>
                <button 
                  onClick={() => setProfileCompleteOpen(false)} 
                  style={{ flex: 1, padding: 12, background: "transparent", color: theme.textMuted, border: `1px solid ${theme.border}`, borderRadius: 8, fontWeight: 700, cursor: "pointer" }}
                >
                  Skip for Now
                </button>
                <button 
                  onClick={handleProfileComplete} 
                  style={{ flex: 1, padding: 12, background: theme.accent, color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}
                >
                  Complete Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}