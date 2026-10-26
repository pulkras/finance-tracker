from django.conf import settings
from django.db import models


class Category(models.Model):
    class Type(models.TextChoices):
        INCOME = "income", "Доход"
        EXPENSE = "expense", "Расход"

    name = models.CharField(
        max_length=100,
        verbose_name="Название",
    )

    type = models.CharField(
        max_length=10,
        choices=Type.choices,
        verbose_name="Тип категории",
    )

    class Meta:
        ordering = ["type", "name"]
        verbose_name = "Категория"
        verbose_name_plural = "Категории"
        constraints = [
            models.UniqueConstraint(
                fields=["name", "type"],
                name="unique_category_name_type",
            )
        ]

    def __str__(self):
        return f"{self.name} ({self.get_type_display()})"


class Transaction(models.Model):
    class Type(models.TextChoices):
        INCOME = "income", "Доход"
        EXPENSE = "expense", "Расход"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="transactions",
        verbose_name="Пользователь",
    )

    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="transactions",
        verbose_name="Категория",
    )

    type = models.CharField(
        max_length=10,
        choices=Type.choices,
        verbose_name="Тип операции",
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        verbose_name="Сумма",
    )

    description = models.CharField(
        max_length=255,
        blank=True,
        default="",
        verbose_name="Описание",
    )

    date = models.DateField(
        verbose_name="Дата операции",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Дата создания",
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Дата обновления",
    )

    class Meta:
        ordering = ["-date", "-created_at"]
        verbose_name = "Финансовая операция"
        verbose_name_plural = "Финансовые операции"
        indexes = [
            models.Index(
                fields=["user", "-date"],
                name="transaction_user_date_idx",
            ),
            models.Index(
                fields=["user", "type"],
                name="transaction_user_type_idx",
            ),
        ]

    def __str__(self):
        return (
            f"{self.get_type_display()}: "
            f"{self.amount} — {self.description}"
        )
