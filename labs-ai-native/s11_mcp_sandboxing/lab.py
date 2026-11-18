from pathlib import Path

def safe_mcp_resolve(workspace_root: str, requested: str) -> Path:
    root = Path(workspace_root).resolve()
    target = (root / requested).resolve()
    if target != root and root not in target.parents:
        raise PermissionError("MCP path escape blocked")
    return target
