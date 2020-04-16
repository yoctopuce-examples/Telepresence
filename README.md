
Telepresence
============

This is a simple Electron application that lists detect if a person is in front of the 
computer screen and change the color of the Yocto-Color-V2 leds accordingly.

See more on [yoctopuce.com](https://www.yoctopuce.com/EN/article/simulating-the-presence-of-a-colleague)


## Test the application

You first need to install all required npm packages with the following command
````
npm install
````

Then you can test the application with the following command.
````
npm start
````

**Note for Linux users:**
By default, Linux access rights for USB device are read only for all users, except root. So you need to run the application as root or to install a udev rule.
To start the electron application, you need to use the following command
````
sudo npm run start_as_root
````

## Package the application

To build a distributable package, you can run one of the  following commands:
``npm run package-mac``, ``npm run package-win``, ``npm run package-lin-x64``, 
``npm run package-lin-ia32``, ``npm run package-lin-arm``, ``npm run package-lin-arm64``.

Each command creates a folder with the application ready for distribution.
