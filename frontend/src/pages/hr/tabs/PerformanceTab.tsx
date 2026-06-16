import React from 'react';
import Panel from '../components/Panel';
import { theme } from '../data/hrMockData';

const metrics = [
  { label: "Efficiency Score", value: 87, target: 90, color: "#1F7A8C", sub: "Task completion rate" },
  { label: "Quality Assessment", value: 92, target: 95, color: "#10B981", sub: "Error rate tracking" },
  { label: "Productivity Index", value: 94, target: 90, color: "#3B82F6", sub: "Output per hour" },
  { label: "Customer Satisfaction", value: 88, target: 95, color: "#F59E0B", sub: "Client feedback score" },
];

const PerformanceTab: React.FC = () => {
  return (
    <Panel>
      <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 20 }}>Team Performance Overview</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
        {metrics.map((m) => (
          <div key={m.label}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{m.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: m.color }}>{m.value}% / {m.target}%</span>
            </div>
            <div style={{ height: 40, background: theme.surface2, borderRadius: 8, display: "flex", alignItems: "center", padding: 4 }}>
              <div style={{ width: `${m.value}%`, height: "100%", background: `linear-gradient(90deg, ${m.color}, ${m.color})`, borderRadius: 6 }} />
              <span style={{ marginLeft: 12, fontSize: 11, fontWeight: 700 }}>{m.value}%</span>
            </div>
            <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 6 }}>{m.sub}</div>
          </div>
        ))}
      </div>
    </Panel>
  );
};

export default PerformanceTab;