import api from "../config/api";

export const getCustomers = async () => {
  const response = await api.get("/customers/");
  return response.data;
};

export const getCustomerById = async (customerId) => {
  const response = await api.get(`/customers/${customerId}`);
  return response.data;
};

export const createCustomer = async (customerData) => {
  const response = await api.post("/customers/", customerData);
  return response.data;
};

export const deleteCustomer = async (customerId) => {
  const response = await api.delete(`/customers/${customerId}`);
  return response.data;
};