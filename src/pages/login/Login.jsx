import React, { useState } from 'react'
import { Button, Form, Input, message } from 'antd';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const [loading, setLoading] = useState(false)

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    const navigate = useNavigate()

    const [login, setLogin] = useState()
    const [password, setPassword] = useState()
    
    const handleLogin = async () => {
        setLoading(true)
        try {
            const response = await axios.post("https://back.ifly.com.uz/api/auth/login", {login, password}, 
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )

            toast.success(response?.data?.data?.message)
            localStorage.setItem("access_token", response?.data?.data?.access_token)
            localStorage.setItem("refresh_token", response?.data?.data?.refresh_token)
            navigate("/dashboard/products")
        }
        catch(error) {
            console.log(error);
            toast.error(error?.response?.data?.message?.message)
        }
        finally{
            setLoading(false)
        }
    }

    return (
        <section className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center px-4 py-6">
            <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                <Form
                    name="loginForm"
                    layout="vertical"
                    initialValues={{ remember: true }}
                    onFinish={handleLogin}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label={<span className="text-[#1f2d3d] font-medium">Login</span>}
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}>
                        <Input 
                            onChange={(e) => setLogin(e.target.value)} 
                            className="rounded-md py-2" 
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="text-[#1f2d3d] font-medium">Password</span>}
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}>
                        <Input.Password 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="rounded-md py-2" 
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            loading={loading}
                            type="primary"
                            htmlType="submit"
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium rounded-md py-2"
                        >
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </section>
    )
}

export default Login;
