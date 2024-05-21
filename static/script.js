const count = document.getElementById("count");
const chart = new Highcharts.chart({
  chart: {
    renderTo: "chart",
    type: "line",
    zoomType: "x",
    backgroundColor: "transparent",
    plotBorderColor: "transparent",
    animation: false,
    width: 800,
  },
  title: {
    text: "",
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
    },
  ],
});

setInterval(() => {
  fetch("/clicks")
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("count").textContent = data.clicks;

      if (chart.series[0].points.length >= 3600)
        chart.series[0].data[0].remove();
      chart.series[0].addPoint([Date.now(), parseInt(data.clicks)]);
    });
}, 2000);

document.getElementById("increment").addEventListener("click", () => {
  fetch("/clicks", {
    method: "POST",
  });
});
