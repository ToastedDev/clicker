import { Style, css } from "hono/css";
import type { Child } from "hono/jsx";

export function Layout({
  children,
  title,
}: {
  children: Child;
  title?: string;
}) {
  return (
    <html lang="en">
      <head>
        <title>
          {title ? `${title} — Toasted Clicker` : "Toasted Clicker"}
        </title>
        <link rel="stylesheet" href="/static/odometer.css" />
        <script src="/static/odometer.js" />
        <script src="https://code.highcharts.com/10.3.3/highcharts.js" />
        <Style>
          {css`
            @import url("https://fonts.googleapis.com/css2?family=Yantramanav:wght@700&family=Inter:wght@100..900&display=swap");

            * {
              padding: 0;
              margin: 0;
              box-sizing: border-box;
            }

            body {
              background: rgb(67, 20, 7);
              min-height: 100vh;
              display: flex;
              flex-direction: column;
            }

            ::-webkit-scrollbar {
              width: 8px;
            }

            ::-webkit-scrollbar-track {
              background-color: rgb(67, 20, 7);
            }

            ::-webkit-scrollbar-thumb {
              border-radius: 0.5rem;
              background-color: rgb(249, 115, 22);
            }

            ::-webkit-scrollbar-thumb:hover {
              background-color: #f97316bf;
            }

            ::-moz-selection {
              background-color: rgb(249, 115, 22);
            }

            ::selection {
              background-color: rgb(249, 115, 22);
            }

            [data-highcharts-chart] {
              width: 100%;
            }
          `}
        </Style>
      </head>
      <body>{children}</body>
    </html>
  );
}
