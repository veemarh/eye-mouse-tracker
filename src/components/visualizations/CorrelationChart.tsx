import {SVGProps, useMemo} from 'react';
import {JSX} from 'react/jsx-runtime';
import {
    ScatterChart,
    Scatter,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from 'recharts';

export interface CorrelationChartProps {
    xData: number[];
    yData: number[];
    xLabel?: string;
    yLabel?: string;
    xDataKey?: string;
    yDataKey?: string;
    width?: number;
    height?: number;
}

export function CorrelationChart({
                                     xData,
                                     yData,
                                     xLabel = "X",
                                     yLabel = "Y",
                                     xDataKey = 'x',
                                     yDataKey = 'y',
                                     width = 500,
                                     height = 400
                                 }: CorrelationChartProps) {
    const minLength = Math.min(xData.length, yData.length);

    const chartData = useMemo(() => {
        return Array.from({length: minLength}, (_, i) => ({
            [xDataKey]: xData[i],
            [yDataKey]: yData[i],
        }));
    }, [xData, yData, minLength]);

    return (
        <ScatterChart width={width} height={height}>
            <CartesianGrid/>
            <XAxis
                type="number"
                dataKey={xDataKey}
                name={xLabel}
                label={{
                    value: xLabel,
                    position: 'insideBottom',
                    offset: -5,
                }}
            />
            <YAxis
                type="number"
                dataKey={yDataKey}
                name={yLabel}
                label={{
                    value: yLabel,
                    angle: -90,
                    position: 'insideLeft',
                }}
            />
            <Tooltip cursor={{strokeDasharray: '3 3'}}/>
            <Legend/>
            <Scatter name="Correlation" data={chartData} fill="#82ca9d"
                     shape={
                         (props: JSX.IntrinsicAttributes & SVGProps<SVGCircleElement>) => <circle {...props} r={2}/>
                     }
            />
        </ScatterChart>
    );
}
