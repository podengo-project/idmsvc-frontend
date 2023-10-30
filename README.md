# idm-domains-frontend

## Initial etc/hosts setup

In order to access the https://[env].foo.redhat.com in your browser, you have to add entries to your `/etc/hosts` file. This is a **one-time** setup that has to be done only once (unless you modify hosts) on each machine.

To setup the hosts file run following command:

Add the below to your `/etc/hosts` file:

```
127.0.0.1 prod.foo.redhat.com
127.0.0.1 stage.foo.redhat.com
127.0.0.1 qa.foo.redhat.com
127.0.0.1 ci.foo.redhat.com
```

## Install react developer tools

A recommended tool to install is react developer tools, which is installed as a plugin for your
favourite browser.

- [React Developer Tools](https://react.dev/learn/react-developer-tools).

## Setup and run chrome-service-backend

Clone repositories and use Alejandro's branch:

```bash
git clone https://github.com/RedHatInsights/chrome-service-backend.git -o upstream
cd chrome-service-backend
git remote add --fetch avisiedo https://github.com/avisiedo/chrome-service-backend.git
git checkout hms-2031-domain-registry
```

Run the server in the foregrand:
```bash
make dev-static port=9999
```

## Getting started

1. `make run` to start the server.

2. Open the [hmsidm beta app](https://stage.foo.redhat.com:1337/beta/settings/hmsidm) in your browser.

3. Currently, `App.tsx` will throw a type error until your app is registered and a `navId` has been set.

Update `config/dev.webpack.config.js` according to your application URL. [Read more](https://github.com/RedHatInsights/frontend-components/tree/master/packages/config#useproxy).

See: [Contributing](./docs/CONTRIBUTING.md).

### Testing

- Run unit tests by `make test`.
- Run linter by `make lint`.

## Development

Generate `src/Api` from the openapi specification by running `make generate-api`.

Update git submodule and regenerate API with`make update-api`.

* [Development Docs](docs/INDEX.md).
* [Pattern Fly 4 - Components](https://www.patternfly.org/v4/components/about-modal).
