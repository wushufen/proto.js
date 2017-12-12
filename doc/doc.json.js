[{
    method: 'Object.getType(value)',
    desc: '获取参数的数据类型',
    args: {
        value: {
            type: '*',
            desc: '需获取类型的参数'
        }
    },
    return: {
        type: 'String',
        desc: '"object","array","date","function","regexp","string","number","boolean","null","undefined"'
    },
    example: 'Object.getType([])'
}
, {
    method: 'Object.isType(type, value)',
    desc: '判断参数的数据类型',
    args: {
        type: {
            type: 'String',
            desc: '"object","array","date","function","regexp","string","number","boolean","null","undefined"'
        }
        value: {
            type: '*',
            desc: ''
        }
    },
    return: {
        type: 'String',
        desc: '"object","array","date","function","regexp","string","number","boolean","null","undefined"'
    },
    example: 'Object.isType("ayyay", [])'
}
, {
    method: 'Array.range(start, end, step)',
    desc: '判断参数的数据类型',
    args: {
        type: {
            type: 'String',
            desc: '"object","array","date","function","regexp","string","number","boolean","null","undefined"'
        }
        value: {
            type: '*',
            desc: ''
        }
    },
    return: {
        type: 'String',
        desc: '"object","array","date","function","regexp","string","number","boolean","null","undefined"'
    },
    example: 'Object.isType("ayyay", [])'
}
]