# Url Migration Tester

It can be very frustrating to check all the urls when you have migrated a website. This tool will help you make it easier.

## Installation
We are not on npmjs.org, so you'll have to do this locally.

### Install dependencies
```bash
# enter src directory
cd src

# install dependencies
npm install
```

#### Install as a package
```bash
# install as a linked package
cd src
sudo npm link
```

## Run
```bash
cd src
node bin/index.js run [--max-failures=<N>] [--max-tests=<N>] [--concurrency=<N>] [-v|-vv|-vvv]
```

### If you linked
```bash
# run from where your config directory is
url-tester run [--max-failures=<N>] [--max-tests=<N>] [--concurrency=<N>] [-v|-vv|-vvv]
```

## Configuration
Example configuration
```yaml
profiles:
  - name: example_name
    enabled: 1
    baseUrl: https://www.example.com/
    testUrl: https://new.example.com/
    urls:
      - type: file
        format: csv
        url: config/urls/example_com.csv
      - type: url
        format: sitemap
        url: https://www.example.com/sitemap.xml
    rewrites:
      - url: config/rewrites/example_com.csv
```
