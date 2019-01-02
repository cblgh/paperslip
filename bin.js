var minimist = require('minimist')
var randomName = require('human-readable-ids').hri
var dedent = require('dedent')
var paper = require('./lib')

var help = dedent`
    Usage: paperslip <name> [--note, --freeform]
    Examples:
      # Receive by listening to 35c3
      paperslip 35c3                              
      # Share a note in 35c3
      paperslip 35c3 --note "dat://7331..c001"    
      # Pipe all your input to 35c3
      paperslip 35c3 --freeform                      

    Options:
        --note <string>     Information to send to peers
        --freeform          Allow freeform keyboard input as long as the session is open
`

var args = minimist(process.argv.slice(2))
if ((args._.length === 0) || args.help) {
  process.stdout.write(help + '\n')
  process.exit(0)
}

var topic = randomName.random()
if (args._.length > 0) topic = args._[0]

if (args.note || args.freeform) {
  paper.write(topic, args.note || process.freeform)
} else {
  var stream = paper.read(topic, function onFinish () {
    process.exit(0)
  })
  stream.pipe(process.stdout)
}
