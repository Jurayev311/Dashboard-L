import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Flex, Spin, Button, Modal, Input, Empty } from 'antd';
import toast from 'react-hot-toast';

const Sizes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => setIsModalOpen(true);
  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);

  // get api
  const [data, SetData] = useState();
  const [load, SetLoad] = useState(false);
  console.log(data);
  

  const getSize = async () => {
    try {
      SetLoad(true);
      const res = await axios.get("https://back.ifly.com.uz/api/sizes");
      SetData(res?.data?.data);
    } catch (error) {
      console.log(error);
    } finally {
      SetLoad(false);
    }
  };

  useEffect(() => {
    getSize();
  }, []);

  // post api
  const [sizes, SetSizes] = useState();
  const token = localStorage.getItem("access_token");

  const createSize = async () => {
    try {
      const res = await axios.post(
        "https://back.ifly.com.uz/api/sizes",
        { size: sizes },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      handleOk();
      getSize();
      toast.success(res?.statusText);
    } catch (error) {
      console.log(error);
      toast.error("Error");
    }
  };

  // delete api
  const deleteSize = async (id) => {
    try {
      const res = await axios.delete(
        `https://back.ifly.com.uz/api/sizes/${id}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      getSize();
      toast.success("Deleted");
    } catch (error) {
      toast.error("Error");
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
              onClick={showModal}
              style={{ backgroundColor: '#00C951', borderColor: '#00C951' }}
            >
              Add Size
            </Button>
            <Modal
              title="Add Size"
              open={isModalOpen}
              onOk={createSize}
              onCancel={handleCancel}
            >
              <form>
                <div className="mb-2">
                  <label className="font-semibold" htmlFor="size">
                    Size
                  </label>
                  <Input
                    id="size"
                    onChange={(e) => SetSizes(e.target.value)}
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
                        <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-normal py-1 px-3 rounded">
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
