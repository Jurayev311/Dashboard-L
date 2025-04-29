import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { Flex, Spin, Button, Modal, Input, Checkbox } from 'antd';
import toast from 'react-hot-toast';

const Sizes = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };


  // get api
  const [data, SetData] = useState()
  const [load, SetLoad] = useState(false)

  const getDiscount = async () => {
    try {
      SetLoad(true)
      const res = await axios.get("https://back.ifly.com.uz/api/sizes")

      console.log(res);
      
      SetData(res?.data?.data)
    }
    catch (error) {
      console.log(error);
    }
    finally {
      SetLoad(false)
    }
  }

  useEffect(() => {
    getDiscount()
  }, [])
  console.log(data);


  // post api
  const [sizes, SetSizes] = useState()
  const token = localStorage.getItem("access_token")

  const createDiscount = async () => {
    try {
      const res = await axios.post("https://back.ifly.com.uz/api/sizes", { size: sizes },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      )

      handleOk()
      getDiscount()
      toast.success(res?.statusText)
    }
    catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message?.message)
    }
  }

  // delete api

  const deleteDiscount = async (id) => {
    try {
      const res = await axios.delete(`https://back.ifly.com.uz/api/sizes/${id}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      )
      console.log(res);
      getDiscount()
      toast.success(`Discount with ID ${id} has been deleted successfully`)
    }
    catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message)
    }
  }

  return (
    <>
      {
        load ? (<div className='flex items-center justify-center translate-y-[220%]'><Flex align="center" gap="middle"> <Spin size="large" /> </Flex></div>) : (<div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Category</h2>
            <Button type="primary" onClick={showModal} style={{ backgroundColor: '#00C951', borderColor: '#00C951' }}>
              Add Sizes
            </Button>
            <Modal title="Add Sizes" open={isModalOpen} onOk={createDiscount} onCancel={handleCancel}>
              <form action="">
                <div className='mb-2'>
                  <label className='font-semibold' htmlFor="">Sizes</label>
                  <Input type='number' onChange={(e) => SetSizes((e.target.value))} placeholder="Size name" />
                </div>
              </form>
            </Modal>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="py-2 font-normal px-4 border border-gray-300">№</th>
                  <th className="py-2 font-normal px-4 border border-gray-300">Sizes</th>
                  <th className="py-2 font-normal px-4 border border-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  data?.map((item, index) => (
                    <tr key={index} className="text-center">
                      <td className="py-2 font-normal px-4 border border-gray-300">{index + 1}</td>
                      <td className="py-2 font-normal px-4 border border-gray-300">{item.size}</td>

                      <td className="py-2 font-normal px-4 border border-gray-300 space-x-2">
                        <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-normal py-1 px-3 rounded">
                          Edit
                        </button>
                        <button onClick={() => deleteDiscount(item?.id)} className="bg-red-500 hover:bg-red-600 text-white font-normal py-1 px-3 rounded">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>)
      }
    </>
  );
};

export default Sizes;
