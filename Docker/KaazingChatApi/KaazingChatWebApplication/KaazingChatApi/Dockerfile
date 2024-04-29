#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base

USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release

WORKDIR /src
COPY ["KaazingChatApi/KaazingChatApi.csproj", "KaazingChatApi/"]
COPY ["Common/Common.csproj", "Common/"]
RUN dotnet restore "./KaazingChatApi/KaazingChatApi.csproj"
COPY . .
WORKDIR "/src/KaazingChatApi"
#COPY certs/wildcard.asuscomm.com.cer /usr/local/share/ca-certificates/
#RUN update-ca-certificates
RUN dotnet build "./KaazingChatApi.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./KaazingChatApi.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

#註解為docker方式,取消註解為docker compose方式
USER root
COPY --from=build /src/KaazingChatApi/certs /certs
COPY --from=build /src/KaazingChatApi/certs /usr/local/share/ca-certificates
RUN update-ca-certificates
ENV ASPNETCORE_Kestrel__Certificates__Default__Password=880816
ENV ASPNETCORE_Kestrel__Certificates__Default__Path=/certs/wildcard.asuscomm.com.pfx

ENTRYPOINT ["dotnet", "KaazingChatApi.dll"]