import React, { useEffect, useMemo, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/productService";

const emptyForm = {
  product_name: "",
  sku: "",
  description: "",
  price: "",
  quantity_in_stock: "",
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const rowsPerPage = 8;

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data || []);
    } catch (error) {
      console.error(error);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const value = search.toLowerCase();

      return (
        product.product_name?.toLowerCase().includes(value) ||
        product.sku?.toLowerCase().includes(value) ||
        product.description?.toLowerCase().includes(value)
      );
    });
  }, [products, search]);

  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const openCreateModal = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setForm({
      product_name: product.product_name || "",
      sku: product.sku || "",
      description: product.description || "",
      price: product.price || "",
      quantity_in_stock: product.quantity_in_stock || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      product_name: form.product_name,
      sku: form.sku,
      description: form.description,
      price: Number(form.price),
      quantity_in_stock: Number(form.quantity_in_stock),
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.product_id, payload);
      } else {
        await createProduct(payload);
      }

      setShowModal(false);
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Failed to save product");
    }
  };

  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await deleteProduct(productId);
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Failed to delete product");
    }
  };

  return (
 <div className="w-full bg-slate-100 px-4 py-5 md:px-10 md:py-2">
    <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Products</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage all inventory products
        </p>
      </div>

      <button
        onClick={openCreateModal}
        className="w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700 md:w-auto"
      >
        Add new product +
      </button>
    </div>

    <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-4 md:flex-row md:items-center md:justify-between md:p-6">
        <div className="flex w-full max-w-2xl overflow-hidden rounded-xl border border-slate-300 bg-white">
          <input
            type="text"
            placeholder="Search product..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full px-5 py-3 text-sm outline-none"
          />

          <button className="border-l border-slate-300 px-6 text-sm font-medium text-slate-500">
            Filters
          </button>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="min-w-[900px] border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
              <th className="w-[22%] px-4 py-4">Product Name</th>
              <th className="w-[14%] px-4 py-4">SKU</th>
              <th className="w-[26%] px-4 py-4">Description</th>
              <th className="w-[12%] px-4 py-4">Price</th>
              <th className="w-[10%] px-4 py-4">Quantity</th>
              <th className="w-[10%] px-4 py-4">Status</th>
              <th className="w-[12%] px-4 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="px-6 py-6 text-center text-slate-500">
                  Loading products...
                </td>
              </tr>
            ) : paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                  No products found
                </td>
              </tr>
            ) : (
              paginatedProducts.map((product) => {
                const isOutOfStock = Number(product.quantity_in_stock || 0) <= 0;

                return (
                  <tr
                    key={product.product_id}
                    className="border-b border-slate-100 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <td className="px-6 py-3 font-semibold text-slate-900">
                      {product.product_name}
                    </td>

                    <td className="px-6 py-3 text-slate-600">{product.sku}</td>

                    <td className="truncate px-6 py-3 text-slate-500">
                      {product.description}
                    </td>

                    <td className="px-6 py-3 font-semibold text-slate-900">
                      ₹{product.price}
                    </td>

                    <td className="px-6 py-3">{product.quantity_in_stock}</td>

                    <td className="px-6 py-3">
                      {isOutOfStock ? (
                        <span className="rounded-full bg-red-100 px-4 py-1.5 text-xs font-semibold text-red-500">
                          Out of Stock
                        </span>
                      ) : (
                        <span className="rounded-full bg-green-100 px-5 py-1.5 text-xs font-semibold text-green-600">
                          Active
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-3">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => openEditModal(product)}
                          className="font-semibold text-blue-600 hover:text-blue-700"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(product.product_id)}
                          className="text-lg text-red-500 hover:text-red-600"
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center gap-2 px-4 py-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="rounded-lg border border-slate-200 px-3 py-1 text-sm disabled:opacity-40"
        >
          ‹
        </button>

        {Array.from({ length: totalPages || 1 }, (_, index) => (
          <button
            key={index}
            onClick={() => setPage(index + 1)}
            className={`rounded-lg border px-3 py-1 text-sm font-semibold ${
              page === index + 1
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-slate-200 bg-white text-slate-600"
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
          className="rounded-lg border border-slate-200 px-3 py-1 text-sm disabled:opacity-40"
        >
          ›
        </button>
      </div>
    </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                {editingProduct ? "Update Product" : "New Product"}
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="text-2xl text-slate-400 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Product Name"
                value={form.product_name}
                onChange={(e) =>
                  setForm({ ...form, product_name: e.target.value })
                }
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
              />

              <input
                type="text"
                placeholder="SKU"
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
              />

              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="h-24 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  type="number"
                  placeholder="Price"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: e.target.value })
                  }
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />

                <input
                  type="number"
                  placeholder="Quantity in Stock"
                  value={form.quantity_in_stock}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      quantity_in_stock: e.target.value,
                    })
                  }
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {editingProduct ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}