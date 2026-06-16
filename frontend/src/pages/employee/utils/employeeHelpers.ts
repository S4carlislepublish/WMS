export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'Pending': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
    'Completed': 'bg-green-50 text-green-700 border-green-200',
    'On Hold': 'bg-gray-50 text-gray-700 border-gray-200',
    'Approved': 'bg-green-50 text-green-700 border-green-200',
    'Rejected': 'bg-red-50 text-red-700 border-red-200',
    'Present': 'bg-green-50 text-green-700 border-green-200',
    'Absent': 'bg-red-50 text-red-700 border-red-200',
    'Leave': 'bg-purple-50 text-purple-700 border-purple-200',
  };
  return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
};

export const getPriorityColor = (priority: string): string => {
  const colors: Record<string, string> = {
    'High': 'text-red-600 bg-red-50',
    'Medium': 'text-yellow-600 bg-yellow-50',
    'Low': 'text-green-600 bg-green-50',
  };
  return colors[priority] || 'text-gray-600 bg-gray-50';
};