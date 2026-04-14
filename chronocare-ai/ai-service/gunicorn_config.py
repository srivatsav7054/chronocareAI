"""
Gunicorn configuration for production deployment
Place this file in the ai-service directory and run:
  gunicorn -c gunicorn_config.py main:app
"""

import multiprocessing
import os

# Server socket configuration
bind = "0.0.0.0:8000"
backlog = 2048

# Worker configuration
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "uvicorn.workers.UvicornWorker"
worker_connections = 1000
timeout = 120
keepalive = 5

# Server mechanics
daemon = False
pidfile = None
umask = 0
user = None
group = None
tmp_upload_dir = None

# Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s" %(D)s'

# Process naming
proc_name = "chronocare-ai-medical-service"

# Server hooks
def post_fork(server, worker):
    """Called after worker spawn"""
    server.log.info("Worker spawned (pid: %s)" % os.getpid())

def pre_fork(server, worker):
    """Called just before fork"""
    pass

def pre_exec(server):
    """Called before process restart"""
    server.log.info("Forking new master process")

def when_ready(server):
    """Called when server is ready"""
    server.log.info("Server ready. Spawning workers")

# Security
secure_scheme_headers = {
    "X-FORWARDED_PROTOCOL": "ssl",
    "X-FORWARDED_PROTO": "https",
    "X-FORWARDED_SSL": "on",
}

# CORS and headers (can be customized per deployment)
raw_env = []
