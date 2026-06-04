import React, { useEffect, useMemo, useState } from 'react';
import {
  XMarkIcon,
  CloudArrowUpIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { apiService } from '../services/api';

interface CreateProjectModalProps {
  onClose: (refresh: boolean) => void;
}

interface Client {
  id: number;
  designation: string;
  vendor_number: string;
}

interface ParsedChapter {
  file_name: string;
  chapter_title: string;
  chapter_order: number;
  file_size?: number;
  sla_hours: number;
  delivery_date: string;
}

interface FormDataType {
  project_code: string;
  customer: string;
  customer_name: string;
  customer_contact: string;
  division_code: string;
  billing_location: string;
  category: string;
  sales_person: string;
  project_title: string;
  priority: string;
  complexity: string;
  client_id: number | '';
  edition: string;
  color: string;
  trim_size: string;
  copyright_year: string;
  manuscript_pages: number | '';
  estimated_pages: number | '';
  actual_pages: number | '';
  isbn_number: string;
  xml_standard: string;
  workflow_id: number;
  final_delivery_date: string;
  notes: string;
}

const defaultSlaMap: Record<string, number> = {
  default: 48,
};

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [chapters, setChapters] = useState<ParsedChapter[]>([]);
  const [zipParsed, setZipParsed] = useState(false);

  const [formData, setFormData] = useState<FormDataType>({
    project_code: '',
    customer: '',
    customer_name: '',
    customer_contact: '',
    division_code: '',
    billing_location: '',
    category: '',
    sales_person: '',
    project_title: '',
    priority: 'medium',
    complexity: 'normal',
    client_id: '',
    edition: '',
    color: '',
    trim_size: '',
    copyright_year: '',
    manuscript_pages: '',
    estimated_pages: '',
    actual_pages: '',
    isbn_number: '',
    xml_standard: '',
    workflow_id: 1,
    final_delivery_date: '',
    notes: '',
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await apiService.getClients({ per_page: 1000 });
      setClients(response.data.clients || []);
    } catch (error) {
      toast.error('Failed to fetch clients');
    }
  };

  const updateForm = (key: keyof FormDataType, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const steps = [
    { number: 1, name: 'Project Info' },
    { number: 2, name: 'Book Details' },
    { number: 3, name: 'Upload ZIP' },
    { number: 4, name: 'Review Chapters' },
    { number: 5, name: 'SLA & Delivery' },
  ];

  const isStep1Valid =
    formData.project_code.trim() &&
    formData.project_title.trim() &&
    formData.client_id !== '';

  const isStep2Valid = true;

  const isStep3Valid = zipParsed && chapters.length > 0;

  const isStep4Valid = chapters.length > 0;

  const isStep5Valid =
    chapters.length > 0 &&
    chapters.every(
      (chapter) =>
        chapter.sla_hours > 0 && chapter.delivery_date && chapter.chapter_title.trim()
    );

  const canGoNext = () => {
    if (step === 1) return !!isStep1Valid;
    if (step === 2) return !!isStep2Valid;
    if (step === 3) return !!isStep3Valid;
    if (step === 4) return !!isStep4Valid;
    return false;
  };

  const totalFiles = chapters.length;

  const estimatedTotalSla = useMemo(() => {
    return chapters.reduce((sum, chapter) => sum + Number(chapter.sla_hours || 0), 0);
  }, [chapters]);

  const handleNext = () => {
    if (!canGoNext()) {
      toast.error('Please complete the required fields before continuing');
      return;
    }
    setStep((prev) => Math.min(prev + 1, 5));
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const buildDefaultDeliveryDate = (index: number, baseDate?: string) => {
    const date = baseDate ? new Date(baseDate) : new Date();
    date.setDate(date.getDate() + index + 1);
    return date.toISOString().split('T')[0];
  };

  const handleZipSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.zip')) {
      toast.error('Please upload a ZIP file');
      return;
    }

    setZipFile(file);
    setZipParsed(false);
    setChapters([]);

    try {
      setUploading(true);

      /**
       * EXPECTED BACKEND RESPONSE:
       * apiService.parseChapterZip(file)
       * returns:
       * {
       *   data: {
       *     chapters: [
       *       { file_name: 'chapter1.docx', chapter_title: 'Chapter 1', chapter_order: 1, file_size: 12000 },
       *       ...
       *     ]
       *   }
       * }
       */

const response = await apiService.parseChapterZip(file);

console.log("ZIP RESPONSE:", response.data);
      const parsedFiles = response?.data?.chapters || [];

      if (!parsedFiles.length) {
        toast.error('No valid chapter files found in ZIP');
        return;
      }

      const mappedChapters: ParsedChapter[] = parsedFiles.map(
        (item: any, index: number) => ({
          file_name: item.file_name,
          chapter_title:
            item.chapter_title ||
            item.file_name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          chapter_order: item.chapter_order || index + 1,
          file_size: item.file_size || 0,
          sla_hours: defaultSlaMap.default,
          delivery_date: buildDefaultDeliveryDate(index, formData.final_delivery_date),
        })
      );

      setChapters(mappedChapters);
      setZipParsed(true);
      toast.success(`${mappedChapters.length} chapters found in ZIP`);
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Failed to parse ZIP file');
    } finally {
      setUploading(false);
    }
  };

  const updateChapter = (
    index: number,
    field: keyof ParsedChapter,
    value: string | number
  ) => {
    setChapters((prev) =>
      prev.map((chapter, i) =>
        i === index ? { ...chapter, [field]: value } : chapter
      )
    );
  };

  const applySameSlaToAll = (hours: number) => {
    setChapters((prev) =>
      prev.map((chapter) => ({ ...chapter, sla_hours: hours }))
    );
  };

  const applySameDeliveryToAll = (date: string) => {
    setChapters((prev) =>
      prev.map((chapter) => ({ ...chapter, delivery_date: date }))
    );
  };

  const handleCreateProject = async () => {
    if (!isStep5Valid) {
      toast.error('Please complete SLA and delivery details for all chapters');
      return;
    }

    if (!zipFile) {
      toast.error('ZIP file is missing');
      return;
    }

    try {
      setLoading(true);

      /**
       * EXPECTED FINAL API:
       * apiService.createProjectWithChapters(formPayload, zipFile)
       *
       * Payload example:
       * {
       *   project: { ...project fields... },
       *   book_details: { ...book fields... },
       *   chapters: [
       *     {
       *       chapter_title,
       *       chapter_order,
       *       file_name,
       *       sla_hours,
       *       delivery_date
       *     }
       *   ]
       * }
       */

      const payload = {
        project: {
          project_code: formData.project_code,
          customer: formData.customer,
          customer_name: formData.customer_name,
          customer_contact: formData.customer_contact,
          division_code: formData.division_code,
          billing_location: formData.billing_location,
          category: formData.category,
          sales_person: formData.sales_person,
          project_title: formData.project_title,
          priority: formData.priority,
          complexity: formData.complexity,
          client_id: Number(formData.client_id),
          workflow_id: formData.workflow_id,
          notes: formData.notes,
          final_delivery_date: formData.final_delivery_date,
        },
        book_details: {
          edition: formData.edition,
          color: formData.color,
          trim_size: formData.trim_size,
          copyright_year: formData.copyright_year,
          manuscript_pages: Number(formData.manuscript_pages || 0),
          estimated_pages: Number(formData.estimated_pages || 0),
          actual_pages: Number(formData.actual_pages || 0),
          isbn_number: formData.isbn_number,
          xml_standard: formData.xml_standard,
        },
        chapters: chapters.map((chapter) => ({
          chapter_title: chapter.chapter_title,
          chapter_order: chapter.chapter_order,
          file_name: chapter.file_name,
          file_size: chapter.file_size || 0,
          sla_hours: Number(chapter.sla_hours),
          delivery_date: chapter.delivery_date,
        })),
      };

      await apiService.createProjectWithChapters(payload, zipFile);

      toast.success('Project created successfully with chapters, SLA, and delivery');
      onClose(true);
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Create New Project</h2>
              <p className="mt-1 text-sm text-slate-500">
                Add project details, upload chapters, review files, and assign delivery.
              </p>
            </div>

            <button
              onClick={() => onClose(false)}
              className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Stepper */}
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
              {steps.map((s) => {
                const active = step === s.number;
                const completed = step > s.number;

                return (
                  <div
                    key={s.number}
                    className={`rounded-2xl border px-4 py-3 ${
                      active
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : completed
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 bg-white text-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                          active
                            ? 'bg-white text-slate-900'
                            : completed
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {completed ? <CheckCircleIcon className="h-5 w-5" /> : s.number}
                      </div>
                      <span className="text-sm font-medium">{s.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="max-h-[58vh] overflow-y-auto px-6 py-6">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">Project Information</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Enter the basic project and client details.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Project Code *
                    </label>
                    <input
                      type="text"
                      value={formData.project_code}
                      onChange={(e) => updateForm('project_code', e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      value={formData.project_title}
                      onChange={(e) => updateForm('project_title', e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Client *
                    </label>
                    <select
                      value={formData.client_id}
                      onChange={(e) =>
                        updateForm(
                          'client_id',
                          e.target.value ? Number(e.target.value) : ''
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-400"
                    >
                      <option value="">Select client</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.designation} - {client.vendor_number}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => updateForm('priority', e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-400"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Customer
                    </label>
                    <input
                      type="text"
                      value={formData.customer}
                      onChange={(e) => updateForm('customer', e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      value={formData.customer_name}
                      onChange={(e) => updateForm('customer_name', e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">Book Details</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Add publication and manuscript information.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Edition
                    </label>
                    <input
                      type="text"
                      value={formData.edition}
                      onChange={(e) => updateForm('edition', e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      ISBN Number
                    </label>
                    <input
                      type="text"
                      value={formData.isbn_number}
                      onChange={(e) => updateForm('isbn_number', e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Manuscript Pages
                    </label>
                    <input
                      type="number"
                      value={formData.manuscript_pages}
                      onChange={(e) =>
                        updateForm(
                          'manuscript_pages',
                          e.target.value ? Number(e.target.value) : ''
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Estimated Pages
                    </label>
                    <input
                      type="number"
                      value={formData.estimated_pages}
                      onChange={(e) =>
                        updateForm(
                          'estimated_pages',
                          e.target.value ? Number(e.target.value) : ''
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Actual Pages
                    </label>
                    <input
                      type="number"
                      value={formData.actual_pages}
                      onChange={(e) =>
                        updateForm(
                          'actual_pages',
                          e.target.value ? Number(e.target.value) : ''
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      XML Standard
                    </label>
                    <input
                      type="text"
                      value={formData.xml_standard}
                      onChange={(e) => updateForm('xml_standard', e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">Upload Chapter ZIP</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Each file inside the ZIP will be treated as one chapter.
                  </p>
                </div>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center transition hover:border-slate-400 hover:bg-slate-100">
                  <CloudArrowUpIcon className="h-14 w-14 text-slate-400" />
                  <p className="mt-4 text-lg font-medium text-slate-900">
                    Upload chapter ZIP
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Example: if the ZIP has 5 files, 5 chapters will be created for review.
                  </p>
                  <input
                    type="file"
                    accept=".zip"
                    onChange={handleZipSelect}
                    className="hidden"
                  />
                  <span className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white">
                    {uploading ? 'Parsing ZIP...' : 'Choose ZIP file'}
                  </span>
                </label>

                {zipFile && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-sm text-slate-500">Selected file</p>
                    <p className="mt-1 font-medium text-slate-900">{zipFile.name}</p>
                  </div>
                )}

                {zipParsed && chapters.length > 0 && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                    <p className="font-medium text-emerald-700">
                      ZIP parsed successfully
                    </p>
                    <p className="mt-1 text-sm text-emerald-600">
                      {chapters.length} chapter files found and ready for review.
                    </p>
                  </div>
                )}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">Review Chapters</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Each uploaded file is listed as one chapter before final creation.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
                    Total chapters: <span className="font-semibold text-slate-900">{totalFiles}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {chapters.map((chapter, index) => (
                    <div
                      key={`${chapter.file_name}-${index}`}
                      className="rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-[90px_1fr_180px] md:items-center">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
                          {chapter.chapter_order}
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            Chapter Title
                          </label>
                          <input
                            type="text"
                            value={chapter.chapter_title}
                            onChange={(e) =>
                              updateChapter(index, 'chapter_title', e.target.value)
                            }
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                          />
                          <p className="mt-2 text-xs text-slate-500">
                            Source file: {chapter.file_name}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-3">
                          <p className="text-xs uppercase tracking-wide text-slate-500">
                            File size
                          </p>
                          <p className="mt-1 font-medium text-slate-900">
                            {chapter.file_size
                              ? `${(chapter.file_size / 1024).toFixed(1)} KB`
                              : '—'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">SLA & Delivery</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Set the turnaround time and delivery date for each chapter, then create the project.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Chapter count</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{chapters.length}</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Total SLA hours</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">
                      {estimatedTotalSla}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Final delivery date</p>
                    <input
                      type="date"
                      value={formData.final_delivery_date}
                      onChange={(e) => updateForm('final_delivery_date', e.target.value)}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Apply same SLA to all chapters
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => applySameSlaToAll(24)}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
                      >
                        24 hrs
                      </button>
                      <button
                        type="button"
                        onClick={() => applySameSlaToAll(48)}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
                      >
                        48 hrs
                      </button>
                      <button
                        type="button"
                        onClick={() => applySameSlaToAll(72)}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
                      >
                        72 hrs
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Apply same delivery date to all chapters
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="date"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                        onChange={(e) => applySameDeliveryToAll(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {chapters.map((chapter, index) => (
                    <div
                      key={`${chapter.file_name}-${index}`}
                      className="rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.4fr_180px_220px] md:items-end">
                        <div>
                          <div className="flex items-center gap-2">
                            <DocumentTextIcon className="h-5 w-5 text-slate-400" />
                            <p className="font-medium text-slate-900">
                              {chapter.chapter_title}
                            </p>
                          </div>
                          <p className="mt-1 text-sm text-slate-500">{chapter.file_name}</p>
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            SLA (hours)
                          </label>
                          <input
                            type="number"
                            min={1}
                            value={chapter.sla_hours}
                            onChange={(e) =>
                              updateChapter(index, 'sla_hours', Number(e.target.value))
                            }
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                          />
                        </div>

                        <div>
                          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                            <CalendarDaysIcon className="h-4 w-4" />
                            Delivery date
                          </label>
                          <input
                            type="date"
                            value={chapter.delivery_date}
                            onChange={(e) =>
                              updateChapter(index, 'delivery_date', e.target.value)
                            }
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Notes
                  </label>
                  <textarea
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => updateForm('notes', e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                    placeholder="Optional project notes..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-3 border-t border-slate-200 bg-white px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-slate-500">
              Step {step} of {steps.length}
            </div>

            <div className="flex items-center gap-3">
              {step > 1 && (
                <button
                  onClick={handlePrev}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  disabled={loading || uploading}
                >
                  Previous
                </button>
              )}

              {step < 5 ? (
                <button
                  onClick={handleNext}
                  disabled={!canGoNext() || loading || uploading}
                  className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleCreateProject}
                  disabled={loading || uploading || !isStep5Valid}
                  className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? 'Creating Project...' : 'Create Project'}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateProjectModal;