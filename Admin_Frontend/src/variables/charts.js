export const barChartDataDailyTraffic = [
  {
    name: "Daily Traffic",
    data: [20, 30, 40, 20, 45, 50, 30],
  },
];

export const barChartOptionsDailyTraffic = {
  chart: {
    toolbar: {
      show: false,
    },
  },
  tooltip: {
    style: {
      fontSize: "12px",
      fontFamily: undefined,
      backgroundColor: "#000000"
    },
    onDatasetHover: {
      style: {
        fontSize: "12px",
        fontFamily: undefined,
      },
    },
    theme: "dark",
  },
  xaxis: {
    categories: ["00", "04", "08", "12", "14", "16", "18"],
    show: false,
    labels: {
      show: true,
      style: {
        colors: "#A3AED0",
        fontSize: "14px",
        fontWeight: "500",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: false,
    color: "black",
    labels: {
      show: true,
      style: {
        colors: "#CBD5E0",
        fontSize: "14px",
      },
    },
  },
  grid: {
    show: false,
    strokeDashArray: 5,
    yaxis: {
      lines: {
        show: true,
      },
    },
    xaxis: {
      lines: {
        show: false,
      },
    },
  },
  fill: {
    type: "gradient",
    gradient: {
      type: "vertical",
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.9,
      colorStops: [
        [
          {
            offset: 0,
            color: "#4318FF",
            opacity: 1,
          },
          {
            offset: 100,
            color: "rgba(67, 24, 255, 1)",
            opacity: 0.28,
          },
        ],
      ],
    },
  },
  dataLabels: {
    enabled: false,
  },
  plotOptions: {
    bar: {
      borderRadius: 10,
      columnWidth: "40px",
    },
  },
};

export const pieChartOptions = {
  labels: ["Available", "Unavailable"],
  colors: ["#00FF00", "#FF3322"], // Green for Available, Red for Unavailable
  chart: {
    width: "900px",
    height: "400px", // Larger height to match a typical dashboard chart
    type: "donut", // Explicitly set to donut for the uploaded image style
  },
  states: {
    hover: {
      filter: {
        type: "lighten",
        value: 0.4,
      },
    },
  },
  legend: {
    show: true,
    position: "bottom",
    horizontalAlign: "center",
    fontSize: "14px",
    fontWeight: "500",
    labels: {
      colors: "#000000", // black
    },
  },
  dataLabels: {
    enabled: true,
    // formatter: (val) => `${val}%`, // Show percentage
    style: {
      fontSize: "14px",
      fontWeight: "bold",
      colors: ["#FFFFFF"],
      position: "center",
    },
  },
  // hover: { mode: null },
  plotOptions: {
    pie: {
      donut: {
        size: "100%", // Donut size to match the image
        labels: {
          show: false,
          name: {
            show: false, // Hide name for simplicity
          },
          value: {
            show: true,
            fontSize: "16px",
            fontWeight: "bold",
            color: "#FFFFFF",
            formatter: (val) => val, // Show raw value instead of percentage
          },
          total: {
            show: true,
            label: false,
            // formatter: (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0),
            fontSize: "16px",
            fontWeight: "bold",
            color: "#A3AED0",
          },
        },
      },
    },
  },
  fill: {
    colors: ["#00FF00", "#FF3322"], // Consistent with labels
  },
  tooltip: {
    enabled: true,
    theme: "dark",
    style: {
      fontSize: "14px",
      fontFamily: undefined,
      backgroundColor: "#000000",
    },
    // y: {
    //   formatter: (val) => `${val} Products`, // Custom tooltip format
    // },
  },
};

export const barChartOptions = {
  chart: {
    stacked: false,
    toolbar: { show: false },
  },
  tooltip: {
    style: { fontSize: "12px", backgroundColor: "#000000" },
    theme: "dark",
  },
  xaxis: {
    categories: ["Pending", "Preparing","In Transit", "Delivered", "Cancelled"],
    labels: {
      show: true,
      style: {
        colors: "#000000", // black color for better visibility
        fontSize: "14px",
        fontWeight: "500",
      },
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    show: true,
    labels: {
      show: true,
      style: {
        colors: "#A3AED0",
        fontSize: "14px",
        fontWeight: "500",
      },
      formatter: (value) => Math.round(value), // Round to avoid decimals
    },
  },
  grid: {
    borderColor: "rgba(163, 174, 208, 0.3)",
    show: true,
    yaxis: { lines: { show: true, opacity: 0.5 } },
    row: { opacity: 0.5 },
    xaxis: { lines: { show: false } },
  },
  fill: { type: "solid" },
  dataLabels: {
    enabled: true,
    style: {
      colors: ["#FFFFFF"], // White text for contrast
      fontSize: "12px",
      fontWeight: "bold",
    },
  },
  plotOptions: {
    bar: {
      borderRadius: 8,
      columnWidth: "30px",
      distributed: true, // Enable distributed bars for unique colors per category
    },
  },
  colors: ["#0000FF", "#87CEEB", "#FFA500", "#00FF00", "#FF0000"], // Blue, sky blue, Orange, Green, Red
};



export const lineChartDataTotalSpent = [
  {
    name: "Revenue",
    data: [50, 64, 48, 66, 49, 68],
    color: "#4318FF",
  },
  {
    name: "Profit",
    data: [30, 40, 24, 46, 20, 46],
    color: "#6AD2FF",
  },
];

export const lineChartOptionsTotalSpent = {
  legend: {
    show: false,
  },

  theme: {
    mode: "light",
  },
  chart: {
    type: "line",

    toolbar: {
      show: false,
    },
  },

  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
  },

  tooltip: {
    style: {
      fontSize: "12px",
      fontFamily: undefined,
      backgroundColor: "#000000"
    },
    theme: 'dark',
    x: {
      format: "dd/MM/yy HH:mm",
    },
  },
  grid: {
    show: false,
  },
  xaxis: {
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      style: {
        colors: "#A3AED0",
        fontSize: "12px",
        fontWeight: "500",
      },
    },
    type: "text",
    range: undefined,
    categories: ["SEP", "OCT", "NOV", "DEC", "JAN", "FEB"],
  },

  yaxis: {
    show: false,
  },
};
