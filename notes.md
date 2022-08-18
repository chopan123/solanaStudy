Get program ID

```
solana address -k target/deploy/mysolanaapp-keypair.json
```

Provider seems to be someone because it has wallet, connection (and opts)


# Fix polyfills

Install React-app-rewired
```
npm install --save-dev react-app-rewired
```

Install missing dependencies
```
npm install --save-dev crypto-browserify stream-browserify assert stream-http https-browserify os-browserify url buffer process
```

In this case
```
npm install --save-dev crypto-browserify stream-browserify
```

3. Override the create-react-app webpack config file

create file `config-overrides.js`

In tutorial says:
```javascript
const webpack = require('webpack');
module.exports = function override(config) {
		const fallback = config.resolve.fallback || {};
		Object.assign(fallback, {
    	"crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "assert": require.resolve("assert"),
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "os": require.resolve("os-browserify"),
      "url": require.resolve("url")
      })
   config.resolve.fallback = fallback;
   config.plugins = (config.plugins || []).concat([
   	new webpack.ProvidePlugin({
    	process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    })
   ])
   return config; }
```

for us:
```javascript
const webpack = require('webpack');
module.exports = function override(config) {
		const fallback = config.resolve.fallback || {};
		Object.assign(fallback, {
    	"crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify")
      })
   config.resolve.fallback = fallback;
   config.plugins = (config.plugins || []).concat([
   	new webpack.ProvidePlugin({
    	process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    })
   ])
   return config;
 }
   ```

   Modify `scripts` in `package.json`
```json
"scripts": {
	"start": "react-app-rewired start",
  "build": "react-app-rewired build",
  "test": "react-app-rewired test",
  "eject": "react-scripts eject"
 },
 ```

-----------------------

# Udemy Course

import `use anchor_lang::solana_program::entrypoint::ProgramResult;`
for error related to ProgramResult

use `  const provider = anchor.AnchorProvider.local();
`

instead of `Provider`


## Using candy machine

See if candy machine is installed:
```
ts-node ~/deprecated-clis/src/candy-machine-v2-cli.ts --version
```

Deploy to devnet
```
ts-node ~/deprecated-clis/src/candy-machine-v2-cli.ts upload -e devnet -k ~/.config/solana/devnet.json -cp config.json ./assets
```
output:
```
wallet public key: 3Y14BQ1sEMbY4uzcrH1HMeHE9CT948JDJ1b2rWSbEEv3
Using cluster devnet
WARNING: The "arweave" storage option will be going away soon. Please migrate to arweave-bundle or arweave-sol for mainnet.

Beginning the upload for 3 (img+json) pairs
started at: 1660849606197
initializing candy machine
Candy machine address:  83rLvrGrnprUozuizgRmfhhxQ5vzoLopbkFj8VoALWVh
Collection metadata address:  BV2W57i5GF9ZH1mnBPA6CHfveP5SUearEuCwH4TVBuyj
Collection metadata authority:  3Y14BQ1sEMbY4uzcrH1HMeHE9CT948JDJ1b2rWSbEEv3
Collection master edition address:  57jpDWN7DMbf1hAdM4eCJJ1yo5EAqjWSyuXQ3r5j8utU
Collection mint address:  3qTT63xD8gG1Mo9QN9UjHUM5bmLg1JsTASsVg8y9117s
Collection PDA address:  E9sH3EgZ5wZJijx4GjQkSZimj8rBmxHEAABZVKGBC7oz
Collection authority record address:  39CoFAwAPunrqprxXmxBoroJgW3F9GGYiotompWgmQm3
Collection:  {
  collectionMetadata: 'BV2W57i5GF9ZH1mnBPA6CHfveP5SUearEuCwH4TVBuyj',
  collectionPDA: 'E9sH3EgZ5wZJijx4GjQkSZimj8rBmxHEAABZVKGBC7oz',
  txId: '5r4J355w1bW5PQUv6dQzHJPQDqG7AEXsggqturiJRP2ELBQD5NVY7BQf4MvL6S8YJ97zs5VC5DqzVXAxfr7onP12'
}
initialized config for a candy machine with publickey: 83rLvrGrnprUozuizgRmfhhxQ5vzoLopbkFj8VoALWVh
[0] out of [3] items have been uploaded
Starting upload for [3] items, format {"mediaExt":".png","index":"0"}
Progress: [████████████████████████████████████████] 100% | 3/3
Writing all indices in 1 transactions...
Progress: [████████████████████████████████████████] 100% | 1/1
Done. Successful = true.
ended at: 2022-08-18T19:07:27.911Z. time taken: 00:00:41
```

NFT contract: `83rLvrGrnprUozuizgRmfhhxQ5vzoLopbkFj8VoALWVh`

Verify if it is uploaded:
```
ts-node ~/deprecated-clis/src/candy-machine-v2-cli.ts verify_upload -e devnet -k ~/.config/solana/devnet.json
