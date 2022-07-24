/*


 how to use:
 
 invoke the utility like so:
 
 window["local/path/to/saveas.js"]();
 
 
 second arg is optional, otherwise will either use filename if input is file, or generate untitled+timestamp if input is blob
 __saveAs(fileOrBlob,fileName);
 
 alternatively:
 __save(fileOrBlob

 needs: mimeTypeToFileExtension

*/


self[new Error().stack.match(location.href.match(/(.*)\//g)+"(.*?):")[1]]=()=>{

  
  var getDate=function(){
    var date  = new Date();
    return {
      month : (date.getMonth()+1).toString().padStart(2,0)  ,
      day   : date.getDate().toString().padStart(2,0)       ,
      year  : date.getFullYear().toString().padStart(4,0)   ,
    };
  };
  
  var getTime=function(){
    var date  = new Date();
    return {
      hours         : date.getHours().toString().padStart(2,0)        ,
      minutes       : date.getMinutes().toString().padStart(2,0)      ,
      seconds       : date.getSeconds().toString().padStart(2,0)      ,
      milliseconds  : date.getMilliseconds().toString().padStart(3,0) ,
    };
  };
  
  var getTimeStamp=function(){
    var date=__getDate();
    var time=__getTime();
    return date.month+date.day+date.year+"-"+time.hours+time.minutes+"-"+time.seconds+time.milliseconds;
  };
  
  

  var isIOS=function(){
    if (/iPad|iPhone|iPod/.test(navigator.platform)){
      return true;
    }else{
      return navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform);
    }
  };
  
  var isIPadOS=function(){
    return navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform);
  };



  var blobToFile=function(blob,fileName){
    // convert a blob to a file object
    // if no second argument, will generate file name based on date
    if(!fileName){
      fileName="untitled-"+getTimeStamp();
    }
    var hasFileExt = fileName.match(/\.(.*?)/g);
    if(!hasFileExt){
      var gottenFileExtension = mimeTypeToFileExtension(blob.type);
      fileName+="."+gottenFileExtension;
    }
    blob.name = fileName;
    blob.lastModified = new Date();
    return new File([blob], blob.name, {
      type: blob.type,
    });
  };
  
  
  
  
  
  var mobileShare=function(fileOrBlob){
    // uses share sheet on mobile devices
    // 1st arg - required - must be file object
    var file=fileOrBlob;
    if(!fileOrBlob.name){
      file=blobToFile(fileOrBlob);
    }
    var files=[file];
    navigator.share({files});
  };
  
  var download=function(file){
    // uses traditional download function in desktop browsers.
    // may not work for mobile browsers.
    // file MUST have name with file extension
    // 1st arg - required - must be file object
    var file=fileOrBlob;
    if(!fileOrBlob.name){
      file=blobToFile(fileOrBlob);
    }
    var a       = document.createElement("a");
    a.download  = file.name;
    a.href      = URL.createObjectURL(file);
    a.target    = "_blank";
    a.onclick   =()=>a.remove();
    document.documentElement.appendChild(a);
    a.click();
  };
  
  
  window.__save=function(fileOrBlob){
    // works on both desktop and mobile
    // uses download for desktop and share for mobile
    // uses generated filename based on timestamp
    var file=fileOrBlob;
    if(!fileOrBlob.name){
      file=blobToFile(fileOrBlob);
    }
    if(isIOS()||isIPadOS()){
      mobileShare(file);
    }else{
      download(file);
    }
  };
  
  window.__saveAs=function(fileOrBlob,fileName){
    // works on both desktop and mobile
    // uses download for desktop and share for mobile
    // uses generated filename based on timestamp
    // uses user-4efined file name
    var file=fileOrBlob;
    if(!fileOrBlob.name){
      file=blobToFile(fileOrBlob);
    }
    if(isIOS()||isIPadOS()){
      mobileShare(file);
    }else{
      download(file);
    }
  };
  
  
};
  
