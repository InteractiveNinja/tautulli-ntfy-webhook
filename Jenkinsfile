pipeline {

    environment {
        imagename = "ninja/plex-ntfy"
        registryCredential = 'jenkins-nexus'
        dockerImage = ''
    }

    agent any

    stages {
        stage("Build Project") {
            steps {
                nodejs('node') {
                    sh 'npm ci'
                    sh 'npm run checkstyle'
                    sh 'npm run lint'
                    sh 'npm run build'
                }
            }
        }
        stage("Build Image") {
            steps {
                script {
                    dockerImage = docker.build imagename
                }
            }
        }
        stage('Deploy Image') {
            steps {
                script {
                    docker.withRegistry('http://docker.ninja.home', registryCredential) {
                        dockerImage.push("$BRANCH_NAME-$BUILD_NUMBER")
                        if (env.BRANCH_NAME == 'master') {
                            dockerImage.push("latest")
                        }
                        if (env.BRANCH_NAME == 'dev') {
                            dockerImage.push("dev-latest")
                        }

                    }
                }
            }
        }
        stage('Deploy on Server') {
            steps {
                script {
                    configFileProvider(
                            [configFile(fileId: 'portainer-webhook', variable: 'webhooks')]) {
                        def servers = readJSON(file:webhooks)

                        env.prodWebhookUrl= servers.prod
                        env.devWebhookUrl= servers.dev

                        if (env.BRANCH_NAME == 'master') {
                            sh "curl --insecure -X POST ${env.prodWebhookUrl}"
                        }
                        if (env.BRANCH_NAME == 'dev') {
                            sh "curl --insecure -X POST ${env.devWebhookUrl}"
                        }
                    }

                }
            }

        }
    }
}

