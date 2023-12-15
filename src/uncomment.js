import strip from 'strip-comments'
import fs from 'fs'
// import { readdirSync } from 'fs'
// import prettier from 'prettier'
import path from 'path'


/**
 * 
 * @param {string} dir 
 */
function traverseDir(dir) {
    if (!dir)
        throw new Error('Directory not set!')

    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file)

        if (fs.lstatSync(fullPath).isDirectory()) {
            console.log(fullPath)

            traverseDir(fullPath)
        } else {
            console.log('Removing Comments: ', fullPath)
            unCommentSingleFile(fullPath)
        }
    })
}


/**
 * 
 * @param {string} filename 
 */
async function unCommentSingleFile(filename) {
    if (!filename)
        throw new Error('Filename not set!')

    const file = fs.openSync(filename, "r+")
    const content = fs.readFileSync(file, "utf8")

    // remove all comments
    let stripedContent = strip(content, {
        block: true,
        line: true,
        keepProtected: true,
        preserveNewlines: false,
    })
        // replace multiple empty lines with only one, which are created after stripping comments
        .replace(/(\n\s*\n)/g, '\n')


    fs.writeFileSync(filename, stripedContent)
}

try {
    const path = 'dist'
    traverseDir(path)

    console.log('\nComments Removed! \n')
} catch (error) {
    console.log('\n\n Error occurred while UnCommenting !')

    throw error
}
