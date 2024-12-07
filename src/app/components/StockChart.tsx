import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';

interface StockData {
  dates: string[];
  values: number[];
}

interface StockInfo {
  'Meta Data'?: {
    '2. Symbol'?: string;
  };
}


interface StockChartProps {
  data: StockData | null;
  stockInfo: StockInfo | null; 
}

const StockChart: React.FC<StockChartProps> = ({ data, stockInfo }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  useEffect(() => {
    if (!data || !chartRef.current) return;

    const chartInstance = echarts.init(chartRef.current);

    const options: echarts.EChartsOption = {
      title: {
        text: stockInfo?.['Meta Data']?.['2. Symbol'] ? `${stockInfo['Meta Data']['2. Symbol']} ${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart` : `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart`,
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any[]) => {
          const param = params[0];
          return param ? `Value: <strong>$${param.value}</strong> <br/> Date: <strong>${param.axisValue}</strong>` : '';
        },
      },
      xAxis: {
        type: 'category',
        data: data.dates,
        axisLabel: { rotate: 45 },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value: number) => `$ ${value}`,
        },
      },
      series: [
        {
          data: data.values,
          type: chartType,
          smooth: chartType === 'line',
          areaStyle: chartType === 'line' ? {} : null,
        },
      ],
    };

    chartInstance.setOption(options);

    return () => {
      chartInstance.dispose();
    };
  }, [data, stockInfo, chartType]);

  const handleChartTypeChange = (type: 'line' | 'bar') => {
    setChartType(type);
  };


  return (
    <div className='chart-container'>
      <div >
        <span className='chart-title'>Chart Type:</span>
        <button
          onClick={() => handleChartTypeChange("line")}
          className='chart-switch-buttons'
          style={{
            backgroundColor: chartType === "line" ? "#0070f3" : "#f0f0f0",
            color: chartType === "line" ? "white" : "#333",
            marginRight: "10px",
          }}
        >
          Line
        </button>
        <button
          onClick={() => handleChartTypeChange("bar")}
          className='chart-switch-buttons'
          style={{
            backgroundColor: chartType === "bar" ? "#0070f3" : "#f0f0f0",
            color: chartType === "bar" ? "white" : "#333",

          }}
        >
          Bar
        </button>
      </div>
      <div ref={chartRef} className='chart_container'  />
    </div>
  );
};

export default StockChart;
