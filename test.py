import requests as R
import random, string

def randomword(length):
   letters = string.ascii_lowercase
   return ''.join(random.choice(letters) for i in range(length))


for i in range(0,50):
    email = randomword(random.randint(1,32)) + '@mail.com'

    d = {
        'email' : email,
        'password1' : '1',
        'password2' : '1'
    }

    r = R.post('http://127.0.0.1:4000/register?', data=d, allow_redirects=False)

    print(r.headers)      