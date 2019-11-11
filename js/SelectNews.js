
//var work_checkbox = document.getElementsByName("article");
//var workElement = document.getElementsByClassName("work");
//var workBlockElement = document.getElementsByClassName('work-block');//中央コラムに存在する記事の取得
var worksElement = document.getElementsByClassName('works');
var work_num = 5;

window.onload = function(){
  console.log("Onload SelectNews.js file");

  CreateMainClum(work_num);
  MainClumIntotxt();
}


/*
//mainClumを生成する
*/
function CreateMainClum(clum_num){
  for(let i = 0; i < clum_num; i++){
    //work-block要素の作成
    let workBlockElement = document.createElement('div');
    workBlockElement.className = 'work-block';
    workBlockElement.addEventListener("click", function(){
      MainClumClickCreateRightClum({id: i, click: true})
    }, false);


    //input要素の作成
    let inputCheckboxElement = document.createElement('input');
    inputCheckboxElement.type = 'checkbox';
    inputCheckboxElement.name = 'article';
    inputCheckboxElement.value = i;

    //work要素の作成
    let workElement = document.createElement('div');
    workElement.className = 'work';

    //workImg要素の作成
    let workImgElement = document.createElement('div');
    workImgElement.className = 'workImg';
    let imgElement = document.createElement('img');
    imgElement.src = "src/img/" + i + ".png";

    //構造体の制作
    workImgElement.appendChild(imgElement);
    workElement.appendChild(workImgElement);
    workBlockElement.appendChild(inputCheckboxElement);
    workBlockElement.appendChild(workElement);
    worksElement[0].appendChild(workBlockElement);//設定されたIDと登録順序が通信速度の差でずれてしまう
  }
}

/*
//mainClumの要素にテキストを挿入する
*/
function MainClumIntotxt(){
  let workElements = document.getElementsByClassName('work');
  for(let i = 0; i < workElements.length; i++){
    let id = ('000' + i).slice(-3);//3桁としてidを揃える
    console.log(id + "番目の記事データにアクセス");
    let xmlHttpReq = new XMLHttpRequest();
    let cmd = "./rb/index.rb?cmd=read";
    let fileName = "&fn=article/article_" + i + ".txt";

    xmlHttpReq.open('GET', cmd + fileName, true);//ここで指定するパスは、index.htmlファイルを基準にしたときの相対パス
    xmlHttpReq.send(null);//サーバーへのリクエストを送信する、引数はPOSTのときのみ利用

    xmlHttpReq.onreadystatechange = function(){
      if((xmlHttpReq.readyState == 4) && (xmlHttpReq.status == 200) ){
        //テキストの編集
        let txt = xmlHttpReq.responseText;

        //1行目を見出しとする
        let txt_array = txt.split(/\r?\n/);
        console.log(txt_array[0]);

        //work-txt要素の作成
        let work_txtElement = document.createElement('div');
        work_txtElement.className = 'work-txt';
        let h3Element = document.createElement('h3');
        let pElement = document.createElement('p');
        h3Element.innerHTML = txt_array[0];
        for(let j = 1; j < 2; j++){
          pElement.innerHTML += txt_array[j];
        }

        work_txtElement.appendChild(h3Element);
        work_txtElement.appendChild(pElement);
        //workElements[i].appendChild(work_txtElement);
        workElements[i].insertBefore(work_txtElement, workElements[i].firstChild);

        if(i == workElements.length-1)ReadListFile("read");//画面要素の編集
      }
    }
  }
}


