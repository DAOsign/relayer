# Blockchain Relayer

Blockchain Relayer is a Node.js service that works together with `daosign backend`. Its primary function is to receive data from the `daosign backend`, process it, and send transactions to various blockchains, returning the `txid` of each successful transaction.

## Installation and Launch

Before starting, make sure you have [Node.js](https://nodejs.org/) installed.

1. Clone the repository:

   ```bash
   git clone git@github.com:DAOsign/relayer.git
   cd relayer
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Configure the `.env` file using the example in [Configuration](#configuration).

4. Start the application:

   ```bash
   npm start
   ```

### With docker

* Build docker: 
```shell
docker build -t daosign-relayer .
```

* Run relayer docker image:
```shell
docker run --env-file .env daosign-relayer
```


## Configuration

The blockchain relayer requires a `.env` file with settings to connect to various blockchain nodes and databases. An example `.env` file is provided below.

### Example `.env` File

```dotenv
# Basic settings
PORT=8000
APP_NAME=daosign||tradefi
APP_SLACK_WEBHOOK_LINK=<Your Slack webhook URL>

# Database settings
TYPEORM_HOST=127.0.0.1
TYPEORM_USERNAME=db_user
TYPEORM_PASSWORD=db_password
TYPEORM_DATABASE=db_name
TYPEORM_PORT=25433
TYPEORM_LOGGING=false

# Ethereum settings
ETH_RPC_URL=<Ethereum RPC URL>
ETH_PRIVATE_KEY=<Ethereum private key>
ETH_CONTRACT_ADDRESS=<Ethereum contract address>

# Oasis settings
OASIS_RPC_URL=<Oasis RPC URL>
OASIS_CONTRACT_ADDRESS=<Oasis contract address>
OASIS_PRIVATE_KEY=<Oasis private key>

# Sui settings
SUI_RPC_TYPE=testnet
SUI_PACKAGE_ID=<Sui package ID>
SUI_BAG_ID=<Sui bag ID>
SUI_MNEMONIC=<Sui mnemonic>

# Polkadot settings
POLKADOT_RPC_URL=<Polkadot RPC URL>
POLKADOT_CONTRACT_ADDRESS=<Polkadot contract address>
POLKADOT_MNEMONIC=<Polkadot mnemonic>

# Graylog settings
GRAYLOG_HOST=<Graylog server URL>

# Storage settings
STORAGE_RPC_URL=<Storage RPC URL>
STORAGE_CONTRACT_ADDRESS=<Storage contract address>
STORAGE_ADMIN_PRIVATE_KEY=<Storage admin private key>

# Near settings
NEAR_CONTRACT_ADDRESS=<Near contract address>
NEAR_MNEMONIC=<Near mnemonic>
NEAR_RPC_NET=<Near RPC network>
```

Fill in each environment variable with values that match your infrastructure and the blockchains the relayer needs to connect to.

## How It Works

1. The relayer receives requests with data from the `daosign backend` that need to be placed in specific blockchains.
2. Based on the received data, the relayer prepares and performs transactions for the respective blockchains.
3. Upon successful completion of the transaction, the relayer returns the `txid` — the transaction identifier that confirms it has been processed.

## Testing

Run following command to execute unit tests:

```shell
cp .env.example .env
yarn test
```

You should see output like that:

```shell
Test Suites: 3 passed, 3 total
Tests:       28 passed, 28 total
Snapshots:   0 total
Time:        5.075 s
Ran all test suites matching /test/i.
Done in 5.54s.

```