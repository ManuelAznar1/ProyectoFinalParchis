#!/bin/bash

# Coge como argumento la fecha del backup a restaurar
# Usage: ./restore_backup.sh YYYY-MM-DD_HH-MM-SS
# Example: ./restore_backup.sh 2023-10-01_12-00-00

DATE=$1

cat /parchis_backups/$DATE/parchis_db.tar | docker import - parchis_db:latest

cat /parchis_backups/$DATE/parchis_frontend.tar | docker import - parchis_frontend:latest

cat /parchis_backups/$DATE/parchis_backend.tar | docker import - parchis_backend:latest

cat /parchis_backups/$DATE/parchis_nginx.tar | docker import - parchis_nginx:latest