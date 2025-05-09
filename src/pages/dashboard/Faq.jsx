import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Flex, Spin, Button, Modal, Input, Empty } from 'antd';
import toast from 'react-hot-toast';

const Faq = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null); // Edit uchun ID
  const [data, SetData] = useState();
  const [load, SetLoad] = useState(false);

  const [question, SetQuestion] = useState();
  const [answer, SetAnswer] = useState();
  const [questionRu, setQuestionRu] = useState();
  const [answerRu, setAnswerRu] = useState();
  const [questionDe, setQuestionDe] = useState();
  const [answerDe, setAnswerDe] = useState();

  const token = localStorage.getItem("access_token");

  const getFaq = async () => {
    try {
      SetLoad(true);
      const res = await axios.get("https://testaoron.limsa.uz/api/faq");
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

  const showModal = () => {
    setEditId(null);
    clearForm();
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditId(null);
    clearForm();
  };

  const clearForm = () => {
    SetQuestion("");
    SetAnswer("");
    setQuestionRu("");
    setAnswerRu("");
    setQuestionDe("");
    setAnswerDe("");
  };

  const handleOk = () => {
    editId ? updateFaq() : createFaq();
  };

  const createFaq = async () => {
    try {
      const res = await axios.post(
        "https://testaoron.limsa.uz/api/faq",
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

      toast.success("FAQ added successfully");
      getFaq();
      setIsModalOpen(false);
      clearForm();
    } catch (error) {
      toast.error(error?.response?.data?.message?.message || "Error adding FAQ");
    }
  };

  const updateFaq = async () => {
    try {
      const res = await axios.patch(
        `https://testaoron.limsa.uz/api/faq/${editId}`,
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

      toast.success("FAQ updated successfully");
      getFaq();
      setIsModalOpen(false);
      setEditId(null);
      clearForm();
    } catch (error) {
      toast.error("Error updating FAQ");
    }
  };

  const deleteFaq = async (id) => {
    try {
      await axios.delete(`https://testaoron.limsa.uz/api/faq/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getFaq();
      toast.success(`FAQ with ID ${id} deleted`);
    } catch (error) {
      toast.error("Error deleting FAQ");
    }
  };

  const handleEdit = (item) => {
    setEditId(item?.id);
    SetQuestion(item?.question_en);
    SetAnswer(item?.answer_en);
    setQuestionRu(item?.question_ru);
    setAnswerRu(item?.answer_ru);
    setQuestionDe(item?.question_de);
    setAnswerDe(item?.answer_de);
    setIsModalOpen(true);
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
            <Modal
              title={editId ? "Edit FAQ" : "Add FAQ"}
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <form>
                {[
                  ["Question (EN)", question, SetQuestion],
                  ["Answer (EN)", answer, SetAnswer],
                  ["Question (RU)", questionRu, setQuestionRu],
                  ["Answer (RU)", answerRu, setAnswerRu],
                  ["Question (DE)", questionDe, setQuestionDe],
                  ["Answer (DE)", answerDe, setAnswerDe],
                ].map(([label, value, setter], i) => (
                  <div key={i} className="mb-2">
                    <label className="font-semibold">{label}</label>
                    <Input value={value} onChange={(e) => setter(e.target.value)} placeholder={label} />
                  </div>
                ))}
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
                        <button
                          onClick={() => handleEdit(item)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-white font-normal py-1 px-3 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteFaq(item?.id)}
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
