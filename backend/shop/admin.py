from django.contrib import admin

from .models import Order, OrderItem, Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "origin", "roast", "price", "cup_score", "roast_level")
    list_filter = ("roast",)
    search_fields = ("name", "origin", "region")
    prepopulated_fields = {"sku": ("name",)}


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    fields = ("product", "grind", "quantity", "unit_price")


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("order_no", "name", "status", "total", "created_at")
    list_filter = ("status",)
    search_fields = ("order_no", "name", "email")
    readonly_fields = ("order_no", "subtotal", "shipping", "total", "created_at")
    inlines = [OrderItemInline]
