import React from 'react'
import ReactECharts from "echarts-for-react";
import { useNavigate } from 'react-router-dom';

type Props = {}

const Dashboard = (props: Props) => {
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate('/'); 
  };
  const option = {
    title: { text: "User Demographics", left: "center" },
    tooltip: { trigger: "item" },
    legend: { orient: "vertical", left: "left" },
    series: [
      {
        name: "Users",
        type: "pie",
        radius: "50%",
        data: [
          { value: 1048, name: "Active" },
          { value: 735, name: "Inactive" },
          { value: 580, name: "New Users" },
        ],
      },
    ],
  };

  return (
    <div>
      <button 
        onClick={handleGoBack} 
        style={{ 
          marginBottom: '10px', 
          padding: '8px 16px', 
          backgroundColor: '#007bff', 
          color: 'white',  
        }}>
        Quay về trang sản phẩm
      </button>
      <ReactECharts option={option} style={{ height: 300 }} />
    </div>
  );
}

export default Dashboard