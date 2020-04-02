function defineReactive(obj,key,val){
    observe(val);
    Object.defineProperty(obj,key,{
        get(){
            console.log('值为'+val)
        },
        set(newVal){
            console.log('值为'+newVal)
            val = newVal

        }
    })

}
function observe (obj){ 
     if (typeof obj!== 'object' || obj == null) { //要的是个对象，不是得话就不走
         return
     }
     new Observer(obj)
}
function getType(obj){ //类型精确判断
    var type = Object.prototype.toString.call(obj).slice(8, -1);
    return type;
  }
class Fy{
    constructor(option){
        this.$option = option;
        this.$data = option.data; 
        observe(this.$data)
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