import {useEffect, useRef} from 'react';
import HeatMap from 'heatmap-ts';
import {useWindowDimensions} from '../../hooks/useWindowDimensions';

export interface HeatmapCoordinates {
    x: number;
    y: number;
    value?: number;
    radius?: number;
}

interface HeatmapProps<T> {
    data: T[];
    extractCoordinates: (item: T) => HeatmapCoordinates;
    originalWidth: number;
    originalHeight: number;
}

export function Heatmap<T>({data, extractCoordinates, originalWidth, originalHeight}: HeatmapProps<T>) {
    const containerRef = useRef<HTMLDivElement>(null);
    const heatmapInstanceRef = useRef<HeatMap | null>(null);
    const {width: currentWindowWidth, height: currentWindowHeight} = useWindowDimensions();

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

        const points = data.map(item => {
            const coords = extractCoordinates(item);
            return {
                x: coords.x / 3,
                y: coords.y / 3,
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
    }, [data, extractCoordinates, originalWidth, originalHeight, currentWindowWidth, currentWindowHeight]);

    return (
        <div ref={containerRef}
             style={{
                 width: originalWidth / 3 + 'px',
                 height: originalHeight / 3 + 'px',
                 border: '1px solid black'
             }}
        ></div>
    );
}
