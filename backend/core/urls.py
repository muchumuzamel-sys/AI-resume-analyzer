import os
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from django.http import HttpResponse

def frontend_view(request):
    index_path = settings.FRONTEND_DIST / 'index.html'
    if index_path.exists():
        with open(index_path, 'r', encoding='utf-8') as f:
            return HttpResponse(f.read(), content_type='text/html')
    return HttpResponse("Frontend dist not found. Please run 'npm run build' inside the frontend directory.", status=404)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('accounts.urls')),
    path('api/v1/resumes/', include('resumes.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static('/assets/', document_root=settings.FRONTEND_DIST / 'assets')

# SPA catch-all route for frontend React router
urlpatterns += [
    re_path(r'^(?!api/|admin/|media/|assets/|static/).*$', frontend_view, name='frontend'),
]
