import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Spin, Button, Modal, Input, Empty } from 'antd';
import toast from 'react-hot-toast';

const Colors = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [colorEn, setColorEn] = useState('');
  const [colorRu, setColorRu] = useState('');
  const [colorDe, setColorDe] = useState('');

  const token = localStorage.getItem("access_token");

  const getColors = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://back.ifly.com.uz/api/colors");
      setData(res?.data?.data || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch colors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getColors();
  }, []);

  const showModal = () => {
    setIsEditing(false);
    setEditId(null);
    setColorEn('');
    setColorRu('');
    setColorDe('');
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsEditing(false);
  };

  const handleSubmit = async () => {
    const payload = {
      color_en: colorEn,
      color_ru: colorRu,
      color_de: colorDe,
    };

    const url = isEditing
      ? `https://back.ifly.com.uz/api/colors/${editId}`
      : `https://back.ifly.com.uz/api/colors`;

    const method = isEditing ? 'patch' : 'post';

    try {
      await axios({
        method,
        url,
        data: payload,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(isEditing ? "Color updated" : "Color added");
      handleCancel();
      getColors();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message?.message || "Error");
    }
  };

  const handleEdit = (item) => {
    setColorEn(item.color_en);
    setColorRu(item.color_ru);
    setColorDe(item.color_de);
    setEditId(item.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const deleteColor = async (id) => {
    try {
      await axios.delete(`https://back.ifly.com.uz/api/colors/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Deleted");
      getColors();
    } catch (error) {
      toast.error("Error");
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center translate-y-[220%]">
          <Spin size="large" />
        </div>
      ) : (
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Colors</h2>
            <Button
              type="primary"
              onClick={showModal}
              style={{ backgroundColor: '#00C951', borderColor: '#00C951' }}
            >
              Add Color
            </Button>

            <Modal
              title={isEditing ? "Edit Color" : "Add Color"}
              open={isModalOpen}
              onOk={handleSubmit}
              onCancel={handleCancel}
            >
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                <div className="mb-2">
                  <label className="font-semibold" htmlFor="color-en">Color (EN)</label>
                  <Input
                    id="color-en"
                    value={colorEn}
                    onChange={(e) => setColorEn(e.target.value)}
                    placeholder="English name"
                  />
                </div>
                <div className="mb-2">
                  <label className="font-semibold" htmlFor="color-ru">Color (RU)</label>
                  <Input
                    id="color-ru"
                    value={colorRu}
                    onChange={(e) => setColorRu(e.target.value)}
                    placeholder="Russian name"
                  />
                </div>
                <div className="mb-2">
                  <label className="font-semibold" htmlFor="color-de">Color (DE)</label>
                  <Input
                    id="color-de"
                    value={colorDe}
                    onChange={(e) => setColorDe(e.target.value)}
                    placeholder="German name"
                  />
                </div>
              </form>
            </Modal>
          </div>

          <div className="overflow-x-auto">
            {data.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <Empty description="No colors available" />
              </div>
            ) : (
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="py-2 px-4 border border-gray-300 font-normal">№</th>
                    <th className="py-2 px-4 border border-gray-300 font-normal">Color EN</th>
                    <th className="py-2 px-4 border border-gray-300 font-normal">Color RU</th>
                    <th className="py-2 px-4 border border-gray-300 font-normal">Color DE</th>
                    <th className="py-2 px-4 border border-gray-300 font-normal">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={item.id} className="text-center">
                      <td className="py-2 px-4 border border-gray-300 font-normal">{index + 1}</td>
                      <td className="py-2 px-4 border border-gray-300 font-normal">{item.color_en}</td>
                      <td className="py-2 px-4 border border-gray-300 font-normal">{item.color_ru}</td>
                      <td className="py-2 px-4 border border-gray-300 font-normal">{item.color_de}</td>
                      <td className="py-2 px-4 border border-gray-300 font-normal space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-3 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteColor(item.id)}
                          className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
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

export default Colors;
