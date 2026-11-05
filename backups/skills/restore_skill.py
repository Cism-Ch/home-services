#!/usr/bin/env python3
"""
restore_skill.py - Agent Skill Restoration Utility
Restores pruned skill files from backups/skills/unpacked or backups/skills/skills_pruned.bak.

Usage:
    python backups/skills/restore_skill.py --list
    python backups/skills/restore_skill.py --find <pattern>
    python backups/skills/restore_skill.py --restore <rel_path>
    python backups/skills/restore_skill.py --restore-all
"""
import sys
import json
import shutil
import zipfile
from pathlib import Path

BACKUP_DIR = Path(__file__).resolve().parent
ROOT_DIR = BACKUP_DIR.parent.parent
SKILLS_DIR = ROOT_DIR / ".agents" / "skills"
MANIFEST_FILE = BACKUP_DIR / "RESTORE_MANIFEST.json"
BAK_FILE = BACKUP_DIR / "skills_pruned.bak"
UNPACKED_DIR = BACKUP_DIR / "unpacked"

def load_manifest():
    if not MANIFEST_FILE.exists():
        print(f"[ERROR] Manifest file not found: {MANIFEST_FILE}")
        sys.exit(1)
    with open(MANIFEST_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def list_files(manifest):
    print(f"[*] Pruned Skills Manifest ({len(manifest['files'])} files):")
    print("-" * 80)
    for path, meta in sorted(manifest["files"].items()):
        print(f" - {path} ({meta['size_bytes']} bytes)")
        print(f"     Reason: {meta['reason']}")
    print("-" * 80)

def find_files(manifest, pattern):
    pattern = pattern.lower()
    matches = {p: m for p, m in manifest["files"].items() if pattern in p.lower() or pattern in m["reason"].lower()}
    print(f"[*] Matching files for pattern '{pattern}' ({len(matches)} found):")
    for path, meta in sorted(matches.items()):
        print(f" - {path}")
        print(f"     Reason: {meta['reason']}")

def restore_file(rel_path, manifest):
    if rel_path not in manifest["files"]:
        print(f"[ERROR] '{rel_path}' not found in manifest.")
        return False

    target_dest = SKILLS_DIR / rel_path
    target_dest.parent.mkdir(parents=True, exist_ok=True)

    unpacked_src = UNPACKED_DIR / rel_path
    if unpacked_src.exists():
        shutil.copy2(unpacked_src, target_dest)
        print(f"[SUCCESS] Restored {rel_path} from unpacked backup to .agents/skills/{rel_path}")
        return True
    elif BAK_FILE.exists():
        with zipfile.ZipFile(BAK_FILE, "r") as zf:
            zf.extract(rel_path, SKILLS_DIR)
        print(f"[SUCCESS] Restored {rel_path} from .bak archive to .agents/skills/{rel_path}")
        return True
    else:
        print(f"[ERROR] Neither unpacked backup nor .bak archive found!")
        return False

def restore_all(manifest):
    print(f"[*] Restoring all {len(manifest['files'])} files...")
    count = 0
    for rel_path in manifest["files"]:
        if restore_file(rel_path, manifest):
            count += 1
    print(f"[+] Completed! Restored {count}/{len(manifest['files'])} files.")

def main():
    manifest = load_manifest()
    args = sys.argv[1:]

    if not args or args[0] in ("-h", "--help"):
        print(__doc__)
        return

    cmd = args[0]
    if cmd in ("--list", "-l"):
        list_files(manifest)
    elif cmd in ("--find", "-f") and len(args) > 1:
        find_files(manifest, args[1])
    elif cmd in ("--restore", "-r") and len(args) > 1:
        restore_file(args[1], manifest)
    elif cmd in ("--restore-all",):
        restore_all(manifest)
    else:
        print(__doc__)

if __name__ == "__main__":
    main()
