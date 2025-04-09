## Comandos Celery
- Ejecutar Scheduler Beat:
  - celery -A api_Conecta beat --loglevel=info 
- Ejecutar Celery Worker para realizar tareas:
    -  celery -A api_Conecta worker --loglevel=info --pool=solo
