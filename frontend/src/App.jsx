import { Outlet } from 'react-router-dom';
import Nav from './components/user/Nav.jsx';
import PageIllustration from './components/user/PageIllustration.jsx';

function App() {

    return (
        <>
            <div className='sticky-top-0'>
                <Nav />
            </div>

            <div className='relative z-0'>
                <PageIllustration />
            </div>
            <div className='relative inset-0 z-10'>
                <Outlet />
            </div>
        </>
    );
}

export default App
