// src/components/Charts.js
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00c49f"];

const Charts = ({ categoryData, dateData }) => {
  // Sort dateData by date ascending
  const sortedDateData = [...dateData].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  return (
    <div style={{ marginTop: "40px" }}>
      <h2 style={{ textAlign: "center" }}>Spending by Category</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={categoryData}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {categoryData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <h2 style={{ textAlign: "center", marginTop: "40px" }}>
        Spending Trend Over Time
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={sortedDateData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            name="Amount Spent"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Charts;
