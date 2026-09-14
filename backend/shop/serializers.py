from decimal import Decimal

from rest_framework import serializers

from .models import Order, OrderItem, Product

FREE_SHIPPING_THRESHOLD = Decimal("40.00")
SHIPPING_FLAT = Decimal("6.00")


class ProductSerializer(serializers.ModelSerializer):
    """Serialises to the exact shape of the storefront `Product` interface,
    so the React app can swap bundled data for API data without a mapper."""

    id = serializers.SlugField(source="sku")
    category = serializers.CharField(source="roast")
    categoryLabel = serializers.CharField(source="get_roast_display")
    roastLevel = serializers.IntegerField(source="roast_level")
    cupScore = serializers.FloatField(source="cup_score")
    price = serializers.FloatField()

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "origin",
            "region",
            "category",
            "categoryLabel",
            "process",
            "varietal",
            "altitude",
            "notes",
            "price",
            "weight",
            "roastLevel",
            "cupScore",
            "badge",
            "description",
            "story",
            "image",
        ]


class OrderItemInputSerializer(serializers.Serializer):
    sku = serializers.SlugField()
    grind = serializers.ChoiceField(choices=OrderItem.Grind.choices)
    quantity = serializers.IntegerField(min_value=1, max_value=24)


class OrderItemSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="product.name", read_only=True)
    weight = serializers.CharField(source="product.weight", read_only=True)
    unit_price = serializers.FloatField(read_only=True)
    lineTotal = serializers.FloatField(source="line_total", read_only=True)

    class Meta:
        model = OrderItem
        fields = ["name", "weight", "grind", "quantity", "unit_price", "lineTotal"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    subtotal = serializers.FloatField(read_only=True)
    shipping = serializers.FloatField(read_only=True)
    total = serializers.FloatField(read_only=True)

    class Meta:
        model = Order
        fields = [
            "order_no",
            "name",
            "email",
            "address",
            "city",
            "zip_code",
            "country",
            "status",
            "subtotal",
            "shipping",
            "total",
            "items",
            "created_at",
        ]
        read_only_fields = fields
