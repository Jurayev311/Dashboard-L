import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Spin, Button, Modal, Input, Empty } from 'antd';
import toast from 'react-hot-toast';

const Products = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(false);
  const token = localStorage.getItem("access_token");

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category_id: '',
    color: '',
    size: '',
    discount: '',
    materials: '',
    image: null,
  });

  // Mahsulotni olish
  const getProduct = async () => {
    try {
      setLoad(true);
      const res = await axios.get("https://testaoron.limsa.uz/api/product");
      setData(res?.data?.data?.products || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  const showAddModal = () => {
    setForm({
      title: '',
      description: '',
      price: '',
      category_id: '',
      color: '',
      size: '',
      discount: '',
      materials: '',
      image: null,
    });
    setEditMode(false);
    setCurrentId(null);
    setIsModalOpen(true);
  };

  const showEditModal = (item) => {
    setEditMode(true);
    setCurrentId(item.id);
    setForm({
      title: item.title_en || '',
      description: item.description_en || '',
      price: item.price || '',
      category_id: item.category?.id || '',
      color: item.colors?.[0]?.color_de || '',
      size: item.sizes?.[0]?.size || '',
      discount: item.discount?.discount || '',
      materials: item.materials?.sq || '',
      image: null,
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditMode(false);
    setCurrentId(null);
  };

  // Mahsulot yaratish
  const createProduct = async () => {
    const url = `https://testaoron.limsa.uz/api/product`;
    const method = editMode ? 'put' : 'post'; // PUT methodi agar edit qilinayotgan bo'lsa, POST bo'lsa yaratish

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('category_id', form.category_id);
    formData.append('color', form.color);
    formData.append('size', form.size);
    formData.append('discount', form.discount);
    formData.append('materials', form.materials);

    if (form.image) {
      formData.append('file', form.image);  
    }

    try {
      await axios({
        method,
        url,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(editMode ? "Product updated" : "Product created");
      handleCancel();
      getProduct(); // Mahsulotlarni yangilash
    } catch (error) {
      console.log(error);
      toast.error("Error occurred");
    }
  };

  // Mahsulotni o'chirish
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`https://testaoron.limsa.uz/api/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Deleted successfully");
      getProduct();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <>
      {load ? (
        <div className="flex items-center justify-center translate-y-[220%]">
          <Spin size="large" />
        </div>
      ) : (
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Products</h2>
            <Button
              type="primary"
              onClick={showAddModal}
              style={{ backgroundColor: '#00C951', borderColor: '#00C951' }}
            >
              Add Product
            </Button>
            <Modal
              title={editMode ? "Edit Product" : "Add Product"}
              open={isModalOpen}
              onOk={createProduct} // Use the createProduct function here
              onCancel={handleCancel}
              okText={editMode ? "Update" : "Create"}
            >
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                  <Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  <Input placeholder="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                  <Input placeholder="Category ID" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} />
                  <Input placeholder="Color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
                  <Input placeholder="Size" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} />
                  <Input placeholder="Discount" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} />
                  <Input placeholder="Materials" value={form.materials} onChange={(e) => setForm({ ...form, materials: e.target.value })} />
                  <input type="file" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} />
                </div>
              </form>
            </Modal>
          </div>

          <div className="overflow-x-auto">
            {data?.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <Empty description="No products available" />
              </div>
            ) : (
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="py-2 px-4 border">№</th>
                    <th className="py-2 px-4 border">Images</th>
                    <th className="py-2 px-4 border">Title</th>
                    <th className="py-2 px-4 border">Description</th>
                    <th className="py-2 px-4 border">Price</th>
                    <th className="py-2 px-4 border">Category</th>
                    <th className="py-2 px-4 border">Color</th>
                    <th className="py-2 px-4 border">Size</th>
                    <th className="py-2 px-4 border">Discount</th>
                    <th className="py-2 px-4 border">Materials</th>
                    <th className="py-2 px-4 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((item, index) => (
                    <tr key={index} className="text-center">
                      <td className="py-2 px-4 border">{index + 1}</td>
                      <td className="py-2 px-4 border">
                        <img src={`https://testaoron.limsa.uz/${item?.images}`} alt="img" className="w-16 h-16 object-cover rounded mx-auto" />
                      </td>
                      <td className="py-2 px-4 border">{item?.title_en}</td>
                      <td className="py-2 px-4 border">{item?.description_en}</td>
                      <td className="py-2 px-4 border">{item?.price}</td>
                      <td className="py-2 px-4 border">{item?.category?.name_en}</td>
                      <td className="py-2 px-4 border">{item?.colors?.[0]?.color_de}</td>
                      <td className="py-2 px-4 border">{item?.sizes?.[0]?.size}</td>
                      <td className="py-2 px-4 border">{item?.discount?.discount}</td>
                      <td className="py-2 px-4 border">{item?.materials?.sq}</td>
                      <td className="py-2 px-4 border">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => showEditModal(item)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteProduct(item?.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Products;
