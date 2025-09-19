# --------------------
# Stage 1: Build JAR
# --------------------
FROM maven:3.9.6-eclipse-temurin-21 AS builder
WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Build the JAR (skip tests for faster builds)
RUN mvn clean package -DskipTests

# --------------------
# Stage 2: Run JAR
# --------------------
FROM eclipse-temurin:21-jdk
WORKDIR /app

# Copy the JAR from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose port (Render will override with $PORT anyway)
EXPOSE 8080

# Run the application
ENTRYPOINT ["java","-jar","/app/app.jar"]