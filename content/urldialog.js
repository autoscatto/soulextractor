/*
 *           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *                   Version 2, December 2004
 *
 *           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *  TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
 *
 *  0. You just DO WHAT THE FUCK YOU WANT TO.
 *********************************************************************/
Components.utils.import("resource://gre/modules/FileUtils.jsm");
function initia(){
  var rv = window.arguments[0];
  var file = FileUtils.getFile("TmpD", ["maildmp.tmp"]);
  file.createUnique(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, FileUtils.PERMS_FILE);
  document.getElementById('patta').value=file.path;
  rv.file=file;
}

function savedia(){
    var rv = window.arguments[0];
    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    fp.init(window, "Select a File", nsIFilePicker.modeSave);
    var res = fp.show();
    if (res != nsIFilePicker.returnCancel) {rv.file = fp.file; document.getElementById('patta').value=fp.file.path;}
}

function click_(v){
    var returnv = window.arguments[0];
    returnv.mail=document.getElementById('maila').value;
    returnv.accepted=v;
    returnv.struct=document.getElementById('structa').checked;
    return true;
}