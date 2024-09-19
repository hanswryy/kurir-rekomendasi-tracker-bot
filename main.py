import requests

resi = input("Masukkan nomor resi: ")

url_target = "https://orchestra.tokopedia.com/orc/v1/microsite/tracking?airwaybill=" + resi

headers = {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'dnt': '1',
    'origin': 'https://www.tokopedia.com',
    'priority': 'u=1, i',
    'referer': 'https://www.tokopedia.com/kurir-rekomendasi?awb=' + resi,
    'sec-ch-ua': '"Not;A=Brand";v="24", "Chromium";v="128"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
}

req = requests.get(url_target, headers=headers)
data = req.json()

if data['status'] == 200:
    # get tracking data
    tracking_data = data['data'][0]['tracking_data']
    # size of tracking data
    print(len(tracking_data))
    print(tracking_data[0])