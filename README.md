ServerAdministration
====================

Demo - [http://youtu.be/VlACrTlJDMQ](http://youtu.be/VlACrTlJDMQ)  

requeriments: nodejs, mongodb, linux (ubuntu)  

instalation:  
copy this repo in one folder.



Copy the script to service folder:
    sudo cp ./bin/ServerAdministration /etc/init.d/ServerAdministration    


Change the required parameters in the file 
(/etc/init.d/ServerAdministration)

	#forever path
	export PATH=$PATH:~/.npm_global/bin
	#node modules path
	export NODE_PATH=$NODE_PATH:/home/santi8ago8/.npm_global/node_modules
	#port to run server.
	PORT=3088
	#sourceDir
	SOURCEDIR=/home/santi8ago8/GitHub/ServerAdministration

	forever_executable=/home/santi8ago8/.npm_global/bin/forever


then run:

    npm install ServerAdministration
    sudo apt-get install imagemagick
    sudo apt-get install daemon
    sudo update-rc.d ServerAdministration defaults

    
Finally, reboot to be sure the ServerAdministration application starts automatically:

    sudo reboot

if you are interested in security creates the certificates ssl view file: creating_cert.txt
