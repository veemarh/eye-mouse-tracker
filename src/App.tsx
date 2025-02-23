import './App.css'
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {AnalyticsPage, MainPage, SessionsPage} from './pages';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage/>}/>
                <Route path="/analytics/:sessionId" element={<AnalyticsPage/>}/>
                <Route path="/sessions" element={<SessionsPage/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
