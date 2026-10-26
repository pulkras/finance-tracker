from django.urls import path

from .views import (
    CategoryListView,
    FinanceSummaryView,
    TransactionDetailView,
    TransactionListCreateView,
)

urlpatterns = [
    path(
        "categories/",
        CategoryListView.as_view(),
        name="category-list",
    ),
    path(
        "transactions/",
        TransactionListCreateView.as_view(),
        name="transaction-list-create",
    ),
    path(
        "transactions/<int:pk>/",
        TransactionDetailView.as_view(),
        name="transaction-detail",
    ),
    path(
        "summary/",
        FinanceSummaryView.as_view(),
        name="finance-summary",
    ),
]
