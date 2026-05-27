export interface Req {
body:string,
method:string,
path:string,
headers: Record<string,string>
}

export interface Res{
    json:(data:unknown, statusCode?:number)=>void;
    send:(body:string,statusCode?:number)=>void;
}