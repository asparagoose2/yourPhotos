# dependencies:
# $ apt-get install libzbar0 libzbar-dev
# $ pip install zbarlight  # you can also use setuptools directly
from PIL import Image
import zbarlight
import qrcode
import os
from pathlib import Path

NULL_CODE = 'NULL'

owners = None
event_global = "global"
galleries = {}

def scan_folder(folder):
    # scan all images in folder by date and time of creation
    paths = sorted(Path(folder).iterdir(), key=os.path.getmtime)
    
    # for img_name in os.listdir(folder):
    for img_name in paths:
        img_path = os.path.join(folder, img_name)
        if img_path.endswith('.png') or img_path.endswith('.jpg'):
            # scan image
            scan_image(img_path)


def scan_image(img_path):
    # scan image
    global owners
    img = Image.open(img_path)
    codes = zbarlight.scan_codes('qrcode', img)
    if codes:
        if codes[0].decode('utf-8') == NULL_CODE:
            print('NULL code')
            owners = None
        else:
            owners = [x.decode('utf-8').split('/')[-1] for x in codes]
            print('[+] Found QR Code: {}'.format(owners))
    else:
        print('[-] No QR Code found in image')
        if owners:

            for owner in owners:
                if owner not in galleries:
                    galleries[owner] = []
                galleries[owner].append(img_path)



scan_folder('.')
print(galleries)