import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Flex, Spin, Button, Modal, Input, Empty } from 'antd';
import toast from 'react-hot-toast';

const Products = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentSizeId, setCurrentSizeId] = useState(null);
  const [sizes, setSizes] = useState('');
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
    image: '',
  });

  console.log(data);

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
    setSizes('');
    setEditMode(false);
    setCurrentSizeId(null);
    setIsModalOpen(true);
  };

  const showEditModal = (item) => {
    setEditMode(true);
    setCurrentSizeId(item?.id);
    setSizes(item?.size);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditMode(false);
    setCurrentSizeId(null);
    setSizes('');
  };

  const createOrUpdateProduct = async () => {
    const url = editMode
      ? `https://testaoron.limsa.uz/api/product/${currentSizeId}`
      : `https://testaoron.limsa.uz/api/product`;
    const method = editMode ? 'patch' : 'post';

    try {
      const res = await axios[method](
        url,
        { size: sizes },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      toast.success(editMode ? "Size updated" : "Size created");
      handleCancel();
      getProduct();
    } catch (error) {
      console.log(error);
      toast.error("Error");
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(
        `https://testaoron.limsa.uz/api/product/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`Size with ID ${id} has been deleted`);
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
              Add Size
            </Button>
            <Modal
              title={editMode ? "Edit Product" : "Add Product"}
              open={isModalOpen}
              onOk={createOrUpdateProduct}
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
                  <Input placeholder="Discount (%)" type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} />
                  <Input placeholder="Materials" value={form.materials} onChange={(e) => setForm({ ...form, materials: e.target.value })} />
                  <Input placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
                </div>
              </form>
            </Modal>
          </div>

          <div className="overflow-x-auto">
            {data?.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <Empty description="No sizes available" />
              </div>
            ) : (
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="py-2 font-normal px-4 border border-gray-300">№</th>
                    <th className="py-2 font-normal px-4 border border-gray-300">Images</th>
                    <th className="py-2 font-normal px-4 border border-gray-300">Title</th>
                    <th className="py-2 font-normal px-4 border border-gray-300">Description</th>
                    <th className="py-2 font-normal px-4 border border-gray-300">Price</th>
                    <th className="py-2 font-normal px-4 border border-gray-300">Category</th>
                    <th className="py-2 font-normal px-4 border border-gray-300">Colors</th>
                    <th className="py-2 font-normal px-4 border border-gray-300">Sizes</th>
                    <th className="py-2 font-normal px-4 border border-gray-300">Discount</th>
                    <th className="py-2 font-normal px-4 border border-gray-300">Materials</th>
                    <th className="py-2 font-normal px-4 border border-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((item, index) => (
                    <tr key={index} className="text-center">
                      <td className="py-2 font-normal px-4 border border-gray-300">{index + 1}</td>
                      <td className="py-2 font-normal px-4 border border-gray-300"> <div className='flex items-center justify-center p-1 border-gray-300'><img src={`https://testaoron.limsa.uz/${item?.images}`} alt={item?.title_en} className="w-16 h-16 object-cover rounded" /></div></td>
                      <td className="py-2 font-normal px-4 border border-gray-300">{item?.title_en}</td>
                      <td className="py-2 font-normal px-4 border border-gray-300">{item?.description_en}</td>
                      <td className="py-2 font-normal px-4 border border-gray-300">{item?.price}</td>
                      <td className="py-2 font-normal px-4 border border-gray-300">{item?.category?.name_en}</td>
                      <td className="py-2 font-normal px-4 border border-gray-300">{item?.colors[0]?.color_de}</td>
                      <td className="py-2 font-normal px-4 border border-gray-300">{item?.sizes[0]?.size}</td>
                      <td className="py-2 font-normal px-4 border border-gray-300">{item?.discount?.discount}</td>
                      <td className="py-2 font-normal px-4 border border-gray-300">{item?.materials?.sq}</td>
                      <td className="py-2 font-normal px-4 border border-gray-300">
                        <div className="flex flex-wrap justify-center items-center gap-2 min-w-[130px]">
                          <button
                            onClick={() => showEditModal(item)}
                            className="bg-yellow-400 hover:bg-yellow-500 text-white font-normal py-1 px-3 rounded text-sm whitespace-nowrap"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteProduct(item?.id)}
                            className="bg-red-500 hover:bg-red-600 text-white font-normal py-1 px-3 rounded text-sm whitespace-nowrap"
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
