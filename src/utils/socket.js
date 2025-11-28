import io from "socket.io-client"
import BASEURL from "./constants"

export const createSocketConnection = ()=>{
    return io(BASEURL);
}