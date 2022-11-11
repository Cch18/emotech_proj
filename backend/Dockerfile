FROM tomcat:8.5-jdk11-openjdk-slim
ADD build/libs/backend-0.0.1-SNAPSHOT.war /usr/local/tomcat/webapps/
EXPOSE 8080
CMD ["catalina.sh", "run"]