pipeline {
    agent any
    environment {
        LOCAL_REGISTRY = "localhost:5000"  // Replace with your local registry URL
    }
    stages {
        stage('Checkout') {
            steps {
                script {
                    echo "Checking out the source code"
                    checkout scm
                    echo "Checkout Success"
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    echo "Building Docker images using docker-compose"

                    // Ensure Docker Compose is installed
                    sh 'docker-compose -v' // This will fail if Docker Compose isn't installed

                    // Build images for backend, frontend, and mongodb using docker-compose with compose.yaml
                    sh 'docker-compose -f compose.yaml build'
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    echo "Running tests using Robot Framework"

                    // Ensure the services are up before running tests
                    sh 'docker-compose -f compose.yaml up -d'  // Start services in detached mode

                    // Run Robot Framework tests after services are running
                    sh 'robot path/to/your/testfile.robot'  // Replace with the path to your Robot test file

                    // Optionally, you can bring down the services after tests
                    sh 'docker-compose -f compose.yaml down'
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up...'
            // Clean up any resources (e.g., remove containers, networks, volumes) after the build
            sh 'docker-compose -f compose.yaml down --volumes --remove-orphans'
        }
        success {
            echo 'Build and tests passed successfully!'
        }
        failure {
            echo 'There were issues with the build or tests.'
        }
    }
}
