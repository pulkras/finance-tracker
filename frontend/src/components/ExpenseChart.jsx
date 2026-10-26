import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = [
  "#16a34a",
  "#2563eb",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#0891b2",
  "#f97316",
  "#64748b",
];

const moneyFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 2,
});

export default function ExpenseChart({ transactions }) {
  const totals = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((result, transaction) => {
      const name = transaction.category_name || "Без категории";

      result[name] = (result[name] || 0) + Number(transaction.amount);

      return result;
    }, {});

  const data = Object.entries(totals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="chart-container">
      {data.length === 0 ? (
        <div className="chart-empty">
          <p>Пока нет расходов для отображения.</p>
        </div>
      ) : (
        <>
          <div className="chart-visual">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={64}
                  outerRadius={94}
                  paddingAngle={3}
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) => moneyFormatter.format(Number(value))}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="chart-center">
              <span>Расходы</span>
              <strong>
                {moneyFormatter.format(total)}
              </strong>
            </div>
          </div>

          <div className="chart-legend">
            {data.map((item, index) => (
              <div className="legend-item" key={item.name}>
                <span
                  className="legend-dot"
                  style={{
                    backgroundColor: COLORS[index % COLORS.length],
                  }}
                />

                <span className="legend-name">{item.name}</span>

                <strong>
                  {moneyFormatter.format(item.value)}
                </strong>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
