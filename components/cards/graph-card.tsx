"use client";

import { useEffect, useState } from "react";
import { useHomeAssistant } from "@/lib/ha-context";
import type { GraphCardConfig, EntityCardEntity } from "@/types/card-types";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

interface GraphCardProps {
  config: GraphCardConfig;
}

type HistoryPoint = {
  timestamp: string;
  [entityId: string]: number | string;
};

export function GraphCard({ config }: GraphCardProps) {
  const { getEntityHistory } = useHomeAssistant();
  const [data, setData] = useState<HistoryPoint[]>([]);

  // Normalize entities array
  const entityConfigs = config.entities.map((e) =>
    typeof e === "string" ? { entity: e } : e
  );

  useEffect(() => {
    async function fetchHistory() {
      // Fetch history for each entity (implement getEntityHistory in your context)
      const hours = config.hours || 24;
      const now = new Date();
      const start = new Date(now.getTime() - hours * 60 * 60 * 1000);
      const promises = entityConfigs.map((e) =>
        getEntityHistory(e.entity, start, now)
      );
      const results = await Promise.all(promises);

      // Merge history by timestamp
      const merged: Record<string, HistoryPoint> = {};
      results.forEach((entityHistory, idx) => {
        const entityId = entityConfigs[idx].entity;
        entityHistory.forEach((point: any) => {
          const ts = point.timestamp || point.last_changed;
          if (!merged[ts]) merged[ts] = { timestamp: ts };
          merged[ts][entityId] = parseFloat(point.state);
        });
      });
      setData(
        Object.values(merged).sort((a, b) =>
          a.timestamp.localeCompare(b.timestamp)
        )
      );
    }
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(config.entities), config.hours]);

  if (!data.length) {
    return <Card className="p-4">Loading...</Card>;
  }

  return (
    <Card className={cn("p-4 h-full flex flex-col")}>
      {config.name && (
        <div className="font-semibold text-md mb-2">{config.name}</div>
      )}
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis dataKey="timestamp" hide />
          <YAxis />
          <Tooltip />
          <Legend />
          {entityConfigs.map((e, idx) => (
            <Line
              key={e.entity}
              type="monotone"
              dataKey={e.entity}
              stroke={`hsl(${(idx * 60) % 360}, 70%, 50%)`}
              dot={false}
              name={e.name || e.entity}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
