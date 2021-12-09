# dependencies:
# $ apt-get install libzbar0 libzbar-dev
# $ pip install zbarlight  # you can also use setuptools directly
from PIL import Image
import zbarlight
import qrcode
import os
from pathlib import Path
import pandas as pd
import uuid
import datetime

NULL_CODE = 'NULL'
QR_CODE_URL = "localhost:5000/gallery/{}"

owners = None
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
            print('[#] Found QR Code: {}'.format(NULL_CODE))
            owners = None
        else:
            print('[+] Found QR Code: {}'.format(owners))
            owners = [x.decode('utf-8').split('/')[-1] for x in codes]
    else:
        print('[-] No QR Code found in image')
        if owners:

            for owner in owners:
                if owner not in galleries:
                    galleries[owner] = []
                galleries[owner].append(img_path)


def generate_qr_codes(guest_list):
    # create folder named curret date hour minute second
    date = str(datetime.datetime.now().strftime("%Y-%m-%d_%H:%M:%S"))
    folder_path = os.path.join(os.getcwd(), date)
    os.mkdir(folder_path)
    for guest in guest_list.keys():
        # generate qr code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=2,
        )
        qr.add_data(QR_CODE_URL.format(guest))
        qr.make(fit=True)
        img = qr.make_image()
        img.save(os.path.join(folder_path, guest + '.png'))


def generate_guest_list_from_csv(csv_file_path):
    data = pd.read_csv(csv_file_path)
    guests = {}
    for index, row in data.iterrows():
        guests[str(uuid.uuid4())] = {"first_name": row['first name'], "last_name": row['last name'], "email": row['email'], "phone": row['phone']}
    return guests

def generate_qr_codes_from_csv(csv_file_path):
    guests = generate_guest_list_from_csv(csv_file_path)
    generate_qr_codes(guests)

# generate_qr_codes(generate_guest_list_from_csv('guest_list.csv'))
generate_qr_codes_from_csv('guest_list.csv')

# scan_folder('.')
# print(galleries)    