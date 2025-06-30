import ReactDOM from 'react-dom/client';
import OverlayPreview from './OverlayPreview';
import '../shared/styles.css';

const App = () => {
  return (
    <div>
      <OverlayPreview />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);