import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Completeprofilepage = () => {
  const navigate = useNavigate();

  const [skillInput, setSkillInput] = useState("");

const [skills, setSkills] = useState([]);

const addSkill = () => {
  if (
    skillInput.trim() &&
    !skills.includes(skillInput.trim())
  ) {
    const updatedSkills = [
      ...skills,
      skillInput.trim()
    ];

    setSkills(updatedSkills);

    setFormData({
      ...formData,
      skills: updatedSkills.join(",")
    });

    setSkillInput("");
  }
};

const removeSkill = (skill) => {
  const updatedSkills = skills.filter(
    (item) => item !== skill
  );

  setSkills(updatedSkills);

  setFormData({
    ...formData,
    skills: updatedSkills.join(",")
  });
};




  const [formData, setFormData] = useState({
    dob: "",
    gender: "",
    marital_status: "",
    blood_group: "",

    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",

    bank_name: "",
    account_number: "",
    ifsc_code: "",

    pan_number: "",
    aadhaar_number: "",

    qualification: "",
    college: "",
    passing_year: "",
    percentage: "",

    total_experience: "",
    skills: "",

    emergency_contact_name: "",
    emergency_contact_number: "",
    tenth_school: "",
tenth_percentage: "",

twelfth_school: "",
twelfth_percentage: "",

ug_degree: "",
ug_college: "",
ug_percentage: "",

pg_degree: "",
pg_college: "",
pg_percentage: "",

previous_company: "",

current_ctc: null,
expected_ctc: null,

notice_period: "",

employee_type: "",

work_location: "",

shift_timing: "",

probation_end_date: "",

emergency_contact_relation: "",
  resume_file: null,
  aadhaar_file: null,
  pan_file: null,
  degree_certificate: null,

  pf_number: "",
uan_number: "",
esi_number: "",

tenth_board: "",
twelfth_board: "",

ug_university: "",
pg_university: "",
  });

  const handleFileChange = (e) => {
  const { name, files } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: files[0],
  }));
};

  const InfoCard = ({ label, value, className = "" }) => (
  <div
    className={`group rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition-all duration-200 hover:border-indigo-200 hover:bg-white hover:shadow-md ${className}`}
  >
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
      {label}
    </p>
    <p className="mt-2 break-words text-sm font-semibold text-slate-900 sm:text-base">
      {value || "N/A"}
    </p>
  </div>
);
   

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const employeeId = localStorage.getItem("employee_id");
        const formPayload = new FormData();

Object.keys(formData).forEach((key) => {
  const value = formData[key as keyof typeof formData];

  if (value !== null && value !== undefined) {
    formPayload.append(key, value as any);
  }
});

 

      const response = await fetch(
  `http://localhost:5000/api/employees/${employeeId}`,
  {
    method: "PATCH",
    body: formPayload,
  }
);

      const data = await response.json();

      if (response.ok) {
        toast.success("Profile Completed Successfully");
        navigate("/employee-dashboard");
      } else {
        toast.error(data.error || "Failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };
  const [employeeInfo, setEmployeeInfo] = useState<any>(null);
  const employeeId = localStorage.getItem("employee_id");

const profileImageUrl =
  `http://localhost:5000/api/employees/image/${employeeId}`;

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const employeeId = localStorage.getItem("employee_id");

        const response = await fetch(
  `http://localhost:5000/api/employees/${employeeId}`
);

const data = await response.json();

setEmployeeInfo(data);

setFormData((prev) => ({
  ...prev,

  ...Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      value ?? ""
    ])
  ),
}));

