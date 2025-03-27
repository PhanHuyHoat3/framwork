import React from 'react'
import ReactECharts from "echarts-for-react";

type Props = {}

const Dashboard = (props: Props) => {
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

  return <ReactECharts option={option} style={{ height: 300 }} />;
}

export default Dashboard