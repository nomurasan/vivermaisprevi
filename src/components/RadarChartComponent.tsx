import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from 'recharts';
import { DimensionConfig, DimensionId, StatusScore } from '../types';
import { DIMENSIONS, getStatusFromScore, getStatusLabel } from '../mock/dimensions';
import { formatPercentage } from '../utils/formatters';

interface RadarChartProps {
  scores: Record<DimensionId, number>;
  onDimensionClick?: (dimId: DimensionId) => void;
}

export const RadarChartComponent: React.FC<RadarChartProps> = ({ scores, onDimensionClick }) => {
  const chartData = DIMENSIONS.map((dim) => {
    const val = scores[dim.id] ?? 70;
    const status = getStatusFromScore(val);
    return {
      dimId: dim.id,
      dimension: dim.shortName,
      fullName: dim.name,
      score: val,
      status: getStatusLabel(status),
      fullMark: 100,
    };
  });

  return (
    <div className="w-full h-80 relative">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
          <PolarGrid stroke="#CAD8E6" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: '#163A63', fontSize: 11, fontWeight: 700 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            stroke="#5A6F82"
            tick={{ fontSize: 9, fill: '#5A6F82' }}
          />
          <Radar
            name="Seu Score"
            dataKey="score"
            stroke="#0A988F"
            strokeWidth={2.5}
            fill="#12B8AE"
            fillOpacity={0.35}
            dot={{ r: 4, fill: '#163A63', stroke: '#12B8AE', strokeWidth: 1.5 }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-3 rounded-lg shadow-lg border border-[#D9E4EE] text-xs">
                    <p className="font-bold text-[#163A63]">{data.fullName}</p>
                    <p className="text-[#12B8AE] font-black text-sm">{formatPercentage(data.score)}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#F4F7FA] text-[#164E7A] border border-[#D9E4EE]">
                      {data.status}
                    </span>
                  </div>
                );
              }
              return null;
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
