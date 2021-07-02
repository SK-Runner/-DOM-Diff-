import patchVnode from "./patchVnode";
import createElement from "./createElement";
// 判断是否是同一个虚拟节点
function checkSameVnode(a,b){
    return a.sel===b.sel && a.key===b.key
}
export default function updateChildren(parentElm,oldCh,newCh){
    // 旧前
    let oldStartIdx = 0;
    // 新前
    let newStartIdx = 0;
    // 旧后
    let oldEndIdx = oldCh.length-1;
    // 新后
    let newEndIdx = newCh.length-1;
    // 旧前节点
    let oldStartVnode = oldCh[0]
    // 旧后节点
    let oldEndVnode = oldCh[oldEndIdx]
    // 新前节点
    let newStartVnode = newCh[0]
    // 新后节点
    let newEndVnode = newCh[newEndIdx]
    // 存储 old 的所有节点
    let keyMap = undefined
    while(oldStartIdx<=oldEndIdx && newStartIdx<=newEndIdx){
        console.log('★');
        // 首先略过已经加undefined标记的东西
        if(oldStartVnode == null || oldCh[oldStartIdx] == undefined){
            console.log(1);
            oldStartIdx = oldCh[++oldStartIdx]
        }else if(oldEndVnode == null || oldCh[oldEndIdx] == undefined){
            console.log(2);
            oldEndVnode = oldCh[--oldEndIdx]
        }else if(newStartVnode == null || newCh[newStartIdx] == undefined){
            console.log(3);
            newStartVnode = newCh[++newStartIdx]
        }else if(newEndVnode == null || newCh[newEndIdx] == undefined){
            console.log(4);
            newEndVnode = newCh[--newEndIdx]
        }else if(checkSameVnode(oldStartVnode,newStartVnode)){
            console.log('① 新前与旧前命中');
            patchVnode(oldStartVnode,newStartVnode)
            oldStartVnode = oldCh[++oldStartIdx]
            newStartVnode = newCh[++newStartIdx]
        }else if(checkSameVnode(oldEndVnode,newEndVnode)){
            console.log('② 旧后与新后命中');
            patchVnode(oldEndVnode,newEndVnode)
            oldEndVnode = oldCh[--oldEndIdx]
            newEndVnode = newCh[--newEndIdx]
        }else if(checkSameVnode(newEndVnode,oldStartVnode)){
            console.log('③ 新后与旧前命中');
            patchVnode(oldStartVnode,newEndVnode)
            // 新后与旧前命中时,要将新前指向的节点插入到旧后节点之后(这里新后与旧前节点相同)
            parentElm.insertBefore(oldStartVnode.elm,oldEndVnode.elm.nextsibling)
            oldStartVnode = oldCh[++oldStartIdx]
            newEndVnode = newCh[--newEndIdx]
        }else if(checkSameVnode(newStartVnode,oldEndVnode)){
            console.log('④ 新前与旧后命中');
            patchVnode(oldEndVnode,newStartVnode)
            // 新前与旧后命中时,将新前指向的节点移动到旧前节点之前(这里旧后与新前节点相同)
            parentElm.insertBefore(oldEndVnode.elm,oldStartVnode.elm)
            oldEndVnode = oldCh[--oldEndIdx]
            newStartVnode = newCh[++newStartIdx]
        }else{
            // 四种命中都错过时
            console.log('四种情况都不匹配');
            // 创建一个对象keyMap，存储old的所有节点
            if(!keyMap){
                keyMap = {}
                for(let i = oldStartIdx ; i <= oldEndIdx ; i++){
                    let key = oldCh[i].key
                    if(key!=undefined){
                        keyMap[key] = i
                    }
                }
                console.log(keyMap);
            }
            // 当前项在old中的位置
            let newIdxInOld = keyMap[newStartVnode.key]
            if(newIdxInOld==undefined){
                // 如果没找到,说明该项时一个新的项，需要为其创建DOM，将其插入到oldStartVnode之前
                console.log('没找到的情况');
                parentElm.insertBefore(createElement(newStartVnode),oldStartVnode.elm)
            }else{
                /**
                 * 使用场景：old中只内部移动或内部修改，不新增子元素
                 * 原先        变为
                 * A           CCC
                 * B    ===>   
                 * C
                 */
                // 如果找到了，说明new中这一项不是全新的，需要将旧节点中该项移动
                let elmToMove = oldCh[newIdxInOld]
                // 先将new中该项与old中需要移动的节点对比，以防同一节点内容不一致
                patchVnode(elmToMove,newStartVnode)
                // 比较之后将旧节点中的对应项设为undefined，以后不再比较
                oldCh[newIdxInOld] = undefined
                // 将该项移动到oldStartVnode之前
                parentElm.insertBefore(elmToMove.elm,oldStartVnode.elm)
            }
            newStartVnode = newCh[++newStartIdx]
        }
    }
    console.log(newStartIdx,newEndIdx);
    console.log(oldStartIdx);
    // 继续看有没有剩余。
    if(newStartIdx <= newEndIdx){
        console.log('new中还有剩余节点没有处理，要把剩余项添加到old没有处理的节点之前');
        console.log(oldCh[oldStartIdx]);
        const before = oldCh[oldStartIdx] ? oldCh[oldStartIdx]:null
        let flag = null
        if(before != null){
            flag = before.elm
        }
        for(let i=newStartIdx ; i<=newEndIdx ; i++){
            // insertBefore可以自动识别第二参数为null，如果为null，则自动将第一参数的dom插入到末尾
            console.log(flag);
            parentElm.insertBefore(createElement(newCh[i]),flag)
        }
    }else if(oldStartIdx <= oldEndIdx){
        console.log('old还有剩余项');
        for(let i=oldStartIdx ; i<=oldEndIdx ; i++){
            if(oldCh[i]){
                parentElm.removeChild(oldCh[i].elm)
            }
        }
    }
}