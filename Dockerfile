FROM node:18 as frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install && npm cache clean --force
COPY frontend/ ./
RUN npx vite build

FROM python:3.11-slim as backend
WORKDIR /app
COPY backend/requirements.txt ./
RUN pip install -r requirements.txt
COPY backend/ ./
COPY --from=frontend-build /app/frontend/dist ./dist
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
