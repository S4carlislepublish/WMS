import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { apiService } from '../services/api';
import { Client } from '../types/index';
import { Building2, Layers3, Users } from 'lucide-react';

interface ClientModalProps {
  client?: Client;
  onClose: (refresh?: boolean) => void;
}

type Tab = 'basic' | 'address' | 'hours';

const ClientModal: React.FC<ClientModalProps> = ({ client, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('basic');
  const [categoryType, setCategoryType] = useState<string>(client?.client_type === 'Organization' ? 'Organization' : 'Person');
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [company, setCompany] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');
  const [division, setDivision] = useState('');
  const [vendorNumber, setVendorNumber] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [workingHours, setWorkingHours] = useState('');
  const [contactHours, setContactHours] = useState('');
  const [clientType, setClientType] = useState('');
  const [subSpecialization, setSubSpecialization] = useState('');

  useEffect(() => {
    if (client) {
      setCategoryType(client.client_type === 'Organization' ? 'Organization' : 'Person');
      setFirstName(client.first_name || '');
      setSurname(client.surname || '');
      setCompany(client.company || '');
      setClientEmail(client.email || '');
      setWebsite(client.website || '');
      setDesignation(client.designation || '');
      setDepartment(client.department || '');
      setDivision(client.division || '');
      setVendorNumber(client.vendor_number || '');
      setAddress1(client.address_line_1 || '');
      setAddress2(client.address_line_2 || '');
      setCountry(client.country || '');
      setState(client.state || '');
      setCity(client.city || '');
      setZipCode(client.zip_code || '');
      setWorkingHours(client.working_hours || '');
      setContactHours(client.contact_hours || '');
      setClientType(client.client_type || '');
      setSubSpecialization(client.sub_specialization || '');
    }
  }, [client]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isBasicValid() || !isAddressValid() || !isHoursValid()) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      const formData = {
        category: categoryType,
        type: clientType,
        email: clientEmail,
        website,
        designation,
        department,
        division,
        vendor_number: vendorNumber,
        address_line_1: address1,
        address_line_2: address2,
        country,
        state,
        city,
        zip_code: zipCode,
        working_hours: workingHours,
        contact_hours: contactHours,
        sub_specialization: subSpecialization,
        status: 'active',
        first_name: categoryType === 'Person' ? firstName : undefined,
        surname: categoryType === 'Person' ? surname : undefined,
        company: categoryType === 'Organization' ? company : undefined,
      };

      if (client) {
        await apiService.updateClient(client.id, formData);
        toast.success('Client updated successfully');
      } else {
        await apiService.createClient(formData);
        toast.success('Client created successfully');
      }
      onClose(true);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const goNext = () => {
    if (activeTab === 'basic' && isBasicValid()) {
      setActiveTab('address');
    } else if (activeTab === 'address' && isAddressValid()) {
      setActiveTab('hours');
    } else {
      toast.error('Please fill all required fields');
    }
  };

  const goPrevious = () => {
    if (activeTab === 'hours') {
      setActiveTab('address');
    } else if (activeTab === 'address') {
      setActiveTab('basic');
    }
  };

  const isBasicValid = () => {
    return (
      categoryType.trim() &&
      clientType.trim() &&
      clientEmail.trim() &&
      website.trim() &&
      designation.trim() &&
      department.trim() &&
      division.trim() &&
      vendorNumber.trim() &&
      (categoryType === 'Person' ? (firstName.trim() && surname.trim()) : company.trim())
    );
  };

  const isAddressValid = () => {
    return (
      address1.trim() &&
      address2.trim() &&
      country.trim() &&
      state.trim() &&
      city.trim() &&
      zipCode.trim()
    );
  };

  const isHoursValid = () => {
    return (
      workingHours.trim() &&
      contactHours.trim()
    );
  };

  const tabs = [
    { id: 'basic' as Tab, label: 'Basic Info', icon: '📋' },
    { id: 'address' as Tab, label: 'Address', icon: '📍' },
    { id: 'hours' as Tab, label: 'Hours', icon: '⏰' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
        <div className="h-screen w-full max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col">
          {/* HEADER */}
          <div className="border-b border-slate-200 bg-white flex-shrink-0">
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-lg bg-[#f6821f]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#f6821f]">
                  <Building2 size={12} />
                  Contact Management
                </div>
                <h2 className="mt-2 text-xl font-bold text-slate-900">
                  {client ? 'Edit Contact Information' : 'Add Contact Information'}
                </h2>
              </div>
              <button
                onClick={() => onClose(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <XMarkIcon size={18} />
              </button>
            </div>

            {/* TABS */}
            <div className="flex border-t border-slate-200">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold transition ${
                    activeTab === tab.id
                      ? 'text-[#f6821f] border-b-2 border-[#f6821f]'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* BODY */}
          <div className="flex-1 overflow-hidden bg-slate-50 p-6">
            <form onSubmit={handleSubmit} className="h-full flex flex-col">
              <div className="flex-1 overflow-y-auto pr-2">
                <div className="space-y-4">
                  {activeTab === 'basic' && (
                    <>
                      {/* CATEGORY & TYPE */}
                      <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="mb-4 flex items-center gap-2">
                          <div className="rounded-md bg-blue-100 p-2">
                            <Layers3 size={16} className="text-blue-600" />
                          </div>
                          <h3 className="text-base font-bold text-slate-900">Category & Type</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <label className="mb-2 block text-xs font-semibold text-slate-700 uppercase">
                              Category <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-4">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  value="Person"
                                  checked={categoryType === "Person"}
                                  onChange={(e) => setCategoryType(e.target.value)}
                                  className="h-4 w-4 border-2 border-slate-300 text-[#f6821f] focus:ring-[#f6821f]"
                                  required
                                />
                                <span className="text-sm text-slate-700">Person</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  value="Organization"
                                  checked={categoryType === "Organization"}
                                  onChange={(e) => setCategoryType(e.target.value)}
                                  className="h-4 w-4 border-2 border-slate-300 text-[#f6821f] focus:ring-[#f6821f]"
                                  required
                                />
                                <span className="text-sm text-slate-700">Organization</span>
                              </label>
                            </div>
                          </div>
                          <div>
                            <label className="mb-2 block text-xs font-semibold text-slate-700 uppercase">
                              Type <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={clientType}
                              onChange={(e) => setClientType(e.target.value)}
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#f6821f]"
                              required
                            >
                              <option value="">Select Type</option>
                              <option value="Customer">Customer</option>
                              <option value="Vendor">Vendor</option>
                              <option value="Publisher">Publisher</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* NAME & COMPANY */}
                      <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="mb-4 flex items-center gap-2">
                          <div className="rounded-md bg-emerald-100 p-2">
                            <Users size={16} className="text-emerald-600" />
                          </div>
                          <h3 className="text-base font-bold text-slate-900">Name & Company</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {categoryType === "Person" && (
                            <>
                              <div>
                                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                  First Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  value={firstName}
                                  onChange={(e) => setFirstName(e.target.value)}
                                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#f6821f]"
                                  placeholder="John"
                                  required
                                />
                              </div>
                              <div>
                                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                  Surname <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  value={surname}
                                  onChange={(e) => setSurname(e.target.value)}
                                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#f6821f]"
                                  placeholder="Doe"
                                  required
                                />
                              </div>
                            </>
                          )}
                          {categoryType === "Organization" && (
                            <div className="md:col-span-2">
                              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                Organization Name <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#f6821f]"
                                placeholder="Acme Publishing Corp"
                                required
                              />
                            </div>
                          )}
                          <div>
                            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                              Email <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="email"
                              value={clientEmail}
                              onChange={(e) => setClientEmail(e.target.value)}
                              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#f6821f]"
                              placeholder="contact@company.com"
                              required
                            />
                          </div>
                          <div>
                            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                              Website <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={website}
                              onChange={(e) => setWebsite(e.target.value)}
                              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#f6821f]"
                              placeholder="https://company.com"
                              required
                            />
                          </div>
                          <div>
                            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                              Designation <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={designation}
                              onChange={(e) => setDesignation(e.target.value)}
                              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#f6821f]"
                              placeholder="Manager"
                              required
                            />
                          </div>
                          <div>
                            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                              Department <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={department}
                              onChange={(e) => setDepartment(e.target.value)}
                              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#f6821f]"
                              placeholder="Sales"
                              required
                            />
                          </div>
                          <div>
                            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                              Division <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={division}
                              onChange={(e) => setDivision(e.target.value)}
                              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#f6821f]"
                              placeholder="North America"
                              required
                            />
                          </div>
                          <div>
                            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                              Vendor Number <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={vendorNumber}
                              onChange={(e) => setVendorNumber(e.target.value)}
                              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#f6821f]"
                              placeholder="VEN-001"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === 'address' && (
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <div className="mb-4 flex items-center gap-2">
                        <div className="rounded-md bg-purple-100 p-2">
                          <Building2 size={16} className="text-purple-600" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900">Address</h3>
                      </div>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="md:col-span-2">
                          <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                            Address Line 1 <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={address1}
                            onChange={(e) => setAddress1(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#f6821f]"
                            placeholder="123 Business Street"
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                            Address Line 2 <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={address2}
                            onChange={(e) => setAddress2(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#f6821f]"
                            placeholder="Suite 100"
                            required
                          />
                        </div>

                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                            Country <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={country}
                            onChange={(e) => { setCountry(e.target.value); setState(""); setCity(""); }}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#f6821f]"
                            required
                          >
                            <option value="">Select Country</option>
                            <option value="India">India</option>
                          </select>
                        </div>

                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                            State <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={state}
                            onChange={(e) => { setState(e.target.value); setCity(""); }}
                            disabled={!country}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#f6821f] disabled:bg-slate-100 disabled:text-slate-400"
                            required
                          >
                            <option value="">Select State</option>
                            <option value="Andhra Pradesh">Andhra Pradesh</option>
                            <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                            <option value="Assam">Assam</option>
                            <option value="Bihar">Bihar</option>
                            <option value="Chhattisgarh">Chhattisgarh</option>
                            <option value="Goa">Goa</option>
                            <option value="Gujarat">Gujarat</option>
                            <option value="Haryana">Haryana</option>
                            <option value="Himachal Pradesh">Himachal Pradesh</option>
                            <option value="Jharkhand">Jharkhand</option>
                            <option value="Karnataka">Karnataka</option>
                            <option value="Kerala">Kerala</option>
                            <option value="Madhya Pradesh">Madhya Pradesh</option>
                            <option value="Maharashtra">Maharashtra</option>
                            <option value="Manipur">Manipur</option>
                            <option value="Meghalaya">Meghalaya</option>
                            <option value="Mizoram">Mizoram</option>
                            <option value="Nagaland">Nagaland</option>
                            <option value="Odisha">Odisha</option>
                            <option value="Punjab">Punjab</option>
                            <option value="Rajasthan">Rajasthan</option>
                            <option value="Sikkim">Sikkim</option>
                            <option value="Tamil Nadu">Tamil Nadu</option>
                            <option value="Telangana">Telangana</option>
                            <option value="Tripura">Tripura</option>
                            <option value="Uttar Pradesh">Uttar Pradesh</option>
                            <option value="Uttarakhand">Uttarakhand</option>
                            <option value="West Bengal">West Bengal</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                            <option value="Ladakh">Ladakh</option>
                            <option value="Puducherry">Puducherry</option>
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                            City <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            disabled={!state}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#f6821f] disabled:bg-slate-100 disabled:text-slate-400"
                            required
                          >
                            <option value="">Select City</option>
                            {state === "Tamil Nadu" && (
                              <>
                                <option value="Chennai">Chennai</option>
                                <option value="Coimbatore">Coimbatore</option>
                                <option value="Madurai">Madurai</option>
                                <option value="Tiruchirappalli">Tiruchirappalli</option>
                                <option value="Salem">Salem</option>
                                <option value="Tirunelveli">Tirunelveli</option>
                                <option value="Erode">Erode</option>
                                <option value="Vellore">Vellore</option>
                                <option value="Thoothukudi">Thoothukudi</option>
                                <option value="Dindigul">Dindigul</option>
                                <option value="Thanjavur">Thanjavur</option>
                                <option value="Ranipet">Ranipet</option>
                                <option value="Sivakasi">Sivakasi</option>
                                <option value="Karur">Karur</option>
                                <option value="Hosur">Hosur</option>
                                <option value="Nagercoil">Nagercoil</option>
                                <option value="Kanchipuram">Kanchipuram</option>
                                <option value="Tiruppur">Tiruppur</option>
                                <option value="Gudiyatham">Gudiyatham</option>
                                <option value="Vaniyambadi">Vaniyambadi</option>
                                <option value="Tiruvannamalai">Tiruvannamalai</option>
                                <option value="Virudhunagar">Virudhunagar</option>
                              </>
                            )}
                          </select>
                        </div>

                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                            Zip Code <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#f6821f]"
                            placeholder="600001"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'hours' && (
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <div className="mb-4 flex items-center gap-2">
                        <div className="rounded-md bg-amber-100 p-2">
                          <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h3 className="text-base font-bold text-slate-900">Working Hours</h3>
                      </div>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                            Working Hours <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={workingHours}
                            onChange={(e) => setWorkingHours(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#f6821f]"
                            placeholder="9:00 AM - 6:00 PM"
                            required
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                            Contact Hours <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={contactHours}
                            onChange={(e) => setContactHours(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#f6821f]"
                            placeholder="9:00 AM - 5:00 PM"
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                            Sub-Specialization
                          </label>
                          <input
                            type="text"
                            value={subSpecialization}
                            onChange={(e) => setSubSpecialization(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#f6821f]"
                            placeholder="e.g., Digital Publishing"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* FOOTER */}
          <div className="border-t border-slate-200 bg-white flex-shrink-0 px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={goPrevious}
                disabled={activeTab === 'basic'}
                className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onClose(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                {activeTab === 'hours' ? (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-6 py-2 text-sm font-semibold text-white bg-[#f6821f] rounded-lg hover:bg-[#e5710f] disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {loading ? 'Saving...' : (client ? 'Update Client' : 'Create Client')}
                  </button>
                ) : (
                  <button
                    onClick={goNext}
                    className="px-6 py-2 text-sm font-semibold text-white bg-[#f6821f] rounded-lg hover:bg-[#e5710f] transition"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default ClientModal;