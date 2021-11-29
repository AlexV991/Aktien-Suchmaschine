import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import React, {useState, useEffect} from 'react'



const Stock = ({stockSymbol}) => {

  const [stockData, setStockData] = useState('')

  const API_KEY = "KT7CW1QXDZBDGCIH.";

  useEffect(() => {
    fetchStock()}, 
  []
  )

    function fetchStock() {
      let API_Call = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stockSymbol}&apikey=${API_KEY}`
      const StockChartValuesFunction = [];
  
      fetch(API_Call)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log(data)
          // get the data of the last 100 days
          for (var key in data[`Time Series (Daily)`]) {
            StockChartValuesFunction.push([
              new Date(key).getTime(),
              parseFloat(
                (
                  Math.round(data[`Time Series (Daily)`][key][`2. high`] * 100) /
                  100
                ).toFixed(2)
              )
            ]);
          }
          setStockData(StockChartValuesFunction.reverse())
          
        });
    }

    const  options = {
      title: {
        text: "My stock chart"
      },
      xAxis: {
        type: "datetime",
        labels: {
          format: "{value:%b-%e}"
        }
      },
      series: [{
        data: stockData
      }]
    };
  
    return (
        <div>
            <h1>Stock Market</h1>
            <HighchartsReact highcharts={Highcharts} options={options} constructorType={'stockChart'}/>
        </div>
    )
  }
export default Stock
