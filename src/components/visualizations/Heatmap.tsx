import {useEffect, useRef} from 'react';
import HeatMap from 'heatmap-ts';
import {GazeData} from '../../@types';

const MAP_WIDTH = 500;
const MAP_HEIGHT = 500;

export function Heatmap({data}: { data: GazeData[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const heatmapInstanceRef = useRef<HeatMap | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        if (!heatmapInstanceRef.current) {
            heatmapInstanceRef.current = new HeatMap({
                container: containerRef.current,
                maxOpacity: 0.6,
                radius: 50,
                blur: 0.9,
                gradient: {
                    '0.4': 'blue',
                    '0.6': 'cyan',
                    '0.7': 'lime',
                    '0.8': 'yellow',
                    '1': 'red'
                }
            });
        }

        const rect = containerRef.current?.getBoundingClientRect();
        const points = data.map(point => ({
            x: Math.round((point.x / window.innerWidth) * (rect.width || MAP_WIDTH)),
            y: Math.round((point.y / window.innerHeight) * (rect.height || MAP_HEIGHT)),
            value: 1,
            radius: 10,
        }));

        const max = Math.max(...points.map(p => p.value), 1);

        heatmapInstanceRef.current.setData({
            max: max,
            min: 1,
            data: points
        });
    }, [data]);

    return (
        <div ref={containerRef}
             style={{width: `${MAP_WIDTH}px`, height: `${MAP_HEIGHT}px`, border: '1px solid black'}}></div>
    )
}
