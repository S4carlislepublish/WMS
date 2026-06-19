import React, { useEffect, useState, useCallback } from "react";
import axios, { AxiosError } from "axios";

// Constants
const BASE_URL = "http://10.1.8.103:5000/api";

// TypeScript Interfaces
interface Employee {
  id: number;
  employee_name: string;
  working_days: number;
  leave_days: number;
  salary: number;
  account_number: string | null;
  monthly_salary: number;
  payment_status: "Paid" | "Pending";
  paid_date?: string;
}

interface PayrollResponse {
  data: Employee[];
}

// Component
const PayrollPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayroll = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await axios.get<PayrollResponse>(`${BASE_URL}/payroll/summary`);
      setEmployees(res.data.data || []);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || "Failed to fetch payroll data");
      setEmployees([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayroll();
  }, [fetchPayroll]);

  const downloadPayslip = (id: number): void => {
    window.open(`${BASE_URL}/payroll/payslip/${id}`, "_blank");
  };

  const markAsPaid = async (id: number): Promise<void> => {
    try {
      await axios.put(`${BASE_URL}/payroll/mark-paid/${id}`);
      await fetchPayroll();
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || "Failed to mark salary as paid");
    }
  };

  const exportPayrollExcel = (): void => {
    window.open(`${BASE_URL}/attendance/export-paysheet`, "_blank");
  };

  const renderStatus = (emp: Employee): React.JSX.Element => {
    if (emp.payment_status === "Paid") {
      return (
        <div>
          <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-medium">
            Paid
          </span>
          <div className="text-xs text-gray-400 mt-0.5">
            {emp.paid_date}
          </div>
        </div>
      );
    }

    return (
      <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-medium">
        Pending
      </span>
    );
  };

  const renderActions = (emp: Employee): React.JSX.Element => {
    return (
      <>
        <button
          onClick={() => downloadPayslip(emp.id)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-200"
          aria-label={`Download payslip for ${emp.employee_name}`}
        >
          Payslip
        </button>

        {emp.payment_status === "Paid" ? (
          <button
            disabled
            className="bg-gray-400 text-white px-3 py-1.5 rounded-md text-xs cursor-not-allowed"
            aria-label="Salary already paid"
          >
            Paid
          </button>
        ) : (
          <button
            onClick={() => markAsPaid(emp.id)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-200"
            aria-label={`Mark salary as paid for ${emp.employee_name}`}
          >
            Pay
          </button>
        )}
      </>
    );
  };

  if (isLoading) {
    return (
      <div className="p-4 flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (error && employees.length === 0) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600 text-sm font-medium">{error}</p>
          <button
            onClick={fetchPayroll}
            className="mt-3 bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-md text-sm transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50">
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Payroll Management</h2>
          <button
            onClick={exportPayrollExcel}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-200"
            aria-label="Export payroll to Excel"
          >
            Export Excel
          </button>
        </div>

        {employees.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            <p className="text-sm">No payroll data available for this period.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-3 py-2 text-left font-semibold text-gray-600 text-xs">Employee</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-600 text-xs">Working</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-600 text-xs">Leave</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-600 text-xs">Salary</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-600 text-xs">Account No</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-600 text-xs">Monthly</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-600 text-xs">Status</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-600 text-xs">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-3 py-2 text-gray-700 text-xs">{emp.employee_name}</td>
                    <td className="px-3 py-2 text-gray-600 text-xs">{emp.working_days}</td>
                    <td className="px-3 py-2 text-gray-600 text-xs">{emp.leave_days}</td>
                    <td className="px-3 py-2 text-gray-700 text-xs">₹{emp.salary}</td>
                    <td className="px-3 py-2 text-gray-600 text-xs">{emp.account_number || "-"}</td>
                    <td className="px-3 py-2 font-semibold text-emerald-600 text-xs">₹{emp.monthly_salary}</td>
                    <td className="px-3 py-2">{renderStatus(emp)}</td>
                    <td className="px-3 py-2 flex gap-1.5">{renderActions(emp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayrollPage;