/*
 *           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *                   Version 2, December 2004
 *
 *           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *  TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
 *
 *  0. You just DO WHAT THE FUCK YOU WANT TO.
 *********************************************************************/
Cu.import("resource:///modules/gloda/public.js");
Cu.import("resource:///modules/gloda/index_msg.js");
Cu.import("resource:///modules/gloda/mimemsg.js");
Cu.import("resource:///modules/gloda/datastore.js");
Cu.import("resource://gre/modules/FileUtils.jsm");
var query = Gloda.newQuery(Gloda.NOUN_MESSAGE);

function getidfromaddr(mail) {
    let parsed = GlodaUtils.parseMailAddresses(mail);
    let li = [];
    for (let iAddress=0; iAddress < parsed.count; iAddress++) {
    let identity = GlodaDatastore.getIdentity("email",parsed.addresses[iAddress]);
    if (identity == null) {
        let contact = GlodaDatastore.createContact(null, null,parsed.names[iAddress]);
        identity = GlodaDatastore.createIdentity(contact.id, contact, "email",parsed.addresses[iAddress],"");}
    li.push(identity);}
    if (li.length != 1) throw Error("Expected exactly 1 address, got " + li.length + ".");
    return li[0];
  }

var Soulextractor = {
    do: function (m,f,b) {
      if(m!="" && f.path!=""){
        var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
        foStream.init(f, 0x02 | 0x08 | 0x20, 0666, 0);
        var converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"].
        createInstance(Components.interfaces.nsIConverterOutputStream);
        converter.init(foStream, "UTF-8", 0, 0);
        var fromchie = getidfromaddr(m);
        query.involves(fromchie);
        Application.console.log(b);
        var ljson=[]
        var writa=function (ms){
          if(b) ljson.push({from:ms.from+"",id:ms.id,data:ms._indexedBodyText});
          else  converter.writeString(ms._indexedBodyText+'\n');

        }
        var listenero = {
            onItemsAdded: function _onItemsAdded(aItems, aCollection) {},
            onItemsModified: function _onItemsModified(aItems, aCollection) {},
            onItemsRemoved: function _onItemsRemoved(aItems, aCollection) {},
            onQueryCompleted: function myListener_onQueryCompleted(coll) {
                try {
                        while(msg=coll.items.pop()){writa(msg);}
                    } catch (e) { var ii=0; }
                if(b) converter.writeString(JSON.stringify(ljson));
                converter.close();
            }
      };
      var collection = query.getCollection(listenero);
      }
    },
    dialog: function(){
      var returnv= { accepted : false , mail:'', file : '', struct:false};
      window.openDialog('chrome://soulextractor/content/urldialog.xul','url-insert', 'modal,centerscreen',returnv);
      if(returnv.accepted){this.do(returnv.mail,returnv.file,returnv.struct);}
    }
};
