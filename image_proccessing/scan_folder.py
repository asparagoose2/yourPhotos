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
import sys


load_dotenv()

DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
NULL_CODE = os.getenv('NULL_CODE') #'NULL'
QR_CODE_URL = os.getenv('QR_CODE_URL') # "localhost:5000/gallery/{}"


client = pymongo.MongoClient("mongodb+srv://{userName}:{password}@cluster0.qtek2.mongodb.net/yourPhotos?retryWrites=true&w=majority".format(userName=DB_USER, password=DB_PASSWORD))
db = client.yourPhotos
Events = db.events 
Galleries = db.galleries


owners = None
galleries = {}

def scan_folder(folder):
    # scan all images in folder by date and time of creation
    paths_and_dates = {path: Image.open(path)._getexif()[36867] for path in Path(folder).iterdir()}
    paths = sorted(Path(folder).iterdir(), key=paths_and_dates.get)

    # for img_name in os.listdir(folder):
    for img_name in paths:
        img_path = os.path.join(folder, img_name.name)
        # img_path = './' + str(img_name)
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
            border=5,
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
        img.save(os.path.join(folder_path, guest["id"] +'_'+guest["first_name"]+'_'+guest["first_name"] + '.png'))


def generate_guest_list_from_csv(csv_file_path,event_id):
    data = pd.read_csv(csv_file_path)
    guests = []
    for index, row in data.iterrows():
        guests.append({"id": str(uuid.uuid4()), "first_name": row['first name'], "last_name": row['last name'], "email": row['email'], "phone": row['phone'],"photos":[], "event": event_id})
    return guests

def generate_qr_codes_from_csv(csv_file_path,event_id):
    event = Events.find_one({"event_id": event_id})
    event_name = event["event_name"]
    guests = generate_guest_list_from_csv(csv_file_path,event_id)
    generate_qr_codes(guests,event_name)
    guests_id = [guest["id"] for guest in guests]
    print(guests)
    Galleries.insert_many(guests)
    Events.update_one({"event_id": event_id}, {"$push": {"guests": guests_id}})

def generate_n_unnamed_qr_codes(n,event_id):
    event = Events.find_one({"event_id": event_id})
    event_name = event["event_name"]
    guests = []
    for i in range(n):
        guests.append({"id": str(uuid.uuid4()), "first_name": "", "last_name": "", "email": "", "phone": "","photos":[], "event": event_id})
    generate_qr_codes(guests,event_name)
    guests_id = [guest["id"] for guest in guests]
    Galleries.insert_many(guests)
    Events.update_one({"event_id": event_id}, {"$push": {"guests": guests_id}})


def create_event(event_name,event_date,event_owner=None,guests=[]):
    event_id = str(uuid.uuid4())
    newEvent = {
        "event_id": event_id,
        "event_name": event_name,
        "event_date": event_date,
        "event_owner": event_owner,
        "guests": guests
    }
    Events.insert_one(newEvent)
    return event_id


def get_all_photos_from_gallery(gallery_id):
    gallery = Galleries.find_one({"id": gallery_id})
    return gallery["photos"]

    
def main():
    args = sys.argv
    if len(args) == 1:
        print("[-] No arguments provided")
        return
    if args[1] == 'scan':
        scan_folder(args[2])
    elif args[1] == 'create':
        generate_qr_codes_from_csv(args[2],args[3])
    elif args[1] == 'create_n':
        generate_n_unnamed_qr_codes(int(args[2]),args[3])
    elif args[1] == 'create_event':
        event_id = create_event(args[2],args[3],args[4] if args[4] else None,args[5] if args[5] else [])
        print("[+] Event created with id: {}".format(event_id))
    elif args[1] == 'help' or args[1] == '-h':
        print("[+] Available commands:")
        print("[+] scan <folder_path>")
        print("[+] create <csv_file_path> <event_id>")
        print("[+] create_n <n> <event_id>")
        print("[+] create_event <event_name> <event_date> <event_owner> <guests>")
        print("[+] help")

if __name__ == '__main__':
    main()

# generate_qr_codes(generate_guest_list_from_csv('guest_list.csv'))
# generate_qr_codes_from_csv('guest_list.csv', create_event("our first event!", "2020-01-01"))
# generate_qr_codes_from_csv('guest_list.csv', "b9b57c1f-6628-4e66-96b8-b89d336627c5")

# print(col.find_one({"guests": {"first_name":"koral"}}))
# print(get_all_photos_from_gallery("a896db65-9282-4ea9-aa7a-14a7555a7633"))
# scan_folder('./Sample_images')
# print(galleries)      

