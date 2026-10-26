import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, ArrowRight } from "lucide-react";

import { financeApi } from "../api/client";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import TransactionTable from "../components/TransactionTable";
import TransactionForm from "../components/TransactionForm";
import ExpenseChart from "../components/ExpenseChart";

const moneyFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 2,
});

export default function Dashboard() {
  const [summary, setSummary] = useState({
    income: "0.00",
    expenses: "0.00",
    balance: "0.00",
  });

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [summaryResponse, transactionsResponse, categoriesResponse] =
        await Promise.all([
          financeApi.getSummary(),
          financeApi.getTransactions(),
          financeApi.getCategories(),
        ]);

      setSummary(summaryResponse.data);

      const transactionData = transactionsResponse.data;
      setTransactions(
        Array.isArray(transactionData)
          ? transactionData
          : transactionData.results || []
      );

      setCategories(categoriesResponse.data);
    } catch (err) {
      if (err.response?.status === 403 || err.response?.status === 401) {
        setError(
          "Нет доступа к финансовым данным. Войди в Django через /api-auth/login/ и обнови страницу."
        );
      } else {
        setError(
          "Не удалось загрузить данные. Проверь, что Django запущен и API доступен."
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function openCreateForm() {
    setEditingTransaction(null);
    setFormOpen(true);
  }

  function openEditForm(transaction) {
    setEditingTransaction(transaction);
    setFormOpen(true);
  }

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

  return (
    <>
      <Header
        title="Обзор"
        subtitle="Сводка твоих финансов"
      />

      {error && (
        <div className="page-error" role="alert">
          <span>{error}</span>

          <button
            className="button button-secondary"
            onClick={loadData}
          >
            Повторить
          </button>
        </div>
      )}

      <div className="dashboard-welcome">
        <div>
          <span className="eyebrow">ТВОИ ФИНАНСЫ</span>
          <h3>Всё под контролем.</h3>
          <p>
            Отслеживай доходы, расходы и управляй личным бюджетом.
          </p>
        </div>

        <button
          className="button button-primary"
          onClick={openCreateForm}
        >
          <Plus size={18} />
          Добавить операцию
        </button>
      </div>

      <section className="stats-grid">
        <StatCard
          title="Общий баланс"
          value={moneyFormatter.format(Number(summary.balance))}
          type="balance"
          description="Доходы минус расходы за всё время"
        />

        <StatCard
          title="Доходы"
          value={moneyFormatter.format(Number(summary.income))}
          type="income"
          description="Все зарегистрированные поступления"
        />

        <StatCard
          title="Расходы"
          value={moneyFormatter.format(Number(summary.expenses))}
          type="expenses"
          description="Все зарегистрированные траты"
        />
      </section>

      <section className="dashboard-grid">
        <div className="panel transactions-panel">
          <div className="panel-header">
            <div>
              <h3>Последние операции</h3>
              <p>Твоя финансовая активность</p>
            </div>

            <Link to="/transactions" className="text-link">
              Все операции
              <ArrowRight size={16} />
            </Link>
          </div>

          <TransactionTable
            transactions={transactions.slice(0, 5)}
            onEdit={openEditForm}
            onDelete={handleDelete}
            loading={loading}
          />
        </div>

        <div className="panel chart-panel">
          <div className="panel-header">
            <div>
              <h3>Структура расходов</h3>
              <p>По категориям</p>
            </div>
          </div>

          {loading ? (
            <div className="empty-state">Загружаем статистику...</div>
          ) : (
            <ExpenseChart transactions={transactions} />
          )}
        </div>
      </section>

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
