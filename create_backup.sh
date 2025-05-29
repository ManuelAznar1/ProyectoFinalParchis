DATE =$(date +%Y-%m-%d_%H-%M-%S)
# Create a backup directory with the current date
mkdir -p /parchis_backups/$DATE


docker export parchis_db > /parchis_backups/$DATE/parchis_db.tar

docker export parchis_frontend > /parchis_backups/$DATE/parchis_frontend.tar

docker export parchis_backend > /parchis_backups/$DATE/parchis_backend.tar

docker export parchis_nginx > /parchis_backups/$DATE/parchis_nginx.tar