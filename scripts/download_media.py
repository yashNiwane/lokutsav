#!/usr/bin/env python3
"""
Lokutsav 2026 - High-Speed Resumable Media Downloader & Offline Gallery Viewer
=============================================================================
This script downloads all participant photos and videos from lokutsav.com
to your local computer, organizes them into folders by participant, and builds
a beautiful, 100% offline interactive gallery viewer so you can browse,
search, and watch all videos flawlessly.

Requires: Python 3.8+ (Zero third-party pip dependencies; standard library only)
"""

import os
import sys
import json
import time
import shutil
import ssl
import re
import urllib.request
import urllib.error
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading

# Configuration Defaults
DEFAULT_BASE_URL = "https://lokutsav.com"
DEFAULT_DOWNLOAD_DIR = "Lokutsav_Downloads"
DEFAULT_WORKERS = 10
CHUNK_SIZE = 128 * 1024  # 128 KB buffer

# SSL Context that ignores certificate verification issues on legacy environments
ssl_ctx = ssl.create_default_context()
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode = ssl.CERT_NONE


def clean_filename(name: str) -> str:
    """Sanitize participant name for directory/file naming."""
    if not name:
        return "Unknown"
    cleaned = re.sub(r'[\\/*?:"<>|]', "", name).strip()
    cleaned = re.sub(r'\s+', "_", cleaned)
    return cleaned[:50] or "Participant"


def format_bytes(num_bytes: int) -> str:
    """Format bytes to human readable format."""
    if num_bytes < 1024:
        return f"{num_bytes} B"
    elif num_bytes < 1024**2:
        return f"{num_bytes / 1024:.1f} KB"
    elif num_bytes < 1024**3:
        return f"{num_bytes / 1024**2:.2f} MB"
    else:
        return f"{num_bytes / 1024**3:.2f} GB"


def format_seconds(seconds: float) -> str:
    """Format seconds to MM:SS or HH:MM:SS."""
    if seconds < 0 or seconds > 86400 * 7:
        return "--:--"
    m, s = divmod(int(seconds), 60)
    h, m = divmod(m, 60)
    if h > 0:
        return f"{h}h {m:02d}m"
    return f"{m:02d}m {s:02d}s"


class DownloadTracker:
    def __init__(self, total_files: int, total_bytes: int):
        self.lock = threading.Lock()
        self.total_files = total_files
        self.total_bytes = total_bytes
        self.completed_files = 0
        self.skipped_files = 0
        self.failed_files = 0
        self.downloaded_bytes = 0
        self.start_time = time.time()
        self.last_update_time = time.time()
        self.speed = 0.0

    def add_bytes(self, num_bytes: int):
        with self.lock:
            self.downloaded_bytes += num_bytes
            now = time.time()
            dt = now - self.last_update_time
            if dt >= 0.5:
                elapsed = now - self.start_time
                if elapsed > 0:
                    self.speed = self.downloaded_bytes / elapsed
                self.last_update_time = now

    def mark_complete(self, skipped: bool = False, failed: bool = False):
        with self.lock:
            if skipped:
                self.skipped_files += 1
            elif failed:
                self.failed_files += 1
            else:
                self.completed_files += 1

    def print_progress(self, current_filename: str):
        with self.lock:
            processed = self.completed_files + self.skipped_files + self.failed_files
            percent = (processed / self.total_files * 100) if self.total_files > 0 else 0
            
            # Progress bar
            bar_len = 22
            filled = int(bar_len * processed / self.total_files) if self.total_files > 0 else 0
            bar = "=" * filled + (">" if filled < bar_len else "") + " " * (bar_len - filled - (1 if filled < bar_len else 0))

            # ETA
            remaining_bytes = max(0, self.total_bytes - self.downloaded_bytes)
            eta_str = format_seconds(remaining_bytes / self.speed) if self.speed > 50000 else "--:--"

            short_fn = (current_filename[:24] + "..") if len(current_filename) > 26 else current_filename.ljust(26)
            sys.stdout.write(
                f"\r[{processed:4d}/{self.total_files:4d}] {percent:5.1f}% [{bar}] "
                f"{format_bytes(self.downloaded_bytes):>8s} | "
                f"{format_bytes(int(self.speed))}/s | ETA: {eta_str:>6s} | {short_fn}"
            )
            sys.stdout.flush()


