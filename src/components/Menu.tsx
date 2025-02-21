import styles from './css/components.module.css'
import ClickHistory from './ClickHistory.tsx';
import {useState} from 'react';

interface GazeCoordinates {
    x: number | null;
    y: number | null;
    timestamp: number | null;
}

interface ClickCoordinates {
    x: number;
    y: number;
    timestamp: number;
}

interface CombinedData {
    click: ClickCoordinates;
    gaze: GazeCoordinates;
}

interface ClickHistoryProps {
    clickData: CombinedData[];
}


function Menu({clickData}: ClickHistoryProps) {
    const [isClickHistoryOpen, setIsClickHistoryOpen] = useState(false);
    return (
        <div className={styles.menu}>
            <button
                onClick={() => setIsClickHistoryOpen(!isClickHistoryOpen)}>{isClickHistoryOpen ? 'Close history' : 'Open history'}</button>
            {isClickHistoryOpen && <ClickHistory clickData={clickData}/>}
        </div>
    )
}

export default Menu;
