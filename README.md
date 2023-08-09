# Running on a local Kubernetes cluster
1. Install skaffold and run the command: `skaffold dev`
2. Setup ingress-nginx by running the command:
```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml
```