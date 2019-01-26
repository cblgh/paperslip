# paperslip
share hard-to-transmit snippets with easy-to-pronounce names using dht magic

## Usage
```sh
Usage: paperslip <name> [--note, --stdin]
Examples:
  # Send a note using a generated namespace
  paperslip --note "dat://54d..b015"
  # Receive a note by listening to 35c3
  paperslip 35c3
  # Share a note in 35c3
  paperslip 35c3 --note "dat://7331..c001"
  # Pipe all your input to 35c3
  paperslip 35c3 --stdin

Options:
    --note <string>     Information to send to peers
    --stdin             Pipe standard input to peers
```
