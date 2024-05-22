const count = document.getElementById("count");
const chart = new Highcharts.chart({
  chart: {
    renderTo: "chart",
    type: "line",
    zoomType: "x",
    panning: true,
    panKey: "shift",
    animation: true,
    backgroundColor: "transparent",
    plotBorderColor: "transparent",
    resetZoomButton: {
      theme: {
        fill: "#232323",
        stroke: "rgb(249, 115, 22)",
        r: 5,
        style: {
          color: "rgb(249, 115, 22)",
          fontSize: "12px",
          fontWeight: "bold",
        },
        states: {
          hover: {
            fill: "rgb(249, 115, 22)",
            style: {
              color: "#232323",
            },
          },
        },
      },
    },
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
  fetch("/api/clicks")
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("count").textContent = data.clicks;

      if (chart.series[0].points.length >= 3600)
        chart.series[0].data[0].remove();
      chart.series[0].addPoint([Date.now(), parseInt(data.clicks)]);
    });
}, 2000);

document.getElementById("increment").addEventListener("click", () => {
  fetch("/api/clicks", {
    method: "POST",
  });
});
