/**
 * 创建DOM节点，但是此节点是孤儿节点
 * @param {*} vnode 插入的新节点
 */
export default function createElement(vnode){
    // 创建DOM节点，此节点现在是孤儿节点
    let domNode = document.createElement(vnode.sel)
    // 判断是否有子节点
    if(vnode.text!=''&&(vnode.children==undefined||vnode.children.length==0)){
        domNode.innerText = vnode.text
    }else if(Array.isArray(vnode.children) && vnode.children.length!=0){
        // 如果有子节点，则遍历生成子节点真实DOM
        for(let i=0 ; i<vnode.children.length ; i++){
            // 获取每一个子节点
            let ch = vnode.children[i]
            // 递归，将子节点变为真实DOM并返回
            let chDOM = createElement(ch)
            // 将子节点追加到父节点内部
            domNode.appendChild(chDOM)
        }
    }
    // 补充虚拟DOM的elm属性为真实DOM
    vnode.elm = domNode
    
    return vnode.elm
}