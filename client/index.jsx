import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { getClicks } from "..";
import { css, cx } from "hono/css";
import trim from "trim-whitespace";
import { button, card, main } from "./css";
import { Layout } from "./layout";

export const client = new Hono();

client.get("*", jsxRenderer(Layout));

function Script({ content }) {
  return <script dangerouslySetInnerHTML={{ __html: trim(content) }} />;
}

function Card({ children }) {
  return <div class={card}>{children}</div>;
}

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
        <Card>
          <div id="chart" />
        </Card>
      </main>
      <Script
        content={`
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
