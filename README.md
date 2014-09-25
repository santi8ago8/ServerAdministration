ServerAdministration
====================

requeriments: nodejs, mongodb, linux (ubuntu)  

instalation:  
copy this repo in one folder.




Add to the file /etc/rc.local (before exit)

    sudo ServerAdministration start
    


Change the required parameters in the file 

    /usr/local/bin/ServerAdministration
    #forever path
    export PATH=$PATH:/usr/local/bin
    #node modules path
    export NODE_PATH=$NODE_PATH:/usr/local/lib/node_modules
    #port to run server.
    PORT=3000
    #sourceDir
    SOURCEDIR=/home/santi8ago8/GitHub/ServerAdministration
then run:
```
npm install ServerAdministration
sudo ServerAdministration start 
```
    
Finally, reboot to be sure the ServerAdministration application starts automatically:

    sudo reboot

if you are interested in security creates the certificates ssl view file: creating_cert.txt