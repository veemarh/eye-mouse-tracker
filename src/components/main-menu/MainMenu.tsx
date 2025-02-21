import styles from './main-menu.module.css'
import ClickHistory from '../windows/ClickHistory.tsx';
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


function MainMenu({clickData}: ClickHistoryProps) {
    const [isClickHistoryOpen, setIsClickHistoryOpen] = useState(false);
    return (
        <div className={styles.menu}>
            <button
                onClick={() => setIsClickHistoryOpen(!isClickHistoryOpen)}>{isClickHistoryOpen ? 'Close history' : 'Open history'}</button>
            {isClickHistoryOpen && <ClickHistory clickData={clickData}/>}
        </div>
    )
}

export default MainMenu;
