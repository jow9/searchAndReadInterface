/*
今は2つのHTMLファイルに分けてそれぞれで似たような処理を行っている
たとえば、テキストファイルの読み込みをそれぞれのページで行っている
しかし、SPAを利用して擬似的な1ページを生成すれば、データの保存や内容の書き換えなどがスマートとなる
つまり、ユーザにとっても開発者にとってもいいことづくめとなる
SPAを利用するためにはReactを導入することで比較的容易にできるっぽい記事を見た（https://tercel-tech.hatenablog.com/entry/2018/09/02/235348）
このサービスもいずれはSPAを導入してよりよいものへ改善したい。
*/

/*要素の取得*/
var worksElement = document.getElementsByClassName('works');
var readWorksElement = document.getElementsByClassName('read-works');//右コラムの取得


window.onload = function(){
  /*ページ遷移処理を作成*/
  let moveElement = document.getElementsByClassName('MoveViewPage');
  moveElement[0].addEventListener("click", function(){
    location.href = 'index.html';
  }, false);
  
  ReadListFile("read");//ReadListFile() → CreateClumBase(list) → ClumIntotxt(list) と順番に呼び出しページを生成する
}


/*
//mainClumを生成する
*/
function CreateClumBase(list){
  for(let i = 0; i < list.length-1; i++){
    if(list[i] == ""){console.log("リストへの反映が終了");break;}
    console.log(list[i] + "番記事のためのタグ要素を生成する");

    /*rightClumを作成する*/
    let txtElement = document.createElement('a');
    txtElement.className = 'read-work';
    txtElement.href = "#" + Number(list[i]);
    readWorksElement[0].appendChild(txtElement);

    /*mainClumを作成する*/
    //work-block要素の作成
    let workBlockElement = document.createElement('div');
    workBlockElement.className = 'work-block';

    //work要素の作成
    let workElement = document.createElement('div');
    workElement.className = 'work';
    workElement.id = Number(list[i]);

    //構造体の制作
    workBlockElement.appendChild(workElement);
    worksElement[0].appendChild(workBlockElement);
  }

  ClumIntotxt(list);
}

/*
//Clumにテキストを挿入する
*/
function ClumIntotxt(list){
  let workElements = document.getElementsByClassName('work');
  let workImgElements = document.getElementsByClassName('workImg');
  let txtElements = document.getElementsByClassName('read-work');
  for(let i = 0; i < list.length-1; i++){
    console.log(Number(list[i]) + "番目の記事データを読み込む");
    let xmlHttpReq = new XMLHttpRequest();
    let cmd = "./rb/index.rb?cmd=read";
    let fileName = "&fn=article/" + Number(list[i]) + ".txt";

    xmlHttpReq.open('GET', cmd + fileName, true);//ここで指定するパスは、index.htmlファイルを基準にしたときの相対パス
    xmlHttpReq.send(null);//サーバーへのリクエストを送信する、引数はPOSTのときのみ利用

    xmlHttpReq.onreadystatechange = function(){
      if((xmlHttpReq.readyState == 4) && (xmlHttpReq.status == 200)){
        //テキストの編集
        let txt = xmlHttpReq.responseText;

        //1行目を見出しとする
        let txt_array = txt.split(/\r?\n/);
        console.log(txt_array[0]);

        /*rightclum要素の作成*/
        var h3Element = document.createElement('h3');
        h3Element.innerHTML = txt_array[0];
        txtElements[i].appendChild(h3Element);

        /*mainClumの作成*/
        //work-txt要素の作成
        let h2Element = document.createElement('h2');
        let pElement = document.createElement('p');
        h2Element.innerHTML = txt_array[0];
        for(let j = 1; j < txt_array.length; j++){
          pElement.innerHTML += txt_array[j];
        }

        //workImg要素の作成
        let imgElement = document.createElement('img');
        imgElement.src = "src/img/" + Number(list[i]) + ".png";
        imgElement.onerror = function () {
          this.style.display = "none";
        }

        workElements[i].appendChild(h2Element);
        workElements[i].appendChild(imgElement);
        workElements[i].appendChild(pElement);
        workElements[i].appendChild(work_txtElement);
      }
    }
  }
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
      var list = xmlHttpReq.responseText.split(/\r\n/);
      CreateClumBase(list);
    }
  }
}
