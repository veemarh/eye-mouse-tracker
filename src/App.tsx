import './App.css'
import MainMenu from './components/main-menu/MainMenu'
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import SessionAnalytics from './components/session-analytics/SessionAnalytics';
import SessionsList from './components/sessions-list/SessionsList';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainMenu/>}/>
                <Route path="/analytics/:sessionId" element={<SessionAnalytics/>}/>
                <Route path="/sessions" element={<SessionsList/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
