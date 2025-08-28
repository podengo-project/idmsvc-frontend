# idmsvc-frontend (FreeIPA Domain Join service frontend)

**This project is currently inactive.  Issues and pull requests will
not be attended to.**

## Initial /etc/hosts setup

In order to access the https://[env].foo.redhat.com in your browser, you have to add entries to your `/etc/hosts` file. This is a **one-time** setup that has to be done only once (unless you modify hosts) on each machine.

To setup the hosts file run following command:

Add the below to your `/etc/hosts` file:

```
127.0.0.1 prod.foo.redhat.com
127.0.0.1 stage.foo.redhat.com
```

## Install react developer tools

A recommended tool to install is react developer tools, which is installed as a plugin for your
favourite browser.

- [React Developer Tools](https://react.dev/learn/react-developer-tools).

## Setup and run chrome-service-backend (optional)

> Useful when trying your service config changes
> before commit to chrome-service-backend repository.

Clone repositories and use Alejandro's branch:

```bash
git clone https://github.com/RedHatInsights/chrome-service-backend.git -o upstream
cd chrome-service-backend
```

Run the server in the foreground:
```bash
make dev-static port=9999
```

## Additional configurations

The below will be necessary to deploy on the dev cluster.

- Install nvm by: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash`.
- Config node 18 by: `nvm install 18; nvm use 18`.
- Run `cp -vf config/bonfire.example.yaml config/bonfire.yaml`.
- Update the `config/bonfire.yaml` file by following the TODO
  placeholders.
- Run `mkdir -p secrets/ephemeral && cp -vf scripts/mk/private.example.mk secrets/private.mk`.
- Update the `secrets/private.mk` file by following the TODO
  placeholders.
- Generate app-secret by: `${PATH_TO_IDMSVC_BACKEND_REPO}/scripts/gen-app-secret.py secrets/ephemeral/app-secret.yaml`.

Now you can deploy into dev cluster by `make ephemeral-build-deploy`.

## Getting started

1. `make run` to start the server.

2. Open the [idmsvc app][idmsvc_app] in your browser.

See: [Contributing](./docs/CONTRIBUTING.md).

### Testing

- Run unit tests by `make test`.
- Run linter by `make lint`.

## Development

Update git submodule and regenerate API with `make update-api`.

Generate `src/Api` from the openapi specification by running `make generate-api`.

* [Development Docs](docs/INDEX.md).
* [PatternFly - Components][patternfly].

[idmsvc_app]: https://stage.foo.redhat.com:1337/settings/idmsvc
[patternfly]: https://www.patternfly.org/components/all-components
[frontend_use_proxy]: https://github.com/RedHatInsights/frontend-components/tree/master/packages/config#useproxy
