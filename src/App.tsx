import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PhotoProvider } from './context/PhotoContext';
import {
  PhotosPage,
  AlbumsPage,
  SimilarPhotosPage,
  BestShotsPage,
  ReviewPage,
  TrashPage,
  SettingsPage,
} from './pages';

function App() {
  return (
    <PhotoProvider>
      <Router basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<PhotosPage />} />
          <Route path="/albums" element={<AlbumsPage />} />
          <Route path="/similar" element={<SimilarPhotosPage />} />
          <Route path="/best-shots" element={<BestShotsPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/trash" element={<TrashPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Router>
    </PhotoProvider>
  );
}

export default App;
