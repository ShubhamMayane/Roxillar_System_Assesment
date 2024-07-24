import React from "react";
import axios from "axios";
import { DataGrid } from '@mui/x-data-grid';


import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';




import "./Table.css";



const columns = [
  { field: 'id', headerName: 'id', width: 130 },
  { field: 'title', headerName: 'Title', width: 150 },
  { field: 'price', headerName: 'Price', width: 150 },
  { field: 'description', headerName: 'Description', width: 150 },
  { field: 'category', headerName: 'Category', width: 150 },
  { field: 'image', headerName: 'Image', width: 150 },
  { field: 'sold', headerName: 'Sold', width: 150 },
  { field: 'dateOfSale', headerName: 'DateOfSale', width: 150 },

];



    
function Table()
{
    let [transactions,setTransactions]=React.useState([]);
    let [statistics,setStatistics]=React.useState({});
    let [barChartData,setBarChartData]=React.useState([]);
    let inputChartData=[];
    let result;
    


    //for table data
    const rows = transactions;


    async function selected(event)
    {
        //alert(e.target.value);
        let month=event.target.value;
        let result= await axios.get("http://localhost:5000/getCombineData?month="+ month);
        console.log(result.data);
        console.log(result.data.Statastics);
        setStatistics(result.data.Statastics);
        setTransactions(result.data.AllTransactions);
       

        //setting data of barchart

        inputChartData= result.data.barChartData.map((element)=>{
    
          return({
              Name:element.startRange+"-"+element.endRange,
              TotalItems:element.items.length
          })
  
      });

      console.log( inputChartData);
      setBarChartData(inputChartData);

        


    }

    const myFunction = async () => {
        result= await axios.get("http://localhost:5000/getCombineData?month="+ 3);
        console.log(result.data);
        console.log(result.data.Statastics);
        setStatistics(result.data.Statastics);
        setTransactions(result.data.AllTransactions);
        
       

       // console.log(typeof transactions);
        console.log( result.data.AllTransactions)

       //console.log(typeof barChartData);
        console.log( result.data.barChartData)

        

       inputChartData= result.data.barChartData.map((element)=>{
    
            return({
                Name:element.startRange+"-"+element.endRange,
                TotalItems:element.items.length
            })
    
        });

        console.log( inputChartData);
        setBarChartData(inputChartData);

        // console.log(typeof barChartData);
    };
    
    React.useEffect(() => {
        myFunction();
    },[]);


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

      
   
    

    return( 
        
        


        <div>
            
            <div className="d-flex justify-content-center">
                    <select className="mb-5 w-25" onChange={selected}>
                        <option value="1">Jan</option>
                        <option value="2">Feb</option>
                        <option value="3" selected>Mar</option>
                        <option value="4">Apr</option>
                        <option value="5">May</option>
                        <option value="6">Jun</option>
                        <option value="7">Jul</option>
                        <option value="8">Aug</option>
                        <option value="9">Sept</option>
                        <option value="10">Oct</option>
                        <option value="11">Nov</option>
                        <option value="12">Dec</option>
                    </select>
            </div>
            


            <div  style={{ height: 400, width: '100%',alignItems:"center" }}>
                            <DataGrid 
                                    rows={rows}
                                    columns={columns}
                                    initialState={{
                                    pagination: {
                                        paginationModel: { page: 0, pageSize: 5 },
                                    },
                                    }}
                                    pageSizeOptions={[5, 10]}
                                    
                                />
            </div>



            

            {/* statistic information show  */}
            <div className="d-flex justify-content-center mt-4 mb-5">
              
                <table class="table">
                      
                      <tbody>
                        <tr className="table-info">
                          <th>Total Sale</th>
                          <th>{statistics.TotalSale}</th>
                          
                        </tr>
                        <tr className="table-info">
                          <th scope="row">Total Sold Item</th>
                          <th>{statistics.TotalSoldItem}</th>
                          
                        </tr>
                        <tr className="table-info">
                          <th scope="row">Total UnsoldItem</th>
                          <th colspan="2">{statistics.totalUnSoldItem}</th>
                         
                        </tr>
                      </tbody>
                </table>

              

            </div>








          {/* chart logic */}


        <div style={{
            width: "100%",
            height: "600px",
            backgroundColor: "white",
        }}>
        <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={300}
                data={barChartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 30,
                  bottom: 5,
                }}
                barSize={20}
              >
                <XAxis dataKey="Name" scale="point" padding={{ left: 50, right: 10 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar dataKey="TotalItems"fill="#8884d8" background={{ fill: '#eee' }} />
              </BarChart>
      </ResponsiveContainer>

        </div>
        

         

        </div>
    


    );

}

export default Table;