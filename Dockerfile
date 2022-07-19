# Build the expo web app
FROM patwoz/expo-cli:latest as web-build

LABEL mainteiner="Haki-Malai" email="hakimalaj@outlook.com"

COPY frontend .

RUN expo build:web

# Build the flask app with the expo web build as static files
FROM python:3.8.10

LABEL mainteiner="Haki-Malai" email="hakimalaj@outlook.com"

COPY backend .

COPY --from=web-build /web-build ./static/web-build

RUN pip install -r requirements.txt

EXPOSE 5000

CMD ["gunicorn", "-b", ":5000","-w", "10", "app:app"]
