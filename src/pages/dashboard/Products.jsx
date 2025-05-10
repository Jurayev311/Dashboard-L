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
  const [sizes, setSizes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [discounts, setDiscounts] = useState([]); // Add discounts state
  const token = localStorage.getItem("access_token");

  const [form, setForm] = useState({
    title_en: '',
    title_ru: '',
    title_de: '',
    description_en: '',
    description_ru: '',
    description_de: '',
    price: '',
    category_id: '',
    sizes_id: [],
    colors_id: [],
    materials: { cotton: '', wool: '' },
    discount_id: null,
    min_sell: 2,
    files: []
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

  // Fetch available sizes
  const getSizes = async () => {
    try {
      const res = await axios.get("https://testaoron.limsa.uz/api/sizes");
      setSizes(res?.data?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch available categories
  const getCategories = async () => {
    try {
      const res = await axios.get("https://testaoron.limsa.uz/api/category");
      setCategories(res?.data?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch available discounts
  const getDiscounts = async () => {
    try {
      const res = await axios.get("https://testaoron.limsa.uz/api/discount");
      setDiscounts(res?.data?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProduct();
    getColors();
    getSizes();
    getCategories();
    getDiscounts(); // Fetch discounts
  }, []);

  const showAddModal = () => {
    setForm({
      title_en: '',
      title_ru: '',
      title_de: '',
      description_en: '',
      description_ru: '',
      description_de: '',
      price: '',
      category_id: '',
      sizes_id: [],
      colors_id: [],
      materials: { cotton: '', wool: '' },
      discount_id: null,
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
      title_en: item.title_en || '',
      title_ru: item.title_ru || '',
      title_de: item.title_de || '',
      description_en: item.description_en || '',
      description_ru: item.description_ru || '',
      description_de: item.description_de || '',
      price: item.price || '',
      category_id: item.category?.id || '',
      sizes_id: item.sizes?.map(s => s.id?.toString()) || [],
      colors_id: item.colors?.map(c => c.id?.toString()) || [],
      materials: item.materials || { cotton: '', wool: '' },
      discount_id: item.discount || null,
      min_sell: item.min_sell || 2,
      files: item.images ? [item.images] : []
    });
    setFileList(item.images ? [{ uid: '-1', name: 'image', status: 'done', url: item.images }] : []);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditMode(false);
    setCurrentId(null);
  };

  // Create or update product
  const handleProduct = async () => {
    if (!fileList || fileList.length === 0) {
      toast.error('Please upload at least one product image.');
      return;
    }
    if (!form.sizes_id || form.sizes_id.length === 0) {
      toast.error('Please select at least one size.');
      return;
    }
    if (!form.colors_id || form.colors_id.length === 0) {
      toast.error('Please select at least one color.');
      return;
    }
    if (!form.category_id) {
      toast.error('Please select a category.');
      return;
    }
    if (form.discount_id && !discounts.find(d => d.id === form.discount_id)) {
      toast.error('Please select a valid discount.');
      return;
    }

    // Use POST for both create and edit (since PUT is not supported)
    const url = editMode
      ? `https://testaoron.limsa.uz/api/product/${currentId}/update`
      : 'https://testaoron.limsa.uz/api/product';

    const formData = new FormData();
    formData.append('title_en', form.title_en);
    formData.append('title_ru', form.title_ru);
    formData.append('title_de', form.title_de);
    formData.append('description_en', form.description_en);
    formData.append('description_ru', form.description_ru);
    formData.append('description_de', form.description_de);
    formData.append('price', form.price);
    formData.append('category_id', form.category_id); // must be a valid category id

    form.sizes_id.forEach((id) => formData.append('sizes_id[]', id));
    form.colors_id.forEach((id) => formData.append('colors_id[]', id));

    formData.append('materials', JSON.stringify(form.materials));
    if (form.discount_id) formData.append('discount_id', form.discount_id);
    formData.append('min_sell', form.min_sell);

    fileList.forEach((fileObj) => {
      formData.append('files', fileObj.originFileObj);
    });

    try {
      // Always use POST, even for edit
      await axios({
        method: 'post',
        url,
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
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
                    placeholder="Title (EN)" 
                    value={form.title_en} 
                    onChange={(e) => setForm({ ...form, title_en: e.target.value })} 
                  />
                  <Input 
                    placeholder="Title (RU)" 
                    value={form.title_ru} 
                    onChange={(e) => setForm({ ...form, title_ru: e.target.value })} 
                  />
                  <Input 
                    placeholder="Title (DE)" 
                    value={form.title_de} 
                    onChange={(e) => setForm({ ...form, title_de: e.target.value })} 
                  />
                  <Input 
                    placeholder="Description (EN)" 
                    value={form.description_en} 
                    onChange={(e) => setForm({ ...form, description_en: e.target.value })} 
                  />
                  <Input 
                    placeholder="Description (RU)" 
                    value={form.description_ru} 
                    onChange={(e) => setForm({ ...form, description_ru: e.target.value })} 
                  />
                  <Input 
                    placeholder="Description (DE)" 
                    value={form.description_de} 
                    onChange={(e) => setForm({ ...form, description_de: e.target.value })} 
                  />
                  <Input 
                    placeholder="Price" 
                    type="number" 
                    value={form.price} 
                    onChange={(e) => setForm({ ...form, price: e.target.value })} 
                  />
                  <Select
                    placeholder="Select category"
                    value={form.category_id}
                    onChange={(value) => setForm({ ...form, category_id: value })}
                    style={{ width: '100%' }}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {categories.map(category => (
                      <Option key={category.id} value={category.id}>
                        {category.name_en}
                      </Option>
                    ))}
                  </Select>
                  <Select
                    mode="multiple"
                    placeholder="Select sizes"
                    value={form.sizes_id}
                    onChange={(value) => setForm({ ...form, sizes_id: value })}
                  >
                    {sizes.map(size => (
                      <Option key={size.id} value={size.id.toString()}>
                        {size.size}
                      </Option>
                    ))}
                  </Select>
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
                  <Select
                    placeholder="Select discount (optional)"
                    value={form.discount_id}
                    onChange={(value) => setForm({ ...form, discount_id: value })}
                    allowClear
                    style={{ width: '100%' }}
                  >
                    {discounts.map(discount => (
                      <Option key={discount.id} value={discount.id}>
                        {discount.name || `ID: ${discount.id}`}
                      </Option>
                    ))}
                  </Select>

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
                    fileList={fileList}
                    onChange={({ fileList }) => setFileList(fileList)}
                    multiple
                    beforeUpload={() => false} // Prevent auto upload
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
                    <th className="py-2 px-4 border border-gray-300">Title (EN)</th>
                    <th className="py-2 px-4 border border-gray-300">Title (RU)</th>
                    <th className="py-2 px-4 border border-gray-300">Title (DE)</th>
                    <th className="py-2 px-4 border border-gray-300">Description (EN)</th>
                    <th className="py-2 px-4 border border-gray-300">Description (RU)</th>
                    <th className="py-2 px-4 border border-gray-300">Description (DE)</th>
                    <th className="py-2 px-4 border border-gray-300">Price</th>
                    <th className="py-2 px-4 border border-gray-300">Category</th>
                    <th className="py-2 px-4 border border-gray-300">Colors</th>
                    <th className="py-2 px-4 border border-gray-300">Sizes</th>
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
                      <td className="py-2 px-4 border border-gray-300">{item?.title_ru}</td>
                      <td className="py-2 px-4 border border-gray-300">{item?.title_de}</td>
                      <td className="py-2 px-4 border border-gray-300">{item?.description_en}</td>
                      <td className="py-2 px-4 border border-gray-300">{item?.description_ru}</td>
                      <td className="py-2 px-4 border border-gray-300">{item?.description_de}</td>
                      <td className="py-2 px-4 border border-gray-300">{item?.price}</td>
                      <td className="py-2 px-4 border border-gray-300">{item?.category?.name_en}</td>
                      <td className="py-2 px-4 border border-gray-300">
                        {item?.colors?.map(c => c.color_en).join(', ')}
                      </td>
                      <td className="py-2 px-4 border border-gray-300">
                        {item?.sizes?.map(s => s.size).join(', ')}
                      </td>
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