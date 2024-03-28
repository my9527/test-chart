const fs = require("fs");
const path = require("path");




/**
 * 生成对应的token tag map
 */
async function buildTokenTags() {
    const content = fs.readFileSync(path.join(__dirname, "../src/app/config/token-sort-tags.txt"), {
        encoding: 'utf-8'
    });
    const _origin = content.replace(/\t/g, ' ').split('\n');

    const sortedTokenWithTag = _origin.reduce((result, cur, index) => {
        const [tokenName, ...tags] = cur.split(' ');
        if (!tokenName) return result;
        const _tags = tags.join(' ');

        return {
            ...result,
            [tokenName]: {
                tag: tags.length ? _tags.split(',') : [],
                index: index,
            },
        }
    }, {});

    fs.writeFileSync(path.join(__dirname, "../src/app/config/token-tags.json"), JSON.stringify(sortedTokenWithTag, null, 2));

}

async function main() {

    buildTokenTags();
}


main();
