import {
  ArrowDownLeft,
  ArrowUpRight,
  MoreHorizontal,
} from "lucide-react";

function formatMoney(value) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 2,
  }).format(Number(value));
}

function formatDate(value) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

export default function TransactionTable({
  transactions,
  onEdit,
  onDelete,
  loading = false,
}) {
  if (loading) {
    return <div className="empty-state">Загружаем операции...</div>;
  }

  if (transactions.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <MoreHorizontal size={26} />
        </div>

        <h3>Операций пока нет</h3>
        <p>Добавь первую финансовую операцию.</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Операция</th>
            <th>Категория</th>
            <th>Дата</th>
            <th>Сумма</th>
            <th>Действия</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((transaction) => {
            const isIncome = transaction.type === "income";

            return (
              <tr key={transaction.id}>
                <td>
                  <div className="transaction-name">
                    <div
                      className={`transaction-icon ${
                        isIncome ? "income-icon" : "expense-icon"
                      }`}
                    >
                      {isIncome ? (
                        <ArrowDownLeft size={19} />
                      ) : (
                        <ArrowUpRight size={19} />
                      )}
                    </div>

                    <div>
                      <strong>
                        {transaction.description ||
                          transaction.category_name}
                      </strong>

                      <span>
                        {transaction.type_display}
                      </span>
                    </div>
                  </div>
                </td>

                <td>
                  <span className="category-badge">
                    {transaction.category_name}
                  </span>
                </td>

                <td className="date-cell">
                  {formatDate(transaction.date)}
                </td>

                <td>
                  <span
                    className={`transaction-amount ${
                      isIncome ? "amount-income" : "amount-expense"
                    }`}
                  >
                    {isIncome ? "+" : "−"}
                    {formatMoney(transaction.amount)}
                  </span>
                </td>

                <td>
                  <div className="table-actions">
                    <button
                      className="icon-button"
                      title="Редактировать"
                      aria-label="Редактировать операцию"
                      onClick={() => onEdit(transaction)}
                    >
                      ✎
                    </button>

                    <button
                      className="icon-button delete-button"
                      title="Удалить"
                      aria-label="Удалить операцию"
                      onClick={() => onDelete(transaction)}
                    >
                      ×
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
