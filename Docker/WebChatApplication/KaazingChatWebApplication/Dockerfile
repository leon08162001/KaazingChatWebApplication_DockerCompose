#Depending on the operating system of the host machines(s) that will build or run the containers, the image specified in the FROM statement may need to be changed.
#For more information, please see https://aka.ms/containercompat

FROM mcr.microsoft.com/dotnet/framework/aspnet:4.8-windowsservercore-ltsc2019

# Next, this Dockerfile creates a directory for your application
RUN mkdir C:\KaazingChatWebApplication

# configure the new site in IIS.
RUN powershell -NoProfile -Command \
    Import-module IISAdministration; \
    New-IISSite -Name "ASPNET" -PhysicalPath C:\KaazingChatWebApplication -BindingInformation "*:1443:"

# This instruction tells the container to listen on port 1443. 
EXPOSE 1443

# The final instruction copies the site you published earlier into the container.
ADD bin/release/ /KaazingChatWebApplication