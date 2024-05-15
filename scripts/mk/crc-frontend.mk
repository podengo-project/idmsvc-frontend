##
#
##

PUBLIC_OPENAPI = api/public.openapi.yaml
NODE_BIN = node_modules/.bin
APIDIR = src/Api

$(NODE_BIN)/%: package.json package-lock.json
	npm install
	touch $(NODE_BIN)/*

$(PUBLIC_OPENAPI):
	git submodule update --init

.PHONY: build
build: $(NODE_BIN)/fec  ## Build the resulting javascript code
	npm run build

.PHONY: clean
clean:  ## Clean the build
	rm -rf dist

.PHONY: lint
lint:  $(NODE_BIN)/eslint $(NODE_BIN)/stylelint  ## Execute linters
	npm run lint

.PHONY: prettier
prettier: $(NODE_BIN)/prettier  ## Make code prettier
	npm run prettier

.PHONY: test
test:  $(NODE_BIN)/jest ## Execute unit tests
	npm run test

.PHONY: run
run:$(NODE_BIN)/fec  ## Execute frontend
	npm run start

.PHONY: generate-api
generate-api: $(NODE_BIN)/openapi-generator-cli $(NODE_BIN)/prettier $(PUBLIC_OPENAPI) ## Generate the API client from openapi specification
	@rm -rf "$(APIDIR)/idmsvc"

	# Generate idmsvc API client
	TS_POST_PROCESS_FILE="node_modules/.bin/prettier --write" \
	    npm run openapi-generator-cli -- generate --enable-post-process-file \
	        -i "$(PUBLIC_OPENAPI)" -g typescript-axios -o $(APIDIR)/idmsvc
	@rm -rf \
	  "$(APIDIR)/idmsvc/.gitignore" \
	  "$(APIDIR)/idmsvc/.npmignore" \
	  "$(APIDIR)/idmsvc/git_push.sh"

.PHONY: update-api
update-api:
	git submodule update --init --remote
	$(MAKE) generate-api
