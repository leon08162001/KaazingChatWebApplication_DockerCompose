#FROM centos:7.7.1908
#FROM centos:8.4.2105
FROM redhat/ubi8:8.8-1067.1696517599

MAINTAINER Ilya Lysenko <lysenko.ilya@gmail.com>

RUN mkdir -p /usr/share/man/man1

# for centos 7
#RUN yum upgrade -y && \
#    yum install bc wget unzip java-11 -y
# for centos 7

# for centos 8
RUN cd /etc/yum.repos.d/
#RUN sed -i 's/mirrorlist/#mirrorlist/g' /etc/yum.repos.d/CentOS-*
#RUN sed -i 's|#baseurl=http://mirror.centos.org|baseurl=http://vault.centos.org|g' /etc/yum.repos.d/CentOS-*

#RUN yum upgrade -y && \
 RUN yum install bc wget unzip java-11 -y
# for centos 8

RUN groupadd -r tibgrp -g 433 && \
    useradd -u 431 -r -m -g tibgrp -d /home/tibusr -s /bin/bash -c "TIBCO Docker image user" tibusr && \
    chown -R tibusr:tibgrp /home/tibusr && \
    mkdir /opt/tibco && \
    chown -R tibusr:tibgrp /opt/tibco && \
    mkdir /tmp/install && \
    mkdir -p /tmp/tibco/ems/datastore && \
    chown -R tibusr:tibgrp /tmp/tibco/ems/datastore && \
    mkdir -p /opt/tibco/ems/config && \
    chown -R tibusr:tibgrp /opt/tibco/ems/config

ADD config/*.conf /opt/tibco/ems/config/
ADD package/TIB_ems*_linux_x86_64.zip* /tmp/install/
ADD certs/*.pem /etc/secret/

RUN cd /tmp/install/ && cat TIB_ems*_linux_x86_64.zip* > TIB_ems_linux_x86_64.zip && \
    unzip /tmp/install/TIB_ems_linux_x86_64.zip -d /tmp/install/tibems/
RUN cd /tmp/install/tibems/TIB_ems* && \
    yum install -y rpm/*.rpm
RUN rm -rf /tmp/install/

USER tibusr
ENV TZ=Asia/Taipei
EXPOSE 7222 7243
ENTRYPOINT ["/opt/tibco/ems/8.5/bin/tibemsd", "-config", "/opt/tibco/ems/config/tibemsd.conf"]