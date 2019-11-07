window.onload = function(){
  ReadListFile("read");
}

/*
//ブラウザを更新したときの処理
//読みたいリスト、（読みたくないリスト）からデータを取得して画面状態を生成する
*/
function ReloadDisplay(list){
  list = list.split(/\r\n/);
  for(var i = 0; i < list.length; i++){
    if(list[i] == ""){console.log("リストへの反映が終了");break;}
    console.log(list[i]);
    CreateReadList({id: Number(list[i])});
  }
}


/*
//読みたいリストを生成する
//obj{id: 何番目の記事が選択されたか}
*/
function CreateReadList(obj){
　console.log("mainClumeで" + obj.id + '番の記事をリスト化する');

  /*要素の取得*/
  var readWorkElement = document.getElementsByClassName('read-works');//右コラムの取得

  /*rightclumにリストを生成する*/
  var txtElement = document.createElement('div');
  var h3Element = document.createElement('h3');
  txtElement.className = 'read-work';
  /*txtElement.addEventListener("click", function(){
    RightClumClickDisplayMainClum({id: obj.id, element: txtElement})
  }, false);*/
  //h3Element.innerHTML = obj.element.getElementsByTagName('h3')[0].innerHTML;//mainコラムから見出し飲みを取得する
  h3Element.innerHTML = "見出し" + obj.id;
  txtElement.appendChild(h3Element);
  readWorkElement[0].appendChild(txtElement);
}


/*
//データの読み込み
//指定したファイルからデータを読み込みmainコラム（とreadページ）を編集する
*/
function ReadListFile(article_abs){
  console.log(article_abs + "にアクセス");
  var xmlHttpReq = new XMLHttpRequest();
  var cmd = "./rb/index.rb?cmd=read";
  var fileName = "&fn=list/" + article_abs + "ArticleList.txt";

  xmlHttpReq.open('GET', cmd + fileName, true);//ここで指定するパスは、index.htmlファイルを基準にしたときの相対パス
  xmlHttpReq.send(null);//サーバーへのリクエストを送信する、引数はPOSTのときのみ利用

  xmlHttpReq.onreadystatechange = function(){
    if((xmlHttpReq.readyState == 4) && (xmlHttpReq.status == 200) ){
      //テキストの編集
      ReloadDisplay(xmlHttpReq.responseText);
    }
  }
}
