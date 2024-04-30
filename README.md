# KaazingChatWebApplication_DockerCompose
網頁聊天室&amp;傳檔(使用docker containers)

0.需先安裝Docker desktop for windows，安裝後須執行

1.將docker-compose.yml的內容裡包含leonpc的字樣改成另外的名稱(如maxpc)

2.將Docker\Kaazing Websocket\kaazing.gateway.docker\config 資料夾下的 gateway-config.xml的內容裡包含leonpc的字樣改成另外的名稱(如maxpc)，主要在JMS service 區塊

3.將Docker\KaazingChatApi\KaazingChatWebApplication\KaazingChatApi 資料夾下的 appsettings.json的內容裡包含leonpc的字樣改成另外的名稱(如maxpc)

4.將Docker\KaazingChatApi\KaazingChatWebApplication\KaazingChatApi 資料夾下的 common.ini的內容裡包含leonpc1的字樣改成另外的名稱(如maxpc1)

5.使用MMC加入憑證管理員後，將CertManager 資料夾下的ca.cer、Intermediate.cer、wildcard.asuscomm.com.pfx 分別匯入到受信任的根憑證授權單位、中繼憑證授權單位、個人憑證管理區

6.將Docker\KaazingChatApi\KaazingChatWebApplication\KaazingChatWebApplication 資料夾建構為IIS web應用程式，port:1443，https，憑證等設定

7.將Docker\KaazingChatApi\KaazingChatWebApplication\KaazingChatWebApplication\lib\client\javascript 資料夾下的 WebChat.js的內容裡包含leonpc的字樣改成另外的名稱(如maxpc),

8.將Docker\KaazingChatApi\KaazingChatWebApplication\KaazingChatWebApplication 資料夾下的 Web.config的內容裡包含leonpc的字樣改成另外的名稱(如maxpc)，common.ini的內容裡包含leonpc1的字樣改成另外的名稱(如maxpc1)

9.修改C:\Windows\System32\drivers\etc 資料夾下的 hosts檔 加入IP和domain name對應
