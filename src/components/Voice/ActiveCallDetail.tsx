import React from 'react';
import { ActiveCallDetailProps } from './types';

const ActiveCallDetail: React.FC<ActiveCallDetailProps> = ({ 
  assistantIsSpeaking, 
  volumeLevel, 
  onEndCallClick 
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
      }}
    >
      <div
        style={{
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          backgroundColor: assistantIsSpeaking ? '#4CAF50' : '#e0e0e0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'all 0.3s ease',
        }}
      >
        <div
          style={{
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            backgroundColor: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '24px',
            fontWeight: 'bold',
          }}
        >
          {assistantIsSpeaking ? 'Speaking...' : 'Listening...'}
        </div>
      </div>

      <div
        style={{
          width: '200px',
          height: '20px',
          backgroundColor: '#e0e0e0',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${volumeLevel * 100}%`,
            height: '100%',
            backgroundColor: '#4CAF50',
            transition: 'width 0.1s ease',
          }}
        />
      </div>

      <button
        onClick={onEndCallClick}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          backgroundColor: '#f44336',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
      >
        End Call
      </button>
    </div>
  );
};

export default ActiveCallDetail; 