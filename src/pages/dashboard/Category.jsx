import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { Flex, Spin, Button, Modal, Input, Empty } from 'antd';
import toast from 'react-hot-toast';

const Category = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const [nameEn, SetNameEn] = useState('');
  const [nameRu, SetNameRu] = useState('');
  const [nameDe, SetNameDe] = useState('');

  const token = localStorage.getItem("access_token");

  const showModal = () => {
    setIsEdit(false);
    setEditId(null);
    SetNameEn('');
    SetNameRu('');
    SetNameDe('');
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOk = () => {
    if (isEdit) {
      editCategory();
    } else {
      createCategory();
    }
  };

  // get api
  const [data, SetData] = useState([]);
  const [load, SetLoad] = useState(false);

  const getCategory = async () => {
    try {
      SetLoad(true);
      const res = await axios.get("https://back.ifly.com.uz/api/category");
      SetData(res?.data?.data);
    }
    catch (error) {
      console.log(error);
    }
    finally {
      SetLoad(false);
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  // post api
  const createCategory = async () => {
    try {
      const res = await axios.post("https://back.ifly.com.uz/api/category", {
        name_en: nameEn,
        name_ru: nameRu,
        name_de: nameDe
      },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );

      setIsModalOpen(false);
      getCategory();
      toast.success(res?.statusText);
    }
    catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message?.message);
    }
  };

  // delete api
  const deleteCategory = async (id) => {
    try {
      const res = await axios.delete(`https://back.ifly.com.uz/api/category/${id}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );
      getCategory();
      toast.success(res?.data?.data?.message);
    }
    catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  // edit modal ochish
  const handleEdit = (item) => {
    setIsEdit(true);
    setEditId(item.id);
    SetNameEn(item.name_en);
    SetNameRu(item.name_ru);
    SetNameDe(item.name_de);
    setIsModalOpen(true);
  };

  // edit patch
  const editCategory = async () => {
    try {
      const res = await axios.patch(`https://back.ifly.com.uz/api/category/${editId}`, {
        name_en: nameEn,
        name_ru: nameRu,
        name_de: nameDe
      },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );
      setIsModalOpen(false);
      getCategory();
      toast.success("Category updated successfully");
    }
    catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message?.message);
    }
  };

  return (
    <>
      {
        load ? (
          <div className='flex items-center justify-center translate-y-[220%]'>
            <Flex align="center" gap="middle">
              <Spin size="large" />
            </Flex>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Category</h2>
              <Button
                type="primary"
                onClick={showModal}
                style={{ backgroundColor: '#00C951', borderColor: '#00C951' }}
              >
                Add Category
              </Button>
              <Modal
                title={isEdit ? "Edit Category" : "Add Category"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
              >
                <form>
                  <div className='mb-2'>
                    <label className='font-semibold'>Category Name (EN)</label>
                    <Input value={nameEn} onChange={(e) => SetNameEn(e.target.value)} placeholder="English name" />
                  </div>
                  <div className='mb-2'>
                    <label className='font-semibold'>Category Name (RU)</label>
                    <Input value={nameRu} onChange={(e) => SetNameRu(e.target.value)} placeholder="Russian name" />
                  </div>
                  <div className='mb-2'>
                    <label className='font-semibold'>Category Name (DE)</label>
                    <Input value={nameDe} onChange={(e) => SetNameDe(e.target.value)} placeholder="German name" />
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
                      <th className="py-2 font-normal px-4 border border-gray-300">Title ENG</th>
                      <th className="py-2 font-normal px-4 border border-gray-300">Title RU</th>
                      <th className="py-2 font-normal px-4 border border-gray-300">Title DE</th>
                      <th className="py-2 font-normal px-4 border border-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      data?.map((item, index) => (
                        <tr key={item.id} className="text-center font-normal">
                          <td className="py-2 px-4 border border-gray-300">{index + 1}</td>
                          <td className="py-2 px-4 border border-gray-300">{item.name_en}</td>
                          <td className="py-2 px-4 border border-gray-300">{item.name_ru}</td>
                          <td className="py-2 px-4 border border-gray-300">{item.name_de}</td>
                          <td className="py-2 px-4 border border-gray-300 space-x-2">
                            <button onClick={() => handleEdit(item)} className="bg-yellow-400 hover:bg-yellow-500 text-white font-normal py-1 px-3 rounded">
                              Edit
                            </button>
                            <button onClick={() => deleteCategory(item.id)} className="bg-red-500 hover:bg-red-600 text-white font-normal py-1 px-3 rounded">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )
      }
    </>
  );
};

export default Category;
