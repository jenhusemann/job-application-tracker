FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY . .

WORKDIR /app/jobtracker

# Install Maven temporarily
RUN apt-get update && apt-get install -y maven

# Generate wrapper properly
RUN mvn -N org.apache.maven.plugins:maven-wrapper-plugin:wrapper

# Now use wrapper
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

CMD ["java", "-jar", "target/jobtracker-0.0.1-SNAPSHOT.jar"]