import { CalendarDays } from "lucide-react";

export default function Header({ title, subtitle }) {
  const today = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="page-header">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      <div className="header-date">
        <CalendarDays size={17} />
        <span>{today}</span>
      </div>
    </header>
  );
}
