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
    visible: false,
  },
  yAxis: {
    visible: false,
  },
  credits: {
    enabled: false,
  },
  series: [
    {
      showInLegend: false,
      name: "",
      marker: { enabled: false },
      color: "orange",
      lineColor: "orange",
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
