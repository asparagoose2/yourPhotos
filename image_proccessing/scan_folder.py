# dependencies:
# $ apt-get install libzbar0 libzbar-dev
# $ pip install zbarlight  # you can also use setuptools directly
from PIL import Image
from PIL import ImageDraw, ImageFont
import zbarlight
import qrcode
import os
from pathlib import Path
import pandas as pd
import uuid
import datetime
import pymongo
import os
from dotenv import load_dotenv


load_dotenv()

DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')

client = pymongo.MongoClient("mongodb+srv://{userName}:{password}@cluster0.qtek2.mongodb.net/yourPhotos?retryWrites=true&w=majority".format(userName=DB_USER, password=DB_PASSWORD))
db = client.yourPhotos
Events = db.events 
Galleries = db.galleries


NULL_CODE = 'NULL'
QR_CODE_URL = "localhost:5000/gallery/{}"

owners = None
galleries = {}

def scan_folder(folder):
    # scan all images in folder by date and time of creation
    paths = sorted(Path(folder).iterdir(), key=os.path.getmtime)
    # for img_name in os.listdir(folder):
    for img_name in paths:
        # img_path = os.path.join(folder, img_name)
        img_path = './' + str(img_name)
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
            owners = None
            print('[#] Found QR Code: {}'.format(NULL_CODE))
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
                Galleries.update_one({"id": owner}, {"$push": {"photos": img_path}})


def generate_qr_codes(guest_list,event_name):
    # create folder named curret date hour minute second
    date = str(datetime.datetime.now().strftime("%Y-%m-%d_%H:%M:%S"))
    folder_path = os.path.join(os.getcwd(), date)
    os.mkdir(folder_path)
    for guest in guest_list:
        # generate qr code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=15,
            border=4,
        )
        qr.add_data(QR_CODE_URL.format(guest["id"]))
        qr.make(fit=True)
        img = qr.make_image()
        width, height = img.size
        draw = ImageDraw.Draw(img)
        # font = ImageFont.truetype('ariel.ttf', 24)
        font = ImageFont.truetype("Ubuntu-B.ttf", 36)
        draw.text((40, height - 47), guest["first_name"].capitalize() + " " + guest["last_name"].capitalize(), font=font)
        draw.text((40, 0 + 5), event_name.title(), font=font)
        img.save(os.path.join(folder_path, guest["id"] + '.png'))


def generate_guest_list_from_csv(csv_file_path,event_id):
    data = pd.read_csv(csv_file_path)
    guests = []
    for index, row in data.iterrows():
        # guests[str(uuid.uuid4())] = {"first_name": row['first name'], "last_name": row['last name'], "email": row['email'], "phone": row['phone']}
        guests.append({"id": str(uuid.uuid4()), "first_name": row['first name'], "last_name": row['last name'], "email": row['email'], "phone": row['phone'],"photos":[], "event": event_id})
    return guests

def generate_qr_codes_from_csv(csv_file_path,event_name):
    event_id = str(uuid.uuid4())
    guests = generate_guest_list_from_csv(csv_file_path,event_id)
    generate_qr_codes(guests,event_name)
    guests_id = [guest["id"] for guest in guests]
    print(guests)
    Galleries.insert_many(guests)
    newEvent = {
        "event_id": event_id,
        "event_name": event_name,
        "event_date": datetime.datetime.now(),
        "event_owner": "test",
        "guests": guests_id
    }
    Events.insert_one(newEvent)

# generate_qr_codes(generate_guest_list_from_csv('guest_list.csv'))
# generate_qr_codes_from_csv('guest_list.csv', "our first event!")

# print(col.find_one({"guests": {"first_name":"koral"}}))

scan_folder('./2021-12-13_16:01:48')
# print(galleries)      