def download_single_file(item: dict, uploads_dir: Path, tracker: DownloadTracker, base_url: str):
    """Download a single media file with resuming and size verification."""
    filename = item["filename"]
    expected_size = item.get("size", 0)
    dest_path = uploads_dir / filename
    part_path = uploads_dir / f"{filename}.part"

    # 1. Check if already completely downloaded
    if dest_path.exists():
        actual_size = dest_path.stat().st_size
        if expected_size <= 0 or actual_size == expected_size:
            tracker.mark_complete(skipped=True)
            tracker.add_bytes(actual_size)
            tracker.print_progress(filename)
            return True

    # 2. Check for partial download resume
    existing_bytes = 0
    if part_path.exists():
        existing_bytes = part_path.stat().st_size
        if expected_size > 0 and existing_bytes > expected_size:
            # Corrupted part file larger than expected, remove
            try:
                part_path.unlink()
                existing_bytes = 0
            except Exception:
                pass

    url = f"{base_url}/uploads/{filename}"
    headers = {
        "User-Agent": "LokutsavDownloader/2.0 (Windows; Python3)",
        "Accept": "*/*"
    }
    if existing_bytes > 0:
        headers["Range"] = f"bytes={existing_bytes}-"
        tracker.add_bytes(existing_bytes)

    req = urllib.request.Request(url, headers=headers)

    # 3. Stream download to disk
    max_retries = 3
    for attempt in range(max_retries):
        try:
            with urllib.request.urlopen(req, context=ssl_ctx, timeout=30) as resp:
                mode = "ab" if (existing_bytes > 0 and resp.status == 206) else "wb"
                if mode == "wb" and existing_bytes > 0:
                    # Server did not honor Range, reset downloaded bytes counter
                    tracker.add_bytes(-existing_bytes)
                    existing_bytes = 0

                with open(part_path, mode) as out_f:
                    while True:
                        chunk = resp.read(CHUNK_SIZE)
                        if not chunk:
                            break
                        out_f.write(chunk)
                        tracker.add_bytes(len(chunk))
                        tracker.print_progress(filename)

            # Atomic rename from .part to final
            if part_path.exists():
                if dest_path.exists():
                    dest_path.unlink()
                part_path.rename(dest_path)

            tracker.mark_complete(skipped=False)
            tracker.print_progress(filename)
            return True

        except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError, ConnectionResetError) as e:
            if attempt == max_retries - 1:
                tracker.mark_complete(failed=True)
                tracker.print_progress(f"FAIL: {filename}")
                return False
            time.sleep(1.5 * (attempt + 1))
        except Exception as e:
            tracker.mark_complete(failed=True)
            return False

    return False


def load_manifests(script_dir: Path):
    """Load or find participant and upload manifest JSON files."""
    # Search locations
    search_dirs = [
        script_dir,
        script_dir.parent,
        Path.cwd(),
        script_dir / ".." / ".."
    ]

    participants_file = None
    uploads_file = None

    for d in search_dirs:
        p_cand = d / "participants_manifest.json"
        u_cand = d / "all_uploads_manifest.json"
        if not participants_file and p_cand.exists():
            participants_file = p_cand
        if not uploads_file and u_cand.exists():
            uploads_file = u_cand

    participants = []
    uploads = []

    if participants_file and participants_file.exists():
        with open(participants_file, "r", encoding="utf-8") as f:
            participants = json.load(f)

    if uploads_file and uploads_file.exists():
        with open(uploads_file, "r", encoding="utf-8") as f:
            uploads = json.load(f)

    return participants, uploads


