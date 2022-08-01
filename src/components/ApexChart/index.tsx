/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

import { DestructureData } from "interfaces";
import { ApexOptions } from "apexcharts";

const DashChart: FC<DestructureData> = (props) => {
  /* global-state */
  const { data } = props.data;
  const { daycategory } = props.categorydata;

  /* local-state */
  const [seriesData, setSeriesData] = useState(data);
  const [categories, setCategories] = useState(daycategory);

  /* hooks */

  /* functions */

  /* effects */
  useEffect(() => {
    setSeriesData(data);
    setCategories(daycategory);
  }, [props]);

  /* constants */
  const options: ApexOptions = {
    chart: {
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
        animateGradually: {
          enabled: false,
          delay: 400,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 800,
        },
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 2,
        blur: 1,
        opacity: 0,
      },
      //header of chart disabled
      toolbar: {
        show: false,
        offsetX: 0,
        offsetY: 0,
        tools: {
          download: true,
          selection: true,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: true,
          reset: true || '<img src="/static/icons/reset.png" width="20">',
          customIcons: [],
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      curve: "smooth",
      colors: ["#3DF4DD"],
      width: 3,
      dashArray: 0,
    },
    grid: {
      show: false, // you can either change hear to disable all grids
      row: {
        colors: undefined,
        opacity: 0.5,
      },
      column: {
        colors: undefined,
        opacity: 0.5,
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 100,
        left: -9,
      },
      xaxis: {
        lines: {
          show: false, //or just here to disable only x axis grids
        },
      },

      yaxis: {
        lines: {
          show: false, //or just here to disable only y axis
        },
      },
    },

    fill: {
      colors: ["#B2EDFF"],
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.6,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
    tooltip: {
      enabled: false,
      enabledOnSeries: undefined,
      shared: false,
      followCursor: false,
      intersect: false,
      inverseOrder: false,
      custom: undefined,
      fillSeriesColor: false,
      style: {
        fontSize: "12px",
        fontFamily: undefined,
      },
      onDatasetHover: {
        highlightDataSeries: false,
      },
      x: {
        show: false,
        format: "dd MMM",
        formatter: undefined,
      },
      marker: {
        show: false,
      },
      items: {
        display: "flex",
      },
      fixed: {
        enabled: false,
        position: "topLeft",
        offsetX: 0,
        offsetY: 0,
      },
    },
    xaxis: {
      type: "category",
      categories: categories,
      axisTicks: {
        show: false,
        borderType: "solid",
        color: "transparent",
        height: 6,
        offsetX: 0,
        offsetY: 0,
      },
      labels: {
        show: false,
      },
      axisBorder: {
        show: true,
        color: "transparent",
        offsetX: 0,
        offsetY: 0,
      },
    },

    yaxis: {
      labels: {
        show: false,
      },
    },
  };

  return (
    <ReactApexChart
      options={options}
      series={[{ enabled: true, name: "Series1", data: seriesData }]}
      type="area"
      height={290}
      width={360}
    />
  );
};

export default DashChart;
