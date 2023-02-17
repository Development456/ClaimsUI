node {
      stage("Git Clone"){

        git branch: 'main', url: 'https://github.com/ineeladri/ClaimsUI.git'
      }
   stage("Docker build"){
        sh 'docker build -t claims-ui .'
        sh 'docker image ls'
      }
      withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'test', usernameVariable: 'ineeladri', passwordVariable: 'password']]) {
        sh 'docker login -u ineeladri -p $password'
      }
      stage("Pushing Image to Docker Hub"){
	sh 'docker tag claims-ui ineeladri/claims-ui'
	sh 'docker push ineeladri/claims-ui'
      }
	stage("SSH Into Server") {
       def remote = [:]
       remote.name = 'Claims-1'
       remote.host = '20.232.127.94'
       remote.user = 'azureuser'
       remote.password = 'Miracle@1234'
       remote.allowAnyHosts = true
     }
     stage("Deploy"){
	     sh 'docker stop claims-ui || true && docker rm -f claims-ui || true'
	     sh 'docker run -d -p 4200:80 --name claims-ui claims-ui'
     }

      }