if (data.skills) {
  setSkills(
    data.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean)
  );
}
      } catch (error) {
        console.error(error);
      }
    };

    fetchEmployee();
  }, []);

    const sections = [
    {
      title: "Personal Information",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      fields: (
        <>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Marital Status</label>
            <select
              name="marital_status"
              value={formData.marital_status}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            >
              <option value="">Select Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Blood Group</label>
            <select
              name="blood_group"
              value={formData.blood_group}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>
        </>
      ),
    },
    {
      title: "Address Details",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      fields: (
        <>
          <div className="col-span-full">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Enter your full address"
              rows={3}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">City</label>
            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              placeholder="Enter city"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">State</label>
            <input
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              placeholder="Enter state"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Country</label>
            <input
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              placeholder="Enter country"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Pincode</label>
            <input
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              required
              placeholder="Enter pincode"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        </>
      ),
    },
    {
      title: "Bank Details",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      fields: (
        <>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Bank Name</label>
            <input
              name="bank_name"
              value={formData.bank_name}
              onChange={handleChange}
              required
              placeholder="Enter bank name"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Account Number</label>
            <input
              name="account_number"
              value={formData.account_number}
              onChange={handleChange}
              required
              placeholder="Enter account number"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">IFSC Code</label>
            <input
              name="ifsc_code"
              value={formData.ifsc_code}
              onChange={handleChange}
              required
              placeholder="Enter IFSC code"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        </>
      ),
    },
    {
      title: "Identity Details",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
        </svg>
      ),
      fields: (
        <>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">PAN Number</label>
            <input
              name="pan_number"
              value={formData.pan_number}
              onChange={handleChange}
              required
              placeholder="Enter PAN number"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Aadhaar Number</label>
            <input
              name="aadhaar_number"
              value={formData.aadhaar_number}
              onChange={handleChange}
              required
              placeholder="Enter Aadhaar number"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        </>
      ),
    },
    {
      title: "Education",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      fields: (
        <>
          {/* 10th */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">10th Board</label>
            <select
              name="tenth_board"
              value={formData.tenth_board}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            >
              <option value="">Select Board</option>
              <option value="State Board">State Board</option>
              <option value="CBSE">CBSE</option>
              <option value="ICSE">ICSE</option>
              <option value="Matriculation">Matriculation</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">10th School Name</label>
            <input
              name="tenth_school"
              value={formData.tenth_school}
              onChange={handleChange}
              placeholder="Enter School Name"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">10th Percentage</label>
            <input
              name="tenth_percentage"
              value={formData.tenth_percentage}
              onChange={handleChange}
              placeholder="e.g. 85%"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          {/* 12th */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">12th Board</label>
            <select
              name="twelfth_board"
              value={formData.twelfth_board}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            >
              <option value="">Select Board</option>
              <option value="State Board">State Board</option>
              <option value="CBSE">CBSE</option>
              <option value="ICSE">ICSE</option>
              <option value="Matriculation">Matriculation</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">12th School Name</label>
            <input
              name="twelfth_school"
              value={formData.twelfth_school}
              onChange={handleChange}
              placeholder="Enter School Name"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">12th Percentage</label>
            <input
              name="twelfth_percentage"
              value={formData.twelfth_percentage}
              onChange={handleChange}
              placeholder="e.g. 82%"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          {/* UG */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">UG University</label>
            <select
              name="ug_university"
              value={formData.ug_university}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            >
              <option value="">Select University</option>
              <option value="Anna University">Anna University</option>
              <option value="University of Madras">University of Madras</option>
              <option value="Bharathiar University">Bharathiar University</option>
              <option value="Bharathidasan University">Bharathidasan University</option>
              <option value="VTU">VTU</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">UG Degree</label>
            <input
              name="ug_degree"
              value={formData.ug_degree}
              onChange={handleChange}
              placeholder="e.g. B.Tech IT"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">UG College</label>
            <input
              name="ug_college"
              value={formData.ug_college}
              onChange={handleChange}
              placeholder="Enter UG College"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">UG Percentage / CGPA</label>
            <input
              name="ug_percentage"
              value={formData.ug_percentage}
              onChange={handleChange}
              placeholder="e.g. 8.5 CGPA"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          {/* PG */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">PG Degree (Optional)</label>
            <input
              name="pg_degree"
              value={formData.pg_degree || ""}
              onChange={handleChange}
              placeholder="e.g. MBA"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">PG College</label>
            <input
              name="pg_college"
              value={formData.pg_college}
              onChange={handleChange}
              placeholder="Enter PG College"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">PG Percentage / CGPA</label>
            <input
              name="pg_percentage"
              value={formData.pg_percentage}
              onChange={handleChange}
              placeholder="e.g. 8.8 CGPA"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        </>
      )
    },
    {
      title: "Experience & Skills",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      fields: (
        <>
          <div className="col-span-full">
            <label className="mb-1.5 block text-sm font-medium text-slate-7 √00">Total Experience</label>
            <input
              name="total_experience"
              value={formData.total_experience}
              onChange={handleChange}
              placeholder="e.g., 2 Years or 0"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div className="col-span-full">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Previous Company</label>
            <input
              name="previous_company"
              value={formData.previous_company || ""}
              onChange={handleChange}
              placeholder="e.g., Infosys"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          {/* Fresher Badge */}
          {(formData.total_experience === "0" || formData.total_experience?.toLowerCase() === "fresher") && (
            <div className="col-span-full">
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                🌱 Fresher
              </span>
            </div>
          )}

          {/* Skills */}
          <div className="col-span-full">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Skills</label>
            <div className="flex gap-2">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Enter Skill"
                className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
              <button
                type="button"
                onClick={addSkill}
                className="rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-700 transition-all"
              >
                Add
              </button>
            </div>
          </div>

          {/* Skill Tags */}
          <div className="col-span-full">
            <div className="flex flex-wrap gap-2 mt-3">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )
    },
    {
      title: "Documents Upload",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
        </svg>
      ),
      fields: (
        <>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Resume</label>
            <input
              type="file"
              name="resume_file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Aadhaar Card</label>
            <input
              type="file"
              name="aadhaar_file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">PAN Card</label>
            <input
              type="file"
              name="pan_file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Degree Certificate</label>
            <input
              type="file"
              name="degree_certificate"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        </>
      )
    },
{  title: "PF Details",
  icon: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m0-8H7m14 4v-2.563c0-.759-.372-1.464-1.003-1.894l-2.79-1.919a6.002 6.002 0 00-6.414 0l-2.79 1.919A2.25 2.25 0 003.75 8.437V11A9 9 0 0012 20a9 9 0 008.25-9z" />
    </svg>
  ),
  fields: (
    <div className="space-y-5">
      {/* PF Number */}
      <div className="group">
        <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-700">
          <svg className="h-4 w-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          PF Number
        </label>
        <div className="relative">
          <input
            name="pf_number"
            value={formData.pf_number}
            onChange={handleChange}
            placeholder="Enter your PF number"
            className="w-full rounded-xl border border-slate-300 bg-gradient-to-r from-white to-slate-50 px-4 py-3 pl-11 text-slate-900 placeholder-slate-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 group-hover:border-indigo-300"
          />
          <svg className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m0-8H7m14 4v-2.563c0-.759-.372-1.464-1.003-1.894l-2.79-1.919a6.002 6.002 0 00-6.414 0l-2.79 1.919A2.25 2.25 0 003.75 8.437V11A9 9 0 0012 20a9 9 0 008.25-9z" />
          </svg>
        </div>
      </div>



      {/* Info Banner */}
      <div className="mt-4 rounded-xl bg-indigo-50 border border-indigo-100 p-4">
        <div className="flex items-start gap-3">
          <svg className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-indigo-700">
            <p className="font-medium">Employment Security Information</p>
            <p className="mt-1 text-indigo-600">
              PF (Provident Fund), UAN (Universal Account Number), and ESI (Employee State Insurance) are mandatory for eligible employees.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
},
    {
      title: "Emergency Contact",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      fields: (
        <>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Contact Name</label>
            <input
              name="emergency_contact_name"
              value={formData.emergency_contact_name}
              onChange={handleChange}
              required
              placeholder="Enter contact name"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Contact Number</label>
            <input
              name="emergency_contact_number"
              value={formData.emergency_contact_number}
              onChange={handleChange}
              required
              placeholder="Enter contact number"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 p-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-4 shadow-lg">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-slate-900">Complete Your Profile</h1>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-slate-600">
            Please fill in the remaining details to access your dashboard. All fields are important for your employee record.
          </p>
        </div>

        <div className="rounded-3xl bg-white shadow-2xl shadow-slate-200/50">
          {/* Employee Info Section */}
          {employeeInfo && (
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              {/* Header */}
              <div className="relative border-b border-slate-200 bg-[#1F7A8C] px-6 py-8 sm:px-8">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_30%)]" />

                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
                    <div className="relative">
                      <img
                        src={profileImageUrl}
                        alt={`${employeeInfo.first_name || "Employee"} profile`}
                        className="h-28 w-28 rounded-2xl object-cover ring-4 ring-white/20 shadow-2xl"
                      />
                      <span className="absolute -bottom-2 -right-2 rounded-full border-4 border-slate-900 bg-emerald-400 px-2 py-1 text-[10px] font-semibold text-slate-900 shadow">
                        Active
                      </span>
                    </div>

                    <div className="text-center sm:text-left">
                      <p className="text-sm font-medium text-indigo-200">Employee Profile</p>
                      <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
                        {employeeInfo.first_name || "N/A"} {employeeInfo.last_name || ""}
                      </h2>
                      <p className="mt-1 text-sm text-slate-300">
                        {employeeInfo.designation || "N/A"} • {employeeInfo.department || "N/A"}
                      </p>

                      <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                          ID: {employeeInfo.employee_id || "N/A"}
                        </span>
                        <span className="rounded-full bg-indigo-400/20 px-3 py-1 text-xs font-medium text-indigo-100">
                          Role: {employeeInfo.role || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                      <p className="text-xs text-slate-300">Email</p>
                      <p className="mt-1 truncate text-sm font-semibold text-white">{employeeInfo.email || "N/A"}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                      <p className="text-xs text-slate-300">Phone</p>
                      <p className="mt-1 text-sm font-semibold text-white">{employeeInfo.phone || "N/A"}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur col-span-2 sm:col-span-1">
                      <p className="text-xs text-slate-300">Joining Date</p>
                      <p className="mt-1 text-sm font-semibold text-white">{employeeInfo.joining_date || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 shadow-md">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Employee Information</h3>
                    <p className="text-sm text-slate-500">Personal and professional details</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <InfoCard label="Employee ID" value={employeeInfo.employee_id} />
                  <InfoCard label="First Name" value={employeeInfo.first_name} />
                  <InfoCard label="Last Name" value={employeeInfo.last_name} />
                  <InfoCard label="Email" value={employeeInfo.email} />
                  <InfoCard label="Phone" value={employeeInfo.phone} />
                  <InfoCard label="Department" value={employeeInfo.department} />
                  <InfoCard label="Designation" value={employeeInfo.designation} />
                  <InfoCard label="Role" value={employeeInfo.role} />
                  <InfoCard label="Salary" value={employeeInfo.salary} />
                  <InfoCard label="Joining Date" value={employeeInfo.joining_date} />
                  <InfoCard label="PF Number" value={employeeInfo.pf_number} />
                  <InfoCard label="UAN Number" value={employeeInfo.uan_number} />
                  <InfoCard label="10th Board" value={employeeInfo.tenth_board} />
                  <InfoCard label="UG University" value={employeeInfo.ug_university} />
                  <InfoCard label="Reporting Manager" value={employeeInfo.reporting_manager} className="sm:col-span-2 xl:col-span-3" />
                </div>
              </div>
            </section>
          )}

          {/* Form Sections */}
          <form onSubmit={handleSubmit}>
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {sections.map((section, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 transition-all hover:border-indigo-300 hover:shadow-md"
                  >
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                        {section.icon}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{section.title}</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {section.fields}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 bg-slate-50 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>All fields are required for profile completion</span>
                </div>
                <button
                  type="submit"
                  className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span>Complete Profile</span>
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 transition-opacity group-hover:opacity-20"></div>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Progress Indicator */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">Step 2 of 3 – Complete Profile Information</p>
          <div className="mx-auto mt-2 max-w-md overflow-hidden rounded-full bg-slate-200">
            <div className="h-2 w-2/3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Completeprofilepage;