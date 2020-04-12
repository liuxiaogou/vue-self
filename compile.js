// 编译器
// 递归遍历dom树
// 判断节点类型，如果是文本，则判断是否是插值绑定
// 如果是元素，则遍历其属性判断是否是指令或事件，然后递归子元素
class Compiler{
    constructor(el,vm){
        this.$vm = vm;
        this.$el = document.querySelector(el);
        if (this.$el) {
            this.compile(this.$el)
            
        }
    }
    compile(el){
        const childNodes = el.childNodes;
        console.log(111);
        Array.from(childNodes).forEach((node)=>{
            
            if (this.isElement(node)) {
                this.compileElement(node);
            }else if (this.isText(node)) {
               
                this.compileText(node);
                
            }
              // 递归子节点
            if (node.childNodes && node.childNodes.length > 0) {
                this.compile(node)
            }
        })
      
    }
    isElement(node){
        return node.nodeType ===1
    }
    isText(node){
        // console.log(node,node.textContent);
        return node.nodeType ===3 && /\{\{(.*)\}\}/.test(node.textContent)
    }
    
    compileElement(node){
       
        let watch = [];
        Array.from(node.attributes).forEach((attr)=>{
            const name = attr.name;
            const value = attr.value;
            if (this.isFyAttr(name)) {
                const attr_name = name.substring(3);
                console.log(attr_name,value);
                this[attr_name] && this[attr_name](node,value)
            }
        })
    }
    isFyAttr(name){
        return name.indexOf('fy-')===0
    }
    compileText(node){
        this.updata(node,RegExp.$1,"text")
    }
    html(node,value){
      
        this.updata(node,value,"html")
    }
    text(node,value){
        this.updata(node,value,"text")
    }
    updata(node,content,name){
        //初始化
        const fn =  this[name+'Updata'];
        fn && fn(node,this.$vm[content])
        //创建watcher实例
        new Watcher(this.$vm,content,function(val){
            console.log(55);
            fn && fn(node,val)
        });
    }
    htmlUpdata(node,content){
        node.innerHTML = content;
    }
    textUpdata(node,content){
        console.log(node,content)
        node.textContent = content;
    }

}