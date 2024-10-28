module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure `result` usage is followed by an error check',
      recommended: 'error',
    },
    messages: {
      missingCheck: 'A result from `result` must be followed by an `if (result.err)` check.',
    },
  },
  create(context) {
    return {
      VariableDeclaration(node) {
        // Find the variable declaration with `result` assignment
        node.declarations.forEach((decl) => {
          if (decl?.init?.argument?.callee?.name === 'result') {
            
            const resultVarName = decl.id.name
            
            // Find the following statement to check for `if (resultVar.err)`
            const parentBlock = node.parent.body
            const currentIndex = parentBlock.indexOf(node)
            
            const nextStatement = parentBlock[currentIndex + 1]
            if (
              nextStatement &&
              nextStatement.type === 'IfStatement' &&
              nextStatement.test &&
              nextStatement.test.type === 'MemberExpression' &&
              nextStatement.test.object.name === resultVarName &&
              nextStatement.test.property.name === 'err'
            ) {
              // If the next statement is an if-check on `.err`, it's valid
              return
            }

            // Report if no check was found
            context.report({
              node,
              messageId: 'missingCheck',
            })
          }
        })
      },
    }
  },
}