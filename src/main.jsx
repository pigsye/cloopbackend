import { createRoot } from 'react-dom/client'
import './styles/index.scss'
import MainContent from './components/backend/mainContent'
import { BrowserRouter } from "react-router-dom";

const root = createRoot(document.getElementById('root'))
root.render(
    <BrowserRouter>
        <MainContent />
    </BrowserRouter>
)