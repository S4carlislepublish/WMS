import React, { useEffect, useState } from "react";
import axios from "axios";
import { PencilIcon } from "@heroicons/react/24/outline";

const BASE_URL = "http://10.1.8.103:5000/api";

const ProfileTab = () => {

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [profile, setProfile] = useState<any>({});

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {

    try {

      const res = await axios.get(
        `${BASE_URL}/employees/profile/${user.id}`
      );

      setProfile(res.data.data);

    } catch (err) {

      console.log(err);

    }

  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });

  };

  const updatePassword = async () => {

    if (
      passwordData.new_password !==
      passwordData.confirm_password
    ) {
      alert("Passwords do not match");
      return;
    }

    try {

      const res = await axios.post(
        `${BASE_URL}/auth/change-password`,
        {
          user_id: user.id,
          current_password:
            passwordData.current_password,
          new_password:
            passwordData.new_password
        }
      );

      alert(res.data.message);

      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: ""
      });

    } catch (err: any) {

      alert(
        err?.response?.data?.message ||
        "Password update failed"
      );

    }

  };

  return (

    <>
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          Profile
        </h2>

        <p className="text-sm text-gray-500">
          Manage your personal information
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">

          <div className="flex items-start gap-6 mb-6">

            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">

              {profile.first_name?.charAt(0)}
              {profile.last_name?.charAt(0)}

            </div>

            <div>

              <h3 className="text-xl font-bold">

                {profile.first_name}
                {" "}
                {profile.last_name}

              </h3>

              <p className="text-gray-500">
                {profile.designation}
              </p>

              <p className="text-sm text-gray-400">
                {profile.department}
              </p>

              <button className="mt-3 flex items-center gap-2 text-blue-600">

                <PencilIcon className="w-4 h-4" />

                Edit Profile

              </button>

            </div>

          </div>

          <div className="grid md:grid-cols-2 gap-4">

            <div>
              <label className="text-xs text-gray-500">
                Employee ID
              </label>

              <p>{profile.employee_id}</p>
            </div>

            <div>
              <label className="text-xs text-gray-500">
                Department
              </label>

              <p>{profile.department}</p>
            </div>

            <div>
              <label className="text-xs text-gray-500">
                Email
              </label>

              <p>{profile.email}</p>
            </div>

            <div>
              <label className="text-xs text-gray-500">
                Phone
              </label>

              <p>{profile.phone}</p>
            </div>

            <div>
              <label className="text-xs text-gray-500">
                Manager
              </label>

              <p>{profile.reporting_manager}</p>
            </div>

            <div>
              <label className="text-xs text-gray-500">
                Joining Date
              </label>

              <p>{profile.joining_date}</p>
            </div>

          </div>

        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

          <h3 className="font-semibold mb-4">
            Quick Stats
          </h3>

          <div className="space-y-3">

            <div className="flex justify-between bg-gray-50 p-3 rounded">
              <span>Department</span>
              <span>{profile.department}</span>
            </div>

            <div className="flex justify-between bg-gray-50 p-3 rounded">
              <span>Designation</span>
              <span>{profile.designation}</span>
            </div>

          </div>

        </div>

      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">

        <h3 className="text-lg font-semibold mb-4">
          Change Password
        </h3>

        <div className="grid md:grid-cols-3 gap-4">

          <div>

            <label className="block mb-2">
              Current Password
            </label>

            <input
              type="password"
              name="current_password"
              value={passwordData.current_password}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />

          </div>

          <div>

            <label className="block mb-2">
              New Password
            </label>

            <input
              type="password"
              name="new_password"
              value={passwordData.new_password}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />

          </div>

          <div>

            <label className="block mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirm_password"
              value={passwordData.confirm_password}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />

          </div>

        </div>

        <button
          onClick={updatePassword}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          Update Password
        </button>

      </div>

    </>
  );

};

export default ProfileTab;