from django.contrib import admin

from .models import Category, Transaction


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "type")
    list_filter = ("type",)
    search_fields = ("name",)


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "type",
        "amount",
        "category",
        "date",
    )

    list_filter = (
        "type",
        "category",
        "date",
    )

    search_fields = (
        "description",
        "user__username",
    )

    date_hierarchy = "date"
    readonly_fields = ("created_at", "updated_at")
