# escape=`
ARG REPO=mcr.microsoft.com/dotnet/framework/aspnet
FROM $REPO:4.8-20240213-windowsservercore-ltsc2019

ENV hostname "leonpc.asuscomm.com"
ENV pfxpw "880816"

WORKDIR /inetpub/wwwroot
#RUN mkdir -p C:\inetpub\wwwroot\KaazingChatWebApplication

COPY certs/wildcard.asuscomm.com.pfx /wildcard.asuscomm.com.pfx
COPY certs/ca.cer /ca.cer
COPY certs/Intermediate.cer /Intermediate.cer


ADD KaazingChatWebApplication C:\inetpub\wwwroot\KaazingChatWebApplication
COPY etc/hosts C:\Windows\System32\drivers\etc\hosts


SHELL [ "powershell" ]

RUN Import-Module IISAdministration; `
    $PfxPW = ConvertTo-SecureString -String \"${env:pfxpw}\" -Force -AsPlainText; `
    Import-Certificate -FilePath C:\ca.cer -CertStoreLocation cert:\LocalMachine\Root; `
    Import-Certificate -FilePath C:\Intermediate.cer -CertStoreLocation cert:\LocalMachine\CA; `
    $cert = Import-PfxCertificate -FilePath C:\wildcard.asuscomm.com.pfx -CertStoreLocation cert:\LocalMachine\My -Password $PfxPW; `
    Remove-Item C:\ca.cer; `
    Remove-Item C:\Intermediate.cer; `
    Remove-Item C:\wildcard.asuscomm.com.pfx; `
    $newAppPool = New-WebAppPool -Name "KaazingChatWebApplication" -Force; `
    New-IISSiteBinding -Name \"Default Web Site\" -Protocol https -BindingInformation \"*:1443:${env:hostname}\" -SslFlag Sni -CertificateThumbPrint $cert.Thumbprint -CertStoreLocation "cert:\LocalMachine\My"; `
    New-IISSiteBinding -Name \"Default Web Site\" -Protocol http -BindingInformation "192.168.177.127:80:"; `
    New-IISSiteBinding -Name \"Default Web Site\" -Protocol http -BindingInformation "127.0.0.1:80:"; `
    New-IISSiteBinding -Name \"Default Web Site\" -Protocol http -BindingInformation "*:80:localhost"; `
    New-WebApplication -Name "KaazingChatWebApplication" -Site \"Default Web Site\" -PhysicalPath "C:\inetpub\wwwroot\KaazingChatWebApplication" -ApplicationPool "KaazingChatWebApplication" -Force;

EXPOSE 80
EXPOSE 1443