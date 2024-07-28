import os
from supabase import create_client, Client
from dotenv import load_dotenv
import pyheif
from PIL import Image
import requests
import piexif
import magic

def check_file_type(file_path):
    file_type = magic.from_file(file_path, mime=True)
    print(f"Detected file type: {file_type}")

# Load environment variables
load_dotenv()
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase = create_client(url, key)

def download_file(url, local_filename):
    with requests.get(url, stream=True) as r:
        r.raise_for_status()
        with open(local_filename, 'wb') as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)
    return local_filename

def get_geolocation_from_heic(file_path):
    # Extract EXIF data
    exif_data = piexif.load(file_path)
    gps_info = exif_data.get('GPS', {})
    
    # Parse GPS data
    def parse_gps_info(gps_info):
        def get_coordinate(values, reference):
            degrees = values[0][0] / values[0][1]
            minutes = values[1][0] / values[1][1]
            seconds = values[2][0] / values[2][1]
            coordinate = degrees + (minutes / 60.0) + (seconds / 3600.0)
            if reference in ['S', 'W']:
                coordinate = -coordinate
            return coordinate
        
        lat = get_coordinate(gps_info[2], gps_info[1].decode('utf-8'))
        lon = get_coordinate(gps_info[4], gps_info[3].decode('utf-8'))
        
        return lat, lon

    if gps_info:
        lat, lon = parse_gps_info(gps_info)
        return lat, lon
    else:
        return None

def add_geolocation(post):
    print(post)
    file_url = supabase.storage.from_('user-images').get_public_url(post['pic_uri'])
    file_name = post["pic_uri"].split("/")[-1]
    local_filename = f'fixtures/{file_name}'  # Use a proper directory structure

    # Ensure the fixtures directory exists
    os.makedirs('fixtures', exist_ok=True)

    local = download_file(file_url, local_filename)
    print(f"Local file path: {local}")
    print(f"Current working directory: {os.getcwd()}")

    check_file_type(local)
    # Verify file size
    file_size = os.path.getsize(local)
    print(f"Downloaded file size: {file_size} bytes")

    try:
        geolocation = get_geolocation_from_heic(local)
        if geolocation:
            latitude = geolocation[0]
            longitude = geolocation[1]
            print(f"Latitude: {geolocation[0]}, Longitude: {geolocation[1]}")
            supabase.table("Posts").update({"latitude": latitude, "longitude": longitude}).eq('id', post['id']).execute()
        else:
            print("No geolocation data found.")
    except Exception as e:
        print(f"Error reading HEIC file: {e}")

if __name__ == '__main__':
    all_posts = supabase.table("Posts").select("*").execute()
    for post in all_posts.data:
        if post['latitude'] is None and post['pic_uri'] is not None:
            add_geolocation(post)
