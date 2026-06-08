import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { apiService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  EllipsisVerticalIcon,
  StarIcon,
  FunnelIcon,
  ChevronDownIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import CreateProjectModal from '../modals/CreateProjectModal';
import { workflowService } from '../services/api';
import { projectService } from '../services/api';


interface Project {
  id: number;
  project_code: string;
  project_title: string;
  customer_name: string;
  priority: string;
  current_stage: string;
  status: string;
  created_at: string;
  activated_at: string | null;
  completed_at: string | null;
    is_active: boolean;
}


const PROJECT_STAGES = [
  'Pre-Editing',
  'Copywriting',
  'Proofreading',
  'QA',
  'Final Delivery',
];


const PROJECT_STATUS = [
  'draft',
  'active',
  'completed',
  'overdue',
];


const ProjectsPage: React.FC = () => {
  const { user } = useAuthStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, per_page: 10, total: 0, pages: 0 });
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [starredProjects, setStarredProjects] = useState<number[]>([]);
  const [workflows, setWorkflows] = useState<any[]>([]);
const [selectedWorkflows, setSelectedWorkflows] = useState<Record<number, string>>({});

  const fetchWorkflows = async () => {
  try {
const response = await workflowService.getWorkflows();
    setWorkflows(response.data.workflows || response.data);
  } catch (error) {
    console.error('Workflow load error:', error);
  }
};



const handleActivate = async (
  projectId: number
) => {

  try {

    const workflowId =
      selectedWorkflows[projectId];

    console.log(
      "PROJECT ID:",
      projectId
    );

    console.log(
      "WORKFLOW ID:",
      workflowId
    );

    if (!workflowId) {
      alert("Select Workflow First");
      return;
    }

    await apiService.activateProject(
      projectId,
      workflowId
    );

    alert(
      "Project Activated Successfully"
    );

    fetchProjects();

  } catch (error) {

    console.error(
      "ACTIVATE ERROR:",
      error
    );

    alert("Activation Failed");
  }
};

