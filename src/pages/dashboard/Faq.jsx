import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Flex, Spin, Button, Modal, Input, Empty } from 'antd';
import toast from 'react-hot-toast';

const Faq = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => setIsModalOpen(true);
  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);

  // get api
  const [data, SetData] = useState();
  const [load, SetLoad] = useState(false);

  const getFaq = async () => {
    try {
      SetLoad(true);
      const res = await axios.get("https://back.ifly.com.uz/api/faq");
      SetData(res?.data?.data);
    } catch (error) {
      console.log(error);
    } finally {
      SetLoad(false);
    }
  };

  useEffect(() => {
    getFaq();
  }, []);

  // post api
  const [question, SetQuestion] = useState();
  const [answer, SetAnswer] = useState();
  const [questionRu, setQuestionRu] = useState();
  const [answerRu, setAnswerRu] = useState();
  const [questionDe, setQuestionDe] = useState();
  const [answerDe, setAnswerDe] = useState();
  const token = localStorage.getItem("access_token");

  const createFaq = async () => {
    try {
      const res = await axios.post(
        "https://back.ifly.com.uz/api/faq",
        {
          question_en: question,
          answer_en: answer,
          question_ru: questionRu,
          answer_ru: answerRu,
          question_de: questionDe,
          answer_de: answerDe,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      handleOk();
      getFaq();
      toast.success(res?.statusText);
    } catch (error) {
      toast.error(error?.response?.data?.message?.message);
    }
  };

  // delete api
  const deleteDiscount = async (id) => {
    try {
      const res = await axios.delete(
        `https://back.ifly.com.uz/api/faq/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getFaq();
      toast.success(`FAQ with ID ${id} has been deleted successfully`);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <>
      {load ? (
        <div className="flex items-center justify-center translate-y-[220%]">
          <Flex align="center" gap="middle">
            <Spin size="large" />
          </Flex>
        </div>
      ) : (
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">FAQ</h2>
            <Button
              type="primary"
              onClick={showModal}
              style={{ backgroundColor: '#00C951', borderColor: '#00C951' }}
            >
              Add FAQ
            </Button>
            <Modal title="Add FAQ" open={isModalOpen} onOk={createFaq} onCancel={handleCancel}>
              <form action="">
                <div className="mb-2">
                  <label className="font-semibold">Question (EN)</label>
                  <Input onChange={(e) => SetQuestion(e.target.value)} placeholder="English question" />
                </div>
                <div className="mb-2">
                  <label className="font-semibold">Answer (EN)</label>
                  <Input onChange={(e) => SetAnswer(e.target.value)} placeholder="English answer" />
                </div>
                <div className="mb-2">
                  <label className="font-semibold">Question (RU)</label>
                  <Input onChange={(e) => setQuestionRu(e.target.value)} placeholder="Russian question" />
                </div>
                <div className="mb-2">
                  <label className="font-semibold">Answer (RU)</label>
                  <Input onChange={(e) => setAnswerRu(e.target.value)} placeholder="Russian answer" />
                </div>
                <div className="mb-2">
                  <label className="font-semibold">Question (DE)</label>
                  <Input onChange={(e) => setQuestionDe(e.target.value)} placeholder="German question" />
                </div>
                <div className="mb-2">
                  <label className="font-semibold">Answer (DE)</label>
                  <Input onChange={(e) => setAnswerDe(e.target.value)} placeholder="German answer" />
                </div>
              </form>
            </Modal>
          </div>

          <div className="overflow-x-auto">
            {data?.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <Empty description="No FAQs available" />
              </div>
            ) : (
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="py-2 font-normal px-4 border border-gray-300">№</th>
                    <th className="py-2 font-normal px-4 border border-gray-300">Question (EN)</th>
                    <th className="py-2 font-normal px-4 border border-gray-300">Answer (EN)</th>
                    <th className="py-2 font-normal px-4 border border-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((item, index) => (
                    <tr key={index} className="text-center">
                      <td className="py-2 font-normal px-4 border border-gray-300">{index + 1}</td>
                      <td className="py-2 font-normal px-4 border border-gray-300">{item?.question_en}</td>
                      <td className="py-2 font-normal px-4 border border-gray-300">{item?.answer_en}</td>
                      <td className="py-2 font-normal px-4 border border-gray-300 space-x-2">
                        <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-normal py-1 px-3 rounded">
                          Edit
                        </button>
                        <button
                          onClick={() => deleteDiscount(item?.id)}
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

export default Faq;