def organize_participant_folders(participants: list, uploads_dir: Path, target_base_dir: Path):
    """Create structured participant folders with details.txt and media links/copies."""
    participants_dir = target_base_dir / "Participants"
    participants_dir.mkdir(parents=True, exist_ok=True)

    print("\nOrganizing participant folders...")
    count = 0
    for p in participants:
        ticket = p.get("ticketId", "UNKNOWN")
        name = clean_filename(p.get("fullName", "Participant"))
        district = clean_filename(p.get("district", "Maharashtra"))
        status = p.get("paymentStatus", "PENDING")

        folder_name = f"[{ticket}] {name} ({district})"
        if status != "COMPLETED":
            folder_name += " [UNPAID]"

        p_folder = participants_dir / folder_name
        p_folder.mkdir(parents=True, exist_ok=True)

        # Parse photos
        photos = []
        raw_photos = p.get("photoUrls")
        if raw_photos:
            try:
                photos = json.loads(raw_photos) if isinstance(raw_photos, str) else raw_photos
            except Exception:
                photos = [raw_photos]

        # Write details.txt
        details_txt = p_folder / "details.txt"
        with open(details_txt, "w", encoding="utf-8") as f:
            f.write("================================================================\n")
            f.write("  LOKUTSAV 2026 - PARTICIPANT ENTRY PROFILE\n")
            f.write("================================================================\n\n")
            f.write(f"Ticket ID          : {ticket}\n")
            f.write(f"Full Name          : {p.get('fullName', '')}\n")
            f.write(f"Phone Number       : {p.get('phone', '')}\n")
            f.write(f"Payment Status     : {status}\n")
            f.write(f"Category           : {'घरगुती गणपती (Household)' if p.get('category') == 'HOUSEHOLD' else 'सार्वजनिक गणेशोत्सव मंडळ (Sarvajanik Mandal)'}\n")
            f.write(f"Idol Type          : {p.get('idolType', '')}\n")
            f.write(f"District / City    : {p.get('district', '')} / {p.get('city', '')}\n")
            f.write(f"Decoration Title   : {p.get('themeTitle', '')}\n")
            f.write(f"Registration Date  : {p.get('createdAt', '')}\n")
            if p.get("videoUrl") and (p["videoUrl"].startswith("http://") or p["videoUrl"].startswith("https://")):
                f.write(f"External Video Link: {p['videoUrl']}\n")
            f.write("\n----------------------------------------------------------------\n")
            f.write("Theme Description:\n")
            f.write(f"{p.get('themeDescription', '')}\n")
            f.write("================================================================\n")

        # Organize photos
        for idx, photo_rel in enumerate(photos, start=1):
            if not photo_rel:
                continue
            if photo_rel.startswith("http://") or photo_rel.startswith("https://"):
                continue  # External link
            fn = photo_rel.replace("/uploads/", "").strip()
            src = uploads_dir / fn
            if src.exists():
                ext = src.suffix or ".jpg"
                dest = p_folder / f"photo_{idx}{ext}"
                if not dest.exists():
                    try:
                        os.link(src, dest)
                    except Exception:
                        shutil.copy2(src, dest)

        # Organize video
        if p.get("videoUrl") and not (p["videoUrl"].startswith("http://") or p["videoUrl"].startswith("https://")):
            v_fn = p["videoUrl"].replace("/uploads/", "").strip()
            v_src = uploads_dir / v_fn
            if v_src.exists():
                v_ext = v_src.suffix or ".mp4"
                v_dest = p_folder / f"video{v_ext}"
                if not v_dest.exists():
                    try:
                        os.link(v_src, v_dest)
                    except Exception:
                        shutil.copy2(v_src, v_dest)

        count += 1

    print(f"Organized {count} participant profiles into: {participants_dir}")


