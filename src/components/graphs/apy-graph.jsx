// interface ApyGraphProps {
//     address: string;
// }

// export const ApyGraph = ({ address }: ApyGraphProps) => {
//     return <></>;
// };

import { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

function Chart() {
    const chartRef = useRef(null);

    useEffect(() => {
        let root = am5.Root.new(chartRef.current);

        // Set themes (same as your original code)
        root.setThemes([am5themes_Animated.new(root)]);

        // Chart, axes, series, etc. (rest of your original code)
        let chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panX: true,
                panY: true,
                wheelX: "panX",
                wheelY: "zoomX",
                pinchZoomX: true,
                paddingLeft: 0,
            })
        );

        // Add cursor
        // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
        let cursor = chart.set(
            "cursor",
            am5xy.XYCursor.new(root, {
                behavior: "none",
            })
        );
        cursor.lineY.set("visible", false);

        // Generate random data
        let date = new Date();
        date.setHours(0, 0, 0, 0);
        let value = 1000;
        let volume = 100000;

        function generateData() {
            value = Math.round(Math.random() * 10 - 5 + value);
            volume = Math.round(Math.random() * 1000 - 500 + volume);

            am5.time.add(date, "day", 1);
            // add another if it's saturday
            if (date.getDay() == 6) {
                am5.time.add(date, "day", 1);
            }
            // add another if it's sunday
            if (date.getDay() == 0) {
                am5.time.add(date, "day", 1);
            }

            return {
                date: date.getTime(),
                value: value,
                volume: volume,
            };
        }

        function generateDatas(count) {
            let data = [];
            for (var i = 0; i < count; ++i) {
                data.push(generateData());
            }
            return data;
        }

        // Create axes
        // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
        let xAxis = chart.xAxes.push(
            am5xy.GaplessDateAxis.new(root, {
                maxDeviation: 0,
                baseInterval: {
                    timeUnit: "day",
                    count: 1,
                },
                renderer: am5xy.AxisRendererX.new(root, {
                    minorGridEnabled: true,
                }),
                tooltip: am5.Tooltip.new(root, {}),
            })
        );

        let yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                extraMin: 0.2,
                renderer: am5xy.AxisRendererY.new(root, {}),
            })
        );

        // Add series
        // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
        let series = chart.series.push(
            am5xy.LineSeries.new(root, {
                name: "Series",
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "value",
                valueXField: "date",
                tooltip: am5.Tooltip.new(root, {
                    labelText: "{valueY}",
                }),
            })
        );

        // y axis for volume
        let volumeAxisRenderer = am5xy.AxisRendererY.new(root, {});
        volumeAxisRenderer.grid.template.set("forceHidden", true);
        volumeAxisRenderer.labels.template.set("forceHidden", true);

        let volumeAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                height: am5.percent(25),
                y: am5.percent(100),
                centerY: am5.percent(100),
                panY: false,
                renderer: volumeAxisRenderer,
            })
        );

        // Add series
        // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
        let volumeSeries = chart.series.push(
            am5xy.ColumnSeries.new(root, {
                name: "Volume Series",
                xAxis: xAxis,
                yAxis: volumeAxis,
                valueYField: "volume",
                valueXField: "date",
                tooltip: am5.Tooltip.new(root, {
                    labelText: "{valueY}",
                }),
            })
        );

        volumeSeries.columns.template.setAll({
            fillOpacity: 1,
            strokeOpacity: 0,
            width: am5.percent(40),
        });

        // Set data
        let data = generateDatas(200);
        series.data.setAll(data);
        volumeSeries.data.setAll(data);

        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        series.appear(1000);
        chart.appear(1000, 100);

        // Clean up when the component unmounts
        return () => {
            root.dispose();
        };
    }, []);

    return (
        <div
            id="chartdiv"
            ref={chartRef}
            className="w-full h-96 bg-white/5 backdrop-blur-sm  rounded-xl"
        ></div>
    );
}

export default Chart;
