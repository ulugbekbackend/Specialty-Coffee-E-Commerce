import secrets
from decimal import Decimal

from django.db import transaction
from django.db.models import Q
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_GET
from rest_framework import status, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Order, OrderItem, Product
from .serializers import (
    FREE_SHIPPING_THRESHOLD,
    SHIPPING_FLAT,
    OrderItemInputSerializer,
    OrderSerializer,
    ProductSerializer,
)


@require_GET
def spa_view(request):
    """Serve the built Vite app (dist/index.html) for every non-API route."""
    return render(request, "index.html")


@require_GET
def health(request):
    return JsonResponse({"status": "brewing", "products": Product.objects.count()})


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """GET /api/products/ — supports ?roast=light|medium|dark|decaf and ?q=…"""

    serializer_class = ProductSerializer

    def get_queryset(self):
        qs = Product.objects.all()
        roast = self.request.query_params.get("roast")
        if roast:
            qs = qs.filter(roast=roast)
        q = self.request.query_params.get("q")
        if q:
            qs = qs.filter(
                Q(name__icontains=q)
                | Q(origin__icontains=q)
                | Q(region__icontains=q)
                | Q(notes__icontains=q)
            )
        return qs


@api_view(["POST"])
def create_order(request):
    """POST /api/orders/ — turns the cart payload into a persisted order."""
    items_in = OrderItemInputSerializer(data=request.data.get("items", []), many=True)
    items_in.is_valid(raise_exception=True)

    name = (request.data.get("name") or "").strip()
    email = (request.data.get("email") or "").strip()
    address = (request.data.get("address") or "").strip()
    if not (name and email and address):
        return Response(
            {"detail": "name, email and address are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    lines = []
    for line in items_in.validated_data:
        try:
            product = Product.objects.get(sku=line["sku"])
        except Product.DoesNotExist:
            return Response(
                {"detail": f"Unknown sku: {line['sku']}"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        lines.append((product, line["grind"], line["quantity"]))

    if not lines:
        return Response({"detail": "Cart is empty."}, status=status.HTTP_400_BAD_REQUEST)

    subtotal = sum((p.price * qty for p, _, qty in lines), Decimal("0.00"))
    shipping = Decimal("0.00") if subtotal >= FREE_SHIPPING_THRESHOLD else SHIPPING_FLAT

    with transaction.atomic():
        order = Order.objects.create(
            order_no=f"EO-{secrets.token_hex(3).upper()}",
            name=name,
            email=email,
            address=address,
            city=(request.data.get("city") or "").strip(),
            zip_code=(request.data.get("zip") or "").strip(),
            country=(request.data.get("country") or "United States").strip(),
            notes=(request.data.get("notes") or "").strip(),
            subtotal=subtotal,
            shipping=shipping,
            total=subtotal + shipping,
        )
        for product, grind, quantity in lines:
            OrderItem.objects.create(
                order=order,
                product=product,
                grind=grind,
                quantity=quantity,
                unit_price=product.price,
            )

    return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
