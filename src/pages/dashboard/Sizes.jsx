import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Flex, Spin, Button, Modal, Input, Empty } from 'antd';
import toast from 'react-hot-toast';

const Sizes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentSizeId, setCurrentSizeId] = useState(null);
  const [sizes, setSizes] = useState('');
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(false);
  const token = localStorage.getItem("access_token");

  const getSize = async () => {
    try {
      setLoad(true);
      const res = await axios.get("https://testaoron.limsa.uz/api/sizes");
      setData(res?.data?.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    getSize();
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

  const createOrUpdateSize = async () => {
    const url = editMode
      ? `https://testaoron.limsa.uz/api/sizes/${currentSizeId}`
      : `https://testaoron.limsa.uz/api/sizes`;
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
      getSize();
    } catch (error) {
      console.log(error);
      toast.error("Error");
    }
  };

  const deleteSize = async (id) => {
    try {
      await axios.delete(
        `https://testaoron.limsa.uz/api/sizes/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`Size with ID ${id} has been deleted`);
      getSize();
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
            <h2 className="text-2xl font-bold">Sizes</h2>
            <Button
              type="primary"
              onClick={showAddModal}
              style={{ backgroundColor: '#00C951', borderColor: '#00C951' }}
            >
              Add Size
            </Button>
            <Modal
              title={editMode ? "Edit Size" : "Add Size"}
              open={isModalOpen}
              onOk={createOrUpdateSize}
              onCancel={handleCancel}
            >
              <form onSubmit={(e) => { e.preventDefault(); createOrUpdateSize(); }}>
                <div className="mb-2">
                  <label className="font-semibold" htmlFor="size">
                    Size
                  </label>
                  <Input
                    id="size"
                    value={sizes}
                    onChange={(e) => setSizes(e.target.value)}
                    placeholder="Enter size"
                  />
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
                    <th className="py-2 font-normal px-4 border border-gray-300">Size</th>
                    <th className="py-2 font-normal px-4 border border-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((item, index) => (
                    <tr key={item?.id} className="text-center">
                      <td className="py-2 font-normal px-4 border border-gray-300">{index + 1}</td>
                      <td className="py-2 font-normal px-4 border border-gray-300">{item?.size}</td>
                      <td className="py-2 font-normal px-4 border border-gray-300 space-x-2">
                        <button
                          onClick={() => showEditModal(item)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-white font-normal py-1 px-3 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteSize(item?.id)}
                          className="bg-red-500 hover:bg-red-600 text-white font-normal py-1 px-3 rounded"
                        >
                          Delete
                        </button>
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

export default Sizes;
