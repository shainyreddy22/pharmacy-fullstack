# Build the backend JAR file
mvn clean package -DskipTests

# Build and push Docker image (optional)
# docker build -t pharmacy-backend .
# docker push your-docker-registry/pharmacy-backend:latest