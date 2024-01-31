import theme from "./theme";

export const labels = ["経験年数", "適応力", "人柄", "発信力", "年齢", "コミュ力", "技術力", "正確性"];
export const dataChart = [1.67, 5, 3.35, 1.67, 3.35, 5, 3.35, 4];

export const config = {
  plugins: {
    legend: {
      display: false,
    },
  },
  elements: {
    point: {
      pointStyle: "dash",
    },
  },
  scales: {
    r: {
      max: 5,
      min: 0,
      ticks: {
        stepSize: 1.67,
        reverse: true,
        backgroundColor: "#fff",
        display: false,
      },
      grid: {
        color: theme.blue,
        lineWidth: [1, 1, 2],
      },
      pointLabels: {
        color: "#1A2944",
        font: {
          size: 10,
        },
        padding: 20,
      },
    },
  },
};
