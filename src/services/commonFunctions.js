export const toUpperCaseFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

export const reversedNum = (num) => {
    return (parseFloat(num
        .toString()
        .split('')
        .reverse()
        .join('')
    ) * Math.sign(num)
    )
}