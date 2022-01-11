const baseLength = 26

export default function syntax () {
  const sourceSet = new Set()
  return {
    build (opts) {
      const { generatedExpressions, stepParameterNames } = opts
      const steps = generatedExpressions.reduce((acc, { parameterNames, source }) => {
        if (sourceSet.has(source)) {
          return acc
        }
        sourceSet.add(source)
        const allParameterNames = [ ...stepParameterNames, ...parameterNames ]
        const parameterNameLength = parameterNames.reduce((l, item) => l + item.length + 2, 0)
        const overflow = (baseLength + source.length + parameterNameLength) > 100
        const paramSeparator = overflow ? ',\n  ' : ', '
        const firstParenSeparator = overflow ? '\n  ' : ''
        const lastParenSeparator = overflow ? '\n' : ''
        const newStep = `
defineStep('${source}', function (${firstParenSeparator}${allParameterNames.join(paramSeparator)}${lastParenSeparator}) {
  return 'pending'
})`
        acc.push(newStep)
        return acc
      }, [])
      return steps.join('')
    },
  }
}
