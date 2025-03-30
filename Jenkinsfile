pipeline {
    agent any
    environment {
        LOCAL_REGISTRY = "localhost:5000" // Replace with your local registry URL
    }
    stages {
        stage('Checkout') {
            print "Checkout"
            checkout {
                [
                    $class: 'GitSCM',
                    branches: [[name: '*/main']], // Replace with your branch name
                    userRemoteConfigs: [ [
                        credentialsId: '7b8a8548-fec8-4a17-9334-1c84556d634b', // Replace with your credentials ID
                        url: 'https://github.com/BitterSweet7/frontbacknext.git'
                    ]

                    ]
                ]
                print "Checkout Success"
            }
        }
         stage('Build') {
            steps {
                script {
                    echo "Building Docker images using docker-compose"
                    
                    // Ensure Docker Compose is installed
                    sh 'docker-compose -v'

                    // Build images for backend, frontend, and mongodb
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
}
