module.exports = parseFlags = (str) => {
    const flags = {}; let
        value;

    const withQuotes = /--(\w{2,})=("(\\"|[^"])*"|'(\\'|[^'])*')/gi;
    while ((value = withQuotes.exec(str))) {
        flags[value[1]] = value[2]
            .replace(/\\["']/g, (i) => i.slice(1))
            .slice(1, -1);
    }
    str = str.replace(withQuotes, '');

    const withoutQuotes = /--(\w{2,})(?:=(\S+))?/gi;
    while ((value = withoutQuotes.exec(str))) flags[value[1]] = value[2] || true;
    str = str.replace(withoutQuotes, '');

    const shortReg = /-([a-z]+)/gi;
    while ((value = shortReg.exec(str))) for (value of value[1]) flags[value] = true;
    str = str.replace(shortReg, '');

    return { flags, content: str };
}