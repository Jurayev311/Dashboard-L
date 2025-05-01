import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Flex, Spin, Button, Modal, Input, Empty } from 'antd';
import toast from 'react-hot-toast';

const Contact = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [addressEn, setAddressEn] = useState('');
  const [addressRu, setAddressRu] = useState('');
  const [addressDe, setAddressDe] = useState('');

  const token = localStorage.getItem("access_token");

  const getContacts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://back.ifly.com.uz/api/contact");
      setData(res?.data?.data || []);
    } catch (err) {
      toast.error("Failed to fetch contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getContacts();
  }, []);

  const clearForm = () => {
    setPhone('');
    setEmail('');
    setAddressEn('');
    setAddressRu('');
    setAddressDe('');
  };

  const showModal = () => {
    clearForm();
    setEditId(null);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditId(null);
    clearForm();
  };

  const handleSubmit = () => {
    editId ? updateContact() : createContact();
  };

  const createContact = async () => {
    try {
      await axios.post("https://back.ifly.com.uz/api/contact", {
        phone_number: phone,
        email,
        address_en: addressEn,
        address_ru: addressRu,
        address_de: addressDe,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      toast.success("Contact added successfully");
      getContacts();
      setIsModalOpen(false);
      clearForm();
    } catch (err) {
      toast.error("Failed to add contact");
    }
  };

  const updateContact = async () => {
    try {
      await axios.patch(`https://back.ifly.com.uz/api/contact/${editId}`, {
        phone_number: phone,
        email,
        address_en: addressEn,
        address_ru: addressRu,
        address_de: addressDe,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      toast.success("Contact updated successfully");
      getContacts();
      setIsModalOpen(false);
      clearForm();
      setEditId(null);
    } catch (err) {
      toast.error("Failed to update contact");
    }
  };

  const deleteContact = async (id) => {
    try {
      await axios.delete(`https://back.ifly.com.uz/api/contact/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      toast.success("Contact deleted");
      getContacts();
    } catch (err) {
      toast.error("Failed to delete contact");
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setPhone(item.phone_number);
    setEmail(item.email);
    setAddressEn(item.address_en);
    setAddressRu(item.address_ru);
    setAddressDe(item.address_de);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      {loading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <Flex align="center" gap="middle">
            <Spin size="large" />
          </Flex>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Contact</h2>
            <Button
              type="primary"
              onClick={showModal}
              style={{ backgroundColor: '#00C951', borderColor: '#00C951' }}
            >
              Add Contact
            </Button>
          </div>

          <Modal
            title={editId ? "Edit Contact" : "Add Contact"}
            open={isModalOpen}
            onOk={handleSubmit}
            onCancel={handleCancel}
          >
            <form>
              {[
                ["Phone Number", phone, setPhone],
                ["Email", email, setEmail],
                ["Address (EN)", addressEn, setAddressEn],
                ["Address (RU)", addressRu, setAddressRu],
                ["Address (DE)", addressDe, setAddressDe],
              ].map(([label, value, setter], i) => (
                <div key={i} className="mb-2">
                  <label className="font-semibold">{label}</label>
                  <Input value={value} onChange={(e) => setter(e.target.value)} placeholder={label} />
                </div>
              ))}
            </form>
          </Modal>

          <div className="overflow-x-auto">
            {data.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <Empty description="No Contacts found" />
              </div>
            ) : (
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="py-2 px-4 border border-gray-300 font-normal">№</th>
                    <th className="py-2 px-4 border border-gray-300 font-normal">Phone Number</th>
                    <th className="py-2 px-4 border border-gray-300 font-normal">Email</th>
                    <th className="py-2 px-4 border border-gray-300 font-normal">Address (EN)</th>
                    <th className="py-2 px-4 border border-gray-300 font-normal">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={item.id} className="text-center">
                      <td className="py-2 px-4 border border-gray-300 font-normal">{index + 1}</td>
                      <td className="py-2 px-4 border border-gray-300 font-normal">{item.phone_number}</td>
                      <td className="py-2 px-4 border border-gray-300 font-normal">{item.email}</td>
                      <td className="py-2 px-4 border border-gray-300 font-normal">{item.address_en}</td>
                      <td className="py-2 px-4 border border-gray-300 font-normal space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-white font-normal py-1 px-3 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteContact(item.id)}
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
        </>
      )}
    </div>
  );
};

export default Contact;
