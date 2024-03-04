
# .PHONY: ephemeral-setup
# ephemeral-setup: ## Configure bonfire to run locally
# 	$(BONFIRE) config write-default > $(PROJECT_DIR)/config/bonfire-config.yaml

ifeq (,$(APP_NAME))
$(error APP_NAME is empty; did you miss to set APP_NAME=my-app at your scripts/mk/variables.mk)
endif

CLUSTER ?= crc-eph.r9lp.p1.openshiftapps.com

APP_COMPONENT ?= frontend

# Set the default duration for the namespace reservation and extension
EPHEMERAL_DURATION ?= 4h

NAMESPACE ?= $(shell oc project -q 2>/dev/null)
# POOL could be:
#   default
#   minimal
#   managed-kafka
#   real-managed-kafka
POOL ?= default
export NAMESPACE
export POOL


ifneq (default,$(POOL))
EPHEMERAL_OPTS += --no-single-replicas
else
EPHEMERAL_OPTS += --single-replicas
endif

ifeq (False,$(CLIENTS_RBAC_ENABLED))
EPHEMERAL_OPTS += --set-parameter "$(APP_COMPONENT)/CLIENTS_RBAC_ENABLED=False"
else
ifneq (,$(CLIENTS_RBAC_BASE_URL))
EPHEMERAL_OPTS += --set-parameter "$(APP_COMPONENT)/CLIENTS_RBAC_BASE_URL=$(CLIENTS_RBAC_BASE_URL)"
endif
endif

EPHEMERAL_BONFIRE_PATH ?= config/bonfire.yaml

EPHEMERAL_DEPS := $(BONFIRE) $(EPHEMERAL_BONFIRE_PATH)

# Enable frontend deployment
EPHEMERAL_OPTS += --frontends true

# https://consoledot.pages.redhat.com/docs/dev/creating-a-new-app/using-ee/bonfire/getting-started-with-ees.html
# Checkout this: https://github.com/RedHatInsights/bonfire/commit/15ac80bfcf9c386eabce33cb219b015a58b756c8
.PHONY: ephemeral-login
ephemeral-login: .old-ephemeral-login ## Help in login to the ephemeral cluster
	@#if [ "$(GH_SESSION_COOKIE)" != "" ]; then python3 $(GO_OUTPUT)/get-token.py; else $(MAKE) .old-ephemeral-login; fi

.PHONY: .old-ephemeral-login
.old-ephemeral-login:
	xdg-open "https://oauth-openshift.apps.$(CLUSTER)/oauth/token/request"
	@echo "- Login with github"
	@echo "- Do click on 'Display Token'"
	@echo "- Copy 'Log in with this token' command"
	@echo "- Paste the command in your terminal"
	@echo ""
	@echo "(once) Remember to set-up config/bonfire.yaml if not yet"
	@echo "# cp -vf config/bonfire.example.yaml config/bonfire.yaml"
	@echo "# $$EDITOR config/bonfire.yaml"
	@echo ""
	@echo "Now you should have access to the cluster, remember to use bonfire to manage namespace lifecycle:"
	@echo '# make ephemeral-namespace-create'
	@echo ""
	@echo "Check the namespaces reserved to you by:"
	@echo '# make ephemeral-namespace-list'
	@echo ""
	@echo "If you need to extend 1hour the time for the namespace reservation"
	@echo '# make ephemeral-namespace-extend EPHEMERAL_DURATION=1h'
	@echo ""
	@echo "Finally if you don't need the reserved namespace or just you want to cleanup and restart with a fresh namespace you run:"
	@echo '# make ephemeral-namespace-delete-all'
	@echo ""

# Download https://gitlab.cee.redhat.com/klape/get-token/-/blob/main/get-token.py
$(GO_OUTPUT/get-token.py):
	curl -Ls -o "$(GO_OUTPUT/get-token.py)" "https://gitlab.cee.redhat.com/klape/get-token/-/raw/main/get-token.py"

# CONTAINER_IMAGE_BASE should be a public image
.PHONY: ephemeral-build
ephemeral-build: $(EPHEMERAL_DEPS) ## Build and deploy image using 'build_deploy.sh' script; It create CONTAINER_IMAGE_BASE:CONTAINER_IMAGE_TAG image
	$(MAKE) ephemeral-registry-login
	$(MAKE) container-build CONTAINER_BUILD_OPTS="--build-arg APP_NAME=$(APP_NAME) --build-arg GIT_HASH=$(shell git rev-parse --verify HEAD) --build-arg SRC_HASH=$(shell git rev-parse HEAD) --build-arg APP_NAME=$(APP_NAME)"
	$(MAKE) container-push

.PHONY: ephemeral-registry-login
ephemeral-registry-login:  ## log into container registries for ephemeral build
	$(CONTAINER_ENGINE) login --get-login quay.io 2>/dev/null || \
		$(MAKE) registry-login \
			CONTAINER_REGISTRY_USER="$(QUAY_USER)" \
			CONTAINER_REGISTRY_TOKEN="$(QUAY_TOKEN)" \
			CONTAINER_REGISTRY="quay.io"
	$(CONTAINER_ENGINE) login --get-login registry.redhat.io 2>/dev/null || \
		$(MAKE) registry-login \
			CONTAINER_REGISTRY_USER="$(RH_REGISTRY_USER)" \
			CONTAINER_REGISTRY_TOKEN="$(RH_REGISTRY_TOKEN)" \
			CONTAINER_REGISTRY="registry.redhat.io"

