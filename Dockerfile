FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY . .

WORKDIR /app/jobtracker

# Install Maven temporarily
RUN apt-get update && apt-get install -y maven

# Generate wrapper properly
RUN mvn -N wrapper

# Now use wrapper
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

CMD ["java", "-jar", "target/*.jar"]