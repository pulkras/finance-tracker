from rest_framework import serializers

from .models import Category, Transaction


class CategorySerializer(serializers.ModelSerializer):
    type_display = serializers.CharField(
        source="get_type_display",
        read_only=True,
    )

    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "type",
            "type_display",
        ]


class TransactionSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(
        source="category.name",
        read_only=True,
    )

    category_id = serializers.PrimaryKeyRelatedField(
        source="category",
        queryset=Category.objects.all(),
    )

    type_display = serializers.CharField(
        source="get_type_display",
        read_only=True,
    )

    class Meta:
        model = Transaction
        fields = [
            "id",
            "type",
            "type_display",
            "amount",
            "description",
            "date",
            "category_id",
            "category_name",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Сумма должна быть больше нуля."
            )

        return value

    def validate(self, attrs):
        category = attrs.get(
            "category",
            getattr(self.instance, "category", None),
        )

        transaction_type = attrs.get(
            "type",
            getattr(self.instance, "type", None),
        )

        if category and transaction_type:
            if category.type != transaction_type:
                raise serializers.ValidationError({
                    "category_id": (
                        "Тип категории должен совпадать "
                        "с типом финансовой операции."
                    )
                })

        return attrs
