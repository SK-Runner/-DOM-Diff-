import vnode from "./vnode"
import createElement from './createElement'
import patchVnode from './patchVnode'
export default function patch(oldVnode,newVnode){
    // 判断第一个参数是DOM节点还是虚拟节点
    if( oldVnode.sel=='' || oldVnode.sel==undefined ){
        oldVnode = vnode(oldVnode.tagName.toLowerCase(),{},[],undefined,oldVnode);
    }
    if(oldVnode.key==newVnode.key && oldVnode.sel==newVnode.sel){
        console.log('key和sel相同时');
        patchVnode(oldVnode,newVnode)
    }else{
        console.log('不是同一节点，暴力删除旧节点，插入新节点');
        let newDom = createElement(newVnode)
        // 安全判断：老节点的父节点和新节点是否都存在
        if(oldVnode.elm.parentNode && newDom){
            oldVnode.elm.parentNode.insertBefore(newDom,oldVnode.elm)
        }
        // 暴力删除旧节点
        oldVnode.elm.parentNode.removeChild(oldVnode.elm)
    }
}