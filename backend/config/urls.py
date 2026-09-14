from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path

from shop.views import spa_view

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("shop.urls")),
    path("", spa_view, name="home"),
    # every other route falls through to the React SPA (client-side anchors)
    re_path(r"^(?!api/|admin/|static/|assets/).*$", spa_view),
]

if settings.DEBUG:
    # serve the Vite build's hashed assets straight from ../dist
    urlpatterns += static("assets/", document_root=settings.FRONTEND_DIR / "assets")
