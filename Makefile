.PHONY: up down logs rebuild

up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f

build:
	docker compose down -v
	docker compose up --build

rebuild:
	docker compose down -v
	docker compose up --build
