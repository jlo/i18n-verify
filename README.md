# Translation verification tool

## Usage
`node parse-verify.js [OPTION1] [OPTION2]... arg1 arg2...`

The following options are supported:
```
  -c, --parse <ARG1>...<ARGN>	Paths to directories containing constructs to parse (mandatory)
  -v, --verify <ARG1>        	Path to file to verify against (mandatory)
  -p, --pattern <ARG1>       	Regex pattern to parse against ("translate\('(.*)'\)" by default)
```

## Tests (WIP)
`npm test`
