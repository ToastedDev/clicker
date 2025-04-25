import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { getAnalytics, getClicks, getCountries } from "..";
import { css, cx } from "hono/css";
import { baseCard, button, buttonAsCard, card, main } from "./css";
import { Layout } from "./layout";
import { countryCodes } from "./countries";

export const client = new Hono();

client.get("*", jsxRenderer(Layout));

function Script({ content }) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: content
          .split("\n")
          .map((str) => str.trim())
          .filter((str) => str.length)
          .join("")
          .replace(/\t/g, ""),
      }}
    />
  );
}

function Card({ children }) {
  return <div class={card}>{children}</div>;
}

const chartStyles = `{
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
        color: "#9a3412",
        fontFamily: '"Inter", sans-serif',
      },
    },
    gridLineColor: "#9a3412",
    lineColor: "#9a3412",
    minorGridLineColor: "#9a3412",
    tickColor: "#9a3412",
    title: {
      style: {
        color: "#9a3412",
      },
    },
  },
  yAxis: {
    title: {
      text: "",
    },
    labels: {
      style: {
        color: "#9a3412",
        fontFamily: '"Inter", sans-serif',
      },
    },
    gridLineColor: "#9a3412",
    lineColor: "#9a3412",
    minorGridLineColor: "#9a3412",
    tickColor: "#9a3412",
  },
  credits: {
    enabled: false,
  },
}`;

client.get("/", async (ctx) => {
  const initialClicks = await getClicks();

  const count = css`
    font-family: "Yantramanav", sans-serif;
    font-weight: bold;
    font-size: 3rem;
    line-height: 1.1em;
    padding: 5px;
    @media (min-width: 640px) {
      & {
        font-size: 4rem;
      }
    }
    @media (min-width: 768px) {
      & {
        font-size: 4.5rem;
      }
    }
    @media (min-width: 1024px) {
      & {
        font-size: 5rem;
      }
    }
  `;

  return ctx.render(
    <>
      <main class={main}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={80}
          height={80}
          viewBox="0 0 14 14"
          style="color: #ff6900; margin-inline: auto;"
        >
          <g fill="currentColor">
            <path d="M9.5 4.5A2.5 2.5 0 0 0 7 2H2.5A2.5 2.5 0 0 0 1 6.5v5a1 1 0 0 0 1 1h5.5a1 1 0 0 0 1-1v-5a2.49 2.49 0 0 0 1-2"></path>
            <path
              fill-rule="evenodd"
              d="M10.695 2.97a3.99 3.99 0 0 1-.226 3.525H13l.008-.001A2.49 2.49 0 0 0 14 4.5A2.5 2.5 0 0 0 11.5 2h-1.377c.235.294.428.62.572.97M13 7.743h-3V11.5a2.5 2.5 0 0 1-.209 1H12a1 1 0 0 0 1-1z"
              clip-rule="evenodd"
            ></path>
          </g>
        </svg>
        <Card>
          <p class={cx(count, "odometer")} id="count">
            {initialClicks}
          </p>
          <button class={button} id="increment">
            +1
          </button>
        </Card>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <a
            href="/analytics"
            class={buttonAsCard}
            style="display: flex; flex-direction: row; align-items: center; gap: 0.25rem;"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              style="width: 1.25rem; height: 1.25rem; margin-right: 0.25rem;"
            >
              <path d="M3 3v18h18" />
              <path d="M13 17V9" />
              <path d="M18 17V5" />
              <path d="M8 17v-3" />
            </svg>
            View analytics
          </a>
          <a
            href="/lb"
            class={buttonAsCard}
            style="display: flex; flex-direction: row; align-items: center; gap: 0.25rem;"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              style="width: 1.25rem; height: 1.25rem; margin-right: 0.25rem;"
            >
              <line x1="8" x2="21" y1="6" y2="6" />
              <line x1="8" x2="21" y1="12" y2="12" />
              <line x1="8" x2="21" y1="18" y2="18" />
              <line x1="3" x2="3.01" y1="6" y2="6" />
              <line x1="3" x2="3.01" y1="12" y2="12" />
              <line x1="3" x2="3.01" y1="18" y2="18" />
            </svg>
            View country leaderboard
          </a>
        </div>
        <Card>
          <div id="chart" />
        </Card>
      </main>
      <Script
        content={`
          const chart = new Highcharts.chart({
            ...${chartStyles},
            series: [
              {
                showInLegend: false,
                name: "",
                marker: { enabled: false },
                color: "black",
                lineColor: "black",
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
            fetch("/api/click", {
              method: "POST",
            });
          });
        `}
      />
    </>
  );
});

