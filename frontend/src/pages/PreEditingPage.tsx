import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { apiService } from '../services/api';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { DocumentTextIcon, CloudArrowUpIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useNavigate } from "react-router-dom";

interface Assignment {
  id: number;
  project_id: number;
  project_title: string;
  project_code: string;
  workflow_stage: string;
  status: string;
  assigned_at: string;
  chapters: any[];
}

const PreEditingPage: React.FC = () => {
const user = {
  full_name: "User1",
  role: "Pre-Editing",
  team: "Publishing Team",
};
const [assignments, setAssignments] =
  useState<Assignment[]>([]);
   const [loading, setLoading] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [completeLoading, setCompleteLoading] = useState(false);
  const [comments, setComments] = useState('');
  const navigate = useNavigate();

   useEffect(() => {
     fetchAssignments();
   }, []);


  
  const fetchAssignments = async () => {
  try {
    setLoading(true);

    const response = await apiService.getProjects({
      status: "active",
      stage: "Pre-Editing",
    });

    setAssignments(response.data.projects || []);
  } catch (error) {
    console.error(error);
    toast.error("Failed to load assignments");
  } finally {
    setLoading(false);
  }
};

  const handleFileUpload = async () => {
  toast.success("Dummy Upload Success");
};

  const handleCompleteStage = async (
  projectId: number
) => {
  try {
    setCompleteLoading(true);

    await apiService.completeStage(projectId, {
      comments,
    });

    toast.success(
      "Moved to Copywriting"
    );

    fetchAssignments();
  } catch (error) {
    toast.error(
      "Failed to complete stage"
    );
  } finally {
    setCompleteLoading(false);
  }
};

const openChapter = (chapter: any) => {

  navigate("/editor", {
    state: {
      project_id: selectedAssignment?.project_id,
      chapter_id: chapter.id,
      fileName: chapter.file_name,
      filePath: chapter.file_path,
      fileData: chapter
    }
  });

};

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Pre-Editing Workspace</h1>
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
          <p className="text-gray-400">You don't have any projects assigned yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Assignments List */}
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
                <div className="flex items-center mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    assignment.status === 'in_progress' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'
                  }`}>
                    {assignment.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Workspace */}
          <div className="lg:col-span-2">
            {selectedAssignment ? (
              <div className="bg-gray-800 rounded-lg p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">
                    {selectedAssignment.project_title}
                  </h2>
                  <p className="text-gray-400">{selectedAssignment.project_code}</p>
                </div>

                {/* Chapters */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Chapters</h3>
                  <div className="bg-gray-700 rounded-lg p-4">
                    {selectedAssignment.chapters && selectedAssignment.chapters.length > 0 ? (
                      selectedAssignment.chapters.map((chapter:any) => (
  <div
    key={chapter.id}
    onClick={() => openChapter(chapter)}
    className="flex items-center justify-between py-2 border-b border-gray-600 last:border-b-0 cursor-pointer hover:bg-gray-600 px-2 rounded"
  >
    <div className="flex items-center">
      <DocumentTextIcon className="h-5 w-5 text-blue-400 mr-2" />
      <span
  onClick={() => openChapter(chapter)}
  className="text-white cursor-pointer hover:text-blue-400"
>
  {chapter.chapter_title}
</span>
    </div>

    <span
      className={`px-2 py-1 rounded text-xs ${
        chapter.status === "completed"
          ? "bg-green-600 text-white"
          : "bg-yellow-600 text-white"
      }`}
    >
      {chapter.status}
    </span>
  </div>
))
                    ) : (
                      <p className="text-gray-400">No chapters uploaded yet</p>
                    )}
                  </div>
                </div>

                {/* Upload Section */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Upload Completed Files</h3>
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                    <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-300 mb-3">Drag and drop files here or click to upload</p>
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      multiple
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleFileUpload(selectedAssignment.project_id, e.target.files[0]);
                        }
                      }}
                    />
                    <label
                      htmlFor="file-upload"
                      className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold cursor-pointer hover:bg-gray-100 transition-colors inline-block"
                    >
                      {uploadingFile ? 'Uploading...' : 'Choose Files'}
                    </label>
                  </div>
                </div>

                {/* Comments */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Comments (Optional)
                  </label>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                    placeholder="Add any notes or comments..."
                  />
                </div>

                {/* Complete Button */}
                <button
                  onClick={() => handleCompleteStage(selectedAssignment.project_id)}
                  disabled={completeLoading}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  {completeLoading ? 'Completing...' : 'Complete & Move to Copywriting'}
                </button>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-12 text-center">
                <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Select a Project</h3>
                <p className="text-gray-400">Click on a project from the left to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PreEditingPage;