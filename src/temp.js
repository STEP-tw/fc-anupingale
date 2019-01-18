let fs=require("fs")
fs.readFile("./user_comments.json",(err,data)=>{
 return data.split(",").reduce((acc,dat)=>{
 console.log(data,typeof(data));
  acc.push
 (JSON.parse(dat));
 return acc;
},[]);
});
