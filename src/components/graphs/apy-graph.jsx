import React, { PureComponent } from "react";
import {
    Label,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ReferenceArea,
    ResponsiveContainer,
} from "recharts";

const initialData = [
    { name: 1, Implied: 50, Underlying: 100 },
    { name: 2, Implied: 37, Underlying: 120 },
    { name: 3, Implied: 45, Underlying: 150 },
    { name: 4, Implied: 55, Underlying: 180 },
    { name: 5, Implied: 59, Underlying: 200 },
    { name: 6, Implied: 63, Underlying: 499 },
    { name: 7, Implied: 53, Underlying: 50 },
    { name: 8, Implied: 52, Underlying: 100 },
    { name: 9, Implied: 79, Underlying: 200 },
    { name: 10, Implied: 94, Underlying: 222 },
    { name: 11, Implied: 73, Underlying: 210 },
    { name: 12, Implied: 41, Underlying: 300 },
    { name: 13, Implied: 21, Underlying: 50 },
    { name: 14, Implied: 86, Underlying: 190 },
    { name: 15, Implied: 77, Underlying: 300 },
    { name: 16, Implied: 66, Underlying: 400 },
    { name: 17, Implied: 55, Underlying: 200 },
    { name: 18, Implied: 99, Underlying: 50 },
    { name: 19, Implied: 76, Underlying: 100 },
    { name: 20, Implied: 85, Underlying: 100 },
];

const getAxisYDomain = (from, to, ref, offset) => {
    const refData = initialData.slice(from - 1, to);
    let [bottom, top] = [refData[0][ref], refData[0][ref]];
    refData.forEach((d) => {
        if (d[ref] > top) top = d[ref];
        if (d[ref] < bottom) bottom = d[ref];
    });

    return [(bottom | 0) - offset, (top | 0) + offset];
};

const initialState = {
    data: initialData,
    left: "dataMin",
    right: "dataMax",
    refAreaLeft: "",
    refAreaRight: "",
    top: "dataMax+1",
    bottom: "dataMin-1",
    top2: "dataMax+20",
    bottom2: "dataMin-20",
    animation: true,
};

export default class Example2 extends PureComponent {
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    zoom() {
        let { refAreaLeft, refAreaRight } = this.state;
        const { data } = this.state;

        if (refAreaLeft === refAreaRight || refAreaRight === "") {
            this.setState(() => ({
                refAreaLeft: "",
                refAreaRight: "",
            }));
            return;
        }

        // xAxis domain
        if (refAreaLeft > refAreaRight)
            [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];

        // yAxis domain
        const [bottom, top] = getAxisYDomain(
            refAreaLeft,
            refAreaRight,
            "Implied",
            1
        );
        const [bottom2, top2] = getAxisYDomain(
            refAreaLeft,
            refAreaRight,
            "Underlying",
            50
        );

        this.setState(() => ({
            refAreaLeft: "",
            refAreaRight: "",
            data: data.slice(),
            left: refAreaLeft,
            right: refAreaRight,
            bottom,
            top,
            bottom2,
            top2,
        }));
    }

    zoomOut() {
        const { data } = this.state;
        this.setState(() => ({
            data: data.slice(),
            refAreaLeft: "",
            refAreaRight: "",
            left: "dataMin",
            right: "dataMax",
            top: "dataMax+1",
            bottom: "dataMin",
            top2: "dataMax+50",
            bottom2: "dataMin+50",
        }));
    }

    render() {
        const {
            data,
            barIndex,
            left,
            right,
            refAreaLeft,
            refAreaRight,
            top,
            bottom,
            top2,
            bottom2,
        } = this.state;

        return (
            <div
                className="highlight-bar-charts"
                style={{ userSelect: "none", width: "100%" }}
            >
                <button
                    type="button"
                    className="btn update"
                    onClick={this.zoomOut.bind(this)}
                >
                    Zoom Out
                </button>

                <ResponsiveContainer width="100%" height={400}>
                    <LineChart
                        width={800}
                        height={400}
                        data={data}
                        onMouseDown={(e) =>
                            this.setState({ refAreaLeft: e.activeLabel })
                        }
                        onMouseMove={(e) =>
                            this.state.refAreaLeft &&
                            this.setState({ refAreaRight: e.activeLabel })
                        }
                        // eslint-disable-next-line react/jsx-no-bind
                        onMouseUp={this.zoom.bind(this)}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            allowDataOverflow
                            dataKey="name"
                            domain={[left, right]}
                            type="number"
                        />
                        <YAxis
                            orientation="right"
                            allowDataOverflow
                            domain={[bottom2, top2]}
                            type="number"
                            yAxisId="2"
                        />
                        <Tooltip />
                        <Line
                            yAxisId="2"
                            type="monotone"
                            dataKey="Implied"
                            stroke="#8884d8"
                            dot={false}
                            animationDuration={300}
                        />
                        <Line
                            yAxisId="2"
                            type="monotone"
                            dataKey="Underlying"
                            stroke="#82ca9d"
                            dot={false}
                            animationDuration={300}
                        />

                        {refAreaLeft && refAreaRight ? (
                            <ReferenceArea
                                yAxisId="1"
                                x1={refAreaLeft}
                                x2={refAreaRight}
                                strokeOpacity={0.3}
                            />
                        ) : null}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    }
}
