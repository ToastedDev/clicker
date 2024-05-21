const analyticsData = JSON.parse(
  document.getElementById("analytics").innerHTML
);

const createChart = ({ id, title = "", data }) =>
  new Highcharts.chart({
    chart: {
      renderTo: id,
      type: "line",
      zoomType: "x",
      backgroundColor: "transparent",
      plotBorderColor: "transparent",
      animation: false,
      width: 800,
    },
    title: {
      text: title,
      style: {
        fontFamily: '"Inter", sans-serif',
        fontWeight: "600",
        letterSpacing: "-0.025em",
        color: "white",
      },
    },
    xAxis: {
      type: "datetime",
      tickPixelInterval: 500,
      labels: {
        style: {
          color: "#c2410c",
          fontFamily: '"Inter", sans-serif',
        },
      },
      gridLineColor: "#c2410c",
      lineColor: "#c2410c",
      minorGridLineColor: "#c2410c",
      tickColor: "#c2410c",
      title: {
        style: {
          color: "#c2410c",
        },
      },
    },
    yAxis: {
      title: {
        text: "",
      },
      labels: {
        style: {
          color: "#c2410c",
          fontFamily: '"Inter", sans-serif',
        },
      },
      gridLineColor: "#c2410c",
      lineColor: "#c2410c",
      minorGridLineColor: "#c2410c",
      tickColor: "#c2410c",
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        showInLegend: false,
        name: "",
        marker: { enabled: false },
        color: "rgb(249, 115, 22)",
        lineColor: "rgb(249, 115, 22)",
        lineWidth: 4,
        data,
      },
    ],
  });

createChart({
  id: "minutely-chart",
  title: "Minutely Clicks",
  data: analyticsData,
});
