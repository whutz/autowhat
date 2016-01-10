**Installing Autowhat**

```
git clone https://whutz@bitbucket.org/whutz/autowhat.git

cd autowhat
npm install
```
**Configuring Autowhat**

Fill in relevant settings in config.json

- username = your what.cd username
- password = your what.cd password
- path = your what.cd torrent authkey and password. This can be found with the following steps:

Let's say the url below is what is generated when you download a torrent:
- https://what.cd/torrents.php?action=download&id=123456&authkey=abcd12345&torrent_pass=abcd12345

The expected value would be /torrents.php?action=download&id=123456&authkey=abcd12345&torrent_pass=abcd12345

**Starting autowhat**
```
node topten.js
```
