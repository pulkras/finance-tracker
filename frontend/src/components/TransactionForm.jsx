import { useEffect, useState } from "react";
import { X } from "lucide-react";

const today = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function TransactionForm({
  categories,
  transaction,
  onSubmit,
  onClose,
  saving,
}) {
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(today());
  const [error, setError] = useState("");

  const availableCategories = categories.filter(
    (category) => category.type === type
  );

  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setAmount(String(transaction.amount));
      setCategoryId(String(transaction.category_id));
      setDescription(transaction.description || "");
      setDate(transaction.date);
    } else {
      setType("expense");
      setAmount("");
      setCategoryId("");
      setDescription("");
      setDate(today());
    }

    setError("");
  }, [transaction]);

  useEffect(() => {
    const exists = availableCategories.some(
      (category) => String(category.id) === String(categoryId)
    );

    if (!exists) {
      setCategoryId(
        availableCategories.length > 0
          ? String(availableCategories[0].id)
          : ""
      );
    }
  }, [type, categories, categoryId]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Введите сумму больше нуля.");
      return;
    }

    if (!categoryId) {
      setError("Выберите категорию.");
      return;
    }

    if (!date) {
      setError("Укажите дату операции.");
      return;
    }

    try {
      await onSubmit({
        type,
        amount: numericAmount.toFixed(2),
        category_id: Number(categoryId),
        description: description.trim(),
        date,
      });
    } catch (err) {
      const data = err.response?.data;

      if (data && typeof data === "object") {
        const firstError = Object.values(data).flat()[0];
        setError(
          typeof firstError === "string"
            ? firstError
            : "Не удалось сохранить операцию."
        );
      } else {
        setError("Не удалось связаться с сервером.");
      }
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className="transaction-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="transaction-form-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h3 id="transaction-form-title">
              {transaction ? "Редактировать операцию" : "Новая операция"}
            </h3>

            <p>Заполни информацию о финансовой операции.</p>
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Закрыть"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="form-label">Тип операции</label>

          <div className="type-switch">
            <button
              type="button"
              className={type === "expense" ? "selected expense-selected" : ""}
              onClick={() => setType("expense")}
            >
              Расход
            </button>

            <button
              type="button"
              className={type === "income" ? "selected income-selected" : ""}
              onClick={() => setType("income")}
            >
              Доход
            </button>
          </div>

          <label className="form-label" htmlFor="amount">
            Сумма, ₽
          </label>

          <input
            id="amount"
            type="number"
            min="0.01"
            step="0.01"
            max="9999999999.99"
            placeholder="0.00"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            required
          />

          <label className="form-label" htmlFor="category">
            Категория
          </label>

          <select
            id="category"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            required
          >
            <option value="" disabled>
              Выбери категорию
            </option>

            {availableCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <label className="form-label" htmlFor="description">
            Описание
          </label>

          <input
            id="description"
            type="text"
            maxLength="255"
            placeholder="Например, покупка продуктов"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />

          <label className="form-label" htmlFor="date">
            Дата операции
          </label>

          <input
            id="date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
          />

          {error && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="button button-secondary"
              onClick={onClose}
            >
              Отмена
            </button>

            <button
              type="submit"
              className="button button-primary"
              disabled={saving || availableCategories.length === 0}
            >
              {saving
                ? "Сохранение..."
                : transaction
                  ? "Сохранить изменения"
                  : "Добавить операцию"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
