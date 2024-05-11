# Pull base image
#FROM centos:centos7.9.2009
#FROM centos:8.4.2105
FROM redhat/ubi8:8.8-1067.1696517599

MAINTAINER Kaazing Docker Maintainers, contact via github issues: https://github.com/kaazing/gateway.docker/issues

# for centos 8
RUN cd /etc/yum.repos.d/
#RUN sed -i 's/mirrorlist/#mirrorlist/g' /etc/yum.repos.d/CentOS-*
#RUN sed -i 's|#baseurl=http://mirror.centos.org|baseurl=http://vault.centos.org|g' /etc/yum.repos.d/CentOS-*
# for centos 8

RUN yum install -y java-11

# pub   2048R/385B4D59 2015-07-01 [expires: 2017-12-08]
#       Key fingerprint = F8F4 B66E 022A 4668 E532  DAC0 3AA0 B82C 385B 4D59
# uid                  Kaazing build <build@kaazing.com>
# sub   2048R/26C0219B 2015-07-01 [expires: 2017-12-08]
#RUN gpg --keyserver ha.pool.sks-keyservers.net --recv-keys F8F4B66E022A4668E532DAC03AA0B82C385B4D59

ENV KAAZING_GATEWAY_VERSION 5.8.22
ENV KAAZING_GATEWAY_URL https://cdn.kaazing.com/releases/enterprise.gateway/${KAAZING_GATEWAY_VERSION}/kaazing-enterprise-gateway-${KAAZING_GATEWAY_VERSION}.tar.gz
#ENV KAAZING_GATEWAY_URL https://oss.sonatype.org/content/repositories/releases/org/kaazing/gateway.distribution/${KAAZING_GATEWAY_VERSION}/gateway.distribution-${KAAZING_GATEWAY_VERSION}.tar.gz

# Set Working Dir
WORKDIR /kaazing-gateway

# Get the latest stable version of gateway
RUN curl -fSL -o gateway.tar.gz $KAAZING_GATEWAY_URL \
	&& curl -fSL -o gateway.tar.gz.asc ${KAAZING_GATEWAY_URL}.asc \
	&& tar -xvf gateway.tar.gz --strip-components=1 \
	&& rm gateway.tar.gz*

ADD certs/*.* /etc/secret/
ADD config/*.* /kaazing-gateway/conf/
ADD lib/*.* /kaazing-gateway/lib/

USER root
#RUN keytool -keystore cacerts -storepass "880816" -noprompt -trustcacerts -importcert -alias wildcard.asuscomm -file /etc/secret/wildcard.asuscomm.com.cer
#RUN keytool -import -file /etc/secret/wildcard.asuscomm.com.cert.pem -alias wildcard.asuscomm -keystore cacerts -trustcacerts -storepass "880816" -noprompt
COPY certs/wildcard.asuscomm.com.cer /usr/local/share/ca-certificates/
RUN yum update -y ca-certificates

# By default, Java uses /dev/random to gather entropy data for cryptographic
# needs. However, using /dev/random can cause delays during Gateway startup,
# especially in virtualized environments. /dev/urandom does not require
# collection of entropy data in subsequent runs.
# See: https://github.com/kaazing/gateway/issues/167
ENV GATEWAY_OPTS="-Xmx512m -Djava.security.egd=file:/dev/urandom"

# add new files to the path
ENV PATH=$PATH:/kaazing-gateway/bin

# Expose Ports
EXPOSE 8001 9001

# Define default command
CMD ["gateway.start"]