.PHONY: ephemeral-deploy
ephemeral-deploy: $(EPHEMERAL_DEPS) ## Deploy application using 'config/bonfire.yaml'.
	$(BONFIRE) deploy \
	    --source appsre \
		--local-config-path "$(EPHEMERAL_BONFIRE_PATH)" \
		--local-config-method override \
		--secrets-dir "$(PROJECT_DIR)/secrets/ephemeral" \
		--import-secrets \
		--namespace "$(NAMESPACE)" \
		--set-parameter "$(APP_COMPONENT)/IMAGE=$(CONTAINER_IMAGE_BASE)" \
		--set-parameter "$(APP_COMPONENT)/IMAGE_TAG=$(CONTAINER_IMAGE_TAG)" \
		$(EPHEMERAL_OPTS) \
		"$(APP_NAME)"

.PHONY: ephemeral-build-deploy
ephemeral-build-deploy:  ## Build and deploy the image (run ephemeral-build and ephemeral-deploy sequentially)
	$(MAKE) ephemeral-build
	$(MAKE) ephemeral-deploy

# NOTE Changes to config/bonfire.yaml could impact to this rule
.PHONY: ephemeral-undeploy
ephemeral-undeploy: $(EPHEMERAL_DEPS) ## Undeploy application from the current namespace
	$(BONFIRE) process \
	    --source appsre \
		--local-config-path "$(EPHEMERAL_BONFIRE_PATH)" \
		--local-config-method override \
		--namespace "$(NAMESPACE)" \
		--set-parameter "$(APP_COMPONENT)/IMAGE=$(CONTAINER_IMAGE_BASE)" \
		--set-parameter "$(APP_COMPONENT)/IMAGE_TAG=$(CONTAINER_IMAGE_TAG)" \
		$(EPHEMERAL_OPTS) \
		"$(APP_NAME)" 2>/dev/null | json2yaml | oc delete -f -
	! oc get secrets/content-sources-certs &>/dev/null || oc delete secrets/content-sources-certs

.PHONY: ephemeral-process
ephemeral-process: $(EPHEMERAL_DEPS) ## Process application from the current namespace
	$(BONFIRE) process \
	    --source appsre \
		--local-config-path "$(EPHEMERAL_BONFIRE_PATH)" \
		--namespace "$(NAMESPACE)" \
		--set-parameter "$(APP_COMPONENT)/IMAGE=$(CONTAINER_IMAGE_BASE)" \
		--set-parameter "$(APP_COMPONENT)/IMAGE_TAG=$(CONTAINER_IMAGE_TAG)" \
		$(EPHEMERAL_OPTS) \
		"$(APP_NAME)" 2>/dev/null | json2yaml

# TODO Add command to specify to bonfire the clowdenv template to be used
.PHONY: ephemeral-namespace-create
ephemeral-namespace-create: $(EPHEMERAL_DEPS) ## Create a namespace (requires ephemeral environment)
	oc project "$(shell $(BONFIRE) namespace reserve --force --pool "$(POOL)" -d "$(EPHEMERAL_DURATION)" 2>/dev/null)"

.PHONY: ephemeral-namespace-delete
ephemeral-namespace-delete: $(EPHEMERAL_DEPS) ## Delete current namespace (requires ephemeral environment)
	$(BONFIRE) namespace release --force "$(oc project -q)"

.PHONY: ephemeral-namespace-delete-all
ephemeral-namespace-delete-all: $(EPHEMERAL_DEPS) ## Delete all namespace created by us (requires ephemeral environment)
	for item in $$( bonfire namespace list --mine --output json | jq -r '. | to_entries | map(select(.key | match("ephemeral-*";"i"))) | map(.key) | .[]' ); do \
	  $(BONFIRE) namespace release --force $$item ; \
	done

.PHONY: ephemeral-namespace-list
ephemeral-namespace-list: $(EPHEMERAL_DEPS) ## List all the namespaces reserved to the current user (requires ephemeral environment)
	$(BONFIRE) namespace list --mine

.PHONY: ephemeral-namespace-extend
ephemeral-namespace-extend: $(EPHEMERAL_DEPS) ## Extend for EPHEMERAL_DURATION ("4h" default) the usage of the current ephemeral environment
	$(BONFIRE) namespace extend --duration "$(EPHEMERAL_DURATION)" "$(NAMESPACE)"

.PHONY: ephemeral-namespace-describe
ephemeral-namespace-describe: $(EPHEMERAL_DEPS) ## Display information about the current namespace
	$(BONFIRE) namespace describe "$(NAMESPACE)"

.PHONY: ephemeral-pr-checks
ephemeral-pr-checks:
	IMAGE="$(CONTAINER_IMAGE_BASE)" bash ./pr_checks.sh

# FIXME This rule will require some updates but it will be something similar
.PHONY: ephemeral-test-backend
ephemeral-test-backend: $(EPHEMERAL_DEPS) ## Run IQE tests in the ephemeral environment (require to run ephemeral-deploy before)
	$(BONFIRE) deploy-iqe-cji \
	  --env clowder_smoke \
	  --cji-name "$(APP_NAME)-$(APP_COMPONENT)" \
	  --namespace "$(NAMESPACE)" \
	  "$(APP_NAME)"

# https://kubernetes.io/docs/tasks/administer-cluster/dns-debugging-resolution/
.PHONY: ephemeral-run-dnsutil
ephemeral-run-dnsutil:  ## Run a shell in a new pod to debug dns situations
	oc run dnsutil --rm --image=registry.k8s.io/e2e-test-images/jessie-dnsutils:1.3 -it -- bash

.PHONY: bonfire-deploy
bonfire-deploy: $(EPHEMERAL_DEPS)  ## Run raw bonfire command with no customizations
	$(BONFIRE) deploy --frontends true "$(APP_NAME)"
