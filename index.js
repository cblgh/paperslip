var minimist = require("minimist")
var randomName = require("human-readable-ids").hri
var dedent = require("dedent")
var paper = require("./lib")

var help = dedent`
    usage: paperslip write --name 35c3 --note dat://c001..f00d
`

var args = minimist(process.argv.slice(2))
if (Object.keys(args).length === 1 && args._.length === 1 || args.help) {
    process.stdout.write(help + "\n") 
    process.exit(0)
}

// default operation is read
var operation = "read"
if (args._.length > 0) { operation = args._[0] }

var topic = randomName.random()
if (args.name) topic = args.name 
log(`joining ${topic}`)

function log(msg) {
    process.stdout.write(msg + "\n")
}

if (operation === "read") {
    paper.read(topic, function onFinish() {
        process.exit()
    })
} else if (operation === "write") {
    paper.write(topic, args.note)
}
