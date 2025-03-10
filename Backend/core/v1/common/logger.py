import logging
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Optional

from rich.console import Console
from rich.logging import RichHandler

LOG_LEVEL_MAP = {
    "debug": logging.DEBUG,
    "info": logging.INFO,
    "warning": logging.WARNING,
    "error": logging.ERROR,
    "critical": logging.CRITICAL,
}

DEFAULT_LOG_DIR = Path(__file__).parent / "logs"

def get_logger(
    name: str,
    save_log_file: bool = True,
    level: str = os.getenv("LOG_LEVEL", "info").lower(),
    rich_console: bool = True,
    format: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    rich_format: str = "[%(asctime)s] %(message)s",
    date_format: str = "%Y-%m-%d %H:%M:%S",
) -> logging.Logger:
    """
    Get a configured logger instance.

    Args:
        name: Name of the logger
        save_log_file: Whether to save logs to a file (default: True)
        level: Logging level (default: INFO)
        rich_console: Whether to use rich console logging (default: True)
        format: Format for file logging
        rich_format: Format for rich console logging
        date_format: Date format for logging

    Returns:
        Configured logger instance
    """
    logger = logging.getLogger(name)
    level = LOG_LEVEL_MAP.get(level.lower(), logging.INFO)
    logger.setLevel(level)
    logger.handlers.clear()
    
    # Console handler
    if rich_console:
        console_handler = RichHandler(
            console=Console(force_terminal=True),
            show_time=True,
            show_path=False,
            markup=False,
            rich_tracebacks=True,
            tracebacks_show_locals=True,
        )
        console_handler.setFormatter(logging.Formatter(rich_format, datefmt=date_format))
    else:
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setFormatter(logging.Formatter(format, datefmt=date_format))
    
    console_handler.setLevel(level)
    logger.addHandler(console_handler)
    
    # File handler
    if save_log_file:
        log_dir = DEFAULT_LOG_DIR
        log_dir.mkdir(parents=True, exist_ok=True)
        log_path = log_dir / f"{name}.log"
        file_handler = logging.FileHandler(log_path)
        file_handler.setFormatter(logging.Formatter(format, datefmt=date_format))
        file_handler.setLevel(level)
        logger.addHandler(file_handler)
    
    return logger
