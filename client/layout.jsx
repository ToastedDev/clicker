import { css, Style } from "hono/css";

export function Layout({ children, title }) {
  title = title ? `${title} — Toasted Clicker` : "Toasted Clicker";
  const description = "The toastiest clicker in the world!";
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <title>{title}</title>
        <link
          rel="icon"
          type="image/svg+xml"
          href="https://toasted.dev/favicon.svg"
        />
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content="https://toasted.is-a.dev/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:creator" content="@ToastedDev" />
        <meta name="twitter:creator:id" content="1145171094556426240" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta property="og:image" content="https://toasted.is-a.dev/logo.png" />
        <meta
          name="twitter:image"
          content="https://toasted.is-a.dev/logo.png"
        />
        <meta name="twitter:card" content="summary" />
        <meta name="theme-color" content="#f97316" />
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
              color: white;
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

            .highcharts-reset-zoom {
              border-radius: 8px;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
          `}
        </Style>
      </head>
      <body>{children}</body>
    </html>
  );
}
