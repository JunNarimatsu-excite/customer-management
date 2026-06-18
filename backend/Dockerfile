FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ADD https://github.com/microsoft/ApplicationInsights-Java/releases/download/3.7.8/applicationinsights-agent-3.7.8.jar /app/applicationinsights-agent.jar
EXPOSE 8080
ENTRYPOINT ["java","-javaagent:/app/applicationinsights-agent.jar","-jar","app.jar"]