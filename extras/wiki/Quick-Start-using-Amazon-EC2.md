**Update: this tutorial is no longer relevant to this current BrowserQuest fork. It may work with minimal changes for deploying the original Mozilla release of BrowserQuest.**

I'm fairly new to all of this and after a bit of looking around and messing with stuff, I managed to get vanilla BrowserQuest installed and working fine on Amazon EC2 hosting. You can try this yourself for free since Amazon doesn't charge for low-tier instances. These directions are for an absolute novice and there are probably much better methods. Chances are if you're reading this, you probably don't need this help, but I wanted to create this just in case there was another person lost like me.  

## Part One:
Setup Amazon EC2 hosting. Launch an EC2 instance using Ubuntu 12.04.1. Create an elastic IP for it (in the sidebar under Network&Security) and assign it to this instance. Then go into security groups and select the Inbound Traffic tab. Select an "All TCP" option and leave the IP addresses as zeroes. This is probably insecure, but it's the most fool-proof way to make it work. 

## Part Two:
SSH into your newly created instance. Amazon has directions on how to do this. Once your shell is connected and waiting, type the following:

sudo su

apt-get update

apt-get upgrade

apt-get install -y curl build-essential pkg-config bison git npm nodejs

git clone https://github.com/browserquest/BrowserQuest.git

npm install underscore log bison websocket websocket-server sanitizer memcache

cd BrowserQuest/client

npm install -g http-server

cp -r ../shared .

cd config

curl http://169.254.169.254/latest/meta-data/public-ipv4 > public.ip

sed -e "s/Set production websocket host here/`cat public.ip`/g" config_build.json-dist > config_build.json

sed -e "s/Set local dev websocket host here/`cat public.ip`/g" config_local.json-dist > config_local.json

cd ../..

screen -S client -dm bash -c "cd client;http-server"

screen -S server -dm bash -c "node server/js/main.js"

## Details
In very simple terms, there's a couple things going on here. The above lines you enter into your shell install all the necessary software used and downloads the files off GitHub. There are two separate parts of BrowserQuest: the client side and the server side. The client side is served by node's http-server and is accessible in your web browser at your.elastic.ip.address:8080/index.html (assuming you used 8080, which http-server does by default). The server side status can be seen at your.elastic.ip.address:8000/status (assuming you left the port at 8000 in the config files). It will have an array of the instances that exist and the number of players in each instance. 

You will likely run into problems trying to use this guide with any other fork of BrowserQuest since they all seem to have minor issues that most people will run into. At least with this you get a starting point of something that works.

## Credits
Dirk (dirkk0) was extremely helpful both in his contributions to this guide on GitHub and also in emailing with me directly. Most of this information came from him, I'm simply putting it into slightly simpler (and more verbose) terms. His original article, which also includes links to his updated instructions at the end, can be found here: 
http://web3dblog.wordpress.com/2012/03/30/installing-browserquest-on-amazon-ec2/