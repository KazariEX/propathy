type State =
    | "dot"
    | "bracket"
    | "property";

export function parsePath(path: string) {
    const states: State[] = [];
    const chars = path.trim().split(/\s*/);

    const props: string[] = [];
    let prop = "";

    let escape = false;
    let next = init;
    let i = 0;
    while (i < chars.length) {
        const char = chars[i];
        next = next(char);
    }

    if (states.at(-1) === "property") {
        exit("property");
    }
    return props;

    function init(char: string) {
        if (char === "[") {
            consume(char);
            enter("bracket");
            enter("property");
            return bracket;
        }
        enter("dot");
        enter("property");
        return dot;
    }

    function start(char: string) {
        if (char === ".") {
            consume(char);
            enter("dot");
            enter("property");
            return dot;
        }
        if (char === "[") {
            consume(char);
            enter("bracket");
            enter("property");
            return bracket;
        }
        throw new Error(`[Propathy] Not allowed to start with characters other than "." or "[".`);
    }

    function dot(char: string) {
        if (!escape && (char === "." || char === "[")) {
            exit("property");
            exit("dot");
            return start;
        }
        consume(char);
        return dot;
    }

    function bracket(char: string) {
        if (!escape && char === "]") {
            exit("property");
            exit("bracket");
            consume(char);
            return start;
        }
        consume(char);
        return bracket;
    }

    function consume(char: string) {
        i++;
        if (states.at(-1) === "property") {
            if (escape) {
                escape = false;
                prop += char;
            }
            else if (char === "\\") {
                escape = true;
            }
            else {
                prop += char;
            }
        }
    }

    function enter(state: State) {
        states.push(state);
    }

    function exit(state: State) {
        if (state !== states.at(-1)) {
            throw new Error(`[Propathy] "${state}" is not the last state.`);
        }
        if (state === "property") {
            if (escape) {
                escape = false;
                prop += "\\";
            }
            props.push(prop);
            prop = "";
        }
        states.pop();
    }
}

export function getProperty(target: Record<string, any>, path: string, defaultValue?: unknown) {
    const props = parsePath(path);

    let obj = target;
    for (const prop of props) {
        if (prop in obj) {
            obj = obj[prop];
        }
        else {
            return defaultValue;
        }
    }
    return obj;
}

export function setProperty(target: Record<string, any>, path: string, value: unknown) {
    const props = parsePath(path);
    if (!props.length) {
        return;
    }

    let obj = target;
    for (let i = 0; i < props.length - 1; i++) {
        obj = (
            obj[props[i]] ??= /^\d+$/.test(props[i + 1]) ? [] : {}
        );
    }
    obj[props.at(-1)!] = value;
}

export function hasProperty(target: Record<string, any>, path: string) {
    const props = parsePath(path);

    let obj = target;
    for (let i = 0; i < props.length; i++) {
        const prop = props[i];
        if (prop in obj) {
            obj = obj[prop];
            continue;
        }
        return false;
    }
    return true;
}

export function deleteProperty(target: Record<string, any>, path: string) {
    const props = parsePath(path);

    let obj = target;
    for (let i = 0; i < props.length; i++) {
        const prop = props[i];
        if (prop in obj) {
            if (i === props.length - 1) {
                return delete obj[prop];
            }
            obj = obj[prop];
        }
        else break;
    }
    return false;
}