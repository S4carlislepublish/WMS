import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { apiService } from '../services/api';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { DocumentTextIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const CopywritingPage: React.FC = () => {
  const { user } = useAuthStore();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<any | null>(null);
  const [completeLoading, setCompleteLoading] = useState(false);
  const [comments, setComments] = useState('');

  useEffect(() => {
     fetchAssignments();
   }, []);

  const fetchAssignments = async () => {
    try {
      const dummyProjects = [
  {
    id: 1,
    project_title: "Mathematics Grade 10",
    project_code: "PRJ-001",
  },
  {
    id: 2,
    project_title: "Physics Handbook",
    project_code: "PRJ-002",
  },
  {
    id: 3,
    project_title: "Chemistry Workbook",
    project_code: "PRJ-003",
  },
];

setAssignments(dummyProjects);
    } catch (error) {
      toast.error('Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteStage = async (projectId: number) => {
    setCompleteLoading(true);
    try {
      await apiService.completeStage(projectId, { comments });
      toast.success('Stage completed! Project moved to Proofreading');
      setComments('');
      setSelectedAssignment(null);
      fetchAssignments();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to complete stage');
    } finally {
      setCompleteLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Copywriting Workspace</h1>
          <p className="text-gray-400 mt-1">Assigned Projects - {user?.full_name}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-white"></div>
        </div>
      ) : assignments.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-12 text-center">
          <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Assigned Projects</h3>
          <p className="text-gray-400">You don't have any copywriting tasks yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            {assignments.map((assignment, index) => (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedAssignment(assignment)}
                className={`bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-750 transition-colors ${
                  selectedAssignment?.id === assignment.id ? 'ring-2 ring-white' : ''
                }`}
              >
                <h3 className="text-white font-semibold">{assignment.project_title}</h3>
                <p className="text-gray-400 text-sm">{assignment.project_code}</p>
              </motion.div>
            ))}
          </div>

          <div className="lg:col-span-2">
            {selectedAssignment ? (
              <div className="bg-gray-800 rounded-lg p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">
                    {selectedAssignment.project_title}
                  </h2>
                  <p className="text-gray-400">{selectedAssignment.project_code}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Comments
                  </label>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white"
                    placeholder="Add any notes..."
                  />
                </div>

                <button
                  onClick={() => handleCompleteStage(selectedAssignment.id)}
                  disabled={completeLoading}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  {completeLoading ? 'Completing...' : 'Complete & Move to Proofreading'}
                </button>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-12 text-center">
                <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Select a Project</h3>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CopywritingPage;