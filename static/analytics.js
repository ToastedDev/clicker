const analyticsData = JSON.parse(
  document.getElementById("analytics-data").textContent
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

function convertToHourlyData(minuteData) {
  const hourlyData = {};

  minuteData.forEach((entry) => {
    const date = new Date(entry[0]);
    const value = entry[1];

    const hourKey = date.toISOString().slice(0, 13);

    if (!hourlyData[hourKey] || date > new Date(hourlyData[hourKey][0])) {
      hourlyData[hourKey] = [entry[0], value];
    }
  });

  const result = Object.entries(hourlyData).map(([key, [time, value]]) => {
    const exactHourDate = new Date(time);
    exactHourDate.setUTCMinutes(0, 0, 0);
    return [exactHourDate.toISOString(), value];
  });

  return result;
}

function convertToDailyData(minuteData) {
  const dailyData = {};

  minuteData.forEach((entry) => {
    const date = new Date(entry[0]);
    const value = entry[1];

    const dayKey = date.toISOString().slice(0, 10);

    if (!dailyData[dayKey] || date > new Date(dailyData[dayKey][0])) {
      dailyData[dayKey] = [entry[0], value];
    }
  });

  const result = Object.entries(dailyData).map(([key, [time, value]]) => {
    const exactDayDate = new Date(time);
    exactDayDate.setUTCHours(0, 0, 0, 0);
    return [exactDayDate.toISOString(), value];
  });

  return result;
}

createChart({
  id: "minutely-chart",
  title: "Minutely Clicks",
  data: analyticsData,
});

createChart({
  id: "hourly-chart",
  title: "Hourly Clicks",
  data: convertToHourlyData(analyticsData),
});

createChart({
  id: "daily-chart",
  title: "Daily Clicks",
  data: convertToDailyData(analyticsData),
});
