import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { Flex, Spin, Button, Modal, Input } from 'antd';
import toast from 'react-hot-toast';

const Colors = () => {

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

  const getColors = async () => {
    try {
      SetLoad(true)
      const res = await axios.get("https://back.ifly.com.uz/api/colors")

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
    getColors()
  }, [])

  // post api
  const [colorEn, SetColorEn] = useState()
  const [colorRu, SetColorRu] = useState()
  const [colorDe, SetColorDe] = useState()  
  const token = localStorage.getItem("access_token")

  const createColors = async () => {
    try {
      const res = await axios.post("https://back.ifly.com.uz/api/colors", {color_en: colorEn, color_ru: colorRu, color_de: colorDe},
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      )

      handleOk()
      getColors()
      toast.success(res?.statusText)
    }
    catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message?.message)
    }
  }

  // delete api
  
  const deleteColors = async (id) => {
    try {
      const res = await axios.delete(`https://back.ifly.com.uz/api/colors/${id}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      )
      console.log(res);
      getColors()
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
            <h2 className="text-2xl font-bold">Colors</h2>
            <Button type="primary" onClick={showModal} style={{ backgroundColor: '#00C951', borderColor: '#00C951' }}>
              Add Colors
            </Button>
            <Modal title="Add Category" open={isModalOpen} onOk={createColors} onCancel={handleCancel}>
              <form action="">
                <div className='mb-2'>
              <label className='font-semibold' htmlFor="">Color (EN)</label>
              <Input onChange={(e) => SetColorEn(e.target.value)} placeholder="English name" />
              </div>
              <div className='mb-2'>
              <label className='font-semibold' htmlFor="">Color (RU)</label>
              <Input onChange={(e) => SetColorRu(e.target.value)} placeholder="Russian name" />
              </div>
              <div className='mb-2'>
              <label className='font-semibold' htmlFor="">Color (DE)</label>
              <Input onChange={(e) => SetColorDe(e.target.value)} placeholder="German name" />
              </div>
              </form>
            </Modal>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="py-2 font-normal px-4 border border-gray-300">№</th>
                  <th className="py-2 font-normal px-4 border border-gray-300">Colors ENG</th>
                  <th className="py-2 font-normal px-4 border border-gray-300">Colors RU</th>
                  <th className="py-2 font-normal px-4 border border-gray-300">Colors DE</th>
                  <th className="py-2 font-normal px-4 border border-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  data?.map((item, index) => (
                    <tr key={index} className="text-center">
                      <td className="py-2 font-normal px-4 border border-gray-300">{index + 1}</td>
                      <td className="py-2 font-normal px-4 border border-gray-300">{item?.color_en}</td>
                      <td className="py-2 font-normal px-4 border border-gray-300">{item?.color_ru}</td>
                      <td className="py-2 font-normal px-4 border border-gray-300">{item?.color_de}</td>
                      <td className="py-2 font-normal px-4 border border-gray-300 space-x-2">
                        <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-normal py-1 px-3 rounded">
                          Edit
                        </button>
                        <button onClick={() => deleteColors(item?.id)} className="bg-red-500 hover:bg-red-600 text-white font-normal py-1 px-3 rounded">
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

export default Colors;
