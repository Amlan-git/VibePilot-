import React from 'react';
import { Loader as KendoLoader } from '@progress/kendo-react-indicators';
import './Loader.css';

interface LoaderProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  type?: 'pulsing' | 'infinite-spinner' | 'converging-spinner';
  fullScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({
  message = 'Loading...',
  size = 'medium',
  type = 'pulsing',
  fullScreen = false
}) => {
  return (
    <div className={`loader-container ${fullScreen ? 'fullscreen' : ''}`}>
      <KendoLoader type={type} size={size} />
      {message && <div className="loader-message">{message}</div>}
    </div>
  );
}; 