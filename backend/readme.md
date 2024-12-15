# Invest App Backend

This is the backend for the Invest App, which provides APIs for managing user portfolios and cryptocurrency data.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application Locally](#running-the-application-locally)
- [AWS Deployment](#aws-deployment)

## Prerequisites

Before you begin, ensure you have met the following requirements:
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [MongoDB](https://www.mongodb.com/try/download/community) (if not using Docker)
- [AWS Account](https://aws.amazon.com/)
- [GitHub Account](https://github.com/)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/invest-app.git
   cd invest-app/backend
2. Install the dependencies:
    ```bash
    npm install
3. Create a .env file and copy the environment variable from .env.example

## Running the Application Locally
To run the application locally, you can use Docker Compose:

1. Start the application and MongoDB:
    ```bash 
    docker-compose up
2. The application will be available at http://localhost:3000.
3. To stop the application, press CTRL + C in the terminal where Docker Compose is running.

# AWS Deployment
This project uses GitHub Actions for CI/CD to deploy the application to AWS.

## Steps for AWS Deployment
1. Set Up AWS Credentials:
- Create an IAM user in your AWS account with permissions to access ECS and ECR.
- Note down the AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY.
2. Configure GitHub Secrets:
- Go to your GitHub repository.
- Navigate to Settings > Secrets and variables > Actions.
- Add the following secrets:
  - AWS_ACCESS_KEY_ID: Your AWS access key ID.
  - AWS_SECRET_ACCESS_KEY: Your AWS secret access key.
3. Dockerfile:
- Ensure you have a Dockerfile in the root of your backend directory. This file is - used to build the Docker image for your application.
4. GitHub Actions Workflow:
- The deployment process is defined in the .github/workflows/deploy.yml file. This workflow is triggered on every push to the main branch.
- It performs the following steps:
 - Checks out the code.
 - Configures AWS credentials.
 - Logs in to Amazon ECR.
 - Builds, tags, and pushes the Docker image to ECR.
 - Updates the ECS service to deploy the new image.
5. Deploying the Application:
- Push your changes to the main branch of your GitHub repository:
    ```bash 
    git add .
    git commit -m "Deploying to AWS"
    git push origin main
6. Accessing the Application:
- Once the deployment is complete, your application will be running on AWS ECS. You can access it using the public URL provided by your ECS service.