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
    {
        name: "1",
        PT: 2992.5,
        YT: 157.5,
    },
    {
        name: "2",
        PT: 2993.77978,
        YT: 142.8242414,
    },
    {
        name: "3",
        PT: 2993.212422,
        YT: 149.4856326,
    },
    {
        name: "4",
        PT: 2992.306488,
        YT: 159.6163108,
    },
    {
        name: "5",
        PT: 2992.157741,
        YT: 161.2266629,
    },
    {
        name: "6",
        PT: 2993.007114,
        YT: 151.8329945,
    },
    {
        name: "7",
        PT: 2992.660549,
        YT: 155.7252731,
    },
    {
        name: "8",
        PT: 2992.772663,
        YT: 154.4754652,
    },
    {
        name: "9",
        PT: 2992.615093,
        YT: 156.229527,
    },
    {
        name: "10",
        PT: 2991.358023,
        YT: 169.6572921,
    },
    {
        name: "11",
        PT: 2990.519538,
        YT: 178.1262053,
    },
    {
        name: "12",
        PT: 2988.963888,
        YT: 192.9930696,
    },
    {
        name: "13",
        PT: 2988.00606,
        YT: 201.6826823,
    },
    {
        name: "14",
        PT: 2986.323733,
        YT: 216.2319434,
    },
    {
        name: "15",
        PT: 2984.27007,
        YT: 232.9620404,
    },
    {
        name: "16",
        PT: 2986.382447,
        YT: 215.7379563,
    },
    {
        name: "17",
        PT: 2985.306474,
        YT: 224.6472785,
    },
    {
        name: "18",
        PT: 2983.222859,
        YT: 241.1237982,
    },
    {
        name: "19",
        PT: 2985.997692,
        YT: 218.9582147,
    },
    {
        name: "20",
        PT: 2986.354408,
        YT: 215.9739818,
    },
    {
        name: "21",
        PT: 2984.32715,
        YT: 232.5104595,
    },
    {
        name: "22",
        PT: 2987.074355,
        YT: 209.8442445,
    },
    {
        name: "23",
        PT: 2988.522265,
        YT: 197.0395995,
    },
    {
        name: "24",
        PT: 2989.770452,
        YT: 185.4112918,
    },
    {
        name: "25",
        PT: 2989.324863,
        YT: 189.6315905,
    },
    {
        name: "26",
        PT: 2991.230308,
        YT: 170.9704217,
    },
    {
        name: "27",
        PT: 2989.740953,
        YT: 185.6931986,
    },
    {
        name: "28",
        PT: 2990.686277,
        YT: 176.4698454,
    },
    {
        name: "29",
        PT: 2989.857239,
        YT: 184.5798108,
    },
    {
        name: "30",
        PT: 2990.993061,
        YT: 173.3870398,
    },
    {
        name: "31",
        PT: 2989.573118,
        YT: 187.2902331,
    },
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
    top: "dataMax+1000",
    bottom: "dataMin-100",
    top2: "dataMax+1000",
    bottom2: "dataMin-100",
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
            top: "dataMax+3000",
            bottom: "dataMin+3000",
            top2: "dataMax+3000",
            bottom2: "dataMin+3000",
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
                            dataKey="PT"
                            stroke="#8884d8"
                            dot={false}
                            animationDuration={300}
                        />
                        <Line
                            yAxisId="2"
                            type="monotone"
                            dataKey="YT"
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