def generate_offline_viewer(participants: list, uploads_dir: Path, target_base_dir: Path):
    """Generate self-contained Offline_Media_Viewer.html."""
    print("Generating Offline Interactive Gallery Viewer...")

    # Enrich participant data with local relative media paths
    viewer_participants = []
    for p in participants:
        photos = []
        raw = p.get("photoUrls")
        if raw:
            try:
                photos = json.loads(raw) if isinstance(raw, str) else raw
            except Exception:
                photos = [raw]

        local_photos = []
        external_photos = []
        for ph in photos:
            if not ph:
                continue
            if ph.startswith("http://") or ph.startswith("https://"):
                external_photos.append(ph)
            else:
                fn = ph.replace("/uploads/", "").strip()
                if (uploads_dir / fn).exists():
                    local_photos.append(f"uploads/{fn}")

        local_video = None
        external_video = None
        if p.get("videoUrl"):
            v = p["videoUrl"].strip()
            if v.startswith("http://") or v.startswith("https://"):
                external_video = v
            else:
                v_fn = v.replace("/uploads/", "").strip()
                if (uploads_dir / v_fn).exists():
                    local_video = f"uploads/{v_fn}"

        viewer_participants.append({
            "ticketId": p.get("ticketId", ""),
            "fullName": p.get("fullName", ""),
            "phone": p.get("phone", ""),
            "district": p.get("district", "Maharashtra"),
            "city": p.get("city", ""),
            "category": p.get("category", "HOUSEHOLD"),
            "idolType": p.get("idolType", ""),
            "themeTitle": p.get("themeTitle", ""),
            "themeDescription": p.get("themeDescription", ""),
            "paymentStatus": p.get("paymentStatus", "PENDING"),
            "photos": local_photos,
            "externalPhotos": external_photos,
            "video": local_video,
            "externalVideo": external_video,
            "createdAt": p.get("createdAt", "")
        })

    json_payload = json.dumps(viewer_participants, ensure_ascii=False)

    html_content = f"""<!DOCTYPE html>
<html lang="mr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>लोकोत्सव २०२६ - ऑफलाइन मीडिया गॅलरी (Offline Media Viewer)</title>
  <style>
    :root {{
      --primary: #9B1B1E;
      --primary-hover: #7F1518;
      --gold: #D97706;
      --bg: #F8FAFC;
      --card-bg: #FFFFFF;
      --text: #0F172A;
      --text-muted: #64748B;
      --border: #E2E8F0;
    }}
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Mukta", sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.5;
    }}
    header {{
      background: linear-gradient(135deg, #7F1518 0%, #9B1B1E 50%, #450A0A 100%);
      color: white;
      padding: 1.5rem 1rem;
      border-bottom: 4px solid var(--gold);
      position: sticky;
      top: 0;
      z-index: 40;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }}
    .header-container {{
      max-width: 1300px;
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }}
    .title-group h1 {{
      font-size: 1.35rem;
      font-weight: 800;
      letter-spacing: -0.02em;
    }}
    .title-group p {{
      font-size: 0.825rem;
      opacity: 0.9;
      color: #FDE68A;
    }}
    .stats-badge {{
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(8px);
      padding: 0.4rem 0.8rem;
      border-radius: 9999px;
      border: 1px solid rgba(255, 255, 255, 0.25);
      font-size: 0.825rem;
      font-weight: 600;
    }}
    
    .toolbar-section {{
      background: white;
      border-bottom: 1px solid var(--border);
      padding: 1rem;
      position: sticky;
      top: 76px;
      z-index: 30;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }}
    .toolbar-container {{
      max-width: 1300px;
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      align-items: center;
    }}
    .search-box {{
      flex: 1 1 280px;
      position: relative;
    }}
    .search-box input {{
      width: 100%;
      padding: 0.6rem 0.9rem;
      border: 1.5px solid var(--border);
      border-radius: 8px;
      font-size: 0.9rem;
      outline: none;
      transition: border-color 0.2s;
    }}
    .search-box input:focus {{
      border-color: var(--primary);
    }}
    select, button.filter-btn {{
      padding: 0.6rem 0.9rem;
      border: 1.5px solid var(--border);
      background: white;
      border-radius: 8px;
      font-size: 0.85rem;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }}
    button.filter-btn:hover, select:hover {{
      background: #F1F5F9;
    }}
    button.filter-btn.active {{
      background: var(--primary);
      color: white;
      border-color: var(--primary);
    }}

    main {{
      max-width: 1300px;
      margin: 1.5rem auto;
      padding: 0 1rem;
    }}
    .count-status {{
      margin-bottom: 1rem;
      font-size: 0.9rem;
      color: var(--text-muted);
      font-weight: 600;
    }}
    .gallery-grid {{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.25rem;
    }}
    .card {{
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
      display: flex;
      flex-col;
      flex-direction: column;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      transition: transform 0.2s, box-shadow 0.2s;
    }}
    .card:hover {{
      transform: translateY(-3px);
      box-shadow: 0 10px 20px -5px rgba(0,0,0,0.1);
      border-color: #CBD5E1;
    }}
    .card-media {{
      position: relative;
      background: #0F172A;
      aspect-ratio: 4 / 3;
      overflow: hidden;
      cursor: pointer;
    }}
    .card-media img {{
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }}
    .card:hover .card-media img {{
      transform: scale(1.03);
    }}
    .no-photo-box {{
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #94A3B8;
      font-size: 0.9rem;
      background: #1E293B;
    }}
    .badge-bar {{
      position: absolute;
      top: 0.5rem;
      left: 0.5rem;
      display: flex;
      gap: 0.35rem;
      flex-wrap: wrap;
    }}
    .badge {{
      padding: 0.2rem 0.5rem;
      border-radius: 6px;
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }}
    .badge-paid {{ background: #16A34A; color: white; }}
    .badge-unpaid {{ background: #DC2626; color: white; }}
    .badge-cat {{ background: rgba(0,0,0,0.7); color: white; backdrop-filter: blur(4px); }}
    .badge-count {{ position: absolute; bottom: 0.5rem; right: 0.5rem; background: rgba(0,0,0,0.75); color: white; padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.75rem; }}

    .card-body {{
      padding: 1rem;
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 0.5rem;
    }}
    .ticket-chip {{
      display: inline-block;
      align-self: flex-start;
      font-family: monospace;
      font-size: 0.78rem;
      font-weight: 800;
      color: var(--primary);
      background: #FEE2E2;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
    }}
    .participant-name {{
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--text);
      line-height: 1.3;
    }}
    .theme-title {{
      font-size: 0.88rem;
      font-weight: 600;
      color: var(--gold);
    }}
    .meta-line {{
      font-size: 0.8rem;
      color: var(--text-muted);
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }}
    .theme-desc {{
      font-size: 0.825rem;
      color: #334155;
      margin-top: 0.25rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      flex: 1;
    }}
    .card-actions {{
      margin-top: 0.75rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--border);
      display: flex;
      gap: 0.5rem;
    }}
    .btn {{
      flex: 1;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      font-size: 0.825rem;
      font-weight: 700;
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.35rem;
      transition: background 0.15s;
    }}
    .btn-photo {{ background: #E2E8F0; color: #0F172A; }}
    .btn-photo:hover {{ background: #CBD5E1; }}
    .btn-video {{ background: var(--primary); color: white; }}
    .btn-video:hover {{ background: var(--primary-hover); }}
    .btn-disabled {{ background: #F1F5F9; color: #94A3B8; cursor: not-allowed; }}

    /* Modal Styling */
    .modal-backdrop {{
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.85);
      z-index: 100;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      backdrop-filter: blur(6px);
    }}
    .modal-content {{
      background: #0F172A;
      color: white;
      width: 100%;
      max-width: 900px;
      border-radius: 12px;
      overflow: hidden;
      position: relative;
      display: flex;
      flex-direction: column;
      max-height: 90vh;
      border: 1px solid #334155;
    }}
    .modal-header {{
      padding: 0.8rem 1.2rem;
      background: #1E293B;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #334155;
    }}
    .modal-header h3 {{
      font-size: 1rem;
      font-weight: 700;
    }}
    .modal-close {{
      background: none;
      border: none;
      color: #94A3B8;
      font-size: 1.5rem;
      cursor: pointer;
      line-height: 1;
    }}
    .modal-close:hover {{ color: white; }}
    .modal-body {{
      padding: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow-y: auto;
      background: black;
      min-height: 300px;
    }}
    .modal-body video, .modal-body img {{
      max-width: 100%;
      max-height: 70vh;
      border-radius: 8px;
    }}
  </style>
</head>
<body>

  <header>
    <div class="header-container">
      <div class="title-group">
        <h1>🚩 महाराष्ट्र राज्य ऑनलाइन गणेश सजावट स्पर्धा २०२६</h1>
        <p>Offline Media Gallery & Jury Reviewer (स्थानिक ऑफलाइन दर्शक)</p>
      </div>
      <div class="stats-badge" id="statsBadge">लोड करत आहे...</div>
    </div>
  </header>

  <div class="toolbar-section">
    <div class="toolbar-container">
      <div class="search-box">
        <input type="text" id="searchInput" placeholder="शोध: तिकीट क्रमांक (LOK-..), नाव, शहर, किंवा फोन...">
      </div>

      <button class="filter-btn active" data-filter="all">सर्व (All)</button>
      <button class="filter-btn" data-filter="paid">फक्त PAID</button>
      <button class="filter-btn" data-filter="household">घरगुती (Household)</button>
      <button class="filter-btn" data-filter="mandal">सार्वजनिक मंडळ</button>
      <button class="filter-btn" data-filter="video">व्हिडिओ उपलब्ध</button>

      <select id="districtSelect">
        <option value="">सर्व जिल्हे (All Districts)</option>
      </select>
    </div>
  </div>

  <main>
    <div class="count-status" id="countStatus">दाखवत आहे: 0 नोंदी</div>
    <div class="gallery-grid" id="galleryGrid"></div>
  </main>

  <!-- Media Player Modal -->
  <div class="modal-backdrop" id="mediaModal" onclick="closeModal(event)">
    <div class="modal-content" onclick="event.stopPropagation()">
      <div class="modal-header">
        <h3 id="modalTitle">Media Viewer</h3>
        <button class="modal-close" onclick="closeModal()">&times;</button>
      </div>
      <div class="modal-body" id="modalBody"></div>
    </div>
  </div>

  <script>
    const participants = {json_payload};

    // Populate districts
    const districts = Array.from(new Set(participants.map(p => p.district).filter(Boolean))).sort();
    const districtSelect = document.getElementById('districtSelect');
    districts.forEach(d => {{
      const opt = document.createElement('option');
      opt.value = d;
      opt.textContent = d;
      districtSelect.appendChild(opt);
    }});

    let currentFilter = 'all';
    let searchQuery = '';
    let selectedDistrict = '';

    const grid = document.getElementById('galleryGrid');
    const countStatus = document.getElementById('countStatus');
    const statsBadge = document.getElementById('statsBadge');

    const totalPaid = participants.filter(p => p.paymentStatus === 'COMPLETED').length;
    statsBadge.textContent = `एकूण: ${{participants.length}} स्पर्धक | पेड: ${{totalPaid}}`;

    function render() {{
      const filtered = participants.filter(p => {{
        // Filter pills
        if (currentFilter === 'paid' && p.paymentStatus !== 'COMPLETED') return false;
        if (currentFilter === 'household' && p.category !== 'HOUSEHOLD') return false;
        if (currentFilter === 'mandal' && p.category === 'HOUSEHOLD') return false;
        if (currentFilter === 'video' && !p.video) return false;

        // District filter
        if (selectedDistrict && p.district !== selectedDistrict) return false;

        // Search text
        if (searchQuery) {{
          const q = searchQuery.toLowerCase();
          const matchTicket = (p.ticketId || '').toLowerCase().includes(q);
          const matchName = (p.fullName || '').toLowerCase().includes(q);
          const matchPhone = (p.phone || '').includes(q);
          const matchCity = (p.city || '').toLowerCase().includes(q);
          const matchTitle = (p.themeTitle || '').toLowerCase().includes(q);
          if (!matchTicket && !matchName && !matchPhone && !matchCity && !matchTitle) return false;
        }}
        return true;
      }});

      countStatus.textContent = `दाखवत आहे: ${{filtered.length}} / ${{participants.length}} नोंदी`;
      grid.innerHTML = '';

      filtered.forEach((p, idx) => {{
        const card = document.createElement('div');
        card.className = 'card';

        const allPhotos = [...(p.photos || []), ...(p.externalPhotos || [])];
        const mainPhoto = allPhotos.length > 0 ? allPhotos[0] : null;
        const photoCount = allPhotos.length;
        const isPaid = p.paymentStatus === 'COMPLETED';

        card.innerHTML = `
          <div class="card-media" onclick="viewPhotoGallery(${{idx}}, 0)">
            ${{mainPhoto 
              ? `<img src="${{mainPhoto}}" alt="${{p.fullName}}" loading="lazy" onerror="this.src=''; this.parentElement.innerHTML='<div class=no-photo-box>फोटो उपलब्ध नाही</div>'">` 
              : `<div class="no-photo-box">📷 फोटो उपलब्ध नाही</div>`}}
            <div class="badge-bar">
              <span class="badge ${{isPaid ? 'badge-paid' : 'badge-unpaid'}}">${{isPaid ? 'PAID' : 'UNPAID'}}</span>
              <span class="badge badge-cat">${{p.category === 'HOUSEHOLD' ? 'घरगुती' : 'सार्वजनिक'}}</span>
            </div>
            ${{photoCount > 1 ? `<div class="badge-count">📷 ${{photoCount}} Photos</div>` : ''}}
          </div>
          <div class="card-body">
            <span class="ticket-chip">${{p.ticketId || 'NO-TICKET'}}</span>
            <div class="participant-name">${{p.fullName || 'अनामिक'}}</div>
            <div class="meta-line">
              <span>📍 ${{p.district || 'महाराष्ट्र'}}${{p.city ? ' (' + p.city + ')' : ''}}</span>
              <span>•</span>
              <span>📞 ${{p.phone || ''}}</span>
            </div>
            ${{p.themeTitle ? `<div class="theme-title">🚩 ${{p.themeTitle}}</div>` : ''}}
            ${{p.themeDescription ? `<div class="theme-desc">${{p.themeDescription}}</div>` : ''}}
            <div class="card-actions">
              <button class="btn btn-photo" onclick="viewPhotoGallery(${{idx}}, 0)" ${{photoCount === 0 && (!p.externalPhotos || p.externalPhotos.length === 0) ? 'disabled' : ''}}>
                📷 फोटो (${{photoCount + (p.externalPhotos ? p.externalPhotos.length : 0)}})
              </button>
              ${{p.video 
                ? `<button class="btn btn-video" onclick="playVideo('${{p.video}}', '${{p.ticketId}} - ${{p.fullName.replace(/'/g, "\\\\'")}}')">▶ व्हिडिओ पहा</button>`
                : p.externalVideo 
                  ? `<a href="${{p.externalVideo}}" target="_blank" rel="noopener noreferrer" class="btn btn-video" style="background:#2563EB; text-decoration:none;">🔗 ऑनलाइन व्हिडिओ</a>`
                  : `<button class="btn btn-disabled" disabled>व्हिडिओ नाही</button>`}}
            </div>
          </div>
        `;
        grid.appendChild(card);
      }});
    }}

    // Filter Buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {{
      btn.addEventListener('click', () => {{
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        render();
      }});
    }});

    // Search Input
    document.getElementById('searchInput').addEventListener('input', (e) => {{
      searchQuery = e.target.value.trim();
      render();
    }});

    // District Select
    districtSelect.addEventListener('change', (e) => {{
      selectedDistrict = e.target.value;
      render();
    }});

    // Modals
    const modal = document.getElementById('mediaModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    function playVideo(videoSrc, title) {{
      modalTitle.textContent = '🎥 व्हिडिओ: ' + title;
      modalBody.innerHTML = `<video controls autoplay style="width:100%; max-height:75vh; outline:none;"><source src="${{videoSrc}}" type="video/mp4">आपला ब्राउझर व्हिडिओला सपोर्ट करत नाही.</video>`;
      modal.style.display = 'flex';
    }}

    function viewPhotoGallery(participantIdx, photoIdx) {{
      const p = participants[participantIdx];
      const allPhotos = [...(p.photos || []), ...(p.externalPhotos || [])];
      if (allPhotos.length === 0) return;
      modalTitle.textContent = `📷 ${{p.ticketId}} - ${{p.fullName}} (${{photoIdx + 1}}/${{allPhotos.length}})`;
      modalBody.innerHTML = `
        <div style="text-align:center; position:relative; width:100%;">
          <img src="${{allPhotos[photoIdx]}}" style="max-width:100%; max-height:70vh; border-radius:8px;">
          ${{allPhotos.length > 1 ? `
            <div style="margin-top:1rem; display:flex; justify-content:center; gap:1rem;">
              <button class="filter-btn" onclick="viewPhotoGallery(${{participantIdx}}, ${{Math.max(0, photoIdx - 1)}})">‹ आधीचा</button>
              <button class="filter-btn" onclick="viewPhotoGallery(${{participantIdx}}, ${{Math.min(allPhotos.length - 1, photoIdx + 1)}})">पुढील ›</button>
            </div>
          ` : ''}}
        </div>
      `;
      modal.style.display = 'flex';
    }}

    function closeModal(e) {{
      modal.style.display = 'none';
      modalBody.innerHTML = '';
    }}

    document.addEventListener('keydown', (e) => {{
      if (e.key === 'Escape') closeModal();
    }});

    render();
  </script>
</body>
</html>
"""

    viewer_file = target_base_dir / "index.html"
    with open(viewer_file, "w", encoding="utf-8") as f:
        f.write(html_content)

    print(f"Offline Gallery Viewer successfully created at: {viewer_file}")
    return viewer_file


