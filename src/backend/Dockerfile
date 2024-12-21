FROM python:3.9-slim

# Çalışma dizinini ayarla
WORKDIR /app

# Gerekli dosyaları ekle
COPY requirements.txt requirements.txt

# Bağımlılıkları yükle
RUN pip install --no-cache-dir -r requirements.txt

# Uygulama dosyalarını kopyala
COPY . .

# Uygulama çalıştırma komutu
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
