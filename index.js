function defineReactive(obj,key,val){
    observe(val);
    const dep = new Dep();
    Object.defineProperty(obj,key,{
        get(){
            console.log('值为'+val);
            //依赖收集在这里
            Dep.target&& dep.addDep(Dep.target)
            return val
        },
        set(newVal){
            if (newVal!==val) {
                val = newVal
                observe(newVal);
                dep.notify();
            }
        }
    })

}
function observe (obj){ 
     if (typeof obj!== 'object' || obj == null) { //要的是个对象，不是的话就不走
         return
     }
     new Observer(obj)
}
function proxy(vm,$data){  //代理，把 实例中的$data的属性 代理到 实例中，这样数据可以直接通过vm.name 去访问
    Object.keys(vm[$data]).forEach((key)=>{
        Object.defineProperty(vm,key,{
            get(){
                return vm[$data][key]
            },
            set(newVal){
                if (newVal!==vm[$data][key]) {
                    vm[$data][key] = newVal
                }
            }
        })
    })
}
function getType(obj){ //类型精确判断
    var type = Object.prototype.toString.call(obj).slice(8, -1);
    return type;
  }
class Fy{
    constructor(option){
        this.$option = option;
        this.$data = option.data; 
        observe(this.$data); //响应化处理
        proxy(this,'$data');//代理
        new Compiler(option.el, this)
    }
}
class Observer{
    constructor(value){
       
        if (getType(value) ==='Object') {
            this.dataxy(value)
        }else if(getType(value) ==='Array'){
        }
    }
    dataxy(obj){
        
        Object.keys(obj).forEach((key)=>{
            defineReactive(obj,key,obj[key])
        })
    }
}
class Watcher{
    constructor(vm,key,updateFn){
        this.vm = vm;
        this.key = key;
        this.updateFn = updateFn;
        Dep.target = this;
        this.vm[this.key] //读取 触发getter
        Dep.target = null; //收集完就置空
    }
    update(){
        this.updateFn.call(this.vm,this.vm[this.key])
    }
}
// Dep 依赖 管理某个key相关的所有watcher实例
class Dep{
    constructor () {
         this.deps = []
    }
    addDep(dep) {   //dep是watch实例
        this.deps.push(dep) 
    }
    notify() { 
        this.deps.forEach(dep => dep.update()); 
    }
}