client.get("/lb", async (ctx) => {
  const countries = (await getCountries()).map((country) => ({
    id: country.code,
    name: countryCodes[country.code],
    count: country.clicks,
  }));

  const table = css`
    ${baseCard}
    font-family: "Inter", sans-serif;
    border-collapse: collapse;
    & > tbody td,
    & > thead th {
      padding: 1rem;
    }
  `;
  const countryClass = css`
    display: flex;
    align-items: center;
    gap: 0.5rem;
  `;

  return ctx.render(
    <>
      <main class={main}>
        <div style="display: flex; align-items: center; gap: 0.5rem; text-align: center; margin-inline: auto;">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={56}
            height={56}
            viewBox="0 0 14 14"
            style="color: #ff6900"
          >
            <g fill="currentColor">
              <path d="M9.5 4.5A2.5 2.5 0 0 0 7 2H2.5A2.5 2.5 0 0 0 1 6.5v5a1 1 0 0 0 1 1h5.5a1 1 0 0 0 1-1v-5a2.49 2.49 0 0 0 1-2"></path>
              <path
                fill-rule="evenodd"
                d="M10.695 2.97a3.99 3.99 0 0 1-.226 3.525H13l.008-.001A2.49 2.49 0 0 0 14 4.5A2.5 2.5 0 0 0 11.5 2h-1.377c.235.294.428.62.572.97M13 7.743h-3V11.5a2.5 2.5 0 0 1-.209 1H12a1 1 0 0 0 1-1z"
                clip-rule="evenodd"
              ></path>
            </g>
          </svg>
          <h1 style='font-size: 2rem; color: #ff6900; font-family: "Inter", sans-serif; letter-spacing: -0.05em;'>
            Country Leaderboard
          </h1>
        </div>
        <a
          href="/"
          class={buttonAsCard}
          style="display: flex; flex-direction: row; align-items: center; gap: 0.25rem;"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            style="width: 1.25rem; height: 1.25rem; margin-right: 0.25rem;"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Go back to clicker
        </a>
        <table class={table}>
          <thead>
            <tr>
              <th style="text-align: center;">Rank</th>
              <th style="text-align: left; line-height: 1.5em;">Country</th>
              <th style="text-align: center;">Clicks</th>
            </tr>
          </thead>
          <tbody>
            {countries.map((country, index) => (
              <tr>
                <td style="text-align: center;">#{index + 1}</td>
                <td class={countryClass}>
                  <img
                    src={
                      country.id === "XX"
                        ? "https://preview.redd.it/the-flag-exists-but-we-dont-know-what-it-looks-like-flag-on-v0-5ilwz1vxv50b1.png?width=640&crop=smart&auto=webp&s=b24df479fdaf0747265c9cf12a20d9cb811c18bb"
                        : `https://flagcdn.com/w80/${country.id.toLowerCase()}.png`
                    }
                    alt={country.name}
                    width={40}
                    height={20}
                    style="object-fit: cover;"
                  />
                  <p>{country.name}</p>
                </td>
                <td style="text-align: center;">
                  {country.count.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>,
    { title: "Country Leaderboard" }
  );
});

client.get("/analytics", async (ctx) => {
  const analytics = await getAnalytics();
  return ctx.render(
    <>
      <main class={main}>
        <div style="display: flex; align-items: center; gap: 0.5rem; text-align: center; margin-inline: auto;">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={56}
            height={56}
            viewBox="0 0 14 14"
            style="color: #ff6900;"
          >
            <g fill="currentColor">
              <path d="M9.5 4.5A2.5 2.5 0 0 0 7 2H2.5A2.5 2.5 0 0 0 1 6.5v5a1 1 0 0 0 1 1h5.5a1 1 0 0 0 1-1v-5a2.49 2.49 0 0 0 1-2"></path>
              <path
                fill-rule="evenodd"
                d="M10.695 2.97a3.99 3.99 0 0 1-.226 3.525H13l.008-.001A2.49 2.49 0 0 0 14 4.5A2.5 2.5 0 0 0 11.5 2h-1.377c.235.294.428.62.572.97M13 7.743h-3V11.5a2.5 2.5 0 0 1-.209 1H12a1 1 0 0 0 1-1z"
                clip-rule="evenodd"
              ></path>
            </g>
          </svg>
          <h1 style='font-size: 2rem; color: #ff6900; font-family: "Inter", sans-serif; letter-spacing: -0.05em;'>
            Analytics
          </h1>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <a
            href="/"
            class={buttonAsCard}
            style="display: flex; flex-direction: row; align-items: center; gap: 0.25rem;"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              style="width: 1.25rem; height: 1.25rem; margin-right: 0.25rem;"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            Go back to clicker
          </a>
          <button
            href="/"
            id="download-csv"
            class={buttonAsCard}
            style="display: flex; flex-direction: row; align-items: center; gap: 0.25rem;"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              style="width: 1.25rem; height: 1.25rem; margin-right: 0.25rem;"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            Download data as CSV
          </button>
        </div>
        {["minutely", "hourly", "daily"].map((chartType) => (
          <Card>
            <div id={`${chartType}-chart`} />
          </Card>
        ))}
      </main>
      <script
        type="application/json"
        id="analytics-data"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(analytics),
        }}
      />
      <Script
        content={`
          const analyticsData = JSON.parse(
            document.getElementById("analytics-data").textContent
          ).map(([date, count]) => [new Date(date).getTime(), count]);

          const chartStyles = ${chartStyles};

          const createChart = ({ id, title = "", data }) =>
            new Highcharts.chart({
              ...chartStyles,
              chart: Object.assign(chartStyles.chart, { renderTo: id }),
              title: {
                text: title,
                style: {
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: "600",
                  letterSpacing: "-0.025em",
                  color: "black",
                },
              },
              series: [
                {
                  showInLegend: false,
                  name: "",
                  marker: { enabled: false },
                  color: "black",
                  lineColor: "black",
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
              return [exactHourDate.getTime(), value];
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
              return [exactDayDate.getTime(), value];
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

          function convertDate(date) {
            return (
              date.toISOString().slice(0, 10) + " " + date.toISOString().slice(11, 16)
            );
          }

          document.getElementById("download-csv").addEventListener("click", () => {
            const csvText =
              "Time (UTC),Clicks\\n" +
              analyticsData
                .map((entry) => [convertDate(new Date(entry[0])), entry[1]].join(","))
                .join("\\n");
            downloadCSVFile(csvText, "ToastedClickerAnalytics.csv");
          });

          function downloadCSVFile(csvText, fileName) {
            const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            if (link.download !== undefined) {
              const url = URL.createObjectURL(blob);
              link.setAttribute("href", url);
              link.setAttribute("download", fileName);
              link.style.visibility = "hidden";
              link.click();
            } else {
              window.open("data:text/csv;charset=utf-8," + encodeURIComponent(csvText));
            }
          }
        `}
      />
    </>,
    { title: "Analytics" }
  );
});
