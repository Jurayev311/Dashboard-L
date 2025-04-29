import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { Flex, Spin, Button, Modal, Input, Checkbox } from 'antd';
import toast from 'react-hot-toast';

const Discount = () => {

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
      const res = await axios.get("https://back.ifly.com.uz/api/discount")

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
  const [disc, SetDisc] = useState()
  const [start, SetStart] = useState()
  const [finish, SetFinish] = useState()
  const [active, setActive] = useState(false)
  const token = localStorage.getItem("access_token")

  const createDiscount = async () => {
    try {
      const res = await axios.post("https://back.ifly.com.uz/api/discount", { discount: disc, started_at: start, finished_at: finish, status: active },
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
      const res = await axios.delete(`https://back.ifly.com.uz/api/discount/${id}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      )
      console.log(res);
      getDiscount()
      toast.success(res?.data?.data?.message)

    }
    catch (error) {
      toast.error(error?.message?.message)
    }
  }

  return (
    <>
      {
        load ? (<div className='flex items-center justify-center translate-y-[220%]'><Flex align="center" gap="middle"> <Spin size="large" /> </Flex></div>) : (<div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Category</h2>
            <Button type="primary" onClick={showModal} style={{ backgroundColor: '#00C951', borderColor: '#00C951' }}>
              Open Modal
            </Button>
            <Modal title="Add Discount" open={isModalOpen} onOk={createDiscount} onCancel={handleCancel}>
              <form action="">
                <div className='mb-2'>
                  <label className='font-semibold' htmlFor="">Discount %</label>
                  <Input type='number' onChange={(e) => SetDisc(Number(e.target.value))} placeholder="Discount %" />
                </div>
                <div className='mb-2'>
                  <label className='font-semibold' htmlFor="">Started</label>
                  <Input type='date' onChange={(e) => SetStart(e.target.value)} placeholder="Russian name" />
                </div>
                <div className='mb-2'>
                  <label className='font-semibold' htmlFor="">Finished</label>
                  <Input type='date' onChange={(e) => SetFinish(e.target.value)} placeholder="German name" />
                </div>
                <div className='mb-2 flex items-center gap-2'>
                  <label className='font-semibold' htmlFor="">Active</label>
                  <Checkbox onChange={(e) => setActive(e.target.checked)} />
                </div>
              </form>
            </Modal>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="py-2 font-normal px-4 border border-gray-300">№</th>
                  <th className="py-2 font-normal px-4 border border-gray-300">Discount (%)</th>
                  <th className="py-2 font-normal px-4 border border-gray-300">Created Date</th>
                  <th className="py-2 font-normal px-4 border border-gray-300">Finished Date</th>
                  <th className="py-2 font-normal px-4 border border-gray-300">Status</th>
                  <th className="py-2 font-normal px-4 border border-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  data?.map((item, index) => (
                    <tr key={index} className="text-center">
                      <td className="py-2 font-normal px-4 border border-gray-300">{index + 1}</td>
                      <td className="py-2 font-normal px-4 border border-gray-300">{item?.discount}%</td>
                      <td className="py-2 font-normal px-4 border border-gray-300">{item?.started_at}</td>
                      <td className="py-2 font-normal px-4 border border-gray-300">{item?.finished_at}</td>
                      <td className="py-2 font-normal px-4 border border-gray-300">
                        <span className={item?.status ? "text-green-500" : "text-red-500"}>
                          {item?.status ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="py-2 font-normal px-4 border border-gray-300 space-x-2">
                        <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-normal py-1 px-3 rounded">
                          Edit
                        </button>
                        <button onClick={() => deleteDiscount(item?.id)} className="bg-rend-500 hover:bg-red-600 text-white font-normal py-1 px-3 rounded">
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

export default Discount;
