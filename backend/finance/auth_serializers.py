from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers


User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        validators=[validate_password],
    )

    password_confirm = serializers.CharField(
        write_only=True,
    )

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "password",
            "password_confirm",
        ]

        read_only_fields = ["id"]

    def validate_username(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Имя пользователя не может быть пустым."
            )

        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError(
                "Пользователь с таким именем уже существует."
            )

        return value

    def validate_email(self, value):
        value = value.strip().lower()

        if not value:
            raise serializers.ValidationError(
                "Укажи адрес электронной почты."
            )

        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                "Этот email уже зарегистрирован."
            )

        return value

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError({
                "password_confirm": "Пароли не совпадают."
            })

        validate_password(attrs["password"])

        return attrs

    def create(self, validated_data):
        validated_data.pop("password_confirm")

        password = validated_data.pop("password")

        user = User(**validated_data)
        user.set_password(password)
        user.save()

        return user
