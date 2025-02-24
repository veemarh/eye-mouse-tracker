import {useEffect, useRef} from 'react';
import HeatMap from 'heatmap-ts';

const MAP_WIDTH = 500;
const MAP_HEIGHT = 500;

export interface HeatmapCoordinates {
    x: number;
    y: number;
    value?: number;
    radius?: number;
}

interface HeatmapProps<T> {
    data: T[];
    extractCoordinates: (item: T) => HeatmapCoordinates;
}

export function Heatmap<T>({data, extractCoordinates}: HeatmapProps<T>) {
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

        const rect = containerRef.current.getBoundingClientRect();
        const points = data.map(item => {
            const coords = extractCoordinates(item);
            return {
                x: Math.round((coords.x / window.innerWidth) * (rect.width || MAP_WIDTH)),
                y: Math.round((coords.y / window.innerHeight) * (rect.height || MAP_HEIGHT)),
                value: coords.value ?? 1,
                radius: coords.radius ?? 10,
            };
        });

        const max = Math.max(...points.map(p => p.value), 1);

        heatmapInstanceRef.current.setData({
            max: max,
            min: 1,
            data: points
        });

        return () => {
            heatmapInstanceRef.current?.setData({max: 0, min: 0, data: []});
        };
    }, [data, extractCoordinates]);

    return (
        <div ref={containerRef}
             style={{width: `${MAP_WIDTH}px`, height: `${MAP_HEIGHT}px`, border: '1px solid black'}}></div>
    )
}
