import createElement from './createElement'
import updateChildren from './updateChildren'

// 对比同一个虚拟节点
export default function patchVnode(oldVnode,newVnode){
    // 如果新旧节点是相同对象，什么都不做
    if(oldVnode === newVnode) return;
    // 如果不是相同对象，则判断新节点有没有text属性
    if(newVnode.text && (newVnode.children == undefined || newVnode.children.length==0)){
        // 如果新节点有text属性，则与旧节点的text属性比较是否相同，不相同替换，相同不做处理
        if(newVnode.text !== oldVnode.text){
            oldVnode.elm.innerText = newVnode.text
        }
    }
    // 如果新节点没有text，则意味有children
    else{
        // 判断旧节点有没有children
        if(oldVnode.children!=undefined && oldVnode.children.length>0){
            // 【如果有，精细化比较，这是最复杂的部分】
            updateChildren(oldVnode.elm,oldVnode.children,newVnode.children)
        }else{
            // 如果没有，意味旧节点有text，清空旧的text，替换为新节点的children
            oldVnode.elm.innerHTML = ''
            for(let i=0 ; i<newVnode.children.length ; i++){
                let dom = createElement(newVnode.children[i])
                oldVnode.elm.appendChild(dom)
            }
        }
    }
}