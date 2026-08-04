import React, { useState, useEffect } from 'react';
import { getAdminProducts, createAdminProduct, updateAdminProduct, deleteAdminProduct } from '../../services/admin/productService';
import api from '../../services/api';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Search, filter, pagination states
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(0);
  const [size] = useState(8);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  // Modal/Drawer states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const [editingId, setEditingId] = useState(null);
  
  // Form fields
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  
  // Validation, Loading & Toast States
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [toast, setToast] = useState(null); // { type: 'success'|'danger', message: '' }

  const triggerToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const loadCategories = async () => {
    try {
      const res = await api.get('/products/categories');
      setCategories(res.data || []);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        size,
        search: search.trim() ? search.trim() : undefined,
        categoryId: selectedCategory ? selectedCategory : undefined,
        sortBy: 'id',
        direction: 'DESC'
      };
      const data = await getAdminProducts(params);
      setProducts(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load products', err);
      triggerToast('danger', 'Could not load products database.');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [page, selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    loadProducts();
  };

  const handleResetSearch = () => {
    setSearch('');
    setSelectedCategory('');
    setPage(0);
    // Directly trigger refresh
    setTimeout(() => {
      loadProducts();
    }, 50);
  };

  const validateForm = () => {
    const errors = {};
    if (!name.trim()) errors.name = 'Product name is required';
    if (!categoryId) errors.categoryId = 'Category selection is required';
    if (!price) {
      errors.price = 'Price is required';
    } else if (isNaN(price) || parseFloat(price) <= 0) {
      errors.price = 'Price must be a number greater than 0';
    }
    if (!stock) {
      errors.stock = 'Stock quantity is required';
    } else if (isNaN(stock) || parseInt(stock) < 0) {
      errors.stock = 'Stock quantity cannot be negative';
    }
    if (!imageUrl.trim()) {
      errors.imageUrl = 'Image URL is required';
    } else if (!imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
      errors.imageUrl = 'Image URL must be valid path or http address';
    }
    if (!description.trim()) errors.description = 'Description is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openAddForm = () => {
    setFormMode('add');
    setName('');
    setCategoryId('');
    setPrice('');
    setStock('');
    setImageUrl('');
    setDescription('');
    setFormErrors({});
    setIsFormOpen(true);
  };

  const openEditForm = (prod) => {
    setFormMode('edit');
    setEditingId(prod.id);
    setName(prod.name || '');
    setCategoryId(prod.categoryId || '');
    setPrice(prod.price || '');
    setStock(prod.stock || '0');
    setImageUrl(prod.imageUrl || '');
    setDescription(prod.description || '');
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    const payload = {
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      stock: parseInt(stock),
      categoryId: parseInt(categoryId),
      imageUrl: imageUrl.trim()
    };

    try {
      if (formMode === 'add') {
        await createAdminProduct(payload);
        triggerToast('success', 'Product created successfully!');
      } else {
        await updateAdminProduct(editingId, payload);
        triggerToast('success', 'Product updated successfully!');
      }
      setIsFormOpen(false);
      loadProducts();
    } catch (err) {
      console.error(err);
      triggerToast('danger', err.message || 'Action failed. Please check details.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteAdminProduct(deleteConfirmId);
      triggerToast('success', 'Product deleted successfully.');
      setDeleteConfirmId(null);
      loadProducts();
    } catch (err) {
      console.error(err);
      triggerToast('danger', 'Failed to delete product. It might be referenced in orders.');
      setDeleteConfirmId(null);
    }
  };

  return (
    <div>
      {/* Toast Alert Widget */}
      {toast && (
        <div className={`toast-alert alert alert-${toast.type} shadow border-0 position-fixed`} style={{ right: '20px', top: '90px', zIndex: 1060, borderRadius: '12px' }}>
          <div className="d-flex align-items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="fw-semibold">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="m-0 fw-bold tracking-wide" style={{ color: '#f8fafc' }}>Products Database</h2>
          <p className="text-secondary small m-0 mt-1">Manage gift catalog inventory, categories and pricing structures.</p>
        </div>
        <button onClick={openAddForm} className="btn btn-warning border-0 text-dark fw-semibold py-2.5 px-4 d-flex align-items-center gap-2" style={{ backgroundColor: '#fbbf24', borderRadius: '10px' }}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search and filter panel */}
      <div className="card border-0 p-3 mb-4 shadow-sm" style={{ borderRadius: '14px', backgroundColor: '#111827', border: '1px solid #1f2937' }}>
        <form onSubmit={handleSearchSubmit} className="row g-3 align-items-end">
          <div className="col-12 col-md-5">
            <label htmlFor="search-input" className="form-label text-light-muted fs-8 font-semibold text-uppercase tracking-wider">Search</label>
            <input 
              type="text" 
              id="search-input"
              className="form-control admin-input w-100" 
              placeholder="Search products by name/description..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <label htmlFor="category-select" className="form-label text-light-muted fs-8 font-semibold text-uppercase tracking-wider">Category</label>
            <select 
              id="category-select"
              className="form-select admin-input w-100"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id || c.categoryId} value={c.id || c.categoryId}>
                  {c.categoryName.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12 col-sm-6 col-md-4 d-flex gap-2">
            <button type="submit" className="btn btn-warning flex-grow-1 py-2 fw-semibold text-dark border-0" style={{ backgroundColor: '#fbbf24', borderRadius: '10px' }}>
              Filter
            </button>
            <button type="button" onClick={handleResetSearch} className="btn btn-outline-secondary py-2 px-3 text-light" style={{ borderColor: '#334155', borderRadius: '10px' }}>
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Main product table */}
      <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', backgroundColor: '#111827', border: '1px solid #1f2937', overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle m-0" style={{ backgroundColor: 'transparent' }}>
            <thead>
              <tr style={{ color: '#94a3b8', borderBottom: '1px solid #1f2937' }}>
                <th className="py-3 px-4 border-0 bg-transparent fs-8 font-semibold text-uppercase tracking-wider">ID</th>
                <th className="py-3 border-0 bg-transparent fs-8 font-semibold text-uppercase tracking-wider">Image</th>
                <th className="py-3 border-0 bg-transparent fs-8 font-semibold text-uppercase tracking-wider">Product details</th>
                <th className="py-3 border-0 bg-transparent fs-8 font-semibold text-uppercase tracking-wider">Category</th>
                <th className="py-3 border-0 bg-transparent fs-8 font-semibold text-uppercase tracking-wider">Price</th>
                <th className="py-3 border-0 bg-transparent fs-8 font-semibold text-uppercase tracking-wider">Stock</th>
                <th className="py-3 px-4 border-0 bg-transparent fs-8 font-semibold text-uppercase tracking-wider text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <div className="spinner-border text-warning" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #1f2937' }}>
                    <td className="py-3 px-4 border-0 bg-transparent font-monospace text-secondary" style={{ fontSize: '0.85rem' }}>{p.id}</td>
                    <td className="py-3 border-0 bg-transparent">
                      <img 
                        src={p.imageUrl || '/Hamperly.png'} 
                        alt={p.name} 
                        className="rounded object-fit-cover shadow-sm bg-secondary"
                        style={{ width: '48px', height: '48px' }}
                        onError={(e) => { e.target.src = '/Hamperly.png'; }}
                      />
                    </td>
                    <td className="py-3 border-0 bg-transparent" style={{ maxWidth: '280px' }}>
                      <span className="d-block fw-semibold text-white text-truncate">{p.name}</span>
                      <small className="text-secondary d-block text-truncate" style={{ fontSize: '0.75rem' }}>{p.description}</small>
                    </td>
                    <td className="py-3 border-0 bg-transparent text-secondary text-capitalize">
                      {p.categoryName?.replace('_', ' ') || 'General'}
                    </td>
                    <td className="py-3 border-0 bg-transparent fw-semibold text-white">₹{p.price?.toFixed(2)}</td>
                    <td className="py-3 border-0 bg-transparent">
                      <span className={`badge px-2.5 py-1.5 rounded font-bold ${
                        p.stock <= 0 ? 'bg-danger text-light' : 
                        p.stock < 10 ? 'bg-warning-subtle text-warning border border-warning' : 
                        'bg-success-subtle text-success border border-success'
                      }`}>
                        {p.stock <= 0 ? 'Out of Stock' : `${p.stock} units`}
                      </span>
                    </td>
                    <td className="py-3 px-4 border-0 bg-transparent text-end">
                      <div className="d-inline-flex gap-2">
                        <button onClick={() => openEditForm(p)} className="btn btn-sm btn-outline-info d-flex align-items-center justify-content-center p-2" style={{ borderRadius: '8px' }} title="Edit">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button onClick={() => handleDeleteClick(p.id)} className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center p-2" style={{ borderRadius: '8px' }} title="Delete">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-secondary">
                    No products matching filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="d-flex align-items-center justify-content-between p-3 border-top" style={{ borderColor: '#1f2937' }}>
            <span className="text-secondary small">Showing page {page + 1} of {totalPages} ({totalElements} total products)</span>
            <div className="d-inline-flex gap-2">
              <button 
                onClick={() => setPage(prev => Math.max(0, prev - 1))}
                className="btn btn-sm btn-outline-secondary text-light px-3"
                disabled={page === 0}
                style={{ borderColor: '#334155', borderRadius: '8px' }}
              >
                Previous
              </button>
              <button 
                onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
                className="btn btn-sm btn-outline-secondary text-light px-3"
                disabled={page === totalPages - 1}
                style={{ borderColor: '#334155', borderRadius: '8px' }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Form Drawer Sidebar (Slides in from Right) */}
      <div 
        className={`form-drawer shadow-lg p-4 text-light ${isFormOpen ? 'open' : ''}`}
        style={{
          width: '450px',
          maxWidth: '100%',
          height: '100vh',
          backgroundColor: '#111827',
          borderLeft: '1px solid #1f2937',
          position: 'fixed',
          top: 0,
          right: 0,
          zIndex: 1050,
          transition: 'transform 0.3s ease',
          transform: isFormOpen ? 'translateX(0)' : 'translateX(100%)',
          overflowY: 'auto'
        }}
      >
        <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3" style={{ borderColor: '#1f2937' }}>
          <h4 className="m-0 fw-bold tracking-wide" style={{ color: '#fbbf24' }}>
            {formMode === 'add' ? 'Create Product' : 'Modify Product'}
          </h4>
          <button onClick={() => setIsFormOpen(false)} className="btn-close btn-close-white" aria-label="Close"></button>
        </div>

        <form onSubmit={handleFormSubmit}>
          <div className="mb-3">
            <label className="form-label text-light-muted fs-8 font-semibold text-uppercase tracking-wider">Product Name</label>
            <input 
              type="text" 
              className={`form-control admin-input ${formErrors.name ? 'is-invalid' : ''}`}
              placeholder="e.g. Royal Golden Milestones Basket"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label text-light-muted fs-8 font-semibold text-uppercase tracking-wider">Category Selection</label>
            <select 
              className={`form-select admin-input ${formErrors.categoryId ? 'is-invalid' : ''}`}
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id || c.categoryId} value={c.id || c.categoryId}>
                  {c.categoryName.replace('_', ' ')}
                </option>
              ))}
            </select>
            {formErrors.categoryId && <div className="invalid-feedback">{formErrors.categoryId}</div>}
          </div>

          <div className="row mb-3">
            <div className="col">
              <label className="form-label text-light-muted fs-8 font-semibold text-uppercase tracking-wider">Price (INR)</label>
              <input 
                type="number" 
                step="0.01"
                className={`form-control admin-input ${formErrors.price ? 'is-invalid' : ''}`}
                placeholder="4999.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              {formErrors.price && <div className="invalid-feedback">{formErrors.price}</div>}
            </div>
            <div className="col">
              <label className="form-label text-light-muted fs-8 font-semibold text-uppercase tracking-wider">Stock Units</label>
              <input 
                type="number" 
                className={`form-control admin-input ${formErrors.stock ? 'is-invalid' : ''}`}
                placeholder="10"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
              {formErrors.stock && <div className="invalid-feedback">{formErrors.stock}</div>}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label text-light-muted fs-8 font-semibold text-uppercase tracking-wider">Product Image URL</label>
            <input 
              type="text" 
              className={`form-control admin-input ${formErrors.imageUrl ? 'is-invalid' : ''}`}
              placeholder="e.g. /images/products/anniversary/image1.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            {formErrors.imageUrl && <div className="invalid-feedback">{formErrors.imageUrl}</div>}
          </div>

          <div className="mb-4">
            <label className="form-label text-light-muted fs-8 font-semibold text-uppercase tracking-wider">Detailed Description</label>
            <textarea 
              rows="4"
              className={`form-control admin-input ${formErrors.description ? 'is-invalid' : ''}`}
              placeholder="Gourmet treats and candle logs to celebrate eternal milestones..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {formErrors.description && <div className="invalid-feedback">{formErrors.description}</div>}
          </div>

          <button 
            type="submit" 
            className="btn btn-warning w-100 py-2.5 fw-semibold text-dark border-0 d-flex align-items-center justify-content-center gap-2"
            disabled={submitting}
            style={{ backgroundColor: '#fbbf24', borderRadius: '10px' }}
          >
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>Saving Changes...</span>
              </>
            ) : (
              <span>Save Product Specifications</span>
            )}
          </button>
        </form>
      </div>
      
      {/* Drawer overlay background */}
      {isFormOpen && (
        <div 
          className="modal-backdrop fade show" 
          onClick={() => setIsFormOpen(false)}
          style={{ zIndex: 1045 }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="modal show d-block" tabIndex="-1" style={{ zIndex: 1070, backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-light border-0" style={{ backgroundColor: '#111827', borderRadius: '16px', border: '1px solid #1f2937' }}>
              <div className="modal-body p-4 text-center">
                <div className="bg-danger-subtle p-3 rounded-circle d-inline-flex mb-3 text-danger">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h5 className="fw-bold mb-2">Delete Product Confirmation</h5>
                <p className="text-secondary small mb-4">Are you sure you want to permanently delete this product? This action will remove the catalog item, and cannot be undone.</p>
                <div className="d-flex gap-2 justify-content-center">
                  <button onClick={() => setDeleteConfirmId(null)} className="btn btn-outline-secondary text-light px-4 py-2 border-0" style={{ backgroundColor: '#1f2937' }}>
                    Cancel
                  </button>
                  <button onClick={confirmDelete} className="btn btn-danger px-4 py-2 border-0" style={{ backgroundColor: '#ef4444' }}>
                    Confirm Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        .toast-alert {
          animation: slide-in-toast 0.25s ease-out;
        }
        @keyframes slide-in-toast {
          0% { transform: translateX(110%); }
          100% { transform: translateX(0); }
        }
        .w-8 { width: 2rem; }
        .h-8 { height: 2rem; }
        .bg-success-subtle {
          background-color: rgba(34, 197, 94, 0.1) !important;
        }
        .bg-warning-subtle {
          background-color: rgba(234, 179, 8, 0.1) !important;
        }
        .bg-danger-subtle {
          background-color: rgba(239, 68, 68, 0.1) !important;
        }
        .admin-input {
          background-color: #0f172a !important;
          border: 1px solid #1f2937 !important;
          color: #f8fafc !important;
          border-radius: 10px;
          padding: 0.625rem 0.875rem;
        }
        .admin-input:focus {
          border-color: #fbbf24 !important;
          box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.15) !important;
        }
      `}</style>
    </div>
  );
};

export default ProductManagement;
