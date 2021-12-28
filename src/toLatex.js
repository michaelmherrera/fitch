export const JUST = {
    "\u2192 I": "ii", // Implication
    "\u2192 E": "ie", // Implication
    "\u2227 I": "ai", // And
    "\u2227 E": "ae", // And
    "\u2228 I": "oi", // Or
    "\u2228 E": "oe", // Or
    "\u00ac I": "ni", // Not Intro
    "\u00ac E": "ne", // Not Elim
    "\u22A5 I": String.raw`by{$\bot$I}`, // Falsum Intro (Note that this is not supported in fitch.sty so will have to implement manually)
    "\u22A5 E": "be", // Falsum elim
    "\u2200 I": "Ai", // Forall
    "\u2200 E": "Ae", // Forall
    "\u2203 I": "Ei", // Exists
    "\u2203 E": "Ee", // Exists
    "R": "r", // Repeat
};
const OPEN = `\\open`
const CLOSE = `\\close`

function hypo(prem) {
    return `\\hypo {${prem["idx"]}} {${prem["value"]}}`
}

function have(elem) {
    let lineNum = elem["idx"]
    let content = elem["value"]
    let justification = elem["justification"]
    let type = JUST[justification[0]]
    let lines = justification[1]
    return `\\have {${lineNum}} {${content}} \\${type}{${lines}}`
}

function getLatexRecursive(subproof) {
    let premises = []
    let body = []
    for (const prem of subproof.premise) {
        premises.push(hypo(prem))
    }
    for (const elem of subproof.body) {
        if (typeof elem["value"] === "string") {
            body.push(have(elem))
        }
        else {
            body.push(OPEN)
            body.push(getLatexRecursive(elem))
            body.push(CLOSE)
        }
    }
    return [premises, body.flat()].flat()
}

export function GetLatex(proof) {
    try {
        let latex = [`\\[`, `\\begin{nd}`, getLatexRecursive(proof), `\\end{nd}`, `\\]`].flat()
        let asString = ""
        for (const line of latex) {
            asString += line
            asString += "\n"
        }
        return asString
    } catch {
        return ""
    }

}


