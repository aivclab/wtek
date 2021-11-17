cd ..\wtek || exit /b
rd -r "node_modules"
npm install
npm link wfundament
npm link
