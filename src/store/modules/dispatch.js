import {defineStore} from "pinia";
import {ref} from "vue";

export const useDispatchStore = defineStore('dispatch',()=>{
    const flag=ref(false);
    const setFlag=(value)=>{
        flag.value=value;
    }
    return {
        flag,
        setFlag
    }
})