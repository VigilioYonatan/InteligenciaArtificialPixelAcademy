#!/usr/bin/env python3
"""Verify archived source files against ORIGINAL_INTEGRITY.json (no external ZIP needed)."""
import hashlib,json,pathlib,sys
root=pathlib.Path(__file__).resolve().parent.parent
manifest=json.loads((root/'ORIGINAL_INTEGRITY.json').read_text())
missing=[];changed=[]
for name,sha in manifest['original_sha256'].items():
    path=root/name
    if not path.is_file():missing.append(name)
    elif name not in manifest['intentional_changes'] and hashlib.sha256(path.read_bytes()).hexdigest()!=sha: changed.append(name)
print(f"archived={len(manifest['original_sha256'])} missing={len(missing)} unexpected_changes={len(changed)}")
for name in missing+changed: print('FAIL',name)
sys.exit(1 if missing or changed else 0)
