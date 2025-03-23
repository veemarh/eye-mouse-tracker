import {SVGProps, useMemo} from 'react';
import {
    ScatterChart,
    Scatter,
    CartesianGrid,
    XAxis,
    YAxis,
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
            [xDataKey]: Math.max(xData[i], 0),
            [yDataKey]: Math.max(yData[i], 0),
        }));
    }, [xData, yData, minLength]);

    const renderPoint = (props: SVGProps<SVGCircleElement>) => {
        const {cx, cy, fill} = props;
        return <circle cx={cx} cy={cy} r={2} fill={fill}/>;
    };
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
            <Legend/>
            <Scatter name="Correlation" data={chartData} fill="#82ca9d"
                     shape={renderPoint}
                     isAnimationActive={false}
            />
        </ScatterChart>
    );
}
