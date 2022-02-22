cd ..\wtek || exit /b
rd -r ".\node_modules\"
del package-lock.json


cd ..\wfundament || exit /b
rd -r ".\node_modules\"
del package-lock.json
call npm install
call npm link

cd ..\wtek || exit /b
call npm link wfundament
call npm install
call npm link
