import React from "react";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';



function Chart(props)
{
    

    console.log("Type is :"+typeof props.chartData);
    console.log(props.chartData);

 
    let inputChartData=props.chartData;

    // inputChartData.map((element)=>{

    //     return({
    //         name:element.startRange+"-"+element.endRange,
    //         totalItems:element.items.length
    //     })

    // })


    // console.log(inputChartData);
const data = [
    {
      name: '0-100',
      uv: 4000,
      pv: 2400,
      amt: 0,
    },
    {
      name: '101-200',
      uv: 3000,
      pv: 1398,
      amt:5,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt:7,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 8,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt:9,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 15,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 11,
    },
  ];



    return (
        <div style={{
            width: "1100px",
            height: "600px",
            backgroundColor: "white",
        }}>
                <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={props.chartData}
          margin={{
            top: 5,
            right: 30,
            left: 30,
            bottom: 5,
          }}
          barSize={20}
        >
          <XAxis dataKey="" scale="point" padding={{ left: 10, right: 10 }} />
          <YAxis />
          <Tooltip />
          <Legend />
          <CartesianGrid strokeDasharray="3 3" />
          <Bar dataKey=""fill="#8884d8" background={{ fill: '#eee' }} />
        </BarChart>
      </ResponsiveContainer>

        </div>
        


    );



}


export default Chart;