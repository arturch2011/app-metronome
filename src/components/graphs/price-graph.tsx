import { GraphData } from "@/data/graph-data";
import React, { useState, useCallback, useEffect } from "react";
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ReferenceArea,
    ResponsiveContainer,
} from "recharts";

interface GraphState {
    data: GraphData[];
    refAreaLeft: string;
    refAreaRight: string;
    left: string;
    right: string;
    top: string;
    bottom: string;
    top2: string;
    bottom2: string;
}

interface GraphProps {
    initialData: GraphData[];
}

export const Graph = ({ initialData }: GraphProps) => {
    const [state, setState] = useState<GraphState>({
        data: initialData,
        refAreaLeft: "",
        refAreaRight: "",
        left: "dataMin",
        right: "dataMax",
        top: "dataMax+1",
        bottom: "dataMin",
        top2: "dataMax+50",
        bottom2: "dataMin+50",
    });

    useEffect(() => {
        setState((s) => ({ ...s, data: initialData }));
    }, [initialData]);

    // Função para calcular domínios do eixo Y
    const getAxisYDomain = (
        from: number,
        to: number,
        ref: keyof GraphData,
        offset: number
    ): [number, number] => {
        const refData = initialData.slice(from - 1, to);
        let [bottom, top] = [refData[0][ref], refData[0][ref]];
        refData.forEach((d) => {
            if (d[ref] > top) top = d[ref];
            if (d[ref] < bottom) bottom = d[ref];
        });

        return [(bottom | 0) - offset, (top | 0) + offset];
    };

    const zoom = useCallback(() => {
        let { refAreaLeft, refAreaRight, data } = state;

        if (refAreaLeft === refAreaRight || refAreaRight === "") {
            setState((s) => ({ ...s, refAreaLeft: "", refAreaRight: "" }));
            return;
        }

        if (refAreaLeft > refAreaRight)
            [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];

        const [bottom, top] = getAxisYDomain(
            parseInt(refAreaLeft),
            parseInt(refAreaRight),
            "Implied",
            1
        ).map((val) => val.toString());
        const [bottom2, top2] = getAxisYDomain(
            parseInt(refAreaLeft),
            parseInt(refAreaRight),
            "Underlying",
            50
        ).map((val) => val.toString());

        setState((s) => ({
            ...s,
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
    }, [state]);

    const zoomOut = useCallback(() => {
        setState((s) => ({
            ...s,
            data: initialData.slice(),
            refAreaLeft: "",
            refAreaRight: "",
            left: "dataMin",
            right: "dataMax",
            top: "dataMax+1",
            bottom: "dataMin",
            top2: "dataMax+50",
            bottom2: "dataMin+50",
        }));
    }, []);

    return (
        <div
            className="highlight-bar-charts"
            style={{ userSelect: "none", width: "100%" }}
        >
            <button type="button" className="btn update" onClick={zoomOut}>
                Zoom Out
            </button>
            <ResponsiveContainer width="100%" height={400} className="pl-8">
                <LineChart
                    width={800}
                    height={400}
                    data={state.data}
                    onMouseDown={(e: any) =>
                        setState((s) => ({ ...s, refAreaLeft: e.activeLabel }))
                    }
                    onMouseMove={(e: any) =>
                        state.refAreaLeft &&
                        setState((s) => ({ ...s, refAreaRight: e.activeLabel }))
                    }
                    onMouseUp={zoom}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        allowDataOverflow
                        dataKey="name"
                        domain={[state.left, state.right]}
                        type="number"
                    />
                    <YAxis
                        orientation="right"
                        allowDataOverflow
                        domain={[state.bottom2, state.top2]}
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
                    {state.refAreaLeft && state.refAreaRight ? (
                        <ReferenceArea
                            yAxisId="1"
                            x1={state.refAreaLeft}
                            x2={state.refAreaRight}
                            strokeOpacity={0.3}
                        />
                    ) : null}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
