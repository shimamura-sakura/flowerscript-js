import hashlib

"""
The Chinese translation group 'Academia Sancti Angraeci' (圣彗星兰学院) have
their script files and filenames encrypted. Texts are encoded with GBK.

Here are the encryption method they used:
"""

def name_step1(s):
    return hashlib.md5(s.lower().encode('ascii')).hexdigest()[-12:][::-1]

def name_step2(s):
    chars = []
    for i, ch in enumerate(s):
        if '0' <= ch <= '9':
            chars.append(chr((ord(ch) + i + 1) %  9 + ord('0'))) # 10 -> 9
        if 'a' <= ch <= 'z':
            chars.append(chr((ord(ch) + i + 1) % 25 + ord('a'))) # 26 -> 25
    return ''.join(chars)

def encrypt_name(s):
    s = step1(s)
    s = step2(s)
    return s

assert encrypt_name('start.s') == '856728hhj7kk'

"""
Their new script.iga should be named data00.iga.
You should extract them with files xor'd with 0xFF before using code below.
"""

def decrypt_file(data):
    for i in range(len(data)):
        data[i] ^= (0x5c * (i + 1)) & 0xFF
    return data

with open('856728hhj7kk', 'rb') as fp:
    data = bytearray(fp.read())