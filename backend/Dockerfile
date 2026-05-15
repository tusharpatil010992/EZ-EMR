FROM eclipse-temurin:17-jdk AS builder
WORKDIR /app
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
RUN ./mvnw dependency:resolve -q
COPY src ./src
RUN ./mvnw package -DskipTests

FROM eclipse-temurin:17-jre AS runner
WORKDIR /app
COPY --from=builder /app/target/emr-backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
