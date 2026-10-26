import {
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
} from "lucide-react";

const icons = {
  balance: Wallet,
  income: ArrowDownLeft,
  expenses: ArrowUpRight,
};

export default function StatCard({
  title,
  value,
  type,
  description,
}) {
  const Icon = icons[type] || Wallet;

  return (
    <section className={`stat-card stat-${type}`}>
      <div className="stat-card-top">
        <span>{title}</span>

        <div className="stat-icon">
          <Icon size={21} />
        </div>
      </div>

      <div className="stat-value">{value}</div>

      <p className="stat-description">{description}</p>
    </section>
  );
}
