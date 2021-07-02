import vnode from './vnode';

// 低配版的h函数，原版函数有重载，参数可变
// 作用将下面三种情况，返回对象形式
// h('div',{},'文字')
// h('div',{},[])
// h('div',{},h())
export default function h(sel, data, c) {
    if (arguments.length != 3) {
        throw new('must have three arguments!')
    }
    if (typeof c == 'string' || typeof c == "number") {
        return vnode(sel, data, undefined, c, undefined)
    } else if (Array.isArray(c)) {
        return vnode(sel, data, c, undefined, undefined)
    } else if (typeof c == 'object') {
        return vnode(sel, data, c, undefined, undefined)
    }
}