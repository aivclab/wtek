cd ../wtek || exit
rm -r node_modules package-lock.json

cd ../wfundament || exit
rm -r node_modules package-lock.json
npm install
npm link

cd ../wtek || exit
npm link wfundament
npm install
npm link
