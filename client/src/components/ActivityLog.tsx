import React, { useEffect, useRef } from 'react';

interface ActivityLogProps {
  logs: string[];
  onClear: () => void;
}

const ActivityLog: React.FC<ActivityLogProps> = ({ logs, onClear }) => {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="card">
      <div className="card-header">
        <span>📝</span>
        <h3 className="card-title">Activity Log</h3>
        <button 
          onClick={onClear}
          className="btn btn-secondary"
          style={{ marginLeft: 'auto', padding: '6px 12px', fontSize: '12px' }}
        >
          Clear
        </button>
      </div>

      <div className="activity-log">
        {logs.length === 0 ? (
          <div className="log-entry" style={{ color: '#a0aec0', fontStyle: 'italic' }}>
            No activity yet... Deploy an oracle to get started!
          </div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="log-entry">
              {new Date().toLocaleTimeString()}: {log}
            </div>
          ))
        )}
        <div ref={logEndRef} />
      </div>
    </div>
  );
};

export default ActivityLog;