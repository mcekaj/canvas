import React, { useMemo } from "react";
import "./App.css";
import { Line } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import { dummy } from "./dummy";

Chart.register(CategoryScale);

function App() {
  const previousY = (ctx: any) =>
    ctx.index === 0
      ? ctx.chart.scales.y.getPixelForValue(100)
      : ctx.chart
          .getDatasetMeta(ctx.datasetIndex)
          .data[ctx.index - 1].getProps(["y"], true).y;
  const dummyData = useMemo(
    () => dummy.map((item) => item.FilteredFrontalAsymmetryAlpha),
    []
  );
  const totalDuration = dummyData.length * 1000;
  const delayBetweenPoints = totalDuration / dummyData.length;
  console.log(delayBetweenPoints);
  return (
    <div>
      <Line
        data={{
          datasets: [
            {
              // pointBackgroundColor: function (context) {
              //   var index = context.dataIndex;
              //   var value: any = context.dataset.data[index];
              //   console.log(value.y);
              //   return value.y > 100 ? "red" : "green";
              // },
              segment: {
                borderColor: (ctx) => {
                  console.log(ctx);
                  const ySegment = ctx.p1.parsed.y * 100;
                  console.log(ctx);
                  console.log("Y:", ySegment);
                  if (ySegment > 0 && ySegment < 30) {
                    return "red";
                  } else if (ySegment > 30 && ySegment < 60) {
                    return "orange";
                  } else {
                    return "green";
                  }
                  // if (ctx.p0.parsed.y > 0) {
                  //   return "red";
                  // } else if (ctx.p0.parsed.y > 0.03) {
                  //   return "orange";
                  // } else {
                  //   return "green";
                  // }
                },
              },
              borderWidth: 10,
              data: dummyData.map((item, index) => ({
                x: index,
                y: item * 10,
              })),
              pointRadius: (ctx: any) => {
                const pointsLength = ctx.chart.data.labels.length - 1;
                const pointsArray: any = [];
                for (let i = 0; i <= pointsLength; i++) {
                  if (i === pointsLength) {
                    pointsArray.push(5);
                  } else {
                    pointsArray.push(0);
                  }
                }

                return pointsArray;
              },
              tension: 1,
            },
          ],
        }}
        options={{
          interaction: {
            intersect: false,
          },

          scales: {
            x: {
              type: "linear",
              weight: 1,
              max: dummyData.length,
            },
            y: {
              type: "linear",
              weight: 1,
              max: 1,
              min: 0,
            },
          },
          animations: {
            x: {
              type: "number",
              easing: "linear",
              duration: delayBetweenPoints,
              from: NaN, // the point is initially skipped
              delay(ctx: any) {
                if (ctx.type !== "data" || ctx.xStarted) {
                  return 0;
                }
                ctx.xStarted = true;
                return ctx.index * delayBetweenPoints;
              },
            },
            y: {
              type: "number",
              easing: "linear",
              duration: delayBetweenPoints,
              from: previousY,
              delay(ctx: any) {
                if (ctx.type !== "data" || ctx.yStarted) {
                  return 0;
                }
                ctx.yStarted = true;
                return ctx.index * delayBetweenPoints;
              },
            },
          },
        }}
      />
    </div>
  );
}

export default App;
