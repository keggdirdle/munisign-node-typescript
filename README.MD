https://roboticsbackend.com/make-a-raspberry-pi-3-program-start-on-boot/

/lib/systemd/system

Enable the systemd service
If you don’t do anything else, well… Nothing will happen. You need to enable the service so systemd will run it on boot.

$ sudo systemctl daemon-reload
$ sudo systemctl enable ensure-file-exists.service 
Created symlink /etc/systemd/system/multi-user.target.wants/ensure-file-exists.service -> /lib/systemd/system/ensure-file-exists.service.
Once done, your service will be started on every Raspberry Pi boot!

To check if your service is enabled, use this command:

$ sudo systemctl list-unit-files | grep ensure-file-exists
ensure-file-exists.service             enabled
This tells you that 1. The “ensure-file-exists” service exists, and 2. it is enabled.

If you want to disable the service, simply do:

$ sudo systemctl disable ensure-file-exists.service 
Removed /etc/systemd/system/multi-user.target.wants/ensure-file-exists.service.

To fun from command (from app directory): node /dist.js agency={agency} defaults to SF


make .cc files
install express: npm install express

run
http://raspberrypi.local:8088/

![alt text](https://i.imgur.com/uhi8H3N.jpg)