import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Flex, Spin, Button, Modal, Input, Empty } from 'antd';
import toast from 'react-hot-toast';

const News = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [titleEn, setTitleEn] = useState('');
  const [titleRu, setTitleRu] = useState('');
  const [titleDe, setTitleDe] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionRu, setDescriptionRu] = useState('');
  const [descriptionDe, setDescriptionDe] = useState('');
  const [image, setImage] = useState(null);
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(false);

  const token = localStorage.getItem('access_token');

  const resetForm = () => {
    setEditMode(false);
    setCurrentMember(null);
    setTitleEn('');
    setTitleRu('');
    setTitleDe('');
    setDescriptionEn('');
    setDescriptionRu('');
    setDescriptionDe('');
    setImage(null);
  };

  const showModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    const url = editMode
      ? `https://back.ifly.com.uz/api/news/${currentMember?.id}`
      : 'https://back.ifly.com.uz/api/news';
    const method = editMode ? 'patch' : 'post';

    const formData = new FormData();
    formData.append('title_en', titleEn);
    formData.append('title_ru', titleRu);
    formData.append('title_de', titleDe);
    formData.append('description_en', descriptionEn);
    formData.append('description_ru', descriptionRu);
    formData.append('description_de', descriptionDe);
    if (image) formData.append('file', image); 

    try {
      const res = await axios[method](url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(res?.statusText || 'Success');
      fetchNews();
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

  const fetchNews = async () => {
    try {
      setLoad(true);
      const res = await axios.get('https://back.ifly.com.uz/api/news');
      setData(res?.data?.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const deleteNews = async (id) => {
    try {
      await axios.delete(`https://back.ifly.com.uz/api/news/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Deleted successfully');
      fetchNews();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Delete error');
    }
  };

  const editNews = (item) => {
    setCurrentMember(item);
    setTitleEn(item?.title_en || '');
    setTitleRu(item?.title_ru || '');
    setTitleDe(item?.title_de || '');
    setDescriptionEn(item?.description_en || '');
    setDescriptionRu(item?.description_ru || '');
    setDescriptionDe(item?.description_de || '');
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
            <h2 className='text-2xl font-bold'>News</h2>
            <Button
              type='primary'
              onClick={showModal}
              style={{ backgroundColor: '#00C951', borderColor: '#00C951' }}
            >
              Add News
            </Button>
            <Modal
              title={editMode ? 'Edit News' : 'Add News'}
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <form className='space-y-2 pt mt-3'>
                <label>Title (EN)</label>
                <Input
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder='Title (EN)'
                />
                <label>Title (RU)</label>
                <Input
                  value={titleRu}
                  onChange={(e) => setTitleRu(e.target.value)}
                  placeholder='Title (RU)'
                />
                <label>Title (DE)</label>
                <Input
                  value={titleDe}
                  onChange={(e) => setTitleDe(e.target.value)}
                  placeholder='Title (DE)'
                />
                <label>Description (EN)</label>
                <Input
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  placeholder='Description (EN)'
                />
                <label>Description (RU)</label>
                <Input
                  value={descriptionRu}
                  onChange={(e) => setDescriptionRu(e.target.value)}
                  placeholder='Description (RU)'
                />
                <label>Description (DE)</label>
                <Input
                  value={descriptionDe}
                  onChange={(e) => setDescriptionDe(e.target.value)}
                  placeholder='Description (DE)'
                />
                <label>Image</label>
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
                <Empty description='No news found' />
              </div>
            ) : (
              <table className='min-w-full bg-white border border-gray-300'>
                <thead>
                  <tr className='bg-gray-300 text-gray-700 text-center'>
                    <th className='py-2 px-4 border border-gray-300 font-normal'>№</th>
                    <th className='py-2 px-4 border border-gray-300 font-normal'>Image</th>
                    <th className='py-2 px-4 border border-gray-300 font-normal'>Title (EN)</th>
                    <th className='py-2 px-4 border border-gray-300 font-normal'>Description (EN)</th>
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
                          alt='news'
                          className='w-12 h-12 rounded-full mx-auto object-cover'
                        />
                      </td>
                      <td className='py-2 px-4 border border-gray-300 font-normal'>{item?.title_en}</td>
                      <td className='py-2 px-4 border border-gray-300 font-normal'>{item?.description_en}</td>
                      <td className='py-2 px-4 border border-gray-300 font-normal space-x-2'>
                        <button
                          onClick={() => editNews(item)}
                          className='bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-3 rounded'
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteNews(item?.id)}
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

export default News;
