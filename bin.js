var minimist = require('minimist')
var namegiver = require('human-readable-ids').hri
var dedent = require('dedent')
var paperslip = require('./')

var help = dedent`
    Usage: paperslip <name> [--note, --stdin]
    Examples:
      # Send a note using a generated namespace
      paperslip --note "dat://54d..b015"
      # Receive a note by listening to 35c3
      paperslip 35c3                              
      # Share a note in 35c3
      paperslip 35c3 --note "dat://7331..c001"    
      # Pipe input to 35c3 with --stdin
      paperslip 35c3 --stdin                      

    Options:
        --note <string>     Information to send to peers
        --stdin             Pipe standard input to peers 
`
var args = minimist(process.argv.slice(2), { alias: { 'n': 'note' } })

var incoming = (args.stdin || !process.stdin.isTTY)
var argless = !args.note && args._.length === 0
if (!incoming && argless || args.help) {
  process.stdout.write(help + '\n')
  process.exit(0)
}

var topic = namegiver.random()
if (args._.length > 0) topic = args._[0]
else process.stdout.write(`listening on ${topic}\n`)

if (args.note || incoming) {
  paperslip.write(topic, args.note ? args.note + '' : process.stdin)
} else {
  var stream = paperslip.read(topic, function onFinish () {
    process.exit(0)
  })
  stream.pipe(process.stdout)
}
