from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Product(models.Model):
    """One coffee on the shelf — mirrors the storefront `Product` interface."""

    class Roast(models.TextChoices):
        LIGHT = "light", "Light roast"
        MEDIUM = "medium", "Medium roast"
        DARK = "dark", "Dark roast"
        DECAF = "decaf", "Decaf"

    sku = models.SlugField(unique=True, db_comment="Storefront id, e.g. cloud-forest")
    name = models.CharField(max_length=80)
    origin = models.CharField(max_length=80)
    region = models.CharField(max_length=120)
    roast = models.CharField(
        max_length=8, choices=Roast.choices, db_comment="Storefront category"
    )
    process = models.CharField(max_length=120)
    varietal = models.CharField(max_length=120)
    altitude = models.CharField(max_length=60)
    notes = models.JSONField(default=list, db_comment="Three tasting notes, in cupping order")
    price = models.DecimalField(max_digits=6, decimal_places=2)
    weight = models.CharField(max_length=20, default="250 g")
    roast_level = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    cup_score = models.DecimalField(max_digits=4, decimal_places=1)
    badge = models.CharField(max_length=60, blank=True)
    description = models.TextField()
    story = models.TextField()
    image = models.URLField(max_length=500)
    sort_order = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["sort_order", "sku"]

    def __str__(self) -> str:
        return f"{self.name} — {self.origin}"


class Order(models.Model):
    """A confirmed checkout, snapshotted at purchase time."""

    class Status(models.TextChoices):
        RECEIVED = "received", "Received"
        ROASTING = "roasting", "Queued for roasting"
        SHIPPED = "shipped", "Shipped"

    order_no = models.CharField(max_length=12, unique=True, editable=False)
    name = models.CharField(max_length=120)
    email = models.EmailField()
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=80)
    zip_code = models.CharField(max_length=20)
    country = models.CharField(max_length=80, default="United States")
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=12, choices=Status.choices, default=Status.RECEIVED)
    subtotal = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    shipping = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.order_no} — {self.name}"


class OrderItem(models.Model):
    class Grind(models.TextChoices):
        WHOLE = "Whole bean", "Whole bean"
        FILTER = "Filter", "Filter"
        ESPRESSO = "Espresso", "Espresso"

    # Django 5.2 composite primary key: one order can never hold
    # duplicate (product, grind) rows — the database enforces it.
    pk = models.CompositePrimaryKey("order", "product", "grind")

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.PROTECT, related_name="order_items")
    grind = models.CharField(max_length=12, choices=Grind.choices)
    quantity = models.PositiveSmallIntegerField(default=1)
    unit_price = models.DecimalField(
        max_digits=6, decimal_places=2, db_comment="Price snapshot at purchase"
    )

    @property
    def line_total(self):
        return self.unit_price * self.quantity

    def __str__(self) -> str:
        return f"{self.quantity}× {self.product.name} ({self.grind})"
