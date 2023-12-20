# [Kalamandir](https://github.com/Girish4489/kalamandir/)

<center>

![KLM](/src/app/klm.png)

</center>

## Getting Started

> Download npm dependencies

```bash
npm install
# or
yarn install
# or
bun install
```

> Packages:

```bash
# required packages
npm i axios bcryptjs jsonwebtoken nodemailer react-hot-toast mongoose
# UI packages
npm i -D daisyui@latest
```

> Files

```bash
# create .env in root(/) directory
#MONGO_URI=mongodb+srv://<username>:<password>@cluster0.zawyfkq.mongodb.net/
MONGO_URI=mongodb://localhost:27017/ # for local mongo server
TOKEN_SECRET=<set-your-secret-string> # keep same for local and mongo
DOMAIN=http://localhost:3000
#need to have gmail and credentials to send the mails
GMAIL=<use your mail>
GMAILPASSWORD= set_password_read_below
DBNAME= # set desired database name
DBTYPE= # online or offline based on where you want store
```

[Set Gmail password for SMTP](https://support.google.com/mail/answer/185833)

> Docker

```bash
# add to .env
DOCKER_USERNAME= # optional
DOCKER_PASSWORD= # optional
DOCKER=true

# Run
docker-compose up -d --build # for build and run
docker-compose up # to run the application
```

> First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [GitHub repository](https://github.com/Girish4489/kalamandir/) - your feedback and contributions are welcome!

## Credits

- [Authentication](https://youtube.com/playlist?list=PLRAV69dS1uWR7KF-zV6YPYtKYEHENETyE&si=fWih85bZai-wrBHY) and verification ideas by [Hitesh Choudhary](https://www.youtube.com/@HiteshChoudharydotcom)
