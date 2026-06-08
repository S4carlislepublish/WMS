import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import {
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const QAPage: React.FC = () => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedAssignment, setSelectedAssignment] =
    useState<any | null>(null);

  const [processing, setProcessing] = useState(false);

  const [comments, setComments] = useState('');

  const [action, setAction] = useState<
    'approve' | 'reject' | null
  >(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await apiService.getProjects({
        status: 'active',
        stage: 'QA',
      });

      setAssignments(response.data.projects || []);
    }

    catch (error) {
      toast.error('Failed to fetch QA assignments');
    }

    finally {
      setLoading(false);
    }
  };

  const handleQAAction = async (
    projectId: number,
    qaAction: 'approve' | 'reject'
  ) => {
    setProcessing(true);

    setAction(qaAction);

    try {
      await apiService.completeStage(projectId, {
        comments: `${
          qaAction === 'approve'
            ? 'Approved'
            : 'Rejected'
        }: ${comments}`,
      });

      toast.success(
        qaAction === 'approve'
          ? 'QA Approved! Project completed.'
          : 'QA Rejected. Project returned for revisions.'
      );

      setComments('');

      setSelectedAssignment(null);

      fetchAssignments();
    }

    catch (error: any) {
      toast.error(
        error.response?.data?.error ||
          'QA action failed'
      );
    }

    finally {
      setProcessing(false);

      setAction(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* Header */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Quality Assurance Workspace
        </h1>

        <p className="text-gray-400 mt-2">
          Review and validate completed projects
        </p>
      </div>

      {/* Loading */}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-white"></div>
        </div>
      ) : assignments.length === 0 ? (
        <div className="bg-gray-800 rounded-2xl p-12 text-center">
          <CheckCircleIcon className="h-16 w-16 text-gray-500 mx-auto mb-4" />

          <h2 className="text-2xl font-semibold text-white">
            No Projects Pending
          </h2>

          <p className="text-gray-400 mt-2">
            No projects available for QA review.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}

          <div className="space-y-4">
            {assignments.map((assignment, index) => (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: index * 0.1,
                }}
                onClick={() =>
                  setSelectedAssignment(assignment)
                }
                className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                  selectedAssignment?.id === assignment.id
                    ? 'bg-white text-black border-white'
                    : 'bg-gray-800 border-gray-700 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <DocumentTextIcon className="h-6 w-6" />

                  <div>
                    <h3 className="font-semibold">
                      {assignment.project_title}
                    </h3>

                    <p className="text-sm opacity-70">
                      {assignment.project_code}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Details */}

          <div className="lg:col-span-2">
            {selectedAssignment ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 rounded-2xl p-6 space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {selectedAssignment.project_title}
                  </h2>

                  <p className="text-gray-400 mt-1">
                    {selectedAssignment.project_code}
                  </p>
                </div>

                {/* Info */}

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700 rounded-xl p-4">
                    <p className="text-gray-400 text-sm">
                      Client
                    </p>

                    <h3 className="text-white font-semibold mt-1">
                      {selectedAssignment.client_name ||
                        'N/A'}
                    </h3>
                  </div>

                  <div className="bg-gray-700 rounded-xl p-4">
                    <p className="text-gray-400 text-sm">
                      Workflow
                    </p>

                    <h3 className="text-white font-semibold mt-1">
                      {selectedAssignment.workflow ||
                        'Standard'}
                    </h3>
                  </div>
                </div>

                {/* Comments */}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    QA Comments
                  </label>

                  <textarea
                    rows={5}
                    value={comments}
                    onChange={(e) =>
                      setComments(e.target.value)
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white"
                    placeholder="Enter QA feedback..."
                  />
                </div>

                {/* Buttons */}

                <div className="flex gap-4">
                  <button
                    disabled={processing}
                    onClick={() =>
                      handleQAAction(
                        selectedAssignment.id,
                        'approve'
                      )
                    }
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <CheckCircleIcon className="h-5 w-5" />

                    {processing &&
                    action === 'approve'
                      ? 'Approving...'
                      : 'Approve'}
                  </button>

                  <button
                    disabled={processing}
                    onClick={() =>
                      handleQAAction(
                        selectedAssignment.id,
                        'reject'
                      )
                    }
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <XCircleIcon className="h-5 w-5" />

                    {processing &&
                    action === 'reject'
                      ? 'Rejecting...'
                      : 'Reject'}
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="bg-gray-800 rounded-2xl p-12 text-center">
                <DocumentTextIcon className="h-16 w-16 text-gray-500 mx-auto mb-4" />

                <h2 className="text-2xl font-semibold text-white">
                  Select a Project
                </h2>

                <p className="text-gray-400 mt-2">
                  Choose a project from the left panel to
                  review.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QAPage;