import {
  HomeIcon, UserGroupIcon, FolderIcon, CalendarIcon, ChartBarIcon,
  Cog6ToothIcon, BanknotesIcon, BellIcon,
} from "@heroicons/react/24/outline";
import { Phone } from "lucide-react";

export const useNavigation = (user: any) => {
  const getNavigationItems = () => {
    if (user?.access_level === "admin") {
      return [
        { name: "Dashboard", icon: HomeIcon, path: "/dashboard" },
        { name: "Projects", icon: FolderIcon, path: "/projects" },
        { name: "Clients", icon: UserGroupIcon, path: "/clients" },
        { name: "Payroll", icon: BanknotesIcon, path: "/payroll" },
        { name: "Settings", icon: Cog6ToothIcon, path: "/settings" },
        { name: "Calendar", icon: CalendarIcon, path: "/calendar" },
        { name: "Reports", icon: ChartBarIcon, path: "/reports" },
        { name: "Announcements", icon: BellIcon, path: "/announcements" },
        {
  name: "Telecom Directory",
  path: "/telecom-directory",
  icon: Phone
}
      ];
    }

    if (user?.access_level === "manager") {
      return [
        { name: "Dashboard", icon: HomeIcon, path: "/dashboard" },
        { name: "Projects", icon: FolderIcon, path: "/projects" },
        { name: "Team Management", icon: UserGroupIcon, path: "/manager-dashboard" },
        { name: "Employee Dashboard", icon: HomeIcon, path: "/employee-dashboard" },
        { name: "Calendar", icon: CalendarIcon, path: "/calendar" },
        { name: "Reports", icon: ChartBarIcon, path: "/reports" },
        { name: "Announcements", icon: BellIcon, path: "/announcements" },
        {
  name: "Telecom Directory",
  path: "/telecom-directory",
  icon: Phone
}
      ];
    }

    if (user?.access_level === "hr") {
      return [
        { name: "Dashboard", icon: HomeIcon, path: "/dashboard" },
        { name: "HR Management", icon: UserGroupIcon, path: "/hrms" },
        { name: "Calendar", icon: CalendarIcon, path: "/calendar" },
        { name: "Reports", icon: ChartBarIcon, path: "/reports" },
        { name: "Announcements", icon: BellIcon, path: "/announcements" },
        {
  name: "Telecom Directory",
  path: "/telecom-directory",
  icon: Phone
}
      ];
    }

    return [
      { name: "Dashboard", icon: HomeIcon, path: "/employee-dashboard" },
      { name: "Reports", icon: ChartBarIcon, path: "/reports" },
      { name: "Announcements", icon: BellIcon, path: "/announcements" },
      {
  name: "Telecom Directory",
  path: "/telecom-directory",
  icon: Phone
}
    ];
  };

  return { sidebarItems: getNavigationItems() };
};