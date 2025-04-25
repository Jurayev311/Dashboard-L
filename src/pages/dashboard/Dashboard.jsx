import React from 'react'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const navigate = useNavigate()

  const handleDelete = () => {
    localStorage.clear()
    navigate("/")
  }

  return (
    <div>Dashboard page tayyor emas
      <button onClick={handleDelete}>chiqish</button>
    </div>
  )
}

export default Dashboard