# [Kalamandir](https://github.com/Girish4489/kalamandir/)

<div align="center">

![KLM](/src/app/klm.png)

</div>

## Getting Started

> Download npm dependencies

```bash
pnpm install
# or
npm install
# or
yarn install
# or
bun install
```

> Files

```bash
# create .env in root(/) directory
# MONGO_ONLINE_URI=mongodb+srv://<username>:<password>@cluster0.zawyfkq.mongodb.net/
MONGO_URI=mongodb://localhost:27017/ # for local mongo server
TOKEN_SECRET=<set-your-secret-string> # keep same for local and mongo
DOMAIN=http://localhost:3000
#need to have gmail and credentials to send the mails
GMAIL=<use your mail>
GMAILPASSWORD= set_password_read_below
DBNAME= # set desired database name
DBTYPE=offline # online based on where you want store uncomment MONGO_ONLINE_URI
```

[Set Gmail password for SMTP](https://support.google.com/mail/answer/185833)

> First, run the development server:

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the GNU Lesser General Public License v2.1 - see the [LICENSE](LICENSE) file for details.
