// 作用：创建虚拟节点，仅仅将参数以对象的形式返回
export default function vnode(sel, data, children, text, elm) {
    let key = data.key
    return {
        sel,
        data,
        children,
        text,
        elm,
        key
    }
}