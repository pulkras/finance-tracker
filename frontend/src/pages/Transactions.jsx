import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { financeApi } from "../api/client";
import Header from "../components/Header";
import TransactionTable from "../components/TransactionTable";
import TransactionForm from "../components/TransactionForm";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);

  const [typeFilter, setTypeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = {};

      if (typeFilter) {
        params.type = typeFilter;
      }

      if (categoryFilter) {
        params.category_id = categoryFilter;
      }

      const [transactionsResponse, categoriesResponse] = await Promise.all([
        financeApi.getTransactions(params),
        financeApi.getCategories(),
      ]);

      const data = transactionsResponse.data;

      setTransactions(
        Array.isArray(data) ? data : data.results || []
      );

      setCategories(categoriesResponse.data);
    } catch (err) {
      if (err.response?.status === 403 || err.response?.status === 401) {
        setError(
          "Нет доступа к данным. Авторизуйся через Django и обнови страницу."
        );
      } else {
        setError("Не удалось загрузить операции.");
      }
    } finally {
      setLoading(false);
    }
  }, [typeFilter, categoryFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleSave(data) {
    setSaving(true);

    try {
      if (editingTransaction) {
        await financeApi.updateTransaction(editingTransaction.id, data);
      } else {
        await financeApi.createTransaction(data);
      }

      setFormOpen(false);
      setEditingTransaction(null);

      await loadData();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(transaction) {
    const confirmed = window.confirm(
      `Удалить операцию «${
        transaction.description || transaction.category_name
      }»?`
    );

    if (!confirmed) return;

    try {
      await financeApi.deleteTransaction(transaction.id);
      await loadData();
    } catch {
      setError("Не удалось удалить операцию.");
    }
  }

  const filteredCategories = categories.filter((category) => {
    return !typeFilter || category.type === typeFilter;
  });

  return (
    <>
      <Header
        title="Операции"
        subtitle="История доходов и расходов"
      />

      <div className="page-toolbar">
        <div>
          <h3>Все операции</h3>
          <p>Управляй своими финансовыми записями.</p>
        </div>

        <button
          className="button button-primary"
          onClick={() => {
            setEditingTransaction(null);
            setFormOpen(true);
          }}
        >
          <Plus size={18} />
          Добавить
        </button>
      </div>

      <div className="filters-panel">
        <div className="filter-field">
          <label htmlFor="type-filter">Тип операции</label>

          <select
            id="type-filter"
            value={typeFilter}
            onChange={(event) => {
              setTypeFilter(event.target.value);
              setCategoryFilter("");
            }}
          >
            <option value="">Все операции</option>
            <option value="income">Доходы</option>
            <option value="expense">Расходы</option>
          </select>
        </div>

        <div className="filter-field">
          <label htmlFor="category-filter">Категория</label>

          <select
            id="category-filter"
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            <option value="">Все категории</option>

            {filteredCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button
          className="button button-secondary filter-reset"
          onClick={() => {
            setTypeFilter("");
            setCategoryFilter("");
          }}
        >
          Сбросить
        </button>
      </div>

      {error && (
        <div className="page-error" role="alert">
          <span>{error}</span>

          <button className="button button-secondary" onClick={loadData}>
            Повторить
          </button>
        </div>
      )}

      <div className="panel transactions-page-panel">
        <div className="panel-header">
          <div>
            <h3>Список операций</h3>
            <p>
              {loading
                ? "Загружаем данные..."
                : `Найдено операций: ${transactions.length}`}
            </p>
          </div>
        </div>

        <TransactionTable
          transactions={transactions}
          onEdit={(transaction) => {
            setEditingTransaction(transaction);
            setFormOpen(true);
          }}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>

      {formOpen && (
        <TransactionForm
          categories={categories}
          transaction={editingTransaction}
          onSubmit={handleSave}
          onClose={() => {
            setFormOpen(false);
            setEditingTransaction(null);
          }}
          saving={saving}
        />
      )}
    </>
  );
}
