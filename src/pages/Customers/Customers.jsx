import { useEffect, useMemo, useState } from "react";
import {
  getCustomers,
  deleteCustomer,
  createCustomer
} from "../../services/customerService";

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    });

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (customerId) => {
    if (!window.confirm("Delete this customer?")) return;

    try {
      await deleteCustomer(customerId);
      fetchCustomers();
    } catch (error) {
      console.error(error);
      alert("Failed to delete customer");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "full_name") {
      const onlyLetters = value.replace(/[^A-Za-z\s]/g, "");

      if (onlyLetters.length > 30) return;

      setFormData({
        ...formData,
        full_name: onlyLetters,
      });

      return;
    }

    if (name === "phone") {
      const onlyNumbers = value.replace(/\D/g, "");

      if (onlyNumbers.length > 10) return;

      setFormData({
        ...formData,
        phone: onlyNumbers,
      });

      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

    const handleCreateCustomer = async (e) => {
    e.preventDefault();

    if (formData.phone.length !== 10) {
      alert("Phone number must be exactly 10 digits");
      return;
    }

    try {
        setSaving(true);

        await createCustomer(formData);

        setShowModal(false);
        setFormData({
        full_name: "",
        email: "",
        phone: "",
        address: "",
        });

        fetchCustomers();
    } catch (error) {
        console.error(error);
        alert("Failed to create customer");
    } finally {
        setSaving(false);
    }
    };

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const keyword = search.toLowerCase();

      return (
        customer.full_name?.toLowerCase().includes(keyword) ||
        customer.email?.toLowerCase().includes(keyword) ||
        customer.phone?.toLowerCase().includes(keyword) ||
        customer.address?.toLowerCase().includes(keyword)
      );
    });
  }, [customers, search]);

  return (
  <div className="w-full min-h-screen bg-slate-100 px-10 py-4">
      {/* Header */}
     <div className="flex items-center justify-between gap-6 mb-5">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Customer Management
        </h1>
        <p className="text-slate-500 mt-1">
          Manage all customers from one place
        </p>
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-semibold"
      >
        + Add Customer
      </button>
    </div>

    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

      {/* Search & Stats */}
      <div className="flex items-center justify-between gap-6 mb-6">
        <div className="text-sm text-slate-500">
          Total Customers:{" "}
          <span className="font-bold text-slate-800">{customers.length}</span>
        </div>

        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-96 border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto border border-slate-200 rounded-xl bg-white">
        <table className="w-full min-w-full border-collapse">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                Full Name
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                Email
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                Phone
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                Address
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                Status
              </th>
              <th className="text-center px-6 py-4 text-sm font-semibold text-slate-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-12 text-slate-500">
                  Loading customers...
                </td>
              </tr>
            ) : filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-12 text-slate-500">
                  No customers found
                </td>
              </tr>
            ) : (
              filteredCustomers.map((customer) => (
                <tr
                  key={customer.customer_id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-6 py-5 font-semibold text-slate-900 whitespace-nowrap">
                    {customer.full_name}
                  </td>

                  <td className="px-6 py-5 text-slate-600 whitespace-nowrap">
                    {customer.email}
                  </td>

                  <td className="px-6 py-5 text-slate-600 whitespace-nowrap">
                    {customer.phone}
                  </td>

                  <td className="px-6 py-5 text-slate-600 whitespace-nowrap">
                    {customer.address}
                  </td>

                  <td className="px-6 py-5 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        customer.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {customer.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-center whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(customer.customer_id)}
                      className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-100 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-5">
                Add Customer
            </h2>

            <form onSubmit={handleCreateCustomer} className="space-y-4">
                <input
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Full Name"
                required
                maxLength={30}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                />

                <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                />

                <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                maxLength={10}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                />

                <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                />

                <div className="flex justify-end gap-3 pt-3">
                <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="rounded-xl border border-slate-300 px-5 py-2 font-semibold text-slate-600"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-emerald-600 px-5 py-2 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                >
                    {saving ? "Saving..." : "Save Customer"}
                </button>
                </div>
            </form>
            </div>
        </div>
        )}
    </div>
);
}