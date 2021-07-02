import h from './h'
import patch from './patch'

const myVnode1 = h('ul',{},[
  h('li',{ key:'A'},'A'),
  h('li',{ key:'B'},'B'),
  h('li',{ key:'C'},'C'),
  h('li',{ key:'E'},'E'),
  h('li',{ key:'F'},'F'),
])

const container = document.getElementById('container')

patch(container,myVnode1)
const myVnode2 = h('ul',{},[
  h('li',{ key:'A'},'A'),
  h('li',{ key:'B'},[
    h('li',{ key:'A'},'A'),
    h('li',{ key:'A'},'A'),
  ]),
  h('li',{ key:'C'},'C'),
  h('li',{ key:'E'},'E'),
  h('li',{ key:'F'},'F'),
])
const btn = document.getElementById('btn')
btn.onclick = function(){
  patch(myVnode1,myVnode2)
}

