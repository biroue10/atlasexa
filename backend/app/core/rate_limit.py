from fastapi import Request
from slowapi import Limiter


def get_client_ip(request: Request) -> str:
    cloudflare_ip = request.headers.get("CF-Connecting-IP")

    if cloudflare_ip:
        return cloudflare_ip.strip()

    forwarded_for = request.headers.get("X-Forwarded-For")

    if forwarded_for:
        return forwarded_for.split(",", 1)[0].strip()

    if request.client:
        return request.client.host

    return "unknown"


limiter = Limiter(key_func=get_client_ip)
