/*


  how to use:

  invoke the utility like so:

  window["local/path/to/saveas.js"]();


  second arg is optional, otherwise will either use filename if input is file, or generate untitled+timestamp if input is blob
  window.__saveAs(fileOrBlob,fileName);

  alternatively:
  window.__save(fileOrBlob)

  needs: mimeTypeToFileExtension

*/

window[new Error().stack.match(location.href.match(/(.*)\//g)+"(.*?):")[1]]=()=>{

  
  function getDate(){
    var date  = new Date();
    return {
      month : (date.getMonth()+1).toString().padStart(2,0)  ,
      day   : date.getDate().toString().padStart(2,0)       ,
      year  : date.getFullYear().toString().padStart(4,0)   ,
    };
  }

  function getTime(){
    var date  = new Date();
    return {
      hours         : date.getHours().toString().padStart(2,0)        ,
      minutes       : date.getMinutes().toString().padStart(2,0)      ,
      seconds       : date.getSeconds().toString().padStart(2,0)      ,
      milliseconds  : date.getMilliseconds().toString().padStart(3,0) ,
    };
  }

  function getTimeStamp(){
    var date=getDate();
    var time=getTime();
    return date.month+date.day+date.year+"-"+time.hours+time.minutes+"-"+time.seconds+time.milliseconds;
  }
  
 
  // check if we are using IOS or iPadOS
  function isIOS(){
    if(/iPad|iPhone|iPod/.test(navigator.platform)){
      return true;
    }else{
      return navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform);
    }
  }

  function isIPadOS(){
    return navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform);
  }



  function blobToFile(blob,fileName){
    // convert a blob to a file object
    // if no second argument, will generate file name based on date
    if(!fileName){
      fileName="untitled-"+getTimeStamp();
    }
    var hasFileExt = fileName.match(/\.(.*?)/g);
    if(!hasFileExt){
      // automatically detect file extension based on mimetype
      var gottenFileExtension = mimeTypeToFileExtension(blob.type);
      fileName+="."+gottenFileExtension;
    }
    blob.name = fileName;
    blob.lastModified = new Date();
    return new File([blob], blob.name, {
      type: blob.type,
    });
  }





  function mobileShare(file){
    // uses share sheet on mobile devices
    // 1st arg - required - must be file object with name
    if(!file.name){
      console.error("mobileShare() can only take a named file as an input");
    }else{
      var files=[file];
      navigator.share({files});
    }
  }

  function download(file){
    // uses traditional download function in desktop browsers.
    // may not work for mobile browsers.
    // file MUST have name with file extension
    // 1st arg - required - must be file object
    if(!file.name){
      console.error("download() can only take a named file as an input");
    }else{
      var a       = document.createElement("a");
      a.download  = file.name;
      a.href      = URL.createObjectURL(file);
      a.target    = "_blank";
      a.onclick   =()=>a.remove();
      document.documentElement.appendChild(a);
      a.click();
    }
  }


  window.__save=function(fileOrBlob){
    // works on both desktop and mobile
    // uses download for desktop and share for mobile
    // uses generated filename based on timestamp
    var file;
    if(!fileOrBlob.name){
      // no name so assume it is a blob, will auto-generate the name
      file=blobToFile(fileOrBlob,null);
    }else{
      // first arg is already a file
      file=fileOrBlob;
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
    // uses user-defined file name
    
    var file;
    
    if(!fileName){
      if(!fileOrBlob.name){
        // first arg is most likely a blob
        file=blobToFile(fileOrBlob,null);
      }else{
        // first arg is most likely a file
        file=fileOrBlob;
      }
    }else{
      // if second arg, use second arg as filename.
      // if first arg is a file, it will overwrite the old name
      file=blobToFile(fileOrBlob,fileName);
    }
    if(isIOS()||isIPadOS()){
      mobileShare(file);
    }else{
      download(file);
    }
  };
  
  


};