def main():
    script_dir = Path(__file__).resolve().parent

    print("=" * 72)
    print("   LOKUTSAV 2026 - COMPLETE MEDIA DOWNLOADER & VIEWER")
    print("=" * 72)

    # 1. Load manifests
    participants, all_uploads = load_manifests(script_dir)
    if not all_uploads:
        print("[!] Error: 'all_uploads_manifest.json' not found. Please ensure it is in the repository.")
        sys.exit(1)

    # File lookup dictionary
    files_by_name = {item["filename"]: item.get("size", 0) for item in all_uploads}

    # Calculate sets
    paid_filenames = set()
    registered_filenames = set()

    for p in participants:
        p_photos = []
        raw = p.get("photoUrls")
        if raw:
            try:
                p_photos = json.loads(raw) if isinstance(raw, str) else raw
            except Exception:
                p_photos = [raw]
        for ph in p_photos:
            fn = ph.replace("/uploads/", "").strip()
            registered_filenames.add(fn)
            if p.get("paymentStatus") == "COMPLETED":
                paid_filenames.add(fn)

        if p.get("videoUrl"):
            v_fn = p["videoUrl"].replace("/uploads/", "").strip()
            registered_filenames.add(v_fn)
            if p.get("paymentStatus") == "COMPLETED":
                paid_filenames.add(v_fn)

    paid_items = [{"filename": fn, "size": files_by_name.get(fn, 0)} for fn in paid_filenames if fn in files_by_name]
    reg_items = [{"filename": fn, "size": files_by_name.get(fn, 0)} for fn in registered_filenames if fn in files_by_name]

    paid_bytes = sum(item["size"] for item in paid_items)
    reg_bytes = sum(item["size"] for item in reg_items)
    all_bytes = sum(item.get("size", 0) for item in all_uploads)

    print("\nAvailable Media Breakdown:")
    print(f" [1] Paid Participants Only    : {len(paid_items):4d} files ({format_bytes(paid_bytes)}) - Recommended")
    print(f" [2] All Registered Entries    : {len(reg_items):4d} files ({format_bytes(reg_bytes)})")
    print(f" [3] Complete Server Archive   : {len(all_uploads):4d} files ({format_bytes(all_bytes)}) [Includes all drafts]")

    # Check command-line arguments for automated or non-interactive mode
    selected_mode = None
    target_dir_arg = None
    workers_arg = DEFAULT_WORKERS

    for arg in sys.argv[1:]:
        if arg in ["--paid", "-1", "1"]:
            selected_mode = "1"
        elif arg in ["--registered", "-2", "2"]:
            selected_mode = "2"
        elif arg in ["--all", "-3", "3"]:
            selected_mode = "3"
        elif arg.startswith("--dir="):
            target_dir_arg = arg.split("=", 1)[1]
        elif arg.startswith("--workers="):
            try:
                workers_arg = int(arg.split("=", 1)[1])
            except ValueError:
                pass

    if not selected_mode:
        try:
            choice = input("\nSelect download mode [1, 2, or 3] (default 1): ").strip()
            selected_mode = choice if choice in ["1", "2", "3"] else "1"
        except (EOFError, KeyboardInterrupt):
            selected_mode = "1"

    if selected_mode == "1":
        active_items = paid_items
        active_participants = [p for p in participants if p.get("paymentStatus") == "COMPLETED"]
        mode_label = "Paid Participants Only"
    elif selected_mode == "2":
        active_items = reg_items
        active_participants = participants
        mode_label = "All Registered Entries"
    else:
        active_items = all_uploads
        active_participants = participants
        mode_label = "Complete Server Archive"

    # Setup directories
    if not target_dir_arg:
        target_dir = Path.cwd() / DEFAULT_DOWNLOAD_DIR
    else:
        target_dir = Path(target_dir_arg).resolve()

    uploads_dir = target_dir / "uploads"
    uploads_dir.mkdir(parents=True, exist_ok=True)

    total_target_bytes = sum(item.get("size", 0) for item in active_items)

    print("\n" + "=" * 72)
    print(f" Mode               : {mode_label}")
    print(f" Destination Folder : {target_dir}")
    print(f" Total Files        : {len(active_items):,}")
    print(f" Total Download Size: {format_bytes(total_target_bytes)}")
    print(f" Parallel Streams   : {workers_arg} threads (Multi-threaded & Resumable)")
    print("=" * 72 + "\n")

    tracker = DownloadTracker(total_files=len(active_items), total_bytes=total_target_bytes)

    # Launch parallel downloads
    try:
        with ThreadPoolExecutor(max_workers=workers_arg) as executor:
            futures = [
                executor.submit(download_single_file, item, uploads_dir, tracker, DEFAULT_BASE_URL)
                for item in active_items
            ]
            for fut in as_completed(futures):
                fut.result()
    except KeyboardInterrupt:
        print("\n\n[!] Download paused by user. You can resume anytime by re-running the script.")
        sys.exit(0)

    print("\n\n" + "=" * 72)
    print(" Media Download Phase Finished!")
    print(f" Successfully Downloaded / Verified : {tracker.completed_files + tracker.skipped_files} files")
    if tracker.failed_files > 0:
        print(f" Failed Downloads                   : {tracker.failed_files} (Run again to retry)")
    print("=" * 72)

    # Organize participant folders
    organize_participant_folders(active_participants, uploads_dir, target_dir)

    # Generate offline HTML viewer
    viewer_file = generate_offline_viewer(active_participants, uploads_dir, target_dir)

    print("\n" + "=" * 72)
    print(" ALL DONE! You can now view all media flawlessly:")
    print(f" 📂 Participant Folders : {target_dir / 'Participants'}")
    print(f" 🌐 Offline Viewer App  : {viewer_file}")
    print("=" * 72)

    # Attempt to open viewer in default browser automatically on Windows
    try:
        import webbrowser
        webbrowser.open(str(viewer_file.resolve()))
    except Exception:
        pass


if __name__ == "__main__":
    main()
