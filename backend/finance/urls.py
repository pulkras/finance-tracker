from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView

from .views import (
    CategoryListView,
    FinanceSummaryView,
    TransactionDetailView,
    TransactionListCreateView,
    RegisterView,
    CurrentUserView,
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
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/me/", CurrentUserView.as_view(), name="current_user"),    
]
