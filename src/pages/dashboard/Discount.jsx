import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Flex, Spin, Button, Modal, Input, Checkbox, Empty } from 'antd';
import toast from 'react-hot-toast';

const Discount = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentDiscount, setCurrentDiscount] = useState(null);
  const [disc, SetDisc] = useState('');
  const [start, SetStart] = useState('');
  const [finish, SetFinish] = useState('');
  const [active, setActive] = useState(false);
  const [data, SetData] = useState([]);
  const [load, SetLoad] = useState(false);

  const token = localStorage.getItem('access_token');

  const resetForm = () => {
    setEditMode(false);
    setCurrentDiscount(null);
    SetDisc('');
    SetStart('');
    SetFinish('');
    setActive(false);
  };

  const showModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    const url = editMode
      ? `https://back.ifly.com.uz/api/discount/${currentDiscount?.id}`
      : 'https://back.ifly.com.uz/api/discount';
    const method = editMode ? 'patch' : 'post';

    try {
      const res = await axios[method](url, {
        discount: disc,
        started_at: start,
        finished_at: finish,
        status: active,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(res?.statusText || 'Success');
      getDiscount();
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

  const getDiscount = async () => {
    try {
      SetLoad(true);
      const res = await axios.get('https://back.ifly.com.uz/api/discount');
      SetData(res?.data?.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      SetLoad(false);
    }
  };

  useEffect(() => {
    getDiscount();
  }, []);

  const deleteDiscount = async (id) => {
    try {
      await axios.delete(`https://back.ifly.com.uz/api/discount/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(`Deleted successfully`);
      getDiscount();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Delete error');
    }
  };

  const editDiscount = (item) => {
    setCurrentDiscount(item);
    SetDisc(item?.discount);
    SetStart(item?.started_at);
    SetFinish(item?.finished_at);
    setActive(item?.status);
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
            <h2 className='text-2xl font-bold'>Discount</h2>
            <Button
              type='primary'
              onClick={showModal}
              style={{ backgroundColor: '#00C951', borderColor: '#00C951' }}
            >
              Add Discount
            </Button>
            <Modal
              title={editMode ? 'Edit Discount' : 'Add Discount'}
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <form>
                <div className='mb-2'>
                  <label className='font-semibold'>Discount %</label>
                  <Input
                    type='number'
                    value={disc}
                    onChange={(e) => SetDisc(Number(e.target.value))}
                    placeholder='Discount %'
                  />
                </div>
                <div className='mb-2'>
                  <label className='font-semibold'>Started</label>
                  <Input
                    type='date'
                    value={start}
                    onChange={(e) => SetStart(e.target.value)}
                    placeholder='Start date'
                  />
                </div>
                <div className='mb-2'>
                  <label className='font-semibold'>Finished</label>
                  <Input
                    type='date'
                    value={finish}
                    onChange={(e) => SetFinish(e.target.value)}
                    placeholder='Finish date'
                  />
                </div>
                <div className='mb-2 flex items-center gap-2'>
                  <label className='font-semibold'>Active</label>
                  <Checkbox
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                  />
                </div>
              </form>
            </Modal>
          </div>

          <div className='overflow-x-auto'>
            {data?.length === 0 ? (
              <div className='flex items-center justify-center h-64'>
                <Empty description='No discounts available' />
              </div>
            ) : (
              <table className='min-w-full bg-white border border-gray-300'>
                <thead>
                  <tr className='bg-gray-200 text-gray-700'>
                    <th className='py-2 font-normal px-4 border border-gray-300'>№</th>
                    <th className='py-2 font-normal px-4 border border-gray-300'>Discount (%)</th>
                    <th className='py-2 font-normal px-4 border border-gray-300'>Started</th>
                    <th className='py-2 font-normal px-4 border border-gray-300'>Finished</th> 
                    <th className='py-2 font-normal px-4 border border-gray-300'>Status</th>
                    <th className='py-2 font-normal px-4 border border-gray-300'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((item, index) => (
                    <tr key={item?.id} className='text-center'>
                      <td className='py-2 px-4 border border-gray-300 font-normal'>{index + 1}</td>
                      <td className='py-2 px-4 border border-gray-300 font-normal'>{item?.discount}%</td>
                      <td className='py-2 px-4 border border-gray-300 font-normal'>{item?.started_at}</td>
                      <td className='py-2 px-4 border border-gray-300 font-normal'>{item?.finished_at}</td>
                      <td className='py-2 px-4 border border-gray-300 font-normal'>
                        <span className={item?.status ? 'text-green-500' : 'text-red-500'}>
                          {item?.status ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className='py-2 px-4 border border-gray-300 space-x-2'>
                        <button
                          onClick={() => editDiscount(item)}
                          className='bg-yellow-400 font-normal hover:bg-yellow-500 text-white py-1 px-3 rounded'
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteDiscount(item?.id)}
                          className='bg-red-500 font-normal hover:bg-red-600 text-white py-1 px-3 rounded'
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

export default Discount;
