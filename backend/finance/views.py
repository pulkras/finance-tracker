from decimal import Decimal

from django.db.models import Sum
from rest_framework import generics, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Category, Transaction
from .serializers import CategorySerializer, TransactionSerializer
from .auth_serializers import RegisterSerializer

class CategoryListView(generics.ListAPIView):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Category.objects.all()

        category_type = self.request.query_params.get("type")

        if category_type in ("income", "expense"):
            queryset = queryset.filter(type=category_type)

        return queryset


class TransactionListCreateView(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = (
            Transaction.objects
            .filter(user=self.request.user)
            .select_related("category")
        )

        params = self.request.query_params

        transaction_type = params.get("type")
        category_id = params.get("category_id")
        date_from = params.get("date_from")
        date_to = params.get("date_to")

        if transaction_type in ("income", "expense"):
            queryset = queryset.filter(type=transaction_type)

        if category_id:
            queryset = queryset.filter(category_id=category_id)

        if date_from:
            queryset = queryset.filter(date__gte=date_from)

        if date_to:
            queryset = queryset.filter(date__lte=date_to)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TransactionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Transaction.objects
            .filter(user=self.request.user)
            .select_related("category")
        )


class FinanceSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        transactions = Transaction.objects.filter(user=request.user)

        income = (
            transactions
            .filter(type=Transaction.Type.INCOME)
            .aggregate(total=Sum("amount"))["total"]
            or Decimal("0.00")
        )

        expenses = (
            transactions
            .filter(type=Transaction.Type.EXPENSE)
            .aggregate(total=Sum("amount"))["total"]
            or Decimal("0.00")
        )

        return Response({
            "income": str(income),
            "expenses": str(expenses),
            "balance": str(income - expenses),
        })
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
        })