const handleDeactivate = async (projectId: number) => {
  try {
    const response = await apiService.deactivateProject(projectId);

    toast.success("Project Deactivated");

    fetchProjects();

    console.log(response.data);
  } catch (error: any) {
    console.log(error);

    toast.error(
      error.response?.data?.error ||
      "Deactivation Failed"
    );
  }
};


  useEffect(() => {
  fetchProjects();
  fetchWorkflows();
}, [pagination.page, statusFilter, stageFilter, priorityFilter]);


  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProjects({
        page: pagination.page,
        per_page: pagination.per_page,
        status: statusFilter,
        stage: stageFilter,
        search: search,
      });
      setProjects(response.data.projects);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };


  const handleCreate = () => {
    setShowModal(true);
  };


  const handleModalClose = (refresh = false) => {
    setShowModal(false);
    if (refresh) {
      fetchProjects();
    }
  };




  const toggleStar = (projectId: number) => {
    setStarredProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };


  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };


  const getPriorityDotColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };


  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-700 border-gray-200',
      active: 'bg-blue-100 text-blue-700 border-blue-200',
      completed: 'bg-green-100 text-green-700 border-green-200',
      overdue: 'bg-red-100 text-red-700 border-red-200',
    };
    return badges[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };


  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon className="w-4 h-4" />;
      case 'overdue': return <ExclamationTriangleIcon className="w-4 h-4" />;
      case 'active': return <ClockIcon className="w-4 h-4" />;
      default: return <DocumentTextIcon className="w-4 h-4" />;
    }
  };


  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };


  const filteredProjects = [...projects].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'project_title':
        comparison = a.project_title.localeCompare(b.project_title);
        break;
      case 'priority':
        comparison = a.priority.localeCompare(b.priority);
        break;
      case 'created_at':
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
      default:
        comparison = 0;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });


  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">Manage and track all your projects</p>
        </div>
        {user?.role === 'Project Manager' || user?.role === 'Admin' || user?.role === 'Super Admin' ? (
          <motion.button
            onClick={handleCreate}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
          >
            <PlusIcon className="h-5 w-5" />
            New Project
          </motion.button>
        ) : null}
      </div>


      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Projects</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{pagination.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Active</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {projects.filter(p => p.status === 'active').length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Completed</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {projects.filter(p => p.status === 'completed').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Overdue</p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {projects.filter(p => p.status === 'overdue').length}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>


      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <  FunnelIcon   className="h-5 w-5 text-gray-600" />
            <h2 className="font-semibold text-gray-900">Filters</h2>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1"
          >
            {showFilters ? 'Hide' : 'Show'} Filters
            <ChevronDownIcon className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Status</option>
                    {PROJECT_STATUS.map(status => (
                      <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stage</label>
                  <select
                    value={stageFilter}
                    onChange={(e) => setStageFilter(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Stages</option>
                    {PROJECT_STAGES.map(stage => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Priority</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setStatusFilter('');
                      setStageFilter('');
                      setPriorityFilter('');
                      setSearch('');
                    }}
                    className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>


        {/* Search Bar */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects by title, code, or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>


      {/* Projects Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('project_title')}>
                  Project
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Stage
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('priority')}>
                  Priority
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('created_at')}>
                  Created
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <DocumentTextIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No projects found</p>
                    <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search criteria</p>
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project, index) => (
                  <motion.tr
                    key={project.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={starredProjects.includes(project.id)}
                        onChange={() => toggleStar(project.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-semibold text-gray-900">{project.project_title}</p>
                          <p className="text-sm text-gray-500">{project.project_code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-700 font-medium">{project.customer_name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1.5 bg-blue-100 text-blue-700 border border-blue-200 rounded-full text-xs font-semibold">
                        {project.current_stage}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getPriorityDotColor(project.priority)}`}></div>
                        <span className={`px-3 py-1.5 border rounded-full text-xs font-semibold ${getPriorityColor(project.priority)}`}>
                          {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`${getStatusBadge(project.status).split(' ')[0]} p-1 rounded`}>
                          {getStatusIcon(project.status)}
                        </div>
                        <span className={`px-3 py-1.5 border rounded-full text-xs font-semibold ${getStatusBadge(project.status)}`}>
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-700 text-sm">
                        {new Date(project.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
  <div className="flex items-center justify-end gap-2">

    {project.status === 'draft' && (
      <>
        <select
          value={selectedWorkflows[project.id] || ''}
          onChange={(e) =>
            setSelectedWorkflows({
              ...selectedWorkflows,
              [project.id]: e.target.value,
            })
          }
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Workflow</option>

          {workflows.map((workflow) => (
            <option
              key={workflow.id}
              value={workflow.id}
            >
              {workflow.name}
            </option>
          ))}
        </select>
{project.is_active ? (
  <button
    onClick={() => handleDeactivate(project.id)}
    className="bg-red-600 text-white px-4 py-2 rounded-lg"
  >
    Deactivate
  </button>
) : (
  <button
    onClick={() => handleActivate(project.id)}
    className="bg-green-600 text-white px-4 py-2 rounded-lg"
  >
    Activate
  </button>
)}
      </>
    )}

    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
      <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
    </button>

  </div>
</td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>


        {/* Pagination */}
        {!loading && pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">{((pagination.page - 1) * pagination.per_page) + 1}</span> to{' '}
              <span className="font-semibold">{Math.min(pagination.page * pagination.per_page, pagination.total)}</span> of{' '}
              <span className="font-semibold">{pagination.total}</span> projects
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page === 1}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-700 font-medium">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page === pagination.pages}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>


      {/* Create Project Modal */}
      {showModal && (
        <CreateProjectModal onClose={handleModalClose} />
      )}
    </div>
  );
};


// Add missing icon
import { CheckCircleIcon } from '@heroicons/react/24/outline';


export default ProjectsPage;