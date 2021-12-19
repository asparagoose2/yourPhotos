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
import shutil

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

    paths_and_dates = {}
    paths = []
    for file in os.listdir(folder):
        try:
            # check file extension
            if file.endswith(".jpg") or file.endswith(".jpeg"):
                path = os.path.join(folder, file)
                paths.append(path)
                img = Image.open(path)
            # check image is jpeg
                paths_and_dates[path] = img._getexif()[36867]
                exif = img._getexif()
                if exif:
                    paths_and_dates[path] = exif[36867]
        except:
            print('[-] Error opening image: {}'.format(path))

    sorted_paths = sorted(paths, key=paths_and_dates.get)

    for img_path in sorted_paths:
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


def generate_qr_codes(guest_list,event_name,event_id):
    # create folder named curret date hour minute second
    # date = str(datetime.datetime.now().strftime("%Y-%m-%d_%H:%M:%S"))
    folder_path = os.path.join(os.getcwd() + "/public/qr_codes", event_id)
    # os.mkdir(folder_path)
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

    # archive folder to zip file
    # shutil.make_archive(folder_path, 'zip', folder_path)
    # shutil.move(folder_path + '.zip', folder_path + '/qr_codes.zip')


def generate_guest_list_from_csv(csv_file_path,event_id):
    data = pd.read_csv(csv_file_path)
    guests = []
    for index, row in data.iterrows():
        guests.append({"id": str(uuid.uuid4()), "first_name": row['first name'], "last_name": row['last name'], "email": row['email'], "phone": row['phone'],"photos":[], "event": event_id})
    return guests

def generate_qr_codes_from_csv(csv_file_path,event_id):
    print("[+] Generating QR codes from CSV")
    print("event_id: {}".format(event_id))
    print("event_id type {}".format(type(event_id)))
    print("csv_file_path: {}".format(csv_file_path))
    event = Events.find_one({"event_id": event_id})
    print("event: {}".format(event))    
    event_name = event["event_name"]
    guests = generate_guest_list_from_csv(csv_file_path,event_id)
    generate_qr_codes(guests,event_name,event_id)
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
    Events.find_one({"event_id": event_id})
    # print(event_id)
    return event_id

def create_event_and_qr(csv_file,event_name,event_date,event_owner=None,guests=[]):
    event_id = create_event(event_name,event_date,event_owner,guests)
    generate_qr_codes_from_csv(csv_file,event_id)


def get_all_photos_from_gallery(gallery_id):
    gallery = Galleries.find_one({"id": gallery_id})
    return gallery["photos"]

    
def main():
    args = sys.argv
    if len(args) == 1:
        print("[-] No arguments provided")
        os.mkdir("./tests")
        return
    if args[1] == 'scan':
        print("[+] Scanning folder")
        print("lala" ,args[0], args[1] ,args[2],"  ", os.getcwd())

        # check if folder exists
        if not os.path.exists(args[2]):
            print("[-] Folder does not exist")
            sys.stdout.flush()
            return
        else:
            scan_folder(args[2])
            return
    elif args[1] == 'create':
        generate_qr_codes_from_csv(args[2],args[3])
        return
    elif args[1] == 'create_random_qr':
        generate_n_unnamed_qr_codes(int(args[2]),args[3])
        return
    elif args[1] == 'create_event':
        if len(args) == 4:
            event_id = create_event(args[2],args[3])
            print(event_id)
            
        elif len(args) == 5:
            event_id = create_event(args[2],args[3],args[4] if args[4] else None,args[5] if args[5] else [])
            print("[+] Event created with id: {}".format(event_id))
        else:
            print("[-] Invalid number of arguments")

    elif args[1] == 'create_event_and_qr':
        if len(args) == 5:
            create_event_and_qr(args[2],args[3],args[4])
            print("done")
            
        elif len(args) == 6:
            event_id = create_event_and_qr(args[2],args[3],args[4],args[5],args[6])
            print("[+] Event created with id: {}".format(event_id))
        else:
            print("[-] Invalid number of arguments")
                
        return
    elif args[1] == 'help' or args[1] == '-h':
        print("[+] Available commands:")
        print("[+] scan <folder_path>")
        print("[+] create <csv_file_path> <event_id>")
        print("[+] create_n <n> <event_id>")
        print("[+] create_event <event_name> <event_date> <event_owner> <guests>")
        print("[+] help")
        return

if __name__ == '__main__':
    main()