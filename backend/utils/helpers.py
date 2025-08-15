def convert_history_item(item):
    timestamp = item.get("timestamp")
    if hasattr(timestamp, "isoformat"):
        ts_str = timestamp.isoformat()
    else:
        ts_str = str(timestamp) if timestamp else None
    return {
        "role": item.get("role"),
        "text": item.get("text"),
        "timestamp": ts_str,
    }
