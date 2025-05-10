import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Spin, Button, Modal, Input, Empty, Select, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';

const { Option } = Select;

const Products = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [colors, setColors] = useState([]);
  const token = localStorage.getItem("access_token");

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category_id: '',
    colors_id: [], // Changed from color to array
    size: '',
    discount_id: null, // Changed from discount to discount_id
    materials: { cotton: '', wool: '' }, // Changed to object
    min_sell: 2, // Added new required field
    files: [] // Changed from image to array
  });

  // Fetch products
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

  // Fetch available colors
  const getColors = async () => {
    try {
      const res = await axios.get("https://testaoron.limsa.uz/api/colors");
      setColors(res?.data?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProduct();
    getColors();
  }, []);

  const showAddModal = () => {
    setForm({
      title: '',
      description: '',
      price: '',
      category_id: '',
      colors_id: [],
      size: '',
      discount_id: null,
      materials: { cotton: '', wool: '' },
      min_sell: 2,
      files: []
    });
    setFileList([]);
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
      colors_id: item.colors?.map(c => c.id.toString()) || [], // Convert to array of strings
      size: item.sizes?.[0]?.size || '',
      discount_id: item.discount?.id || null,
      materials: item.materials || { cotton: '', wool: '' },
      min_sell: item.min_sell || 2,
      files: item.images ? [item.images] : [] // Adjust based on your API
    });
    setFileList(item.images ? [{ uid: '-1', name: 'image', status: 'done', url: item.images }] : []);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditMode(false);
    setCurrentId(null);
  };

  // Handle file upload
  const handleUpload = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('https://testaoron.limsa.uz/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      onSuccess(res.data, file);
      setForm({ ...form, files: [...form.files, res.data.fileId] }); // Adjust based on your API response
    } catch (err) {
      onError(err);
      toast.error('Upload failed');
    }
  };

  // Create or update product
  const handleProduct = async () => {
    const url = editMode 
      ? `https://testaoron.limsa.uz/api/product/${currentId}`
      : 'https://testaoron.limsa.uz/api/product';

    const productData = {
      title: form.title,
      description: form.description,
      price: form.price,
      category_id: form.category_id,
      colors_id: form.colors_id, // array of strings
      size: form.size,
      discount_id: form.discount_id, // object/number or null
      materials: form.materials, // object
      min_sell: form.min_sell, // required number
      files: form.files // array of file IDs
    };

    try {
      const method = editMode ? 'put' : 'post';
      await axios({
        method,
        url,
        data: productData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(editMode ? "Product updated" : "Product created");
      handleCancel();
      getProduct();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error occurred");
    }
  };

  // Delete product
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
              onOk={handleProduct}
              onCancel={handleCancel}
              okText={editMode ? "Update" : "Create"}
              width={800}
            >
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Input 
                    placeholder="Title" 
                    value={form.title} 
                    onChange={(e) => setForm({ ...form, title: e.target.value })} 
                  />
                  <Input 
                    placeholder="Description" 
                    value={form.description} 
                    onChange={(e) => setForm({ ...form, description: e.target.value })} 
                  />
                  <Input 
                    placeholder="Price" 
                    type="number" 
                    value={form.price} 
                    onChange={(e) => setForm({ ...form, price: e.target.value })} 
                  />
                  <Input 
                    placeholder="Category ID" 
                    value={form.category_id} 
                    onChange={(e) => setForm({ ...form, category_id: e.target.value })} 
                  />
                  
                  <Select
                    mode="multiple"
                    placeholder="Select colors"
                    value={form.colors_id}
                    onChange={(value) => setForm({ ...form, colors_id: value })}
                  >
                    {colors.map(color => (
                      <Option key={color.id} value={color.id.toString()}>
                        {color.color_en}
                      </Option>
                    ))}
                  </Select>

                  <Input 
                    placeholder="Size" 
                    value={form.size} 
                    onChange={(e) => setForm({ ...form, size: e.target.value })} 
                  />
                  
                  <Input 
                    placeholder="Discount ID" 
                    type="number"
                    value={form.discount_id || ''} 
                    onChange={(e) => setForm({ 
                      ...form, 
                      discount_id: e.target.value ? parseInt(e.target.value) : null 
                    })} 
                  />

                  <Input 
                    placeholder="Min Sell" 
                    type="number"
                    value={form.min_sell} 
                    onChange={(e) => setForm({ 
                      ...form, 
                      min_sell: parseInt(e.target.value) || 2 
                    })} 
                  />
                </div>

                <div className="mb-4">
                  <h4 className="mb-2">Materials Composition</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      placeholder="Cotton %" 
                      value={form.materials.cotton} 
                      onChange={(e) => setForm({ 
                        ...form, 
                        materials: { ...form.materials, cotton: e.target.value } 
                      })} 
                    />
                    <Input 
                      placeholder="Wool %" 
                      value={form.materials.wool} 
                      onChange={(e) => setForm({ 
                        ...form, 
                        materials: { ...form.materials, wool: e.target.value } 
                      })} 
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="mb-2">Product Images</h4>
                  <Upload
                    customRequest={handleUpload}
                    fileList={fileList}
                    onChange={({ fileList }) => setFileList(fileList)}
                    multiple
                  >
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </Upload>
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
                  <tr className="bg-gray-300 text-gray-700">
                    <th className="py-2 px-4 border border-gray-300">№</th>
                    <th className="py-2 px-4 border border-gray-300">Images</th>
                    <th className="py-2 px-4 border border-gray-300">Title</th>
                    <th className="py-2 px-4 border border-gray-300">Description</th>
                    <th className="py-2 px-4 border border-gray-300">Price</th>
                    <th className="py-2 px-4 border border-gray-300">Category</th>
                    <th className="py-2 px-4 border border-gray-300">Colors</th>
                    <th className="py-2 px-4 border border-gray-300">Size</th>
                    <th className="py-2 px-4 border border-gray-300">Discount ID</th>
                    <th className="py-2 px-4 border border-gray-300">Materials</th>
                    <th className="py-2 px-4 border border-gray-300">Min Sell</th>
                    <th className="py-2 px-4 border border-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((item, index) => (
                    <tr key={index} className="text-center">
                      <td className="py-2 px-4 border border-gray-300">{index + 1}</td>
                      <td className="py-2 px-4 border border-gray-300">
                        <img 
                          src={`https://testaoron.limsa.uz/${item?.images}`} 
                          alt="img" 
                          className="w-16 h-16 object-cover rounded mx-auto" 
                        />
                      </td>
                      <td className="py-2 px-4 border border-gray-300">{item?.title_en}</td>
                      <td className="py-2 px-4 border border-gray-300">{item?.description_en}</td>
                      <td className="py-2 px-4 border border-gray-300">{item?.price}</td>
                      <td className="py-2 px-4 border border-gray-300">{item?.category?.name_en}</td>
                      <td className="py-2 px-4 border border-gray-300">
                        {item?.colors?.map(c => c.color_en).join(', ')}
                      </td>
                      <td className="py-2 px-4 border border-gray-300">{item?.sizes?.[0]?.size}</td>
                      <td className="py-2 px-4 border border-gray-300">{item?.discount?.id || '-'}</td>
                      <td className="py-2 px-4 border border-gray-300">
                        {item?.materials ? `Cotton: ${item.materials.cotton}, Wool: ${item.materials.wool}` : '-'}
                      </td>
                      <td className="py-2 px-4 border border-gray-300">{item?.min_sell || 2}</td>
                      <td className="py-2 px-4 border border-gray-300">
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