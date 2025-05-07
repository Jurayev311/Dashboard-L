import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Flex, Spin, Button, Modal, Input, Empty } from 'antd';
import toast from 'react-hot-toast';

const Team = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [fullName, setFullName] = useState('');
  const [positionEn, setPositionEn] = useState('');
  const [positionRu, setPositionRu] = useState('');
  const [positionDe, setPositionDe] = useState('');
  const [image, setImage] = useState('');
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(false);

  const token = localStorage.getItem('access_token');

  const resetForm = () => {
    setEditMode(false);
    setCurrentMember(null);
    setFullName('');
    setPositionEn('');
    setPositionRu('');
    setPositionDe('');
    setImage('');
  };

  const showModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    const url = editMode
      ? `https://back.ifly.com.uz/api/team-section/${currentMember?.id}`
      : 'https://back.ifly.com.uz/api/team-section';
    const method = editMode ? 'patch' : 'post';

    const formData = new FormData();
    formData.append('full_name', fullName);
    formData.append('position_en', positionEn);
    formData.append('position_ru', positionRu);
    formData.append('position_de', positionDe);
    formData.append('image', image); // Rasmni FormData orqali yuborish

    try {
      const res = await axios[method](url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      // Rasm URL manzilini olish va to‘g‘ri shaklda ko‘rsatish
      const imageUrl = res?.data?.image_url || res?.data?.image;
      const imagePath = imageUrl ? `https://back.ifly.com.uz/${imageUrl}` : '';

      setImage(imagePath); // To‘g‘ri rasm URL manzili bilan yangilash

      toast.success(res?.statusText || 'Success');
      fetchTeam();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error(error?.response?.data?.message?.message || 'Error');
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const fetchTeam = async () => {
    try {
      setLoad(true);
      const res = await axios.get('https://back.ifly.com.uz/api/team-section');
      setData(res?.data?.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const deleteMember = async (id) => {
    try {
      await axios.delete(`https://back.ifly.com.uz/api/team-section/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Deleted successfully');
      fetchTeam();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Delete error');
    }
  };

  const editMember = (item) => {
    setCurrentMember(item);
    setFullName(item?.full_name || '');
    setPositionEn(item?.position_en || '');
    setPositionRu(item?.position_ru || '');
    setPositionDe(item?.position_de || '');
    setImage(item?.image || '');
    setEditMode(true);
    setIsModalOpen(true);
  };

  return (
    <>
      {load ? (
        <div className='flex items-center justify-center translate-y-[220%]'>
          <Flex align='center' gap='middle'>
            <Spin size='large' />
          </Flex>
        </div>
      ) : (
        <div className='p-6'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-2xl font-bold'>Team</h2>
            <Button
              type='primary'
              onClick={showModal}
              style={{ backgroundColor: '#00C951', borderColor: '#00C951' }}
            >
              Add Member
            </Button>
            <Modal
              title={editMode ? 'Edit Member' : 'Add Member'}
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <form className='space-y-2 pt mt-3'>
                <label htmlFor="">Full name</label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder='Full Name'
                />
                <label htmlFor="">Position EN</label>
                <Input
                  value={positionEn}
                  onChange={(e) => setPositionEn(e.target.value)}
                  placeholder='Position EN'
                />
                <label htmlFor="">Position RU</label>
                <Input
                  value={positionRu}
                  onChange={(e) => setPositionRu(e.target.value)}
                  placeholder='Position RU'
                />
                <label htmlFor="">Position DE</label>
                <Input
                  value={positionDe}
                  onChange={(e) => setPositionDe(e.target.value)}
                  placeholder='Position DE'
                />
                <label htmlFor="">Image</label>
                <Input
                  type='file'
                  onChange={(e) => setImage(e.target.files[0])} // Faqat rasm faylini tanlash
                />
              </form>
            </Modal>
          </div>

          <div className='overflow-x-auto'>
            {data?.length === 0 ? (
              <div className='flex items-center justify-center h-64'>
                <Empty description='No team members found' />
              </div>
            ) : (
              <table className='min-w-full bg-white border border-gray-300'>
                <thead>
                  <tr className='bg-gray-300 text-gray-700 text-center'>
                    <th className='py-2 px-4 border border-gray-300 font-normal'>№</th>
                    <th className='py-2 px-4 border border-gray-300 font-normal'>Image</th>
                    <th className='py-2 px-4 border border-gray-300 font-normal'>Full Name</th>
                    <th className='py-2 px-4 border border-gray-300 font-normal'>Position (EN)</th>
                    <th className='py-2 px-4 border border-gray-300 font-normal'>Position (RU)</th>
                    <th className='py-2 px-4 border border-gray-300 font-normal'>Position (DE)</th>
                    <th className='py-2 px-4 border border-gray-300 font-normal'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={item?.id} className='text-center'>
                      <td className='py-2 px-4 border border-gray-300 font-normal'>{index + 1}</td>
                      <td className='py-2 px-4 border border-gray-300 font-normal'>
                        <img
                          src={item?.image ? `https://back.ifly.com.uz/${item?.image}` : 'default-image-url'}
                          alt='team'
                          className='w-12 h-12 rounded-full mx-auto object-cover'
                        />
                      </td>
                      <td className='py-2 px-4 border border-gray-300 font-normal'>{item?.full_name}</td>
                      <td className='py-2 px-4 border border-gray-300 font-normal'>{item?.position_en}</td>
                      <td className='py-2 px-4 border border-gray-300 font-normal'>{item?.position_ru}</td>
                      <td className='py-2 px-4 border border-gray-300 font-normal'>{item?.position_de}</td>
                      <td className='py-2 px-4 border border-gray-300 font-normal space-x-2'>
                        <button
                          onClick={() => editMember(item)}
                          className='bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-3 rounded'
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteMember(item?.id)}
                          className='bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded'
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

export default Team;
