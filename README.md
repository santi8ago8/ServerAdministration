ServerAdministration
====================

requeriments: nodejs, mongodb, linux (ubuntu)  

instalation:  
copy this repo in one folder.


Change the required parameters in the file ServerAdministration

Copy the file ServerAdministration to   
/etc/init.d/ServerAdministration  

Run: 
    sudo /etc/init.d/ServerAdministration start --force
    sudo update-rc.d ServerAdministration defaults
    
Finally, reboot to be sure the ServerAdministration application starts automatically:

    sudo reboot

if you are interested in security creates the certificates ssl (creating_cert.txt)