/*
//記事がクリックされたときに発生するイベント
//クリックされたものをリスト化する
//リスト化した記事はチェックボックスをオンにすることで非表示にする
//obj{id: 何番目の記事が選択されたか, element:選択されたwork要素, クリックによる選択かの有無}
*/
function MainClumClickCreateRightClum(obj){
　console.log("mainClumeで" + obj.id + '番の記事をリスト化する');

  /*要素の取得*/
  var readWorkElement = document.getElementsByClassName('read-works');//右コラムの取得
  let work_txtElement = worksElement[0].getElementsByClassName('work-block')[obj.id];
  let checkboxelement = worksElement[0].getElementsByClassName('work-block')[obj.id].getElementsByTagName('input')[0];

  /*rightclumにリストを生成する*/
  var txtElement = document.createElement('div');
  var h3Element = document.createElement('h3');
  txtElement.className = 'read-work';
  txtElement.addEventListener("click", function(){
    RightClumClickDisplayMainClum({id: obj.id, element: txtElement})
  }, false);
  h3Element.innerHTML = work_txtElement.getElementsByTagName('h3')[0].innerHTML;//mainコラムから見出しを取得する
  txtElement.appendChild(h3Element);
  readWorkElement[0].appendChild(txtElement);

  /*読みたいページを登録*/
  if(obj.click)WriteFile("read", obj.id);

  /*チェックボックスをオンにして非表示にする*/
  checkboxelement.checked = true;
}


/*
//右コラムの要素をクリックした際の処理
//中央コラムの要素をもとの位置に表示する
//右コラムからクリックした記事を消去する
//記事の本文を生成する（未実装）
*/
function RightClumClickDisplayMainClum(obj){
  console.log("rightClumeで" + obj.id + '番の記事がクリックされた');
  console.log(obj.element);

  /*チェックボックスをオフにして表示にする*/
  let checkboxelement = worksElement[0].getElementsByClassName('work-block')[obj.id].getElementsByTagName('input')[0];
  checkboxelement.checked = false;

  /*rightclumから要素を削除する*/
  obj.element.parentNode.removeChild(obj.element);
  console.log(obj.id + "番の記事をrightclumから削除した");

  /*データベースからも記事を削除する*/
  ReWriteFile("read", obj.id);
}


/*
//データの書き込み処理
//読みたい記事情報の登録
//読みたいくない記事情報の登録
//引数1 article_abs:読みたいと読みたくないの記事の区別(文字列で　read or noread を指定する)
//引数2 article_id:登録する記事番号
*/
function WriteFile(article_abs, article_id){
  var id = ('000' + article_id).slice(-3);//3桁としてidを揃える
  console.log(article_abs + "にアクセス");
  console.log(id + "番の記事を登録");
  var xmlHttpReq = new XMLHttpRequest();
  var cmd = "./rb/index.rb?cmd=add";
  var fileName = "&fn=list/" + article_abs + "ArticleList.txt";
  var data = "&data=" + id;

  xmlHttpReq.open('GET', cmd + fileName + data, true);//ここで指定するパスは、index.htmlファイルを基準にしたときの相対パス
  xmlHttpReq.send(null);//サーバーへのリクエストを送信する、引数はPOSTのときのみ利用
}


/*
//データの書き換え
//指定した文字列を削除し、リストから除外する
*/
function ReWriteFile(article_abs, article_id){
  var id = ('000' + article_id).slice(-3);//3桁としてidを揃える
  console.log(article_abs + "にアクセス");
  console.log(id + "番の記事をデータベースから削除");
  var xmlHttpReq = new XMLHttpRequest();
  var cmd = "./rb/index.rb?cmd=rewrite";
  var fileName = "&fn=list/" + article_abs + "ArticleList.txt";
  var data = "&data=" + id;//消すデータ

  xmlHttpReq.open('GET', cmd + fileName + data, true);//ここで指定するパスは、index.htmlファイルを基準にしたときの相対パス
  xmlHttpReq.send(null);//サーバーへのリクエストを送信する、引数はPOSTのときのみ利用
}


/*
//ブラウザを更新したときの処理
//指定したファイルからデータを読み込みmainclum（とreadページ）を編集する
//読みたいリスト、（と読みたくないリスト）からデータを取得して画面状態を生成する
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
      list = xmlHttpReq.responseText.split(/\r\n/);
      for(var i = 0; i < list.length-1; i++){
        if(list[i] == ""){console.log("リストへの反映が終了");break;}
        console.log(list[i]);
        MainClumClickCreateRightClum({id: Number(list[i]), click: false});
      }
    }
  }
}
